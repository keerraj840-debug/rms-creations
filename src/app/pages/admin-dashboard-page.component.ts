import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    @keyframes bar-grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
    .bar-animate { transform-origin: bottom; animation: bar-grow 0.7s cubic-bezier(.4,0,.2,1) forwards; }
    @keyframes fade-up { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
    .fade-up { animation: fade-up 0.5s ease forwards; }
    .fade-up-1 { animation-delay: .05s; }
    .fade-up-2 { animation-delay: .10s; }
    .fade-up-3 { animation-delay: .15s; }
    .fade-up-4 { animation-delay: .20s; }
  `],
  template: `
<div class="space-y-6 p-1">

  <!-- ── PAGE HEADER ── -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 fade-up">
    <div>
      <p class="text-[10px] font-bold uppercase tracking-widest text-[#8B6E57] mb-1">Overview</p>
      <h1 class="text-2xl lg:text-3xl font-bold text-[#2E2825]">Dashboard</h1>
    </div>
    <div class="flex items-center gap-2">
      <div class="flex items-center gap-2 bg-white border border-[#EADFD2] rounded-2xl px-4 py-2 shadow-sm">
        <svg class="w-4 h-4 text-[#8B6E57]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        <span class="text-xs font-semibold text-[#4A3C31]">Oct 2026</span>
      </div>
      <button class="flex items-center gap-2 bg-[#2E2825] text-[#F4F1ED] rounded-2xl px-4 py-2 text-xs font-semibold hover:bg-[#4A3C31] transition-colors shadow-sm">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
        Export
      </button>
    </div>
  </div>

  <!-- ── STATS CARDS ── -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">

    <div class="fade-up fade-up-1 group bg-white border border-[#EADFD2] rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-[#C5A393] transition-all duration-300">
      <div class="flex items-start justify-between mb-4">
        <div class="w-10 h-10 bg-[#F4EDE6] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <svg class="w-5 h-5 text-[#8B6E57]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
        </div>
        <span class="text-[9px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">+12%</span>
      </div>
      <p class="text-[9px] font-bold uppercase tracking-widest text-[#8B6E57] mb-1">Total Products</p>
      <p class="text-3xl font-bold text-[#2E2825]">124</p>
      <div class="mt-3 flex items-end gap-0.5 h-8">
        <div *ngFor="let h of [30,50,40,70,55,80,65]" [style.height.%]="h" class="flex-1 bg-[#EADFD2] group-hover:bg-[#C5A393] rounded-sm transition-colors duration-300 bar-animate"></div>
      </div>
    </div>

    <div class="fade-up fade-up-2 group bg-[#2E2825] border border-[#2E2825] rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <div class="flex items-start justify-between mb-4">
        <div class="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <svg class="w-5 h-5 text-[#F4F1ED]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <span class="text-[9px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">+25%</span>
      </div>
      <p class="text-[9px] font-bold uppercase tracking-widest text-[#F4F1ED]/60 mb-1">Total Revenue</p>
      <p class="text-3xl font-bold text-[#F4F1ED]">&#8377;6.2K</p>
      <div class="mt-3 flex items-end gap-0.5 h-8">
        <div *ngFor="let h of [20,45,35,60,50,75,85]" [style.height.%]="h" class="flex-1 bg-white/20 group-hover:bg-white/35 rounded-sm transition-colors duration-300 bar-animate"></div>
      </div>
    </div>

    <div class="fade-up fade-up-3 group bg-white border border-[#EADFD2] rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-[#C5A393] transition-all duration-300">
      <div class="flex items-start justify-between mb-4">
        <div class="w-10 h-10 bg-[#F4EDE6] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <svg class="w-5 h-5 text-[#8B6E57]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        </div>
        <span class="text-[9px] font-bold uppercase tracking-wider text-[#8B6E57] bg-[#F4EDE6] border border-[#EADFD2] px-2 py-0.5 rounded-full">89 total</span>
      </div>
      <p class="text-[9px] font-bold uppercase tracking-widest text-[#8B6E57] mb-1">Total Users</p>
      <p class="text-3xl font-bold text-[#2E2825]">89</p>
      <div class="mt-3 flex items-end gap-0.5 h-8">
        <div *ngFor="let h of [60,40,70,30,80,55,45]" [style.height.%]="h" class="flex-1 bg-[#EADFD2] group-hover:bg-[#C5A393] rounded-sm transition-colors duration-300 bar-animate"></div>
      </div>
    </div>

    <div class="fade-up fade-up-4 group bg-white border border-[#EADFD2] rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-300">
      <div class="flex items-start justify-between mb-4">
        <div class="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <svg class="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
        </div>
        <span class="text-[9px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">Action</span>
      </div>
      <p class="text-[9px] font-bold uppercase tracking-widest text-[#8B6E57] mb-1">Pending Orders</p>
      <p class="text-3xl font-bold text-[#2E2825]">3</p>
      <div class="mt-3 flex items-end gap-0.5 h-8">
        <div *ngFor="let h of [80,60,90,40,75,55,30]" [style.height.%]="h" class="flex-1 bg-amber-100 group-hover:bg-amber-300 rounded-sm transition-colors duration-300 bar-animate"></div>
      </div>
    </div>

  </div>

  <!-- ── CHARTS ROW ── -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

    <!-- Bar Chart -->
    <div class="fade-up lg:col-span-2 bg-white border border-[#EADFD2] rounded-3xl p-6 shadow-sm">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <p class="text-[9px] font-bold uppercase tracking-widest text-[#8B6E57] mb-1">Weekly</p>
          <h2 class="text-base font-bold text-[#2E2825]">Orders &amp; Visits</h2>
        </div>
        <div class="flex items-center gap-3 flex-wrap">
          <div class="flex items-center gap-1.5 text-[9px] font-semibold text-[#7A6C5E]"><span class="w-3 h-2 rounded-sm bg-[#C56D5B] inline-block"></span>Orders</div>
          <div class="flex items-center gap-1.5 text-[9px] font-semibold text-[#7A6C5E]"><span class="w-3 h-2 rounded-sm bg-[#EADFD2] inline-block"></span>Visits</div>
          <span class="text-[9px] font-bold text-[#8B6E57] bg-[#F4EDE6] border border-[#EADFD2] px-3 py-1 rounded-full">Last 7 Days</span>
        </div>
      </div>
      <div class="relative h-52 pl-6">
        <div class="absolute left-0 top-0 bottom-4 flex flex-col justify-between text-[8px] text-[#A89F91] w-6">
          <span>10</span><span>8</span><span>6</span><span>4</span><span>2</span><span>0</span>
        </div>
        <div class="h-full flex items-end gap-1.5 border-b border-l border-[#EADFD2] pb-4">
          <div *ngFor="let day of chartData" class="flex-1 flex items-end gap-0.5 h-full group/bar">
            <div [style.height.%]="day.visits" class="flex-1 bg-[#EADFD2] group-hover/bar:bg-[#C5A393] rounded-t-md transition-all duration-500 bar-animate"></div>
            <div [style.height.%]="day.orders" class="flex-1 bg-[#C56D5B] group-hover/bar:bg-[#9C4738] rounded-t-md transition-all duration-500 bar-animate"></div>
          </div>
        </div>
      </div>
      <div class="pl-6 flex gap-1.5 mt-1">
        <div *ngFor="let day of chartData" class="flex-1 text-center text-[8px] font-bold text-[#A89F91] uppercase">{{day.label}}</div>
      </div>
    </div>

    <!-- Donut Chart -->
    <div class="fade-up bg-white border border-[#EADFD2] rounded-3xl p-6 shadow-sm flex flex-col">
      <div class="mb-4">
        <p class="text-[9px] font-bold uppercase tracking-widest text-[#8B6E57] mb-1">Distribution</p>
        <h2 class="text-base font-bold text-[#2E2825]">Order Status</h2>
      </div>
      <div class="flex-1 flex items-center justify-center py-2">
        <div class="relative w-32 h-32">
          <svg viewBox="0 0 36 36" class="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F4EDE6" stroke-width="3.5"/>
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#C56D5B" stroke-width="3.5" stroke-dasharray="60 40" stroke-linecap="round"/>
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#EADFD2" stroke-width="3.5" stroke-dasharray="25 75" stroke-dashoffset="-60" stroke-linecap="round"/>
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F4EDE6" stroke-width="3.5" stroke-dasharray="15 85" stroke-dashoffset="-85" stroke-linecap="round"/>
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-xl font-bold text-[#2E2825]">127</span>
            <span class="text-[8px] text-[#8B6E57] font-semibold uppercase tracking-wider">Orders</span>
          </div>
        </div>
      </div>
      <div class="space-y-2.5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-[#C56D5B] flex-shrink-0"></span><span class="text-xs text-[#4A3C31]">Completed</span></div>
          <span class="text-xs font-bold text-[#2E2825]">60%</span>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-[#EADFD2] border border-[#C5A393] flex-shrink-0"></span><span class="text-xs text-[#4A3C31]">Pending</span></div>
          <span class="text-xs font-bold text-[#2E2825]">25%</span>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-[#F4EDE6] border border-[#EADFD2] flex-shrink-0"></span><span class="text-xs text-[#4A3C31]">Cancelled</span></div>
          <span class="text-xs font-bold text-[#2E2825]">15%</span>
        </div>
      </div>
    </div>
  </div>

  <!-- ── BOTTOM ROW ── -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

    <!-- Orders Table -->
    <div class="fade-up lg:col-span-2 bg-white border border-[#EADFD2] rounded-3xl p-6 shadow-sm">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <p class="text-[9px] font-bold uppercase tracking-widest text-[#8B6E57] mb-1">Latest</p>
          <h2 class="text-base font-bold text-[#2E2825]">Recent Orders</h2>
        </div>
        <div class="flex items-center gap-2">
          <button class="px-3 py-1.5 bg-[#2E2825] text-[#F4F1ED] text-[9px] font-bold rounded-full hover:bg-[#4A3C31] transition-colors">Pending (3)</button>
          <button class="px-3 py-1.5 bg-[#F4EDE6] text-[#4A3C31] text-[9px] font-bold rounded-full hover:bg-[#EADFD2] transition-colors">Completed</button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[500px]">
          <thead>
            <tr class="text-[8px] font-bold uppercase tracking-widest text-[#A89F91] border-b border-[#F4EDE6]">
              <th class="pb-3 text-left">Order</th>
              <th class="pb-3 text-left">Customer</th>
              <th class="pb-3 text-left">Items</th>
              <th class="pb-3 text-left">Amount</th>
              <th class="pb-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of recentOrders" class="border-b border-[#F4EDE6] hover:bg-[#FDFBF7] transition-colors">
              <td class="py-3 text-sm font-bold text-[#2E2825]">{{order.id}}</td>
              <td class="py-3">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-full bg-[#F4EDE6] flex items-center justify-center text-[9px] font-bold text-[#8B6E57] flex-shrink-0">{{order.initials}}</div>
                  <span class="text-xs font-medium text-[#4A3C31]">{{order.customer}}</span>
                </div>
              </td>
              <td class="py-3 text-xs text-[#7A6C5E]">{{order.items}} items</td>
              <td class="py-3 text-sm font-bold text-[#2E2825]">&#8377;{{order.amount}}</td>
              <td class="py-3">
                <span [class]="order.statusClass" class="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">{{order.status}}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Top Products -->
    <div class="fade-up bg-white border border-[#EADFD2] rounded-3xl p-6 shadow-sm flex flex-col">
      <div class="mb-5">
        <p class="text-[9px] font-bold uppercase tracking-widest text-[#8B6E57] mb-1">Best Sellers</p>
        <h2 class="text-base font-bold text-[#2E2825]">Top Products</h2>
      </div>
      <div class="flex-1 space-y-4">
        <div *ngFor="let product of topProducts" class="flex items-center gap-3">
          <div class="w-9 h-9 bg-[#F4EDE6] rounded-2xl flex items-center justify-center flex-shrink-0 text-lg">{{product.emoji}}</div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1.5">
              <p class="text-xs font-semibold text-[#2E2825] truncate">{{product.name}}</p>
              <span class="text-[9px] font-bold text-[#8B6E57] ml-2 flex-shrink-0">{{product.pct}}%</span>
            </div>
            <div class="h-1.5 bg-[#F4EDE6] rounded-full overflow-hidden">
              <div [style.width.%]="product.pct" class="h-full bg-gradient-to-r from-[#C56D5B] to-[#DD8776] rounded-full transition-all duration-700"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-5 pt-5 border-t border-[#F4EDE6] flex items-center justify-between">
        <div>
          <p class="text-[8px] uppercase tracking-widest text-[#A89F91] font-bold">This Month</p>
          <p class="text-lg font-bold text-[#2E2825]">&#8377;18.4K</p>
        </div>
        <button class="text-[10px] font-bold text-[#C56D5B] hover:text-[#9C4738] transition-colors flex items-center gap-1">
          View all <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>

  </div>
</div>
  `
})
export class AdminDashboardPageComponent {
  chartData = [
    { label: 'Mon', orders: 30, visits: 55 },
    { label: 'Tue', orders: 50, visits: 75 },
    { label: 'Wed', orders: 35, visits: 60 },
    { label: 'Thu', orders: 70, visits: 90 },
    { label: 'Fri', orders: 55, visits: 80 },
    { label: 'Sat', orders: 80, visits: 95 },
    { label: 'Sun', orders: 60, visits: 70 },
  ];

  recentOrders = [
    { id: '#ORD-201', customer: 'Priya Sharma',  initials: 'PS', items: 3, amount: '1,200', status: 'Pending',   statusClass: 'bg-amber-50 text-amber-600 border border-amber-200' },
    { id: '#ORD-202', customer: 'Rahul Mehra',   initials: 'RM', items: 1, amount: '850',   status: 'Completed', statusClass: 'bg-emerald-50 text-emerald-600 border border-emerald-200' },
    { id: '#ORD-203', customer: 'Ananya Patel',  initials: 'AP', items: 5, amount: '3,500', status: 'Pending',   statusClass: 'bg-amber-50 text-amber-600 border border-amber-200' },
    { id: '#ORD-204', customer: 'Vikram Nair',   initials: 'VN', items: 2, amount: '2,100', status: 'Completed', statusClass: 'bg-emerald-50 text-emerald-600 border border-emerald-200' },
    { id: '#ORD-205', customer: 'Sneha Reddy',   initials: 'SR', items: 4, amount: '4,600', status: 'Pending',   statusClass: 'bg-amber-50 text-amber-600 border border-amber-200' },
  ];

  topProducts = [
    { emoji: '🎁', name: 'Luxury Gift Hamper', pct: 82 },
    { emoji: '🪔', name: 'Diwali Special Box',  pct: 67 },
    { emoji: '🍫', name: 'Chocolate Hamper',    pct: 54 },
    { emoji: '🌸', name: 'Floral Return Gift',  pct: 43 },
    { emoji: '✨', name: 'Premium Dry Fruits',  pct: 31 },
  ];
}
