import process from 'node:process';
import type { ApolloServer } from '@apollo/server';
import { describe, it, expect, vitest } from 'vitest';
import type { AppContext } from '../../@types/common.js';
import { registerSignalEvents } from './registerSignalEvents.js';

describe('registerSignalEvents', () => {
  it('Should register the process signals', () => {
    registerSignalEvents({
      stop: vitest.fn(),
    } as unknown as ApolloServer<AppContext>);

    expect(process.listenerCount('SIGINT')).toBe(1);
    expect(process.listenerCount('SIGTERM')).toBe(1);
  });

  it('Should stop the server when called', () => {
    const stop = vitest.fn();

    vitest.spyOn(process, 'exit').mockImplementation(async () => null as never);

    registerSignalEvents({
      stop,
    } as unknown as ApolloServer<AppContext>);

    process.emit('SIGINT');

    expect(stop).toBeCalledTimes(1);

    process.emit('SIGTERM');

    expect(stop).toBeCalledTimes(2);
  });
});
