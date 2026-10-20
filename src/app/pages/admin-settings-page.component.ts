import { Component, OnInit, HostListener, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../services/supabase.service';
import { NotificationOutboxService } from '../services/notification-outbox.service';

import { CustomHamperService } from '../services/custom-hamper.service';

@Component({
  selector: 'app-admin-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-5xl mx-auto pb-12 space-y-4 transition-colors duration-300">

      <!-- Top Sticky Action Bar -->
      <div class="sticky top-0 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-[#FAF7F2]/95 dark:bg-[#1E1916]/95 backdrop-blur-md border-b border-[#EADFD2]/80 dark:border-white/10 flex items-center justify-between gap-4">

        <!-- Left: Title & Status -->
        <div class="flex items-center gap-3 min-w-0">
          <div class="min-w-0">
            <div class="flex items-center gap-2.5">
              <h1 class="text-lg sm:text-xl font-serif font-bold text-[#2E2825] dark:text-[#F4F1ED] truncate">
                Store Settings
              </h1>

              <!-- Store Status Pill -->
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors flex items-center gap-1.5 shrink-0"
                    [ngClass]="settings.is_app_live ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40' : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/40'">
                <span class="w-1.5 h-1.5 rounded-full" [ngClass]="settings.is_app_live ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                <span>{{ settings.is_app_live ? 'Store Online' : 'Store Offline' }}</span>
              </span>

              <!-- Maintenance Pill -->
              <span *ngIf="settings.under_maintenance" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                Maintenance Mode Active
              </span>
            </div>

            <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] truncate">
              Manage your WhatsApp number, store contact details, email, address, and online status.
            </p>
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-2.5 shrink-0">
          <button type="button" (click)="saveSettings()" [disabled]="saving || loading"
                  class="px-5 py-2 rounded-xl bg-gradient-to-r from-[#9C4738] to-[#BA5E4E] hover:from-[#883B2D] text-white text-xs font-bold shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  title="Keyboard Shortcut: ⌘+Enter">
            <span *ngIf="saving" class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
            <span>{{ saving ? 'Saving...' : 'Save Settings' }}</span>
            <span class="text-[10px] opacity-75 hidden sm:inline font-mono">⌘↵</span>
          </button>
        </div>

      </div>

      <!-- Feedback Banners -->
      <div *ngIf="successMessage" class="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between animate-in fade-in">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-circle-check"></i>
          <span>{{ successMessage }}</span>
        </div>
        <button (click)="successMessage = ''" class="text-emerald-500 hover:text-emerald-700 cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <div *ngIf="errorMessage" class="p-3.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold border border-rose-200 dark:border-rose-800/40 flex items-center justify-between animate-in fade-in">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span>{{ errorMessage }}</span>
        </div>
        <button (click)="errorMessage = ''" class="text-rose-400 hover:text-rose-600 cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <!-- UNIFIED 2-COLUMN WORKSPACE -->
      <div class="bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-6 shadow-2xs">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <!-- LEFT COLUMN: Contact, Concierge WhatsApp & Addresses (7 Cols) -->
          <div class="lg:col-span-7 space-y-5">

            <!-- 1. WhatsApp Config -->
            <div class="space-y-4">
              <div class="border-b border-[#EADFD2]/60 dark:border-white/10 pb-2">
                <h2 class="text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393] uppercase tracking-wider flex items-center gap-2">
                  <i class="fa-brands fa-whatsapp text-emerald-600"></i>
                  <span>WhatsApp Order Number</span>
                </h2>
              </div>

              <div>
                <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                  Primary WhatsApp Number (Without + or spaces) <span class="text-rose-500">*</span>
                </label>
                <div class="relative">
                  <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-600">
                    <i class="fa-brands fa-whatsapp"></i>
                  </span>
                  <input type="text" [(ngModel)]="settings.whatsapp_no" placeholder="e.g. 919284905118"
                         class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-mono font-medium text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738] outline-none">
                </div>
                <p class="text-[10px] text-[#A89F91] mt-1">Country code included, e.g. 91 for India followed by 10 digits. Used for all instant WhatsApp order buttons.</p>
              </div>

              <div>
                <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                  Display Phone Number
                </label>
                <div class="relative">
                  <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7A6C5E]">
                    <i class="fa-solid fa-phone"></i>
                  </span>
                  <input type="text" [(ngModel)]="settings.contact_no" placeholder="e.g. +91 92849 05118"
                         class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-medium text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738] outline-none">
                </div>
                <p class="text-[10px] text-[#A89F91] mt-1">Formatted phone number shown in footer, navbar header, and contact card.</p>
              </div>
            </div>

            <!-- 2. Email & Location -->
            <div class="space-y-4 pt-2">
              <div class="border-b border-[#EADFD2]/60 dark:border-white/10 pb-2">
                <h2 class="text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393] uppercase tracking-wider flex items-center gap-2">
                  <i class="fa-solid fa-envelope text-[#9C4738]"></i>
                  <span>Business Emails & Physical Studio</span>
                </h2>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                    Contact / Inquiries Email
                  </label>
                  <input type="email" [(ngModel)]="settings.contact_email" placeholder="rmsgifthampers@gmail.com"
                         class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738] outline-none">
                </div>

                <div>
                  <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                    Customer Support Email
                  </label>
                  <input type="email" [(ngModel)]="settings.support_email" placeholder="supportrmsgifthampers@gmail.com"
                         class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738] outline-none">
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                  Studio Address / Operational Hub
                </label>
                <textarea [(ngModel)]="settings.address" rows="2" placeholder="e.g. Pune, Maharashtra, India"
                          class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738] outline-none leading-relaxed resize-y"></textarea>
              </div>
            </div>

            <!-- 3. Storefront Availability Toggles -->
            <div class="space-y-4 pt-2">
              <div class="border-b border-[#EADFD2]/60 dark:border-white/10 pb-2">
                <h2 class="text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393] uppercase tracking-wider flex items-center gap-2">
                  <i class="fa-solid fa-power-off text-[#9C4738]"></i>
                  <span>Store Availability & Maintenance</span>
                </h2>
              </div>

              <div class="p-3.5 bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 rounded-2xl space-y-3">
                <!-- App Live Toggle -->
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">Online Storefront Status</p>
                    <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">Keep public customer catalog visible and active</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" [(ngModel)]="settings.is_app_live" class="sr-only peer">
                    <div class="w-9 h-5 bg-stone-300 dark:bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <!-- Maintenance Mode -->
                <div class="flex items-center justify-between pt-2 border-t border-[#EADFD2]/60 dark:border-white/10">
                  <div>
                    <p class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">Scheduled Maintenance Mode</p>
                    <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">Display friendly maintenance banner to visiting customers</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" [(ngModel)]="settings.under_maintenance" class="sr-only peer">
                    <div class="w-9 h-5 bg-stone-300 dark:bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
              </div>
            </div>

            <!-- 4. Instagram Direct Publishing API Config -->
            <div class="space-y-4 pt-2">
              <div class="border-b border-[#EADFD2]/60 dark:border-white/10 pb-2">
                <h2 class="text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393] uppercase tracking-wider flex items-center gap-2">
                  <i class="fa-brands fa-instagram text-pink-600"></i>
                  <span>Instagram Direct Publishing API (Meta Graph)</span>
                </h2>
              </div>

              <div class="p-4 bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 rounded-2xl space-y-3">
                <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] leading-relaxed">
                  Connect your Instagram Business or Creator account to publish product photos, price &amp; captions directly from the Product Form with 1 click.
                </p>

                <div class="space-y-2.5">
                  <div>
                    <label class="block text-[11px] font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">
                      Instagram Business User ID
                    </label>
                    <input type="text" [(ngModel)]="settings.instagram_user_id" placeholder="e.g. 17841400000000000"
                           class="w-full px-3 py-2 bg-white dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl text-xs font-mono outline-none focus:border-[#9C4738]">
                  </div>

                  <div>
                    <label class="block text-[11px] font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">
                      Meta Access Token
                    </label>
                    <input type="password" [(ngModel)]="settings.instagram_access_token" placeholder="EAAG..."
                           class="w-full px-3 py-2 bg-white dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl text-xs font-mono outline-none focus:border-[#9C4738]">
                  </div>
                </div>

                <p class="text-[10px] text-[#A89F91]">
                  Note: If left empty, the 1-click Instagram Publish button automatically copies the caption, link, and hashtags to your clipboard and opens Instagram Create in your browser!
                </p>
              </div>
            </div>

            <!-- 5. Email Notification Outbox Monitor -->
            <div class="space-y-4 pt-2">
              <div class="border-b border-[#EADFD2]/60 dark:border-white/10 pb-2">
                <h2 class="text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393] uppercase tracking-wider flex items-center gap-2">
                  <i class="fa-solid fa-envelope text-[#9C4738]"></i>
                  <span>Email Notification Outbox Monitor</span>
                </h2>
              </div>

              <div class="p-4 bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 rounded-2xl space-y-3">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">Transactional Order Outbox</p>
                    <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">Admin recipient: <strong>rmsgifthampers@gmail.com</strong></p>
                  </div>

                  <button type="button" (click)="processOutboxQueue()" [disabled]="processingOutbox"
                          class="px-3 py-1.5 rounded-xl bg-[#9C4738] text-white text-xs font-bold hover:bg-[#883B2D] transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
                    <i class="fa-solid fa-rotate text-[10px]" [class.animate-spin]="processingOutbox"></i>
                    <span>{{ processingOutbox ? 'Processing...' : 'Process Outbox' }}</span>
                  </button>
                </div>

                <div class="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div class="p-2 bg-white dark:bg-[#1C1917] rounded-xl border border-[#EADFD2] dark:border-white/10">
                    <span class="text-[10px] text-[#7A6C5E] uppercase block font-bold">Pending</span>
                    <span class="font-serif font-bold text-amber-600 text-sm">{{ outboxCounts.pending }}</span>
                  </div>
                  <div class="p-2 bg-white dark:bg-[#1C1917] rounded-xl border border-[#EADFD2] dark:border-white/10">
                    <span class="text-[10px] text-[#7A6C5E] uppercase block font-bold">Sent</span>
                    <span class="font-serif font-bold text-emerald-600 text-sm">{{ outboxCounts.sent }}</span>
                  </div>
                  <div class="p-2 bg-white dark:bg-[#1C1917] rounded-xl border border-[#EADFD2] dark:border-white/10">
                    <span class="text-[10px] text-[#7A6C5E] uppercase block font-bold">Failed</span>
                    <span class="font-serif font-bold text-rose-600 text-sm">{{ outboxCounts.failed }}</span>
                  </div>
                </div>

                <p *ngIf="outboxResultMsg" class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <i class="fa-solid fa-circle-check"></i> {{ outboxResultMsg }}
                </p>
              </div>
            </div>

            <!-- 6. Build Hamper Pricing Markup Config -->
            <div class="space-y-4 pt-2">
              <div class="border-b border-[#EADFD2]/60 dark:border-white/10 pb-2">
                <h2 class="text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393] uppercase tracking-wider flex items-center gap-2">
                  <i class="fa-solid fa-gift text-[#9C4738]"></i>
                  <span>Build Hamper Item Markup / Surcharge</span>
                </h2>
              </div>

              <div class="p-4 bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 rounded-2xl space-y-3">
                <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] leading-relaxed">
                  Enter the extra value/margin to add to each treat in the customer Build Hamper studio:
                  <strong class="text-[#4A3C31] dark:text-[#F4F1ED]">Customer Price = Base Cost + Markup % + Fixed ₹</strong>.
                </p>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[11px] font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">
                      Percentage Markup (%)
                    </label>
                    <div class="relative w-full">
                      <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#7A6C5E]">%</span>
                      <input type="number" [(ngModel)]="settings.hamper_markup_percent" min="0" step="1" placeholder="0"
                             class="w-full bg-white dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl pl-3 pr-8 py-2 text-xs font-serif font-bold text-[#4A3C31] dark:text-[#F4F1ED] outline-none focus:border-[#9C4738]">
                    </div>
                  </div>

                  <div>
                    <label class="block text-[11px] font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">
                      Fixed Surcharge per Item (₹)
                    </label>
                    <div class="relative w-full">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#7A6C5E] font-serif">₹</span>
                      <input type="number" [(ngModel)]="settings.hamper_markup_fixed" min="0" step="1" placeholder="0"
                             class="w-full bg-white dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs font-serif font-bold text-[#4A3C31] dark:text-[#F4F1ED] outline-none focus:border-[#9C4738]">
                    </div>
                  </div>
                </div>

                <!-- Live Preview Pill -->
                <div class="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 text-[11px] text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <i class="fa-solid fa-calculator text-amber-600"></i>
                  <span>
                    Preview: A ₹100 treat will display to customers as 
                    <strong>₹{{ calculatePreviewPrice(100) }}</strong> 
                    (₹100 + {{ settings.hamper_markup_percent || 0 }}% [₹{{ getPercentPreview(100) }}] + ₹{{ settings.hamper_markup_fixed || 0 }}).
                  </span>
                </div>
              </div>
            </div>

          </div>

          <!-- RIGHT COLUMN: Live Contact Preview & Concierge Simulation (5 Cols) -->
          <div class="lg:col-span-5 space-y-5">

            <div class="border-b border-[#EADFD2]/60 dark:border-white/10 pb-2">
              <h2 class="text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393] uppercase tracking-wider flex items-center gap-2">
                <i class="fa-solid fa-eye text-[#9C4738]"></i>
                <span>Customer Touchpoint Preview</span>
              </h2>
            </div>

            <!-- Live Customer Contact Card Simulation -->
            <div class="p-4 bg-gradient-to-br from-[#FAF7F2] to-white dark:from-[#251F1C] dark:to-[#1E1916] border border-[#EADFD2] dark:border-white/10 rounded-2xl shadow-xs space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-xl bg-[#F3E7DC] dark:bg-white/10 text-[#9C4738] dark:text-[#DD8776] flex items-center justify-center text-xs font-bold">
                    <i class="fa-solid fa-store"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-xs text-[#2E2825] dark:text-[#F4F1ED]">RMS Creations Boutique</h3>
                    <p class="text-[10px] text-[#7A6C5E] dark:text-[#C5A393]">Customer Support</p>
                  </div>
                </div>

                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                      [ngClass]="settings.is_app_live ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'">
                  {{ settings.is_app_live ? 'Online' : 'Offline' }}
                </span>
              </div>

              <!-- Contact Item Rows -->
              <div class="space-y-2 text-xs">
                <div class="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-[#1E1916] border border-[#EADFD2]/60 dark:border-white/10">
                  <i class="fa-brands fa-whatsapp text-emerald-600 text-sm"></i>
                  <div class="min-w-0">
                    <span class="text-[9px] uppercase tracking-wider text-[#A89F91] block">Instant WhatsApp</span>
                    <span class="font-mono font-bold text-xs text-[#4A3C31] dark:text-[#F4F1ED]">{{ settings.whatsapp_no || 'Not Set' }}</span>
                  </div>
                </div>

                <div class="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-[#1E1916] border border-[#EADFD2]/60 dark:border-white/10">
                  <i class="fa-solid fa-phone text-[#9C4738] text-xs"></i>
                  <div class="min-w-0">
                    <span class="text-[9px] uppercase tracking-wider text-[#A89F91] block">Phone Calling</span>
                    <span class="font-bold text-xs text-[#4A3C31] dark:text-[#F4F1ED]">{{ settings.contact_no || 'Not Set' }}</span>
                  </div>
                </div>

                <div class="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-[#1E1916] border border-[#EADFD2]/60 dark:border-white/10">
                  <i class="fa-solid fa-envelope text-[#7A6C5E] text-xs"></i>
                  <div class="min-w-0">
                    <span class="text-[9px] uppercase tracking-wider text-[#A89F91] block">Inquiry Email</span>
                    <span class="font-medium text-xs text-[#4A3C31] dark:text-[#F4F1ED] truncate block">{{ settings.contact_email || 'Not Set' }}</span>
                  </div>
                </div>

                <div class="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-[#1E1916] border border-[#EADFD2]/60 dark:border-white/10">
                  <i class="fa-solid fa-location-dot text-[#7A6C5E] text-xs"></i>
                  <div class="min-w-0">
                    <span class="text-[9px] uppercase tracking-wider text-[#A89F91] block">Studio Location</span>
                    <span class="text-xs text-[#4A3C31] dark:text-[#F4F1ED] truncate block">{{ settings.address || 'Maharashtra, India' }}</span>
                  </div>
                </div>
              </div>

              <!-- Quick Test Link -->
              <div class="pt-2">
                <a [href]="'https://wa.me/' + (settings.whatsapp_no || '919284905118') + '?text=' + testWhatsAppMessage" target="_blank"
                    class="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs">
                  <i class="fa-brands fa-whatsapp"></i>
                  <span>Test WhatsApp Link</span>
                </a>
              </div>
            </div>

            <!-- Safe Cloud Sync Note -->
            <div class="p-3 bg-stone-50 dark:bg-white/5 rounded-xl border border-[#EADFD2]/70 dark:border-white/10 text-[11px] text-[#7A6C5E] dark:text-[#C5A393] space-y-1">
              <p class="font-bold text-[#4A3C31] dark:text-[#F4F1ED] flex items-center gap-1.5">
                <i class="fa-solid fa-circle-check text-emerald-600"></i>
                <span>Live Updates:</span>
              </p>
              <p>Changes saved here update immediately across your website header, footer, and WhatsApp buttons.</p>
            </div>

          </div>

        </div>
      </div>

    </div>
  `
})
export class AdminSettingsPageComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private outboxService = inject(NotificationOutboxService);
  private customHamperService = inject(CustomHamperService);
  private cdr = inject(ChangeDetectorRef);

  settings: any = {
    is_app_live: true,
    under_maintenance: false,
    contact_no: '+91 92849 05118',
    support_no: null,
    hamper_item_markup: 0,
    hamper_markup_percent: 0,
    hamper_markup_fixed: 0,
    support_email: 'supportrmsgifthampers@gmail.com',
    contact_email: 'rmsgifthampers@gmail.com',
    address: 'Maharashtra, India',
    whatsapp_no: '919284905118',
    instagram_user_id: '',
    instagram_access_token: '',
    is_active: true
  };

  loading = true;
  saving = false;
  errorMessage = '';
  successMessage = '';

  outboxCounts = { pending: 0, sent: 0, failed: 0 };
  processingOutbox = false;
  outboxResultMsg = '';

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      this.saveSettings();
    }
  }

  async loadOutboxMetrics() {
    try {
      const { data } = await this.supabase
        .from('order_notification_outbox')
        .select('status');

      if (data) {
        this.outboxCounts = {
          pending: data.filter((d: any) => d.status === 'pending' || d.status === 'processing').length,
          sent: data.filter((d: any) => d.status === 'sent').length,
          failed: data.filter((d: any) => d.status === 'failed').length
        };
      }
    } catch {
      // Non-blocking
    } finally {
      this.cdr.markForCheck();
    }
  }

  async processOutboxQueue() {
    this.processingOutbox = true;
    this.outboxResultMsg = '';
    this.cdr.markForCheck();

    try {
      const result = await this.outboxService.processPendingOutbox();
      this.outboxResultMsg = result.message || `Processed ${result.processed} notifications: ${result.sent} sent, ${result.failed} failed.`;
      await this.loadOutboxMetrics();
    } catch (err: any) {
      this.outboxResultMsg = 'Failed to process outbox queue.';
    } finally {
      this.processingOutbox = false;
      this.cdr.markForCheck();
    }
  }

  get testWhatsAppMessage(): string {
    return encodeURIComponent('Hi RMS Creations! Testing WhatsApp link from Admin Settings.');
  }

  async ngOnInit() {
    this.loading = true;
    this.cdr.markForCheck();
    this.loadOutboxMetrics();
    try {
      const { data, error } = await this.supabase.from('app_settings').select('*').limit(1).single();
      if (data) {
        this.settings = { ...data };
        const cfg = this.customHamperService.parseHamperMarkupConfig(data.support_no);
        this.settings.hamper_markup_percent = cfg.percent;
        this.settings.hamper_markup_fixed = cfg.fixedAmount;
        this.settings.hamper_item_markup = cfg.fixedAmount;
      } else if (error) {
        console.warn('Could not load app_settings:', error.message);
      }
    } catch (err: any) {
      console.warn('Error loading settings:', err);
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  async saveSettings() {
    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.markForCheck();

    try {
      let existingSupportObj: Record<string, any> = {};
      if (this.settings.support_no) {
        try {
          existingSupportObj = JSON.parse(this.settings.support_no);
          if (typeof existingSupportObj !== 'object' || existingSupportObj === null) {
            existingSupportObj = {};
          }
        } catch {
          existingSupportObj = {};
        }
      }
      existingSupportObj['hamper_markup_percent'] = Math.max(0, Number(this.settings.hamper_markup_percent) || 0);
      existingSupportObj['hamper_markup_fixed'] = Math.max(0, Number(this.settings.hamper_markup_fixed) || 0);
      existingSupportObj['hamper_item_markup'] = Math.max(0, Number(this.settings.hamper_markup_fixed) || 0);

      const payload: any = {
        is_app_live: Boolean(this.settings.is_app_live),
        under_maintenance: Boolean(this.settings.under_maintenance),
        contact_no: this.settings.contact_no?.trim() || null,
        support_no: JSON.stringify(existingSupportObj),
        support_email: this.settings.support_email?.trim() || null,
        contact_email: this.settings.contact_email?.trim() || null,
        address: this.settings.address?.trim() || null,
        whatsapp_no: this.settings.whatsapp_no?.trim() || null,
        instagram_user_id: this.settings.instagram_user_id?.trim() || null,
        instagram_access_token: this.settings.instagram_access_token?.trim() || null,
        is_active: true
      };

      let error;
      if (this.settings.id) {
        const res = await this.supabase.from('app_settings').update(payload).eq('id', this.settings.id);
        error = res.error;
      } else {
        const res = await this.supabase.from('app_settings').insert([payload]).select().single();
        error = res.error;
        if (res.data) {
          this.settings.id = res.data.id;
        }
      }

      if (error) {
        this.errorMessage = error.message;
      } else {
        this.successMessage = 'Settings saved successfully!';
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.markForCheck();
        }, 3000);
      }
    } catch (err: any) {
      this.errorMessage = err?.message || 'Failed to save settings.';
    } finally {
      this.saving = false;
      this.cdr.markForCheck();
    }
  }

  getPercentPreview(base: number): number {
    return Math.round((base * (this.settings.hamper_markup_percent || 0)) / 100);
  }

  calculatePreviewPrice(base: number): number {
    return this.customHamperService.calculateCustomerItemPrice(base, {
      percent: this.settings.hamper_markup_percent || 0,
      fixedAmount: this.settings.hamper_markup_fixed || 0
    });
  }
}

