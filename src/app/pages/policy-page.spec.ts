import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PolicyPageComponent } from './policy-page.component';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { SeoService } from '../shared/seo.service';
import { BehaviorSubject, of } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('PolicyPageComponent', () => {
  let component: PolicyPageComponent;
  let fixture: ComponentFixture<PolicyPageComponent>;
  let mockSeoService: any;
  let routeData$: BehaviorSubject<any>;
  let queryParams$: BehaviorSubject<any>;

  beforeEach(async () => {
    routeData$ = new BehaviorSubject<any>({ section: 'terms' });
    queryParams$ = new BehaviorSubject<any>({});

    mockSeoService = {
      setPageMetadata: vi.fn(),
      setBreadcrumbSchema: vi.fn(),
      setFaqSchema: vi.fn(),
      setProductSchema: vi.fn(),
      setJsonLd: vi.fn(),
      removeJsonLd: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [PolicyPageComponent],
      providers: [
        provideRouter([]),
        { provide: SeoService, useValue: mockSeoService },
        {
          provide: ActivatedRoute,
          useValue: {
            data: routeData$.asObservable(),
            queryParams: queryParams$.asObservable(),
            snapshot: { queryParamMap: { get: () => null } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PolicyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create PolicyPageComponent and default to terms section', () => {
    expect(component).toBeTruthy();
    expect(component.activeTab).toBe('terms');
    expect(mockSeoService.setPageMetadata).toHaveBeenCalled();
  });

  it('should switch tabs to privacy and update SEO metadata', () => {
    component.selectTab('privacy');
    expect(component.activeTab).toBe('privacy');
    expect(mockSeoService.setPageMetadata).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: 'privacy',
        title: expect.stringContaining('Privacy Policy')
      })
    );
  });

  it('should switch tabs to shipping and refunds properly', () => {
    component.selectTab('shipping');
    expect(component.activeTab).toBe('shipping');

    component.selectTab('refunds');
    expect(component.activeTab).toBe('refunds');
  });

  it('should switch tabs to grievance officer section with statutory compliance details', () => {
    component.selectTab('grievance');
    expect(component.activeTab).toBe('grievance');
    expect(mockSeoService.setPageMetadata).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: 'grievance',
        title: expect.stringContaining('Consumer Grievance')
      })
    );
  });

  it('should switch tabs to cookies policy and update SEO metadata', () => {
    component.selectTab('cookies');
    expect(component.activeTab).toBe('cookies');
    expect(mockSeoService.setPageMetadata).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: 'cookies',
        title: expect.stringContaining('Cookie & Tracking Policy')
      })
    );
  });
});
