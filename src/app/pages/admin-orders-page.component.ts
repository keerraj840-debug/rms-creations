import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../shared/ui/card.component';

@Component({
  selector: 'app-admin-orders-page',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <div class="space-y-6">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <h1 class="text-3xl font-serif font-bold text-[#3B2F2F] tracking-tight">Orders</h1>
          <div class="h-5 w-px bg-[#EADFD2]"></div>
          <div class="flex items-center gap-2 text-sm text-[#7A6C5E] font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span class="text-[10px] uppercase tracking-widest text-[#4A3C31] font-bold">> Sales > Orders</span>
          </div>
        </div>
      </div>

      <app-card [hasFooter]="false">
        <div card-header class="w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="relative w-full md:w-72">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6C5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search orders..." class="w-full bg-white border border-[#EADFD2] rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B6E57]/20 text-sm text-[#4A3C31] placeholder-[#A89F91] transition-all duration-300">
          </div>
          
          <select class="border border-[#EADFD2] rounded-full px-4 py-2 bg-[#FDFBF7] text-[#4A3C31] text-[10px] font-bold tracking-wide focus:outline-none focus:ring-2 focus:ring-[#8B6E57]/20 appearance-none uppercase">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        <div class="overflow-x-auto -mx-5 md:-mx-6">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-[10px] uppercase tracking-widest text-[#7A6C5E] border-b border-[#EADFD2] bg-[#FDFBF7]">
                <th class="px-6 py-4 font-bold">Order ID</th>
                <th class="px-6 py-4 font-bold">Customer</th>
                <th class="px-6 py-4 font-bold">Date</th>
                <th class="px-6 py-4 font-bold">Status</th>
                <th class="px-6 py-4 font-bold text-right">Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#EADFD2]/50">
              <tr class="hover:bg-[#FDFBF7] transition-colors cursor-pointer group">
                <td class="px-6 py-5 font-bold text-[#4A3C31] group-hover:text-[#DD8776] transition-colors">#ORD-001</td>
                <td class="px-6 py-5">
                  <p class="font-bold text-[#4A3C31] text-sm">Rahul Sharma</p>
                  <p class="text-[11px] text-[#7A6C5E]">rahul&#64;example.com</p>
                </td>
                <td class="px-6 py-5 text-sm font-medium text-[#7A6C5E]">Oct 5, 2024</td>
                <td class="px-6 py-5">
                  <span class="inline-flex items-center px-2.5 py-0.5 border border-[#A7F3D0] rounded-md text-[10px] font-bold tracking-wide bg-[#ECFDF5] text-[#059669] uppercase">Delivered</span>
                </td>
                <td class="px-6 py-5 text-right font-black text-[#3B2F2F]">₹4,500</td>
              </tr>
              <tr class="hover:bg-[#FDFBF7] transition-colors cursor-pointer group">
                <td class="px-6 py-5 font-bold text-[#4A3C31] group-hover:text-[#DD8776] transition-colors">#ORD-002</td>
                <td class="px-6 py-5">
                  <p class="font-bold text-[#4A3C31] text-sm">Priya Patel</p>
                  <p class="text-[11px] text-[#7A6C5E]">priya&#64;example.com</p>
                </td>
                <td class="px-6 py-5 text-sm font-medium text-[#7A6C5E]">Oct 4, 2024</td>
                <td class="px-6 py-5">
                  <span class="inline-flex items-center px-2.5 py-0.5 border border-amber-200 rounded-md text-[10px] font-bold tracking-wide bg-amber-50 text-amber-600 uppercase">Processing</span>
                </td>
                <td class="px-6 py-5 text-right font-black text-[#3B2F2F]">₹12,800</td>
              </tr>
              <tr class="hover:bg-[#FDFBF7] transition-colors cursor-pointer group">
                <td class="px-6 py-5 font-bold text-[#4A3C31] group-hover:text-[#DD8776] transition-colors">#ORD-003</td>
                <td class="px-6 py-5">
                  <p class="font-bold text-[#4A3C31] text-sm">Amit Kumar</p>
                  <p class="text-[11px] text-[#7A6C5E]">amit&#64;example.com</p>
                </td>
                <td class="px-6 py-5 text-sm font-medium text-[#7A6C5E]">Oct 4, 2024</td>
                <td class="px-6 py-5">
                  <span class="inline-flex items-center px-2.5 py-0.5 border border-[#F3E7DC] rounded-md text-[10px] font-bold tracking-wide bg-[#FDFBF7] text-[#8B6E57] uppercase">Shipped</span>
                </td>
                <td class="px-6 py-5 text-right font-black text-[#3B2F2F]">₹2,100</td>
              </tr>
            </tbody>
          </table>
        </div>
      </app-card>
    </div>
  `
})
export class AdminOrdersPageComponent {}
