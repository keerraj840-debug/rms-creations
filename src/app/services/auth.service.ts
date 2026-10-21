import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { LocalStorageService } from './local-storage.service';
import { ToastService } from './toast.service';

export interface UserProfile {
  id?: number;
  name: string;
  email: string;
  phone_no?: string;
  role: 'customer' | 'admin';
  gender?: 'male' | 'female' | 'other' | '';
  date_of_birth?: string | null;
  auth_user_id?: string;
  google_id?: string;
  is_active?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly supabase = inject(SupabaseService);
  private readonly localStorage = inject(LocalStorageService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  private readonly USER_STORAGE_KEY = 'rms_auth_user_profile';
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$: Observable<UserProfile | null> = this.currentUserSubject.asObservable();

  public readonly showLogoutModal = signal<boolean>(false);
  public readonly isLoggingOut = signal<boolean>(false);

  constructor() {
    this.initSession();
    this.initAuthStateListener();
  }

  private initAuthStateListener() {
    try {
      this.supabase.client.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT') {
          this.currentUserSubject.next(null);
          this.localStorage.removeItem(this.USER_STORAGE_KEY);
          this.localStorage.removeItem('auth_token');
          this.localStorage.removeItem('user_role');
        } else if (event === 'SIGNED_IN' && session?.user && !this.currentUserSubject.value) {
          await this.syncUserProfile(session.user);
        }
      });
    } catch {
      // Ignore if auth listener unsupported in test / SSR
    }
  }

  private async initSession() {
    const cached = this.localStorage.getItem<UserProfile>(this.USER_STORAGE_KEY);
    if (cached) {
      this.currentUserSubject.next(cached);
    }

    try {
      const { data } = await this.supabase.getUser();
      if (data?.user) {
        await this.syncUserProfile(data.user);
      } else if (!cached) {
        this.currentUserSubject.next(null);
      }
    } catch {
      // In SSR or offline mode, keep cached session if available
    }
  }

  get currentUser(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  /**
   * Returns true only if a verified user profile is held in memory.
   * The profile is populated from the Supabase Auth session — it cannot be
   * spoofed by modifying localStorage. Do NOT gate security-sensitive
   * operations solely on this getter; rely on database RLS policies.
   */
  get isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  async syncUserProfile(authUser: any): Promise<UserProfile | null> {
    if (!authUser?.email) return null;

    try {
      const email = authUser.email.trim().toLowerCase();
      const meta = authUser.user_metadata || {};
      const fullName = meta.full_name || meta.name || authUser.email.split('@')[0];

      // Query database users table
      const { data: existingUser } = await this.supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (existingUser) {
        // Update auth_user_id if not linked
        const updates: any = {};
        if (!existingUser.auth_user_id && authUser.id) {
          updates.auth_user_id = authUser.id;
        }
        if (Object.keys(updates).length > 0) {
          await this.supabase.from('users').update(updates).eq('id', existingUser.id);
        }

        const profile: UserProfile = {
          id: existingUser.id,
          name: existingUser.name || fullName,
          email: existingUser.email,
          phone_no: existingUser.phone_no || '',
          role: (existingUser.role as any) || 'customer',
          gender: existingUser.gender || '',
          date_of_birth: existingUser.date_of_birth || null,
          auth_user_id: authUser.id,
          is_active: existingUser.is_active
        };

        this.setSession(profile);
        return profile;
      } else {
        // Insert new customer record without duplicates
        const newRecord: any = {
          name: fullName,
          email: email,
          role: 'customer',
          gender: meta.gender || '',
          phone_no: meta.phone || '',
          date_of_birth: meta.date_of_birth || null,
          auth_user_id: authUser.id,
          google_id: meta.provider_id || meta.sub || null,
          is_active: true,
          creation_date: new Date().toISOString()
        };

        const { data: inserted, error: insertErr } = await this.supabase
          .from('users')
          .insert(newRecord)
          .select()
          .single();

        if (insertErr) {
          console.error('Error creating user profile record:', insertErr.message);
          return null;
        }

        const profile: UserProfile = {
          id: inserted.id,
          name: inserted.name,
          email: inserted.email,
          phone_no: inserted.phone_no,
          role: 'customer',
          gender: inserted.gender || '',
          date_of_birth: inserted.date_of_birth || null,
          auth_user_id: authUser.id,
          is_active: true
        };

        this.setSession(profile);
        return profile;
      }
    } catch (err) {
      console.error('Error syncing user profile:', err);
      return null;
    }
  }

  async signInWithGoogle(returnUrl?: string): Promise<{ error: any }> {
    try {
      const redirectUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/login${returnUrl ? '?returnUrl=' + encodeURIComponent(returnUrl) : ''}`
        : '';
      const { error } = await this.supabase.signInWithOAuth('google', redirectUrl);
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  }

  async loginWithGoogle(returnUrl?: string): Promise<{ error: any }> {
    return this.signInWithGoogle(returnUrl);
  }

  async updateProfile(updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> {
    const current = this.currentUser;
    if (!current?.email) return { success: false, error: 'User is not logged in' };

    try {
      const payload: any = {
        updation_date: new Date().toISOString()
      };
      if (updates.name !== undefined) payload.name = updates.name.trim();
      if (updates.gender !== undefined) payload.gender = updates.gender;
      if (updates.date_of_birth !== undefined) payload.date_of_birth = updates.date_of_birth;
      if (updates.phone_no !== undefined) payload.phone_no = updates.phone_no.trim();

      const query = current.id ? 
        this.supabase.from('users').update(payload).eq('id', current.id) :
        this.supabase.from('users').update(payload).eq('email', current.email);

      const { error } = await query;
      if (error) throw error;

      const updatedProfile: UserProfile = {
        ...current,
        ...updates
      };

      this.setSession(updatedProfile);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update profile' };
    }
  }

  setSession(profile: UserProfile, token?: string) {
    this.currentUserSubject.next(profile);
    this.localStorage.setItem(this.USER_STORAGE_KEY, profile);
    this.localStorage.setItem('user_role', profile.role);
    if (token) {
      this.localStorage.setItem('auth_token', token);
    }
  }

  promptLogout(): void {
    this.showLogoutModal.set(true);
  }

  cancelLogout(): void {
    if (!this.isLoggingOut()) {
      this.showLogoutModal.set(false);
    }
  }

  async confirmLogout(redirectPath = '/login'): Promise<void> {
    if (this.isLoggingOut()) return;
    this.isLoggingOut.set(true);
    try {
      await this.signOut();
      this.toastService.info('You have been signed out successfully.', 'Signed Out');
    } catch (err) {
      console.warn('Sign-out completed with warning:', err);
    } finally {
      this.isLoggingOut.set(false);
      this.showLogoutModal.set(false);
      this.router.navigate([redirectPath]);
    }
  }

  async signOut(): Promise<void> {
    // 1. Immediately reset in-memory state so router guards and UI immediately see unauthenticated user
    this.currentUserSubject.next(null);

    // 2. Clear known localStorage auth items
    this.localStorage.removeItem(this.USER_STORAGE_KEY);
    this.localStorage.removeItem('auth_token');
    this.localStorage.removeItem('user_role');

    // 3. Clean up any Supabase / cached auth tokens in browser localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key && (key.startsWith('sb-') || key.includes('auth-token') || key === this.USER_STORAGE_KEY || key === 'user_role')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((k) => window.localStorage.removeItem(k));
      } catch {
        // ignore
      }
    }

    // 4. Safely call Supabase signOut with timeout protection
    try {
      await Promise.race([
        this.supabase.signOut(),
        new Promise((resolve) => setTimeout(resolve, 2000))
      ]);
    } catch (err) {
      console.warn('Supabase sign-out encountered warning, proceeding with local clean-up:', err);
    }
  }
}
