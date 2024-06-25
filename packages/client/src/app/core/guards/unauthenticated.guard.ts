import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthenticationService } from '../services/authentication/authentication.service';

export const unauthenticationGuard: CanActivateFn = () => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  const isAuth = authenticationService.isValidToken();

  if (isAuth) {
    void router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
