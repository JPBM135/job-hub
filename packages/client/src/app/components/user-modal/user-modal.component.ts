import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  type ValidatorFn,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { firstValueFrom } from 'rxjs';
import { UsersApiService } from '../../core/api/users/users-api.service';
import { AlertService } from '../../core/services/alert/alert.service';
import { AuthenticationService } from '../../core/services/authentication/authentication.service';

const passwordMatchValidator: ValidatorFn = (control: AbstractControl<unknown>): { mismatch: boolean } | null => {
  const passwordForm = control?.parent?.get('password');

  if (passwordForm?.value === control?.value) {
    return null;
  }

  return { mismatch: true };
};

const conditionalRequiredValidator: ValidatorFn = (control: AbstractControl<unknown>): { required: boolean } | null => {
  const currentPasswordForm = control?.parent?.get('currentPassword');
  const passwordForm = control?.parent?.get('password');
  const newPasswordForm = control?.parent?.get('newPassword');

  if (currentPasswordForm?.value || passwordForm?.value || newPasswordForm?.value) {
    return Validators.required(control) as { required: boolean };
  }

  return null;
};

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './user-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserModalComponent {
  private static readonly PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\dA-Za-z]).*$/;

  public userForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    currentPassword: new FormControl('', [
      conditionalRequiredValidator,
      Validators.minLength(8),
      Validators.maxLength(255),
    ]),
    password: new FormControl('', [
      conditionalRequiredValidator,
      Validators.minLength(8),
      Validators.maxLength(255),
      Validators.pattern(UserModalComponent.PASSWORD_REGEX),
    ]),
    passwordConfirmation: new FormControl('', [
      conditionalRequiredValidator,
      Validators.minLength(8),
      Validators.maxLength(255),
      passwordMatchValidator,
    ]),
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
  });

  public authUser = this.authenticationService.getUser();

  public isLoading = signal(false);

  public constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly matDialogRef: MatDialogRef<UserModalComponent>,
    private readonly usersApiService: UsersApiService,
    private readonly alertService: AlertService,
  ) {
    if (!this.authUser) {
      this.matDialogRef.close();
      return;
    }

    this.userForm.patchValue({
      email: this.authUser.email,
      name: this.authUser.name,
    });
  }

  public getControl(controlName: string): FormControl {
    return this.userForm.get(controlName) as FormControl;
  }

  public hasError(controlName: string, error: string): boolean {
    const control = this.getControl(controlName);
    return control.touched && control.hasError(error);
  }

  public async submit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const { email, currentPassword, password, name } = this.userForm.value;

    this.isLoading.set(true);

    const updatedUser = await firstValueFrom(
      this.usersApiService.updateMe({
        email: email!,
        currentPassword: currentPassword ?? undefined,
        name: name!,
        newPassword: password ?? undefined,
      }),
    ).finally(() => this.isLoading.set(false));

    if (updatedUser) {
      this.authenticationService.setUser(updatedUser.token, updatedUser.user);
      this.alertService.showSuccess('User updated successfully');
      this.matDialogRef.close();
    }
  }
}
