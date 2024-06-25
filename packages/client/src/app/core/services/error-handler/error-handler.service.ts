/* eslint-disable promise/prefer-await-to-callbacks */

import { Injectable } from '@angular/core';
import type { ApolloError } from '@apollo/client/core';
import type { ErrorResponse } from '@apollo/client/link/error';
import { onError } from '@apollo/client/link/error';
import { Subject, catchError } from 'rxjs';
import type { MonoTypeOperatorFunction } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { AlertService } from '../alert/alert.service';
import { ErrorCodes } from './error-handler.constants';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  public resetEmitter$ = new Subject<void>();

  public constructor(private readonly alertService: AlertService) {
    onError((error) => {
      this.alertService.showError(this.resolveErrorMessage(error));
    });
  }

  public handleError(error: ApolloError | ErrorResponse): void {
    this.alertService.showError(this.resolveErrorMessage(error));
  }

  public createErrorHandler<T>(): MonoTypeOperatorFunction<T> {
    return catchError((error: ApolloError) => {
      this.alertService.showError(this.resolveErrorMessage(error));

      return [];
    });
  }

  private resolveErrorMessage(error: ApolloError | ErrorResponse): string {
    if (!environment.isProduction) {
      console.error('Error:', error);
    }

    if (!error) {
      return this.resolveReadableErrorMessage('DEFAULT', true);
    }

    if (error.networkError) {
      return this.resolveReadableErrorMessage('NETWORK', true);
    }

    const message = (error as ApolloError)?.message || error.graphQLErrors?.[0]?.message;

    if (error.graphQLErrors?.length) {
      const errorCodes = error.graphQLErrors.map((graphQLError) => graphQLError.extensions?.['code']);
      const readableErrorMessage = this.resolveReadableErrorMessage((errorCodes[0] as string) || 'DEFAULT');

      if (environment.isProduction && !readableErrorMessage) {
        return this.resolveReadableErrorMessage('DEFAULT', true);
      }

      return readableErrorMessage ?? this.computeDefaultErrorMessage(message ?? 'UNKNOWN', errorCodes[0]);
    }

    return environment.isProduction
      ? this.resolveReadableErrorMessage('DEFAULT', true)
      : this.computeDefaultErrorMessage(message ?? 'UNKNOWN', 'UNKNOWN');
  }

  private computeDefaultErrorMessage(message: string, errorCode: unknown): string {
    const parsedCode = typeof errorCode === 'string' ? errorCode : (errorCode as { code: string })?.code;

    return `Unknown Error: ${message} (${parsedCode ?? 'UNKNOWN'})`;
  }

  private resolveReadableErrorMessage(errorCode: string, isDefault: true): string;
  private resolveReadableErrorMessage(errorCode: string, isDefault?: false): string | null;
  private resolveReadableErrorMessage(errorCode: string, isDefault = false): string | null {
    const value = isDefault ? ErrorCodes.DEFAULTS : ErrorCodes.USER_DEFINED;
    return value[errorCode as keyof typeof value] ?? null;
  }
}
