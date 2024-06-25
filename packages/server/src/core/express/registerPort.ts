import { readFile } from 'node:fs/promises';
import https from 'node:https';
import type express from 'express';
import { config } from '../../config.js';

export async function registerPort(app: ReturnType<typeof express>): Promise<void> {
  if (!config.isProduction) {
    // eslint-disable-next-line no-promise-executor-return
    await new Promise<void>((resolve) => app.listen({ port: config.port }, resolve));
    console.log(`Server is running on port ${config.port}`);
    return;
  }

  const privateKey = await readFile('/job-hub/privatekey.pem');
  const certificate = await readFile('/job-hub/certificate.pem');

  https
    .createServer(
      {
        key: privateKey,
        cert: certificate,
      },
      app,
    )
    .listen(config.port, () => {
      console.log(`Server is running on port ${config.port} (https)`);
    });
}
