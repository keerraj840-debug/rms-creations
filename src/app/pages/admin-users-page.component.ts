import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../services/supabase.service';
import { CardComponent } from '../shared/ui/card.component';
import { ModalComponent } from '../shared/ui/modal.component';
import { TableComponent, TableColumn } from '../shared/ui/table.component';

@Component({
  selector: 'app-admin-users-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, ModalComponent, TableComponent],
  template: `
    <div class="space-y-5  mx-auto pb-12 transition-colors duration-300">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <h1 class="text-xl sm:text-2xl font-serif font-bold text-[#2E2825] dark:text-[#F4F1ED] tracking-tight">
              User Accounts
            </h1>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EADFD2]/70 dark:bg-white/10 text-[#7A6C5E] dark:text-[#C5A393]">
              {{ users.length }} accounts
            </span>
          </div>
          <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] mt-0.5">
            Manage admin and customer user accounts.
          </p>
        </div>
        
        <div class="flex items-center gap-2.5 shrink-0 flex-wrap">
          <!-- Refresh Button -->
          <button type="button" (click)="fetchUsers()" [disabled]="loading"
                  class="p-2.5 rounded-xl bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#4A3C31] dark:hover:text-[#F4F1ED] shadow-2xs hover:border-[#9C4738] transition-all cursor-pointer"
                  title="Refresh Users">
            <i class="fa-solid fa-arrows-rotate text-xs" [class.animate-spin]="loading"></i>
          </button>

          <!-- Add User Button -->
          <button type="button" (click)="openAddUserModal()"
                  class="px-4 py-2 rounded-xl bg-gradient-to-r from-[#9C4738] to-[#BA5E4E] hover:from-[#883B2D] text-white text-xs font-bold shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer">
            <i class="fa-solid fa-user-plus text-xs"></i>
            <span>+ Add User</span>
          </button>
        </div>
      </div>

      <!-- Quick KPI Stats Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <!-- Total Users -->
        <div class="bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-3.5 shadow-2xs flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-[#F3E7DC] dark:bg-white/10 text-[#9C4738] dark:text-[#DD8776] flex items-center justify-center text-sm shrink-0">
            <i class="fa-solid fa-users"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">Total Accounts</p>
            <p class="text-lg font-serif font-bold text-[#3B2F2F] dark:text-[#F4F1ED]">{{ users.length }}</p>
          </div>
        </div>

        <!-- Admins / Staff -->
        <div class="bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-3.5 shadow-2xs flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm shrink-0">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">Staff / Admins</p>
            <p class="text-lg font-serif font-bold text-purple-600 dark:text-purple-400">{{ adminCount }}</p>
          </div>
        </div>

        <!-- Customers -->
        <div class="bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-3.5 shadow-2xs flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm shrink-0">
            <i class="fa-solid fa-user-tag"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">Customers</p>
            <p class="text-lg font-serif font-bold text-blue-600 dark:text-blue-400">{{ customerCount }}</p>
          </div>
        </div>

        <!-- Active Status -->
        <div class="bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-3.5 shadow-2xs flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm shrink-0">
            <i class="fa-solid fa-user-check"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">Active Logins</p>
            <p class="text-lg font-serif font-bold text-emerald-600 dark:text-emerald-400">{{ activeUsersCount }}</p>
          </div>
        </div>
      </div>

      <!-- Main Users Table Card -->
      <app-card [hasFooter]="false">
        <div card-header class="w-full space-y-3">
          
          <!-- Top Row: Search + Role Tabs -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            <!-- Search -->
            <div class="relative w-full sm:w-72">
              <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7A6C5E] dark:text-[#C5A393]"></i>
              <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="applyFilter()" placeholder="Search name or email..."
                     class="w-full bg-[#FDFBF7] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9C4738]/20 text-xs text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] transition-all">
            </div>

            <!-- Role Filter Chips -->
            <div class="flex items-center gap-2 flex-wrap">
              <div class="flex items-center bg-[#FAF7F2] dark:bg-white/5 p-1 rounded-xl border border-[#EADFD2]/70 dark:border-white/10 text-xs">
                <button type="button" (click)="roleFilter = 'all'; applyFilter()"
                        [class]="roleFilter === 'all' ? 'bg-white dark:bg-[#251F1C] text-[#4A3C31] dark:text-[#F4F1ED] font-bold shadow-2xs' : 'text-[#7A6C5E] dark:text-[#C5A393]'"
                        class="px-2.5 py-1 rounded-lg transition-all cursor-pointer">
                  All ({{ users.length }})
                </button>
                <button type="button" (click)="roleFilter = 'admin'; applyFilter()"
                        [class]="roleFilter === 'admin' ? 'bg-white dark:bg-[#251F1C] text-purple-600 dark:text-purple-400 font-bold shadow-2xs' : 'text-[#7A6C5E] dark:text-[#C5A393]'"
                        class="px-2.5 py-1 rounded-lg transition-all cursor-pointer">
                  Admins ({{ adminCount }})
                </button>
                <button type="button" (click)="roleFilter = 'customer'; applyFilter()"
                        [class]="roleFilter === 'customer' ? 'bg-white dark:bg-[#251F1C] text-blue-600 dark:text-blue-400 font-bold shadow-2xs' : 'text-[#7A6C5E] dark:text-[#C5A393]'"
                        class="px-2.5 py-1 rounded-lg transition-all cursor-pointer">
                  Customers ({{ customerCount }})
                </button>
              </div>
            </div>

          </div>

          <!-- Active filters counter -->
          <div *ngIf="searchQuery || roleFilter !== 'all'" class="flex items-center justify-between text-[11px] text-[#A89F91] pt-1 border-t border-[#EADFD2]/40 dark:border-white/5">
            <span>Showing {{ filteredUsers.length }} of {{ users.length }} accounts</span>
            <button type="button" (click)="resetFilters()" class="text-[#9C4738] dark:text-[#DD8776] font-bold hover:underline cursor-pointer">
              Reset Filters
            </button>
          </div>

        </div>

        <!-- High-Performance Table -->
        <app-table
          [columns]="columns"
          [loading]="loading"
          [error]="error"
          (retry)="fetchUsers()"
          [isEmpty]="filteredUsers.length === 0"
          [emptyIcon]="searchQuery || roleFilter !== 'all' ? 'search' : 'users'"
          [emptyTitle]="searchQuery || roleFilter !== 'all' ? 'No matching users' : 'No user accounts found'"
          [emptyDescription]="searchQuery || roleFilter !== 'all' ? 'No users found matching your search or role filter.' : 'Staff members and registered customer profiles will appear here.'"
          [emptyActionText]="searchQuery || roleFilter !== 'all' ? 'Reset Filters' : '+ Add User'"
          [emptyActionIcon]="searchQuery || roleFilter !== 'all' ? 'refresh' : 'plus'"
          (emptyActionClick)="searchQuery || roleFilter !== 'all' ? resetFilters() : openAddUserModal()"
        >
          <tr *ngFor="let user of filteredUsers" class="hover:bg-[#FDFBF7] dark:hover:bg-white/5 transition-colors group">
            
            <!-- User Name & Email -->
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="h-9 w-9 rounded-xl bg-[#F3E7DC] dark:bg-white/10 text-[#9C4738] dark:text-[#DD8776] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  {{ (user.name?.charAt(0) || user.email?.charAt(0) || 'U') | uppercase }}
                </div>
                <div>
                  <button type="button" (click)="openEditModal(user)" 
                          class="font-bold text-[#4A3C31] dark:text-[#F4F1ED] text-xs sm:text-sm group-hover:text-[#9C4738] dark:group-hover:text-[#DD8776] transition-colors text-left cursor-pointer">
                    {{ user.name || 'User #' + user.id }}
                  </button>
                  <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">{{ user.email }}</p>
                </div>
              </div>
            </td>

            <!-- Role Badge -->
            <td class="px-6 py-4">
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                    [ngClass]="user.role === 'admin' ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/40 text-purple-700 dark:text-purple-300' : 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-300'">
                <i [class]="user.role === 'admin' ? 'fa-solid fa-shield-halved text-[9px]' : 'fa-solid fa-user text-[9px]'"></i>
                <span>{{ user.role | uppercase }}</span>
              </span>
            </td>

            <!-- 1-Click Status Toggle -->
            <td class="px-6 py-4">
              <button type="button" (click)="toggleUserStatus(user)"
                      [class]="user.is_active ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100' : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100'"
                      class="px-2.5 py-1 border rounded-lg text-[10px] font-bold tracking-wide transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      title="Click to toggle login status">
                <span class="w-1.5 h-1.5 rounded-full" [ngClass]="user.is_active ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                <span>{{ user.is_active ? 'ACTIVE' : 'SUSPENDED' }}</span>
              </button>
            </td>

            <!-- Joined Date -->
            <td class="px-6 py-4 text-xs font-medium text-[#7A6C5E] dark:text-[#C5A393]">
              {{ user.creation_date | date:'mediumDate' }}
            </td>

            <!-- Actions -->
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-1.5">
                <button type="button" (click)="openEditModal(user)"
                        class="p-1.5 text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#9C4738] dark:hover:text-[#DD8776] hover:bg-[#F3E7DC] dark:hover:bg-white/10 rounded-lg transition-all cursor-pointer"
                        title="Edit User Profile">
                  <i class="fa-solid fa-pen-to-square text-xs"></i>
                </button>
              </div>
            </td>

          </tr>
        </app-table>
      </app-card>

      <!-- EDIT USER MODAL -->
      <app-modal [isOpen]="showEditModal" [title]="'Edit User: ' + (editUser?.name || editUser?.email || '')" size="sm" (onClose)="showEditModal = false">
        <div *ngIf="editUser" class="space-y-4 py-2 text-xs">
          <div>
            <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Full Name</label>
            <input type="text" [(ngModel)]="editUser.name" placeholder="Full Name"
                   class="w-full px-3.5 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FDFBF7] dark:bg-[#1C1917] text-[#4A3C31] dark:text-[#F4F1ED] outline-none">
          </div>

          <div>
            <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Email</label>
            <input type="email" [(ngModel)]="editUser.email" disabled
                   class="w-full px-3.5 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-stone-100 dark:bg-stone-800 text-stone-500 cursor-not-allowed outline-none">
          </div>

          <div>
            <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Phone Number (Optional)</label>
            <input type="text" [(ngModel)]="editUser.phone_no" placeholder="e.g. +91 98765 43210"
                   class="w-full px-3.5 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FDFBF7] dark:bg-[#1C1917] text-[#4A3C31] dark:text-[#F4F1ED] outline-none">
          </div>

          <div>
            <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Assigned Role</label>
            <select [(ngModel)]="editUser.role"
                    class="w-full px-3.5 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FDFBF7] dark:bg-[#1C1917] text-[#4A3C31] dark:text-[#F4F1ED] outline-none">
              <option value="customer">Customer</option>
              <option value="admin">Admin / Staff</option>
            </select>
          </div>

          <div *ngIf="editError" class="p-2.5 bg-rose-50 text-rose-600 rounded-xl font-bold">
            {{ editError }}
          </div>
        </div>

        <div modal-footer class="w-full flex justify-end gap-2">
          <button type="button" (click)="showEditModal = false" class="px-3 py-2 text-xs font-bold text-[#7A6C5E] cursor-pointer">
            Cancel
          </button>
          <button type="button" (click)="saveEditUser()" [disabled]="savingEdit"
                  class="px-4 py-2 rounded-xl bg-[#9C4738] text-white text-xs font-bold shadow-2xs disabled:opacity-50 flex items-center gap-1.5 cursor-pointer">
            <span *ngIf="savingEdit" class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
            <span>Save Changes</span>
          </button>
        </div>
      </app-modal>

      <!-- ADD USER MODAL -->
      <app-modal [isOpen]="showAddModal" title="Add New User Account" size="sm" (onClose)="showAddModal = false">
        <form (ngSubmit)="addUser()" class="space-y-4 py-2 text-xs">
          
          <div *ngIf="modalError" class="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 p-2.5 rounded-xl font-bold border border-rose-200 dark:border-rose-800/40">
            {{ modalError }}
          </div>
          <div *ngIf="modalSuccess" class="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 p-2.5 rounded-xl font-bold border border-emerald-200 dark:border-emerald-800/40">
            {{ modalSuccess }}
          </div>

          <div>
            <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Full Name *</label>
            <input type="text" [(ngModel)]="newUser.name" name="name" required placeholder="e.g. Maya Patel"
                   class="w-full px-3.5 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FDFBF7] dark:bg-[#1C1917] text-[#4A3C31] dark:text-[#F4F1ED] outline-none">
          </div>
          
          <div>
            <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Email Address *</label>
            <input type="email" [(ngModel)]="newUser.email" name="email" required placeholder="e.g. maya@example.com"
                   class="w-full px-3.5 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FDFBF7] dark:bg-[#1C1917] text-[#4A3C31] dark:text-[#F4F1ED] outline-none">
          </div>

          <div>
            <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Role *</label>
            <select [(ngModel)]="newUser.role" name="role"
                    class="w-full px-3.5 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FDFBF7] dark:bg-[#1C1917] text-[#4A3C31] dark:text-[#F4F1ED] outline-none">
              <option value="customer">Customer</option>
              <option value="admin">Admin / Staff</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Initial Password *</label>
            <input type="text" [(ngModel)]="newUser.password" name="password" required placeholder="Min 6 characters"
                   class="w-full px-3.5 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FDFBF7] dark:bg-[#1C1917] text-[#4A3C31] dark:text-[#F4F1ED] font-mono outline-none">
            <span class="text-[10px] text-[#A89F91] mt-0.5 block">Admin can share this with user for first login.</span>
          </div>

          <button type="submit" #submitBtn class="hidden"></button>
        </form>

        <div modal-footer class="w-full flex justify-end gap-2">
          <button type="button" (click)="showAddModal = false" class="px-3 py-2 text-xs font-bold text-[#7A6C5E] cursor-pointer">
            Cancel
          </button>
          <button type="button" (click)="submitBtn.click()" [disabled]="saving || !newUser.email || !newUser.name"
                  class="px-4 py-2 rounded-xl bg-[#9C4738] text-white text-xs font-bold shadow-2xs disabled:opacity-50 flex items-center gap-1.5 cursor-pointer">
            <span *ngIf="saving" class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
            <span>Create Account</span>
          </button>
        </div>
      </app-modal>

    </div>
  `
})
export class AdminUsersPageComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private cdr = inject(ChangeDetectorRef);

  users: any[] = [];
  filteredUsers: any[] = [];
  loading = true;
  error: string | null = null;
  searchQuery = '';
  roleFilter = 'all';

  // Add User State
  showAddModal = false;
  saving = false;
  modalError = '';
  modalSuccess = '';
  newUser = {
    name: '',
    email: '',
    role: 'customer',
    password: 'Password@123'
  };

  // Edit User State
  showEditModal = false;
  savingEdit = false;
  editError = '';
  editUser: any = null;

  columns: TableColumn[] = [
    { label: 'User', width: '36%' },
    { label: 'Role', width: '18%' },
    { label: 'Status', width: '18%' },
    { label: 'Joined', width: '18%' },
    { label: 'Actions', width: '10%', align: 'right' }
  ];

  get adminCount(): number {
    return this.users.filter(u => u.role === 'admin').length;
  }

  get customerCount(): number {
    return this.users.filter(u => u.role === 'customer').length;
  }

  get activeUsersCount(): number {
    return this.users.filter(u => u.is_active).length;
  }

  ngOnInit() {
    this.fetchUsers();
  }

  resetFilters() {
    this.searchQuery = '';
    this.roleFilter = 'all';
    this.applyFilter();
  }

  applyFilter() {
    this.filteredUsers = this.users.filter(u => {
      const q = this.searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q));
      const matchRole = this.roleFilter === 'all' || u.role === this.roleFilter;
      return matchSearch && matchRole;
    });
  }

  async fetchUsers() {
    this.loading = true;
    this.error = null;
    this.cdr.markForCheck();
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .order('creation_date', { ascending: false });

      if (error) {
        this.error = error.message;
        this.users = [];
      } else if (data) {
        this.users = data;
        this.error = null;
      }
      this.applyFilter();
    } catch (err: any) {
      this.error = err?.message || 'Failed to connect to database.';
      this.users = [];
      this.filteredUsers = [];
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  async toggleUserStatus(user: any) {
    const newStatus = !user.is_active;
    const oldStatus = user.is_active;
    user.is_active = newStatus;
    this.cdr.markForCheck();

    try {
      const { error } = await this.supabase
        .from('users')
        .update({ is_active: newStatus })
        .eq('id', user.id);

      if (error) {
        user.is_active = oldStatus;
        this.cdr.markForCheck();
      }
    } catch {
      user.is_active = oldStatus;
      this.cdr.markForCheck();
    }
  }

  openEditModal(user: any) {
    this.editUser = { ...user };
    this.editError = '';
    this.showEditModal = true;
  }

  async saveEditUser() {
    if (!this.editUser) return;
    this.savingEdit = true;
    this.editError = '';
    this.cdr.markForCheck();

    try {
      const { error } = await this.supabase
        .from('users')
        .update({
          name: this.editUser.name?.trim() || null,
          phone_no: this.editUser.phone_no?.trim() || null,
          role: this.editUser.role
        })
        .eq('id', this.editUser.id);

      if (error) {
        this.editError = error.message;
      } else {
        const idx = this.users.findIndex(u => u.id === this.editUser.id);
        if (idx !== -1) {
          this.users[idx] = { ...this.editUser };
        }
        this.applyFilter();
        this.showEditModal = false;
      }
    } catch (err: any) {
      this.editError = err?.message || 'Failed to update user.';
    } finally {
      this.savingEdit = false;
      this.cdr.markForCheck();
    }
  }

  openAddUserModal() {
    this.showAddModal = true;
    this.modalError = '';
    this.modalSuccess = '';
    this.newUser = { name: '', email: '', role: 'customer', password: 'Password@123' };
  }

  async addUser() {
    if (!this.newUser.email?.trim() || !this.newUser.name?.trim()) return;
    this.saving = true;
    this.modalError = '';
    this.modalSuccess = '';
    this.cdr.markForCheck();

    try {
      const { data: authData, error: authError } = await this.supabase.signUp(
        this.newUser.email.trim(),
        this.newUser.password
      );

      if (authError) {
        this.modalError = authError.message;
        this.saving = false;
        this.cdr.markForCheck();
        return;
      }

      const { data, error: dbError } = await this.supabase.from('users').insert({
        email: this.newUser.email.trim(),
        name: this.newUser.name.trim(),
        role: this.newUser.role,
        is_active: true
      }).select().single();

      if (dbError) {
        this.modalError = dbError.message;
      } else {
        this.modalSuccess = 'User account created!';
        if (data) {
          this.users.unshift(data);
          this.applyFilter();
        } else {
          await this.fetchUsers();
        }
        setTimeout(() => {
          this.showAddModal = false;
          this.cdr.markForCheck();
        }, 1200);
      }
    } catch (err: any) {
      this.modalError = err?.message || 'Failed to create user account.';
    } finally {
      this.saving = false;
      this.cdr.markForCheck();
    }
  }
}
