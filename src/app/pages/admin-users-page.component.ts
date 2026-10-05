import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../services/supabase.service';
import { CardComponent } from '../shared/ui/card.component';
import { ButtonComponent } from '../shared/ui/button.component';
import { ModalComponent } from '../shared/ui/modal.component';
import { InputComponent } from '../shared/ui/input.component';

@Component({
  selector: 'app-admin-users-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, ButtonComponent, ModalComponent, InputComponent],
  template: `
    <div class="space-y-6">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <h1 class="text-3xl font-serif font-bold text-[#3B2F2F] tracking-tight">Users</h1>
          <div class="h-5 w-px bg-[#EADFD2]"></div>
          <div class="flex items-center gap-2 text-sm text-[#7A6C5E] font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span class="text-[10px] uppercase tracking-widest text-[#4A3C31] font-bold">> System > Users</span>
          </div>
        </div>
        
        <app-button variant="primary" (onClick)="openAddUserModal()">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Add User
        </app-button>
      </div>

      <!-- Users Table -->
      <app-card [hasFooter]="false">
        <div card-header class="w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="relative w-full md:w-72">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6C5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search users..." class="w-full bg-white border border-[#EADFD2] rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B6E57]/20 text-sm text-[#4A3C31] placeholder-[#A89F91] transition-all duration-300">
          </div>
          
          <select class="border border-[#EADFD2] rounded-full px-4 py-2 bg-[#FDFBF7] text-[#4A3C31] text-[10px] font-bold tracking-wide focus:outline-none focus:ring-2 focus:ring-[#8B6E57]/20 appearance-none uppercase">
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="customer">Customers</option>
          </select>
        </div>

        <div class="overflow-x-auto -mx-5 md:-mx-6">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-[10px] uppercase tracking-widest text-[#7A6C5E] border-b border-[#EADFD2] bg-[#FDFBF7]">
                <th class="px-6 py-4 font-bold">User</th>
                <th class="px-6 py-4 font-bold">Role</th>
                <th class="px-6 py-4 font-bold">Status</th>
                <th class="px-6 py-4 font-bold">Joined</th>
                <th class="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#EADFD2]/50">
              <tr *ngIf="loading">
                <td colspan="5" class="px-6 py-8 text-center text-[#7A6C5E] text-sm">Loading users...</td>
              </tr>
              
              <tr *ngFor="let user of users" class="hover:bg-[#FDFBF7] transition-colors group">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-4">
                    <div class="h-10 w-10 rounded-full bg-[#E5D5C5] text-[#4A3C31] flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-[#DD8776] group-hover:text-white transition-colors">
                      {{ user.name?.charAt(0) || user.email.charAt(0) | uppercase }}
                    </div>
                    <div>
                      <p class="font-bold text-[#4A3C31] text-sm group-hover:text-[#DD8776] transition-colors">{{ user.name || 'No Name' }}</p>
                      <p class="text-[11px] text-[#7A6C5E] mt-0.5">{{ user.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-0.5 border rounded-md text-[10px] font-bold tracking-wide"
                        [ngClass]="user.role === 'admin' ? 'bg-[#F3E7DC] border-[#EADFD2] text-[#8B6E57]' : 'bg-[#FDFBF7] border-[#EADFD2] text-[#7A6C5E]'">
                    {{ user.role | uppercase }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-0.5 border rounded-md text-[10px] font-bold tracking-wide"
                        [ngClass]="user.is_active ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]' : 'bg-rose-50 border-rose-200 text-rose-600'">
                    {{ user.is_active ? 'ACTIVE' : 'INACTIVE' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-xs font-medium text-[#7A6C5E]">
                  {{ user.creation_date | date:'mediumDate' }}
                </td>
                <td class="px-6 py-4 text-right">
                  <button class="text-[#7A6C5E] hover:text-[#DD8776] transition-colors p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </app-card>

      <!-- Add User Modal -->
      <app-modal [isOpen]="showModal" title="Add New User" size="md" (onClose)="closeModal()">
        
        <form (ngSubmit)="addUser()" #userForm="ngForm" class="space-y-5 py-2">
          
          <div *ngIf="modalError" class="bg-rose-50 text-rose-600 p-3 rounded-xl text-sm font-bold border border-rose-200">
            {{ modalError }}
          </div>
          <div *ngIf="modalSuccess" class="bg-[#ECFDF5] text-[#059669] p-3 rounded-xl text-sm font-bold border border-[#A7F3D0]">
            {{ modalSuccess }}
          </div>

          <app-input label="Name" type="text" [(ngModel)]="newUser.name" name="name" [required]="true"></app-input>
          
          <app-input label="Email" type="email" [(ngModel)]="newUser.email" name="email" [required]="true"></app-input>

          <app-input label="Role" type="select" [(ngModel)]="newUser.role" name="role">
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </app-input>

          <app-input label="Temporary Password" type="text" [(ngModel)]="newUser.password" name="password" hint="Must contain Upper, Lower, Number & Special char" [required]="true"></app-input>

          <!-- Hidden Submit Button -->
          <button type="submit" #submitBtn class="hidden"></button>
        </form>

        <div modal-footer class="w-full flex justify-end gap-3">
           <app-button variant="secondary" (onClick)="closeModal()">Cancel</app-button>
           <app-button variant="primary" [loading]="saving" [disabled]="!userForm.valid" (onClick)="submitBtn.click()">Create User</app-button>
        </div>
        
      </app-modal>

    </div>
  `
})
export class AdminUsersPageComponent implements OnInit {
  private supabase = inject(SupabaseService);
  
  users: any[] = [];
  loading = true;
  
  showModal = false;
  saving = false;
  modalError = '';
  modalSuccess = '';
  
  newUser = {
    name: '',
    email: '',
    role: 'customer',
    password: 'Password@123'
  };

  ngOnInit() {
    this.fetchUsers();
  }

  async fetchUsers() {
    this.loading = true;
    const { data, error } = await this.supabase.from('users').select('*').order('creation_date', { ascending: false });
    if (data) {
      this.users = data;
    }
    this.loading = false;
  }

  openAddUserModal() {
    this.showModal = true;
    this.modalError = '';
    this.modalSuccess = '';
    this.newUser = { name: '', email: '', role: 'customer', password: 'Password@123' };
  }

  closeModal() {
    this.showModal = false;
  }

  async addUser() {
    this.saving = true;
    this.modalError = '';
    this.modalSuccess = '';

    const { data: authData, error: authError } = await this.supabase.signUp(
      this.newUser.email, 
      this.newUser.password
    );

    if (authError) {
      this.modalError = authError.message;
      this.saving = false;
      return;
    }

    const { error: dbError } = await this.supabase.from('users').insert({
      email: this.newUser.email,
      name: this.newUser.name,
      role: this.newUser.role,
      is_active: true
    });

    if (dbError) {
      this.modalError = dbError.message;
    } else {
      this.modalSuccess = 'User created successfully!';
      setTimeout(() => {
        this.closeModal();
        this.fetchUsers();
      }, 1500);
    }
    
    this.saving = false;
  }
}
