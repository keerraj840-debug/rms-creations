import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { InputComponent } from '../../shared/ui/input.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { AuthLayoutComponent } from '../../shared/ui/auth-layout.component';

function strongPasswordValidator() {
  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+=\-\[\]{}|;:,.<>])[A-Za-z\d@$!%*?&#^()_+=\-\[\]{}|;:,.<>]{8,}$/;
  return (control: { value: string }) => {
    if (!control.value) return null;
    return pattern.test(control.value) ? null : { strongPassword: true };
  };
}

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('newPassword')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  
  if (password !== confirmPassword) {
    control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  } else {
    if (control.get('confirmPassword')?.hasError('passwordMismatch')) {
        control.get('confirmPassword')?.setErrors(null);
    }
    return null;
  }
}

type Step = 'email' | 'otp' | 'password';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InputComponent, ButtonComponent, AuthLayoutComponent],
  template: `
    <app-auth-layout
      [title]="step() === 'email' ? 'Reset password' : step() === 'otp' ? 'Enter verification code' : 'Set new password'"
      [subtitle]="step() === 'email' ? 'Enter your email address and we will send you a verification code.' : step() === 'otp' ? 'We sent a code to ' + emailForm.value.email : 'Please enter your new password below.'"
      imageSrc="assets/images/auth/forgot_password.jpg"
      imageTitle="Secure your account"
      imageSubtitle="Password recovery"
      [errorMessage]="errorMessage()"
      [successMessage]="successMessage()"
    >
        <!-- Step 1: Email Form -->
        @if (step() === 'email') {
          <form [formGroup]="emailForm" (ngSubmit)="onRequestOtp()" class="space-y-4">
            <app-input
              label="Email"
              type="email"
              formControlName="email"
              [required]="true"
              placeholder="name@company.com"
              [error]="getEmailError()"
            ></app-input>

            <div class="pt-2">
              <app-button
                type="submit"
                variant="primary"
                [fullWidth]="true"
                [disabled]="loading() || emailForm.invalid"
                [loading]="loading()"
              >
                Send verification code
              </app-button>
            </div>
          </form>
        }

        <!-- Step 2: OTP Form -->
        @if (step() === 'otp') {
          <form [formGroup]="otpForm" (ngSubmit)="onVerifyOtp()" class="space-y-4">
            <app-input
              label="Verification Code (OTP)"
              type="text"
              formControlName="token"
              [required]="true"
              placeholder="123456"
              [error]="getOtpError()"
            ></app-input>

            <div class="pt-2">
              <app-button
                type="submit"
                variant="primary"
                [fullWidth]="true"
                [disabled]="loading() || otpForm.invalid"
                [loading]="loading()"
              >
                Verify code
              </app-button>
            </div>
            
            <div class="text-center mt-4">
              <button type="button" (click)="step.set('email')" class="text-xs text-neutral-500 hover:text-neutral-900 underline underline-offset-2">
                Use a different email address
              </button>
            </div>
          </form>
        }

        <!-- Step 3: New Password Form -->
        @if (step() === 'password') {
          <form [formGroup]="passwordForm" (ngSubmit)="onUpdatePassword()" class="space-y-4">
            <div class="relative">
              <app-input
                [type]="showPassword() ? 'text' : 'password'"
                label="New Password"
                formControlName="newPassword"
                [required]="true"
                placeholder="••••••••••••"
                [error]="getPasswordError()"
              ></app-input>

              <button
                type="button"
                (click)="togglePasswordVisibility()"
                class="absolute right-3 top-[38px] text-neutral-400 hover:text-neutral-600 transition-colors p-1"
                aria-label="Toggle password visibility"
              >
                @if (showPassword()) {
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                } @else {
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                }
              </button>
            </div>

            <app-input
              label="Confirm New Password"
              type="password"
              formControlName="confirmPassword"
              [required]="true"
              placeholder="••••••••••••"
              [error]="getConfirmPasswordError()"
            ></app-input>

            <div class="pt-2">
              <app-button
                type="submit"
                variant="primary"
                [fullWidth]="true"
                [disabled]="loading() || passwordForm.invalid"
                [loading]="loading()"
              >
                Update password
              </app-button>
            </div>
          </form>
        }

        <!-- Footer -->
        <p class="mt-8 text-center text-xs text-neutral-500">
          Remember your password?
          <a routerLink="/login" class="text-neutral-900 font-medium hover:underline ml-1 underline-offset-4">
            Sign in
          </a>
        </p>

      </app-auth-layout>
  `
})
export class ForgotPasswordPageComponent {
  private supabase = inject(SupabaseService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  step = signal<Step>('email');
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  showPassword = signal(false);

  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  otpForm = this.fb.group({
    token: ['', [Validators.required, Validators.minLength(6)]]
  });

  passwordForm = this.fb.group({
    newPassword: ['', [Validators.required, strongPasswordValidator()]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: passwordMatchValidator });

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  getEmailError(): string {
    const c = this.emailForm.get('email');
    if (c?.touched && c.errors) {
      if (c.errors['required']) return 'Email is required';
      if (c.errors['email']) return 'Invalid email address';
    }
    return '';
  }

  getOtpError(): string {
    const c = this.otpForm.get('token');
    if (c?.touched && c.errors) {
      if (c.errors['required']) return 'Verification code is required';
      if (c.errors['minlength']) return 'Code must be at least 6 characters';
    }
    return '';
  }

  getPasswordError(): string {
    const c = this.passwordForm.get('newPassword');
    if (c?.touched && c.errors) {
      if (c.errors['required']) return 'Password is required';
      if (c.errors['strongPassword']) return 'Must be 8+ chars with uppercase, lowercase, number, symbol';
    }
    return '';
  }

  getConfirmPasswordError(): string {
    const c = this.passwordForm.get('confirmPassword');
    if (c?.touched && c.errors) {
      if (c.errors['required']) return 'Please confirm your password';
      if (c.errors['passwordMismatch']) return 'Passwords do not match';
    }
    return '';
  }

  async onRequestOtp() {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const { email } = this.emailForm.value;
    const { error } = await this.supabase.resetPasswordForEmail(email!);
    
    this.loading.set(false);
    
    if (error) {
      this.errorMessage.set(error.message);
    } else {
      this.successMessage.set('Verification code sent to your email.');
      this.step.set('otp');
    }
  }

  async onVerifyOtp() {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const { email } = this.emailForm.value;
    const { token } = this.otpForm.value;
    
    const { error } = await this.supabase.verifyOtp(email!, token!, 'recovery');
    
    this.loading.set(false);

    if (error) {
      this.errorMessage.set(error.message);
    } else {
      this.successMessage.set('Code verified! Please set your new password.');
      this.step.set('password');
    }
  }

  async onUpdatePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.errorMessage.set('');

    const { newPassword } = this.passwordForm.value;
    const { error } = await this.supabase.updateUserPassword(newPassword!);

    this.loading.set(false);

    if (error) {
      this.errorMessage.set(error.message);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
