import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="w-full">
      <label *ngIf="label" class="block text-xs font-bold text-[#7A6C5E] uppercase tracking-widest mb-2">
        {{ label }} <span *ngIf="required" class="text-rose-500">*</span>
      </label>
      
      <div class="relative">
        <textarea *ngIf="type === 'textarea'"
          [rows]="rows"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [(ngModel)]="value"
          (ngModelChange)="onChange($event)"
          (blur)="onTouched()"
          class="w-full px-4 py-3 rounded-2xl border border-[#EADFD2] bg-white focus:bg-[#FDFBF7] focus:border-[#8B6E57] focus:ring-2 focus:ring-[#8B6E57]/20 transition-all duration-300 outline-none text-[#4A3C31] placeholder-[#A89F91] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm custom-scrollbar text-sm font-medium"
        ></textarea>
        
        <select *ngIf="type === 'select'"
          [disabled]="disabled"
          [(ngModel)]="value"
          (ngModelChange)="onChange($event)"
          (blur)="onTouched()"
          class="w-full px-4 py-3 rounded-2xl border border-[#EADFD2] bg-white focus:bg-[#FDFBF7] focus:border-[#8B6E57] focus:ring-2 focus:ring-[#8B6E57]/20 transition-all duration-300 outline-none text-[#4A3C31] placeholder-[#A89F91] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm appearance-none text-sm font-medium"
        >
          <ng-content select="option"></ng-content>
        </select>
        
        <input *ngIf="type !== 'textarea' && type !== 'select'"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [(ngModel)]="value"
          (ngModelChange)="onChange($event)"
          (blur)="onTouched()"
          class="w-full px-4 py-3 rounded-2xl border bg-white focus:bg-[#FDFBF7] focus:ring-2 transition-all duration-300 outline-none text-[#4A3C31] placeholder-[#A89F91] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm font-medium"
          [ngClass]="error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' : 'border-[#EADFD2] focus:border-[#8B6E57] focus:ring-[#8B6E57]/20'"
        >

        <svg *ngIf="type === 'select'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute right-4 top-1/2 -translate-y-1/2 text-[#7A6C5E] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
      </div>
      
      <p *ngIf="error" class="text-xs text-rose-500 mt-1.5 font-medium">{{ error }}</p>
      <p *ngIf="hint && !error" class="text-xs text-[#A89F91] mt-1.5 font-medium">{{ hint }}</p>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
  `]
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type = 'text'; // text, password, email, number, textarea, select
  @Input() placeholder = '';
  @Input() hint = '';
  @Input() error = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() rows = 3;

  value: any = '';
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(val: any): void {
    this.value = val;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
