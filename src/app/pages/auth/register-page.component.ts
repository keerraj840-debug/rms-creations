import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { AuthService } from '../../services/auth.service';
import { InputComponent } from '../../shared/ui/input.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { AuthLayoutComponent } from '../../shared/ui/auth-layout.component';
import { sanitizeReturnUrl } from '../../utils/security.utils';

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
      subtitle="Join RMS Creations today to complete orders and track deliveries."
      imageSrc="assets/images/auth/register.jpg"
      imageTitle="Join the family"
      imageSubtitle="Handcrafted Hampers & Gifts"
      [errorMessage]="errorMessage()"
      [successMessage]="successMessage()"
    >
        <!-- Notice if coming from checkout -->
        <div *ngIf="returnUrl && returnUrl.includes('checkout')" class="mb-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
          <i class="fa-solid fa-lock text-amber-600"></i>
          <span>Create your account to continue checkout. Your cart is preserved!</span>
        </div>

        <!-- Google Sign-In Quick Action -->
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
          <div class="relative flex justify-center text-xs uppercase"><span class="bg-[#FAF7F2] dark:bg-[#1C1917] px-2 text-[#8B6E57] dark:text-[#A89F91] font-semibold">Or fill profile details</span></div>
        </div>

        <!-- Form Block -->
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-3.5">
          
          <!-- Full Name -->
          <app-input
            label="Full Name"
            type="text"
            formControlName="name"
            [required]="true"
            placeholder="e.g. Radhika Sharma"
            [error]="getNameError()"
          ></app-input>

          <!-- Email -->
          <app-input
            label="Email"
            type="email"
            formControlName="email"
            [required]="true"
            placeholder="name@company.com"
            [error]="getEmailError()"
          ></app-input>

          <!-- Phone Number -->
          <app-input
            label="Phone Number"
            type="tel"
            formControlName="phone_no"
            placeholder="10-digit mobile number"
            [error]="getPhoneError()"
          ></app-input>

          <!-- Gender & Date of Birth Row -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-[#2E2825] dark:text-[#F4F1ED] mb-1.5">
                Gender <span class="text-rose-500">*</span>
              </label>
              <select
                formControlName="gender"
                class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-[#2E2825] dark:text-[#F4F1ED] outline-none focus:border-[#9C4738] focus:ring-1 focus:ring-[#9C4738]"
              >
                <option value="">Select Gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
              <p *ngIf="registerForm.get('gender')?.touched && registerForm.get('gender')?.invalid" class="text-[11px] text-rose-500 mt-1">
                Gender is required
              </p>
            </div>

            <div>
              <label class="block text-xs font-medium text-[#2E2825] dark:text-[#F4F1ED] mb-1.5">
                Date of Birth <span class="text-rose-500">*</span>
              </label>
              <input
                type="date"
                formControlName="date_of_birth"
                class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl px-3 py-2 text-xs text-[#2E2825] dark:text-[#F4F1ED] outline-none focus:border-[#9C4738] focus:ring-1 focus:ring-[#9C4738]"
              />
              <p *ngIf="registerForm.get('date_of_birth')?.touched && registerForm.get('date_of_birth')?.invalid" class="text-[11px] text-rose-500 mt-1">
                Date of birth is required
              </p>
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-xs font-medium text-[#2E2825] dark:text-[#F4F1ED] mb-1.5">Password <span class="text-rose-500">*</span></label>
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

          <!-- Confirm Password -->
          <div class="relative">
            <app-input
              label="Confirm Password"
              [type]="showPassword() ? 'text' : 'password'"
              formControlName="confirmPassword"
              [required]="true"
              placeholder="••••••••••••"
              [error]="getConfirmPasswordError()"
            ></app-input>
          </div>

          <div class="pt-2">
            <app-button
              type="submit"
              variant="primary"
              [fullWidth]="true"
              [disabled]="loading() || registerForm.invalid"
              [loading]="loading()"
            >
              Complete Registration
            </app-button>
          </div>
        </form>

        <!-- Footer -->
        <p class="mt-8 text-center text-xs text-[#7A6C5E] dark:text-[#C5A393]">
          Already have an account?
          <a [routerLink]="['/login']" [queryParams]="returnUrl ? { returnUrl: returnUrl } : null" class="text-[#57251C] dark:text-[#DD8776] font-bold hover:underline ml-1 underline-offset-4">
            Sign in
          </a>
        </p>

      </app-auth-layout>
  `
})
export class RegisterPageComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  showPassword = signal(false);
  returnUrl = '';

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone_no: ['', [Validators.pattern(/^[0-9]{10}$/)]],
    gender: ['', [Validators.required]],
    date_of_birth: ['', [Validators.required]],
    password: ['', [Validators.required, strongPasswordValidator()]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: passwordMatchValidator });

  ngOnInit() {
    this.returnUrl = sanitizeReturnUrl(this.route.snapshot.queryParamMap.get('returnUrl'));
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((val) => !val);
  }

  getNameError(): string {
    const control = this.registerForm.get('name');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Full name is required';
      if (control.errors['minlength']) return 'Name must be at least 2 characters';
    }
    return '';
  }

  getEmailError(): string {
    const control = this.registerForm.get('email');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Email is required';
      if (control.errors['email']) return 'Please enter a valid email address';
    }
    return '';
  }

  getPhoneError(): string {
    const control = this.registerForm.get('phone_no');
    if (control?.touched && control?.errors) {
      if (control.errors['pattern']) return 'Please enter a valid 10-digit mobile number';
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
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const formValues = this.registerForm.value;
    const { email, password, name, phone_no, gender, date_of_birth } = formValues;

    const { data, error } = await this.supabase.signUp(email, password, {
      data: {
        full_name: name,
        gender: gender,
        date_of_birth: date_of_birth,
        phone_no: phone_no
      }
    });

    if (error) {
      this.errorMessage.set(error.message);
      this.loading.set(false);
      return;
    }

    if (data.user && data.user.identities && data.user.identities.length === 0) {
      this.errorMessage.set('An account with this email already exists. Please log in.');
      this.loading.set(false);
      return;
    }

    // Save profile into users table
    try {
      await this.supabase.from('users').upsert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone_no: phone_no ? phone_no.trim() : null,
        gender: gender,
        date_of_birth: date_of_birth,
        role: 'customer',
        auth_user_id: data.user?.id || null,
        is_active: true
      }, { onConflict: 'email' });
    } catch {
      // Non-blocking if table permissions or triggers take care of it
    }

    if (data.session) {
      await this.authService.syncUserProfile(data.user);
      if (this.returnUrl) {
        this.router.navigateByUrl(this.returnUrl);
        return;
      }
    }

    this.successMessage.set('Registration successful! Check your email to confirm or sign in to complete checkout.');
    this.registerForm.reset();
    this.loading.set(false);

    if (this.returnUrl) {
      setTimeout(() => {
        this.router.navigate(['/login'], { queryParams: { returnUrl: this.returnUrl } });
      }, 1500);
    }
  }
}

