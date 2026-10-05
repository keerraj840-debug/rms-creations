import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../services/supabase.service';
import { CardComponent } from '../shared/ui/card.component';
import { ButtonComponent } from '../shared/ui/button.component';
import { InputComponent } from '../shared/ui/input.component';

@Component({
  selector: 'app-admin-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, ButtonComponent, InputComponent],
  template: `
    <div class="space-y-6 max-w-4xl mx-auto">
      
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <h1 class="text-3xl font-serif font-bold text-[#3B2F2F] tracking-tight">App Settings</h1>
          <div class="h-5 w-px bg-[#EADFD2]"></div>
          <div class="flex items-center gap-2 text-sm text-[#7A6C5E] font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span class="text-[10px] uppercase tracking-widest text-[#4A3C31] font-bold">> System > Settings</span>
          </div>
        </div>
      </div>

      <app-card [hasFooter]="false">
        <form (ngSubmit)="saveSettings()" #settingsForm="ngForm" class="space-y-8">
          
          <div *ngIf="errorMessage" class="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-bold border border-rose-200">
            {{ errorMessage }}
          </div>
          
          <div *ngIf="successMessage" class="bg-[#ECFDF5] text-[#059669] p-4 rounded-xl text-sm font-bold border border-[#A7F3D0]">
            {{ successMessage }}
          </div>

          <div class="space-y-8">
            
            <div class="space-y-6">
              <h3 class="text-lg font-serif font-bold text-[#4A3C31] border-b border-[#EADFD2] pb-2">Global UI Settings</h3>
              
              <app-input label="Site Banner Text" type="textarea" [(ngModel)]="settings.site_banner_text" name="site_banner_text" hint="Displayed at the top of the customer website."></app-input>

              <div class="flex items-center gap-3 pt-2">
                <input type="checkbox" id="is_banner_active" name="is_banner_active" [(ngModel)]="settings.is_banner_active" class="w-5 h-5 rounded text-[#DD8776] border-[#EADFD2] focus:ring-[#DD8776]">
                <label for="is_banner_active" class="text-sm font-bold text-[#4A3C31]">Show Top Banner</label>
              </div>
            </div>

            <div class="space-y-6 pt-4 border-t border-[#EADFD2]">
              <h3 class="text-lg font-serif font-bold text-[#4A3C31] border-b border-[#EADFD2] pb-2">Business Settings</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <app-input label="Contact Email" type="email" [(ngModel)]="settings.contact_email" name="contact_email"></app-input>
                <app-input label="Contact Phone" type="text" [(ngModel)]="settings.contact_phone" name="contact_phone"></app-input>
              </div>
            </div>

          </div>

          <div class="pt-6 border-t border-[#EADFD2] flex justify-end gap-4 mt-8">
            <app-button variant="primary" type="submit" [loading]="saving">
              {{ saving ? 'Saving...' : 'Save Settings' }}
            </app-button>
          </div>
        </form>
      </app-card>
    </div>
  `
})
export class AdminSettingsPageComponent implements OnInit {
  private supabase = inject(SupabaseService);
  
  settings: any = {
    site_banner_text: '',
    is_banner_active: false,
    contact_email: '',
    contact_phone: ''
  };
  
  loading = true;
  saving = false;
  errorMessage = '';
  successMessage = '';

  async ngOnInit() {
    this.loading = true;
    const { data } = await this.supabase.from('app_settings').select('*').single();
    if (data) {
      this.settings = data;
    }
    this.loading = false;
  }

  async saveSettings() {
    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    let error;
    if (this.settings.id) {
      const res = await this.supabase.from('app_settings').update(this.settings).eq('id', this.settings.id);
      error = res.error;
    } else {
      const res = await this.supabase.from('app_settings').insert(this.settings);
      error = res.error;
    }

    if (error) {
      this.errorMessage = error.message;
    } else {
      this.successMessage = 'Settings saved successfully!';
      setTimeout(() => this.successMessage = '', 3000);
    }
    
    this.saving = false;
  }
}
