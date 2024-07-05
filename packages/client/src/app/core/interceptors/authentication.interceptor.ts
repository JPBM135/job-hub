import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environment/environment';
import { AuthenticationService } from '../services/authentication/authentication.service';

const API_URLS = [environment.apiUrl];

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  let requestInstance = req;
  const shouldIncludeAuthorizationHeader = API_URLS.some((url) =>
    req.url.startsWith(url),
  );

  if (shouldIncludeAuthorizationHeader) {
    const authService = inject(AuthenticationService);

    const token = authService.getToken();

    if (token) {
      requestInstance = requestInstance.clone({
        setHeaders: {
          Authorization: token,
        },
      });
    }
  }

  return next(requestInstance);
};
