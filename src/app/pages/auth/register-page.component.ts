import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { LocalStorageService } from '../../services/local-storage.service';
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
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  
  if (password !== confirmPassword) {
    control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  } else {
    // Clear only if it was the only error
    if (control.get('confirmPassword')?.hasError('passwordMismatch')) {
        control.get('confirmPassword')?.setErrors(null);
    }
    return null;
  }
}

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InputComponent, ButtonComponent, AuthLayoutComponent],
  template: `
    <app-auth-layout
      title="Create an account."
      subtitle="Join RMS Creations today to explore our exclusive collection."
      imageSrc="assets/images/auth/register.jpg"
      imageTitle="Join the family"
      imageSubtitle="Start your journey"
      [errorMessage]="errorMessage()"
      [successMessage]="successMessage()"
    >
        <!-- Form Block -->
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
          
          <app-input
            label="Email"
            type="email"
            formControlName="email"
            [required]="true"
            placeholder="name@company.com"
            [error]="getEmailError()"
          ></app-input>

          <div>
            <label class="block text-xs font-medium text-[#2E2825] mb-1.5">Password</label>
            <div class="relative">
              <app-input
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                [required]="true"
                placeholder="••••••••••••"
                [error]="getPasswordError()"
              ></app-input>

              <button
                type="button"
                (click)="togglePasswordVisibility()"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors p-1"
                aria-label="Toggle password visibility"
              >
                @if (showPassword()) {
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                } @else {
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                }
              </button>
            </div>
          </div>

          <app-input
            label="Confirm Password"
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
              [disabled]="loading() || registerForm.invalid"
              [loading]="loading()"
            >
              Sign up
            </app-button>
          </div>
        </form>

        <!-- Footer -->
        <p class="mt-8 text-center text-xs text-neutral-500">
          Already have an account?
          <a routerLink="/login" class="text-neutral-900 font-medium hover:underline ml-1 underline-offset-4">
            Sign in
          </a>
        </p>

      </app-auth-layout>
  `
})
export class RegisterPageComponent {
  private supabase = inject(SupabaseService);
  private fb = inject(FormBuilder);

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  showPassword = signal(false);

  registerForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, strongPasswordValidator()]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: passwordMatchValidator });

  togglePasswordVisibility(): void {
    this.showPassword.update((val) => !val);
  }

  getEmailError(): string {
    const control = this.registerForm.get('email');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Email is required';
      if (control.errors['email']) return 'Please enter a valid email address';
    }
    return '';
  }

  getPasswordError(): string {
    const control = this.registerForm.get('password');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Password is required';
      if (control.errors['strongPassword']) {
        return 'Must be 8+ chars with uppercase, lowercase, number, and symbol';
      }
    }
    return '';
  }

  getConfirmPasswordError(): string {
    const control = this.registerForm.get('confirmPassword');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Please confirm your password';
      if (control.errors['passwordMismatch']) return 'Passwords do not match';
    }
    return '';
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const { email, password } = this.registerForm.value;
    const { data, error } = await this.supabase.signUp(email, password);

    if (error) {
      this.errorMessage.set(error.message);
      this.loading.set(false);
      return;
    }

    if (data.user && data.user.identities && data.user.identities.length === 0) {
      this.errorMessage.set('An account with this email already exists.');
    } else {
      this.successMessage.set('Registration successful! Please check your email to verify your account before signing in.');
      this.registerForm.reset();
    }
    
    this.loading.set(false);
  }
}
