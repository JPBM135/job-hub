import type { Knex } from 'knex';
import { request } from 'undici';
import type { Jobs } from '../../@types/db.schema.js';
import { config } from '../../config.js';
import { createMessagePayloadFromJob } from './embed.js';

export async function sendPostToFeed(job: Jobs, db: Knex) {
  const { feedWebhookUrl } = config;
  console.log('feedWebhookUrl', feedWebhookUrl);
  if (!feedWebhookUrl) return;

  const creator = await db
    .select('*')
    .from('users')
    .where('id', job.created_by)
    .first();

  const messagePayload = createMessagePayloadFromJob(job, creator);

  const response = await request(feedWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messagePayload),
  });

  if (response.statusCode !== 204) {
    throw new Error(`Failed to send post to feed`);
  }

  console.log(`Posted job ${job.id} to feed`, await response.body.text());
}
