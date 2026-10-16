import { Injectable } from '@angular/core';
import {
    createClient,
    SupabaseClient,
} from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

/**
 * SupabaseService wraps the Supabase client and provides helper methods for
 * authentication, generic CRUD operations and real‑time listeners.
 *
 * Expected environment variables (add them to `src/environments/environment.ts`):
 *
 * export const environment = {
 *   production: false,
 *   SUPABASE_URL: 'https://<your-project>.supabase.co',
 *   SUPABASE_ANON_KEY: '<public-anon-key>',
 * };
 */
@Injectable({
    providedIn: 'root',
})
export class SupabaseService {
    private supabase: SupabaseClient;

    constructor() {
        const url = environment.SUPABASE_URL || '';
        const anonKey = environment.SUPABASE_ANON_KEY || '';
        if (!url || !anonKey) {
            console.error('Supabase URL or anon key missing – check your environment config.');
        }
        this.supabase = createClient(url, anonKey);
    }

    get client(): SupabaseClient {
        return this.supabase;
    }

    /* ------------------------------------------------------------------ */
    /* Authentication                                                     */
    /* ------------------------------------------------------------------ */
    async signUp(email: string, password: string, options?: { data?: any }) {
        const { data, error } = await this.supabase.auth.signUp({
            email,
            password,
            options: options?.data ? { data: options.data } : undefined
        });
        return { data, error };
    }

    async signIn(email: string, password: string) {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    }

    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) {
                // If remote sign-out returned an error (such as session missing), clear locally
                await this.supabase.auth.signOut({ scope: 'local' }).catch(() => {});
            }
            return { error };
        } catch (err: any) {
            try {
                await this.supabase.auth.signOut({ scope: 'local' });
            } catch {
                // Ignore fallback error
            }
            return { error: null };
        }
    }

    async signInWithOAuth(provider: 'google' | 'github', redirectTo?: string) {
        const { data, error } = await this.supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: redirectTo || (typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined)
            }
        });
        return { data, error };
    }

    async getSession() {
        return this.supabase.auth.getSession();
    }

    async resetPasswordForEmail(email: string) {
        const { data, error } = await this.supabase.auth.resetPasswordForEmail(email);
        return { data, error };
    }

    async verifyOtp(email: string, token: string, type: any = 'recovery') {
        const { data, error } = await this.supabase.auth.verifyOtp({
            email,
            token,
            type
        });
        return { data, error };
    }

    async updateUserPassword(password: string) {
        const { data, error } = await this.supabase.auth.updateUser({ password });
        return { data, error };
    }

    getUser() {
        return this.supabase.auth.getUser();
    }

    /* ------------------------------------------------------------------ */
    /* Storage                                                            */
    /* ------------------------------------------------------------------ */
    async uploadFile(bucket: string, path: string, file: File) {
        // 1. Enforce 1 MB upload limit on the storage layer
        const MAX_SIZE = 1 * 1024 * 1024;
        if (!file || file.size > MAX_SIZE) {
            return {
                data: null,
                error: new Error(`File upload rejected: Size (${((file?.size || 0) / (1024 * 1024)).toFixed(2)} MB) exceeds maximum allowed limit of 1 MB.`)
            };
        }

        // 2. Enforce JPG, JPEG, and PNG only
        const mime = (file.type || '').toLowerCase();
        if (mime !== 'image/jpeg' && mime !== 'image/png' && mime !== 'image/jpg') {
            return {
                data: null,
                error: new Error(`File upload rejected: Format "${file.type}" is not allowed. Only JPG and PNG are accepted.`)
            };
        }

        // 3. Generate safe server-side filename (ignore client-supplied directory traversal paths)
        const isPng = mime === 'image/png';
        const safeExt = isPng ? 'png' : 'jpg';
        const randomId = typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID().slice(0, 8)
            : Math.random().toString(36).slice(2, 10);
        const prefix = bucket.replace(/[^a-zA-Z0-9]/g, '');
        const safePath = `${prefix}_${Date.now()}_${randomId}.${safeExt}`;

        const contentType = isPng ? 'image/png' : 'image/jpeg';

        const { data, error } = await this.supabase.storage.from(bucket).upload(safePath, file, {
            contentType,
            cacheControl: '3600',
            upsert: true
        });

        if (error) return { data: null, error };

        const { data: publicUrlData } = this.supabase.storage.from(bucket).getPublicUrl(data.path);
        return { data: publicUrlData.publicUrl, error: null };
    }

    /* ------------------------------------------------------------------ */
    /* Generic CRUD                                                       */
    /* ------------------------------------------------------------------ */
    /** Returns a query builder for any table – use Supabase's fluent API. */
    from(table: string) {
        return this.supabase.from(table);
    }

    /* ------------------------------------------------------------------ */
    /* Real‑time listener                                                 */
    /* ------------------------------------------------------------------ */
    onRealtime(
        table: string,
        callback: (payload: any) => void,
    ) {
        return this.supabase
            .channel(`realtime-${table}`)
            .on('postgres_changes' as any, { event: '*', schema: 'public', table }, callback)
            .subscribe();
    }
}
