import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { InputComponent } from '../../shared/ui/input.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { AuthLayoutComponent } from '../../shared/ui/auth-layout.component';

// Enforces 8+ chars, uppercase, lowercase, number, and special character
function strongPasswordValidator() {
  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+=\-\[\]{}|;:,.<>])[A-Za-z\d@$!%*?&#^()_+=\-\[\]{}|;:,.<>]{8,}$/;
  return (control: { value: string }) => {
    if (!control.value) return null;
    return pattern.test(control.value) ? null : { strongPassword: true };
  };
}

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InputComponent, ButtonComponent, AuthLayoutComponent],
  template: `
    <app-auth-layout
      title="Log in."
      subtitle="Log in with your data that you entered during your registration."
      imageSrc="assets/images/auth/login.jpg"
      imageTitle="Welcome back"
      imageSubtitle="Nice to see you again"
      [errorMessage]="errorMessage()"
    >
        <!-- Form Block -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
          
          <app-input
            label="Email"
            type="email"
            formControlName="email"
            [required]="true"
            placeholder="name@company.com"
            [error]="getEmailError()"
          ></app-input>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-medium text-[#2E2825]">Password</label>
              <a routerLink="/forgot-password" class="text-xs text-neutral-500 hover:text-neutral-900 transition-colors">
                Forgot?
              </a>
            </div>

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

          <div class="pt-2">
            <app-button
              type="submit"
              variant="primary"
              [fullWidth]="true"
              [disabled]="loading() || loginForm.invalid"
              [loading]="loading()"
            >
              Sign in
            </app-button>
          </div>
        </form>

        <!-- Footer -->
        <p class="mt-8 text-center text-xs text-neutral-500">
          Don't have an account?
          <a routerLink="/register" class="text-neutral-900 font-medium hover:underline ml-1 underline-offset-4">
            Sign up
          </a>
        </p>

      </app-auth-layout>
  `
})
export class LoginPageComponent {
  private supabase = inject(SupabaseService);
  private router = inject(Router);
  private localStorage = inject(LocalStorageService);
  private fb = inject(FormBuilder);

  loading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, strongPasswordValidator()]]
  });

  togglePasswordVisibility(): void {
    this.showPassword.update((val) => !val);
  }

  getEmailError(): string {
    const control = this.loginForm.get('email');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Email is required';
      if (control.errors['email']) return 'Please enter a valid email address';
    }
    return '';
  }

  getPasswordError(): string {
    const control = this.loginForm.get('password');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Password is required';
      if (control.errors['strongPassword']) {
        return 'Must be 8+ chars with uppercase, lowercase, number, and symbol';
      }
    }
    return '';
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const { email, password } = this.loginForm.value;
    const { data, error } = await this.supabase.signIn(email, password);

    if (error) {
      this.errorMessage.set(error.message);
      this.loading.set(false);
      return;
    }

    if (data.session) {
      this.localStorage.setItem('auth_token', data.session.access_token);

      const userRes = await this.supabase
        .from('users')
        .select('role')
        .eq('email', email)
        .single();

      const role = userRes.data?.role || 'customer';
      this.localStorage.setItem('user_role', role);

      this.router.navigate([role === 'admin' ? '/admin' : '/']);
    }

    this.loading.set(false);
  }
}