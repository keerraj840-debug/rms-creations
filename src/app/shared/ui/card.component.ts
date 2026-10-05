import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white border border-[#EADFD2] rounded-3xl overflow-hidden shadow-sm relative" [ngClass]="customClasses">
      
      <!-- Card Header -->
      <div *ngIf="hasHeader" class="p-5 md:p-6 border-b border-[#EADFD2] flex items-center justify-between">
        <ng-content select="[card-header]"></ng-content>
      </div>
      
      <!-- Card Body -->
      <div class="p-5 md:p-6">
        <ng-content></ng-content>
      </div>
      
      <!-- Card Footer -->
      <div *ngIf="hasFooter" class="p-5 md:p-6 border-t border-[#EADFD2] bg-[#FCF9F2] flex items-center gap-4 justify-end">
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
