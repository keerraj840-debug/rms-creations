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

    /* ------------------------------------------------------------------ */
    /* Authentication                                                     */
    /* ------------------------------------------------------------------ */
    async signUp(email: string, password: string) {
        const { data, error } = await this.supabase.auth.signUp({ email, password });
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
        const { error } = await this.supabase.auth.signOut();
        return { error };
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
        const { data, error } = await this.supabase.storage.from(bucket).upload(path, file, {
            cacheControl: '3600',
            upsert: false
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
