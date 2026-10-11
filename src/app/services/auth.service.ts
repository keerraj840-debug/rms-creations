import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { LocalStorageService } from './local-storage.service';

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

  private readonly USER_STORAGE_KEY = 'rms_auth_user_profile';
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$: Observable<UserProfile | null> = this.currentUserSubject.asObservable();

  constructor() {
    this.initSession();
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

  get isAuthenticated(): boolean {
    const token = this.localStorage.getItem<string>('auth_token');
    return Boolean(token || this.currentUser);
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

  async signOut() {
    await this.supabase.signOut();
    this.currentUserSubject.next(null);
    this.localStorage.removeItem(this.USER_STORAGE_KEY);
    this.localStorage.removeItem('auth_token');
    this.localStorage.removeItem('user_role');
  }
}
