import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-[#2E2825] border border-[#EADFD2] dark:border-white/10 rounded-3xl overflow-hidden shadow-sm relative text-[#4A3C31] dark:text-[#F4F1ED] transition-colors duration-300" [ngClass]="customClasses">
      
      <!-- Card Header -->
      <div *ngIf="hasHeader" class="p-5 md:p-6 border-b border-[#EADFD2] dark:border-white/10 flex items-center justify-between">
        <ng-content select="[card-header]"></ng-content>
      </div>
      
      <!-- Card Body -->
      <div class="p-5 md:p-6">
        <ng-content></ng-content>
      </div>
      
      <!-- Card Footer -->
      <div *ngIf="hasFooter" class="p-5 md:p-6 border-t border-[#EADFD2] dark:border-white/10 bg-[#FCF9F2] dark:bg-[#251F1C] flex items-center gap-4 justify-end">
        <ng-content select="[card-footer]"></ng-content>
      </div>
    </div>
  `
})
export class CardComponent {
  @Input() hasHeader = true;
  @Input() hasFooter = true;
  @Input() customClasses = '';
}
