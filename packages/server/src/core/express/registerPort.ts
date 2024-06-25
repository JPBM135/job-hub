import type express from 'express';
import { config } from '../../config.js';

export async function registerPort(app: ReturnType<typeof express>): Promise<void> {
  // eslint-disable-next-line no-promise-executor-return
  await new Promise<void>((resolve) => app.listen({ port: config.port }, resolve));
  console.log(`Server is running on port ${config.port}`);
}
