import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as Sentry from '@sentry/angular';
import type { User } from '../../../@types/User';
import { decodeBase64Url } from '../../utils/decodeBase64Url';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private static readonly LOCAL_STORAGE_KEY = 'auth_user';

  public constructor(private readonly router: Router) {}

  public getLocalStoredUser(): { token: string; user: User } | null {
    const localStorageValue = localStorage.getItem(
      AuthenticationService.LOCAL_STORAGE_KEY,
    );

    if (!localStorageValue) {
      return null;
    }

    try {
      return JSON.parse(localStorageValue);
    } catch (error) {
      Sentry.captureException(error);

      return null;
    }
  }

  public getToken(): string | null {
    const tokenAndUser = this.getLocalStoredUser();

    if (!tokenAndUser) {
      return null;
    }

    return tokenAndUser.token;
  }

  public isValidToken(): boolean {
    const tokenAndUser = this.getLocalStoredUser();

    if (!tokenAndUser) {
      return false;
    }

    const { token } = tokenAndUser;

    if (!token) {
      return false;
    }

    const [, encodedUser, hmac] = token.split('.');

    if (!encodedUser || !hmac) {
      return false;
    }

    const decodedUser = decodeBase64Url(encodedUser);
    const tokenExp = JSON.parse(decodedUser).exp;

    if (!tokenExp) {
      return false;
    }

    return new Date(tokenExp * 1_000) > new Date();
  }

  public getUser(): User | null {
    const tokenAndUser = this.getLocalStoredUser();

    if (!tokenAndUser) {
      return null;
    }

    return tokenAndUser.user;
  }

  public setUser(token: string, user: User): void {
    localStorage.setItem(
      AuthenticationService.LOCAL_STORAGE_KEY,
      JSON.stringify({ token, user }),
    );
  }

  public removeUser(): void {
    localStorage.removeItem(AuthenticationService.LOCAL_STORAGE_KEY);
    void this.router.navigate(['/login']);
  }
}
