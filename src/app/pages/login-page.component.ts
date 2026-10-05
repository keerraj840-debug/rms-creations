import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-[#F7F6F3] to-[#E6E2D8] flex items-center justify-center p-4">
      <div class="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl bg-opacity-80 border border-white/20">
        <div class="p-8">
          <div class="text-center mb-8">
            <h1 class="text-4xl font-extrabold text-[#9C4738] mb-2 tracking-tight">Welcome Back</h1>
            <p class="text-gray-500 text-sm">Sign in to your account</p>
          </div>

          <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="space-y-6">
            
            <div *ngIf="errorMessage" class="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
              {{ errorMessage }}
            </div>

            <div class="space-y-1">
              <label for="email" class="text-sm font-semibold text-gray-700">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                [(ngModel)]="email" 
                required 
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#DD8776] focus:ring-2 focus:ring-[#DD8776]/20 transition-all outline-none bg-gray-50/50"
                placeholder="admin@example.com"
              >
            </div>

            <div class="space-y-1">
              <label for="password" class="text-sm font-semibold text-gray-700">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                [(ngModel)]="password" 
                required 
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#DD8776] focus:ring-2 focus:ring-[#DD8776]/20 transition-all outline-none bg-gray-50/50"
                placeholder="••••••••"
              >
            </div>

            <button 
              type="submit" 
              [disabled]="loading || !loginForm.valid"
              class="w-full bg-gradient-to-r from-[#9C4738] to-[#DD8776] hover:from-[#8A3A2C] hover:to-[#C67160] text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span *ngIf="loading" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              {{ loading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>
          
        </div>
      </div>
    </div>
  `
})
export class LoginPageComponent {
  private supabase = inject(SupabaseService);
  private router = inject(Router);
  private localStorage = inject(LocalStorageService);

  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  async onSubmit() {
    this.loading = true;
    this.errorMessage = '';

    const { data, error } = await this.supabase.signIn(this.email, this.password);

    if (error) {
      this.errorMessage = error.message;
      this.loading = false;
      return;
    }

    if (data.session) {
      this.localStorage.setItem('auth_token', data.session.access_token);
      
      // For now, let's look up the user role from our 'users' table
      const userRes = await this.supabase.from('users')
        .select('role')
        .eq('email', this.email)
        .single();
        
      const role = userRes.data?.role || 'customer';
      this.localStorage.setItem('user_role', role);

      if (role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/']);
      }
    }
    
    this.loading = false;
  }
}
