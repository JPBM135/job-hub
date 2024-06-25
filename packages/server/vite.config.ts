import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul',
      include: ['src'],
      exclude: ['src/serverless.ts', 'src/config.ts'],
      // all: true,
      lines: 95,
      statements: 95,
      functions: 95,
      branches: 95,
    },
    useAtomics: true,
  },
});
