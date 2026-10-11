import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyStateComponent } from './empty-state.component';

export interface TableColumn {
  key?: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
  headerClass?: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, EmptyStateComponent],
  template: `
    <div class="overflow-x-auto" [ngClass]="customWrapperClass">
      <table class="w-full text-left" [style.minWidth]="minWidth">
        <thead>
          <tr class="text-[10px] uppercase tracking-widest text-[#7A6C5E] dark:text-[#C5A393] border-b border-[#EADFD2] dark:border-white/10 bg-[#FDFBF7] dark:bg-white/5">
            <th *ngFor="let col of columns" 
                class="px-6 py-4 font-bold select-none"
                [ngClass]="[
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                  col.headerClass || ''
                ]"
                [style.width]="col.width || 'auto'">
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#EADFD2]/50 dark:divide-white/5">
          <!-- Loading Shimmer Skeletons -->
          <ng-container *ngIf="loading">
            <tr *ngFor="let r of skeletonRowsArray" class="animate-pulse">
              <td *ngFor="let col of columns; let first = first" 
                  class="px-6 py-4.5"
                  [ngClass]="col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'">
                <div *ngIf="first" class="flex items-center gap-4">
                  <div class="h-10 w-10 rounded-xl bg-[#EADFD2]/60 dark:bg-white/10 shrink-0"></div>
                  <div class="space-y-2 flex-1">
                    <div class="h-3.5 bg-[#EADFD2]/70 dark:bg-white/10 rounded w-3/4"></div>
                    <div class="h-2.5 bg-[#EADFD2]/40 dark:bg-white/5 rounded w-1/2"></div>
                  </div>
                </div>
                <div *ngIf="!first" class="h-3.5 bg-[#EADFD2]/50 dark:bg-white/10 rounded-md" 
                     [ngClass]="col.align === 'right' ? 'w-16 ml-auto' : col.align === 'center' ? 'w-20 mx-auto' : 'w-24'"></div>
              </td>
            </tr>
          </ng-container>

          <!-- Error State -->
          <tr *ngIf="!loading && error">
            <td [attr.colspan]="columns.length" class="p-0">
              <app-empty-state
                icon="alert"
                [title]="errorTitle"
                [description]="error"
                actionText="Try Again"
                actionIcon="refresh"
                actionVariant="outline"
                (actionClick)="retry.emit()"
              ></app-empty-state>
            </td>
          </tr>

          <!-- Empty State -->
          <tr *ngIf="!loading && !error && isEmpty">
            <td [attr.colspan]="columns.length" class="p-0">
              <app-empty-state
                [icon]="emptyIcon"
                [title]="emptyTitle"
                [description]="emptyDescription"
                [actionText]="emptyActionText"
                [actionRouterLink]="emptyActionRouterLink"
                [actionIcon]="emptyActionIcon"
                (actionClick)="emptyActionClick.emit()"
              ></app-empty-state>
            </td>
          </tr>

          <!-- Data Rows (Projected) -->
          <ng-container *ngIf="!loading && !error && !isEmpty">
            <ng-content></ng-content>
          </ng-container>
        </tbody>
      </table>
    </div>
  `
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() loading: boolean = false;
  @Input() error: string | null = null;
  @Input() errorTitle: string = 'Unable to load records';
  @Input() isEmpty: boolean = false;
  @Input() minWidth: string = '600px';
  @Input() customWrapperClass: string = '-mx-5 md:-mx-6';

  @Input() skeletonCount: number = 4;

  @Input() emptyIcon: 'box' | 'search' | 'cart' | 'users' | 'folder' | 'info' | 'alert' = 'box';
  @Input() emptyTitle: string = 'No records found';
  @Input() emptyDescription: string = 'There are no items to display at this time.';
  @Input() emptyActionText?: string;
  @Input() emptyActionRouterLink?: any[] | string | null;
  @Input() emptyActionIcon?: 'plus' | 'refresh' | 'none' = 'none';

  @Output() emptyActionClick = new EventEmitter<void>();
  @Output() retry = new EventEmitter<void>();

  get skeletonRowsArray(): number[] {
    return Array.from({ length: this.skeletonCount }, (_, i) => i);
  }
}
