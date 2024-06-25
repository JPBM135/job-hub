import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  provideExperimentalZonelessChangeDetection,
  type ApplicationConfig,
  type EnvironmentProviders,
  type Provider,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading } from '@angular/router';
import { routes } from './app.routes';
import { authenticationInterceptor } from './core/interceptors/authentication.interceptor';
import { provideApollo } from './core/providers/provideApollo';
import { provideDateAdaptors } from './core/providers/provideDateAdaptors';
import { provideSentry } from './core/providers/provideSentry';

function createProviders(...providers: (unknown[] | unknown)[]): (EnvironmentProviders | Provider)[] {
  return providers.flat() as (EnvironmentProviders | Provider)[];
}

export const appConfig: ApplicationConfig = {
  providers: createProviders(
    provideSentry(),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideHttpClient(withInterceptors([authenticationInterceptor])),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
    ),
    provideDateAdaptors(),
    provideApollo(),
    provideExperimentalZonelessChangeDetection(),
  ),
};
