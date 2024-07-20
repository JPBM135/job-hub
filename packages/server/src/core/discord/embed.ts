import type { RESTPostAPIWebhookWithTokenJSONBody } from 'discord-api-types/v10';
import type { Jobs, Users } from '../../@types/db.schema.js';
import { ellipsis, formatSalary } from './common.js';

enum ComponentType {
  ActionRow = 1,
  Button = 2,
}

enum ButtonStyle {
  Link = 5,
}

function createDescription(job: Jobs) {
  const description = [];

  if (job.company) {
    description.push('**Company:** ' + job.company, '');
  }

  description.push('**Type:** ' + job.type);
  description.push(`**Experience:** ` + job.experience_level);
  description.push(`**Remote Status:** ` + job.remote_status);

  if (job.pay_type || job.pay_min || job.pay_max) {
    description.push(
      `**Salary:** ` + formatSalary(job.pay_max, job.pay_min, job.pay_type),
    );
  }

  if (job.date_posted) {
    description.push(`**Posted:** ` + new Date(job.date_posted).toDateString());
  }

  if (job.description) {
    description.push(
      '**Description:**',
      '```',
      ellipsis(job.description, 3_000),
      '```',
    );
  }

  return description.join('\n');
}

export function createMessagePayloadFromJob(
  job: Jobs,
  author: Users | undefined,
): RESTPostAPIWebhookWithTokenJSONBody {
  return {
    embeds: [
      {
        author: {
          name: ellipsis(['Job Posted', job.title].join(' - '), 256),
        },
        description: createDescription(job),
        footer: {
          text: [job.location, author?.name].filter(Boolean).join(' | '),
        },
        timestamp: new Date().toISOString(),
      },
    ],
    components: [
      {
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.Button,
            style: ButtonStyle.Link,
            label: 'View Job',
            url: `https://job-hub.jpbm.dev/dashboard?jobId=${job.id}`,
          },
          {
            type: ComponentType.Button,
            style: ButtonStyle.Link,
            label: 'Apply to Job',
            url: `https://job-hub.jpbm.dev/dashboard?applyJobId=${job.id}`,
          },
          {
            type: ComponentType.Button,
            style: ButtonStyle.Link,
            label: 'Open Job Directly',
            url: job.url,
          },
        ],
      },
    ],
  };
}
