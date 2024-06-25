import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { firstValueFrom } from 'rxjs';
import { AuthApiService } from '../../core/api/auth/auth-api.service';
import { AuthenticationService } from '../../core/services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  public loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    nonce: new FormControl('', [Validators.required]),
  });

  public constructor(
    private readonly authApiService: AuthApiService,
    private readonly authenticationService: AuthenticationService,
  ) {
    this.loadNonce();
  }

  public hasControlError(controlName: string, error: string): boolean {
    const control = this.loginForm.get(controlName);

    if (!control || control.pristine) {
      return false;
    }

    return control.hasError(error);
  }

  private loadNonce(): void {
    this.authApiService.getNonce().subscribe(({ nonce }) => {
      this.loginForm.get('nonce')?.setValue(nonce);
    });
  }

  public async login() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password, nonce } = this.loginForm.value as { email: string; nonce: string; password: string };

    const login = await firstValueFrom(this.authApiService.login({ email, password, nonce }));

    if (!login) {
      return;
    }

    this.authenticationService.setUser(login.token, login.user);
  }
}
