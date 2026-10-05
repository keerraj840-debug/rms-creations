import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <h1 class="text-3xl font-serif font-bold text-[#3B2F2F] tracking-tight">Admin Dashboard</h1>
          <div class="h-5 w-px bg-[#EADFD2]"></div>
          <div class="flex items-center gap-2 text-sm text-[#7A6C5E] font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span class="text-[10px] uppercase tracking-widest text-[#4A3C31] font-bold">> Dashboard</span>
          </div>
        </div>
        
        <div class="flex items-center gap-3 bg-white border border-[#EADFD2] p-1.5 rounded-full shadow-sm">
          <span class="flex items-center gap-2 px-3 py-1 bg-transparent text-[#7A6C5E] text-xs font-bold rounded-full">
            <span class="h-2 w-2 rounded-full bg-amber-500"></span>
            Action Queue
          </span>
          <span class="px-3 py-1 bg-[#FDFBF7] text-[#4A3C31] border border-[#EADFD2] text-xs font-bold rounded-full">Products 124</span>
          <span class="px-3 py-1 bg-[#FDFBF7] text-[#4A3C31] border border-[#EADFD2] text-xs font-bold rounded-full">Users 89</span>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- Stat Card 1 -->
        <div class="bg-white border border-[#EADFD2] rounded-3xl p-6 shadow-sm hover:border-[#DD8776]/50 transition-colors">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-[10px] font-bold text-[#7A6C5E] uppercase tracking-widest">Total Products</h3>
            <div class="h-8 w-8 bg-[#F3E7DC] text-[#8B6E57] rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
          </div>
          <div class="flex items-end justify-between">
            <span class="text-4xl font-serif font-bold text-[#3B2F2F]">124</span>
            <span class="text-xs font-bold bg-[#FDFBF7] text-[#7A6C5E] border border-[#EADFD2] px-2 py-1 rounded-md">Total</span>
          </div>
        </div>

        <!-- Stat Card 2 -->
        <div class="bg-white border border-[#EADFD2] rounded-3xl p-6 shadow-sm hover:border-[#DD8776]/50 transition-colors">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-[10px] font-bold text-[#7A6C5E] uppercase tracking-widest">Active Categories</h3>
            <div class="h-8 w-8 bg-[#F3E7DC] text-[#8B6E57] rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
          </div>
          <div class="flex items-end justify-between">
            <span class="text-4xl font-serif font-bold text-[#3B2F2F]">8</span>
            <span class="text-xs font-bold bg-[#FDFBF7] text-[#7A6C5E] border border-[#EADFD2] px-2 py-1 rounded-md">Total</span>
          </div>
        </div>

        <!-- Stat Card 3 -->
        <div class="bg-white border border-[#EADFD2] rounded-3xl p-6 shadow-sm hover:border-[#DD8776]/50 transition-colors">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-[10px] font-bold text-[#7A6C5E] uppercase tracking-widest">Total Users</h3>
            <div class="h-8 w-8 bg-[#F3E7DC] text-[#8B6E57] rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
          </div>
          <div class="flex items-end justify-between">
            <span class="text-4xl font-serif font-bold text-[#3B2F2F]">89</span>
            <span class="text-[10px] font-bold text-[#DD8776] cursor-pointer hover:underline">View All &rarr;</span>
          </div>
        </div>

        <!-- Stat Card 4 -->
        <div class="bg-white border border-[#EADFD2] rounded-3xl p-6 shadow-sm hover:border-[#DD8776]/50 transition-colors">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-[10px] font-bold text-[#7A6C5E] uppercase tracking-widest">Pending Orders</h3>
            <div class="h-8 w-8 bg-[#ECFDF5] text-[#059669] rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
          </div>
          <div class="flex items-end justify-between">
            <span class="text-4xl font-serif font-bold text-[#3B2F2F]">3</span>
            <span class="text-xs font-bold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] px-2 py-1 rounded-md">Action</span>
          </div>
        </div>

      </div>

      <!-- Lower Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Graph Area Mock -->
        <div class="bg-white border border-[#EADFD2] rounded-3xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#8B6E57]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
              <h2 class="text-sm font-bold text-[#4A3C31] tracking-wide uppercase">Orders & Activity</h2>
            </div>
            <span class="bg-[#F3E7DC] text-[#4A3C31] text-[10px] font-bold px-3 py-1 rounded-full">Last 7 Days</span>
          </div>
          <p class="text-[11px] text-[#7A6C5E] mb-6">Customer orders and active visits.</p>
          
          <div class="flex items-center gap-4 text-[10px] font-bold text-[#7A6C5E] mb-8">
            <div class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-[#DD8776]"></span> Customer Orders</div>
            <div class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-[#8B6E57]"></span> Active Views</div>
          </div>

          <div class="h-64 border-b border-l border-[#EADFD2] relative">
            <div class="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between pt-4">
              <div class="border-t border-[#EADFD2]/50 w-full relative"><span class="absolute -left-6 -top-2 text-[10px] text-[#A89F91]">10</span></div>
              <div class="border-t border-[#EADFD2]/50 w-full relative"><span class="absolute -left-6 -top-2 text-[10px] text-[#A89F91]">5</span></div>
              <div class="border-t border-[#EADFD2]/50 w-full relative"><span class="absolute -left-6 -top-2 text-[10px] text-[#A89F91]">0</span></div>
            </div>
            
            <div class="absolute bottom-0 inset-x-0 h-full flex items-end justify-around pb-0 px-4">
               <!-- Mock Bars -->
               <div class="flex gap-1 items-end">
                 <div class="w-4 bg-[#DD8776] rounded-t-sm" style="height: 20%;"></div>
                 <div class="w-4 bg-[#8B6E57] rounded-t-sm" style="height: 30%;"></div>
               </div>
               <div class="flex gap-1 items-end">
                 <div class="w-4 bg-[#DD8776] rounded-t-sm" style="height: 40%;"></div>
                 <div class="w-4 bg-[#8B6E57] rounded-t-sm" style="height: 35%;"></div>
               </div>
               <div class="flex gap-1 items-end">
                 <div class="w-4 bg-[#DD8776] rounded-t-sm" style="height: 10%;"></div>
                 <div class="w-4 bg-[#8B6E57] rounded-t-sm" style="height: 15%;"></div>
               </div>
            </div>
          </div>
          
          <div class="flex justify-around text-[10px] font-bold text-[#A89F91] mt-3">
            <span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span><span>Mon</span>
          </div>
        </div>

        <!-- Recent Orders Explorer -->
        <div class="bg-white border border-[#EADFD2] rounded-3xl p-6 shadow-sm">
          <div class="flex items-center justify-between border-b border-[#EADFD2] pb-4 mb-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#8B6E57]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                <h2 class="text-sm font-bold text-[#4A3C31] tracking-wide uppercase">Order Explorer</h2>
              </div>
              <p class="text-[11px] text-[#7A6C5E]">Browse recent pending orders.</p>
            </div>
            <div class="flex bg-[#FDFBF7] p-1 rounded-full border border-[#EADFD2]">
               <button class="px-3 py-1 bg-white shadow-sm border border-[#EADFD2] rounded-full text-[10px] font-bold text-[#4A3C31]">Pending (3)</button>
               <button class="px-3 py-1 text-[#7A6C5E] text-[10px] font-bold rounded-full">Completed</button>
            </div>
          </div>

          <div class="space-y-3">
             <div class="border border-[#EADFD2] rounded-full p-2 pr-4 flex items-center justify-between hover:bg-[#FDFBF7] transition-colors cursor-pointer" *ngFor="let i of [1,2,3,4,5]">
               <div class="flex items-center gap-3">
                 <div class="h-8 w-8 bg-[#F3E7DC] rounded-full flex items-center justify-center text-[#8B6E57]">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                 </div>
                 <span class="text-sm font-bold text-[#4A3C31]">#ORD-20{{ i }}</span>
               </div>
               <span class="text-[10px] font-bold text-[#059669] px-2 py-0.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-full uppercase tracking-wider">Pending</span>
             </div>
          </div>

          <div class="mt-4 flex justify-end">
            <button class="text-[10px] font-bold text-[#7A6C5E] hover:text-[#4A3C31] flex items-center gap-1">Refresh List <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></button>
          </div>
        </div>
      </div>
      
    </div>
  `
})
export class AdminDashboardPageComponent {}
