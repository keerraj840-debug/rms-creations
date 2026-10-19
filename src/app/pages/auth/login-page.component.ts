import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { AuthService } from '../../services/auth.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { InputComponent } from '../../shared/ui/input.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { AuthLayoutComponent } from '../../shared/ui/auth-layout.component';
import { sanitizeReturnUrl } from '../../utils/security.utils';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InputComponent, ButtonComponent, AuthLayoutComponent],
  template: `
    <app-auth-layout
      title="Log in."
      subtitle="Sign in to your account to continue your checkout and order gifts."
      imageSrc="assets/images/auth/login.jpg"
      imageTitle="Welcome back"
      imageSubtitle="Nice to see you again"
      [errorMessage]="errorMessage()"
    >
        <!-- Notice if coming from checkout -->
        <div *ngIf="returnUrl && returnUrl.includes('checkout')" class="mb-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
          <i class="fa-solid fa-lock text-amber-600"></i>
          <span>Please log in or register to complete your order. Your cart items are saved!</span>
        </div>

        <!-- Google Sign-In Button -->
        <button
          type="button"
          (click)="signInWithGoogle()"
          [disabled]="loading()"
          class="w-full py-2.5 px-4 bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-xl text-xs sm:text-sm font-semibold text-[#4A3C31] dark:text-[#F4F1ED] hover:bg-stone-50 dark:hover:bg-white/5 transition flex items-center justify-center gap-2.5 shadow-2xs mb-4 cursor-pointer"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <!-- Divider -->
        <div class="relative my-4">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-[#EADFD2] dark:border-white/10"></div></div>
          <div class="relative flex justify-center text-xs uppercase"><span class="bg-[#FAF7F2] dark:bg-[#1C1917] px-2 text-[#8B6E57] dark:text-[#A89F91] font-semibold">Or with email</span></div>
        </div>

        <!-- Form Block -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
          
          <app-input
            label="Email"
            type="email"
            formControlName="email"
            autocomplete="email"
            [required]="true"
            placeholder="name@company.com"
            [error]="getEmailError()"
          ></app-input>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-medium text-[#2E2825] dark:text-[#F4F1ED]">Password</label>
              <a routerLink="/forgot-password" class="text-xs text-[#8B6E57] dark:text-[#C5A393] hover:text-[#57251C] dark:hover:text-[#F4F1ED] transition-colors">
                Forgot?
              </a>
            </div>

            <div class="relative">
              <app-input
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                autocomplete="current-password"
                [required]="true"
                placeholder="••••••••••••"
                [error]="getPasswordError()"
              ></app-input>

              <button
                type="button"
                (click)="togglePasswordVisibility()"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors p-1"
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
        <p class="mt-8 text-center text-xs text-[#7A6C5E] dark:text-[#C5A393]">
          Don't have an account?
          <a [routerLink]="['/register']" [queryParams]="returnUrl ? { returnUrl: returnUrl } : null" class="text-[#57251C] dark:text-[#DD8776] font-bold hover:underline ml-1 underline-offset-4">
            Sign up
          </a>
        </p>

        <p class="mt-4 text-center text-[10px] text-[#7A6C5E] dark:text-[#C5A393]">
          By continuing, you agree to RMS Creations'
          <a routerLink="/terms" target="_blank" class="underline hover:text-[#9C4738] dark:hover:text-[#EB9D8E]">Terms of Service</a> &amp;
          <a routerLink="/privacy" target="_blank" class="underline hover:text-[#9C4738] dark:hover:text-[#EB9D8E]">Privacy Policy</a>.
        </p>

      </app-auth-layout>
  `
})
export class LoginPageComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private localStorage = inject(LocalStorageService);
  private fb = inject(FormBuilder);

  loading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);
  returnUrl = '';

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  ngOnInit() {
    this.returnUrl = sanitizeReturnUrl(this.route.snapshot.queryParamMap.get('returnUrl'));

    const errorDesc = this.route.snapshot.queryParamMap.get('error_description');
    const errorCode = this.route.snapshot.queryParamMap.get('error_code');
    const errorParam = this.route.snapshot.queryParamMap.get('error');

    if (errorDesc || errorCode || errorParam) {
      if (errorDesc?.includes('Unable to exchange external code')) {
        this.errorMessage.set('Google sign-in verification failed (Client Secret or OAuth config mismatch). Please verify your Google Client Secret in Supabase Auth Providers.');
      } else {
        this.errorMessage.set(errorDesc || errorParam || 'Google sign-in could not be completed. Please try again.');
      }
    }
  }

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
    }
    return '';
  }

  async signInWithGoogle() {
    this.loading.set(true);
    this.errorMessage.set('');
    try {
      await this.authService.loginWithGoogle(this.returnUrl || undefined);
    } catch (err: any) {
      this.errorMessage.set(err?.message || 'Failed to initiate Google sign-in.');
      this.loading.set(false);
    }
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

      // Sync and retrieve user profile
      const profile = await this.authService.syncUserProfile(data.user);
      const role = profile?.role || 'customer';
      this.localStorage.setItem('user_role', role);

      if (this.returnUrl) {
        this.router.navigateByUrl(this.returnUrl);
      } else {
        this.router.navigate([role === 'admin' ? '/admin' : '/']);
      }
    }

    this.loading.set(false);
  }
}