import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MyAccountPageComponent } from './my-account-page.component';
import { AuthService, UserProfile } from '../services/auth.service';
import { CustomerAddressService, CustomerAddress } from '../services/customer-address.service';
import { CartService } from '../services/cart.service';
import { LocalStorageService } from '../services/local-storage.service';
import { SupabaseService } from '../services/supabase.service';
import { SeoService } from '../shared/seo.service';
import { provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

describe('MyAccountPageComponent (Premium Customer UX Overhaul)', () => {
  let component: MyAccountPageComponent;
  let currentUserSubject: BehaviorSubject<UserProfile | null>;
  let mockAuthService: any;
  let mockAddressService: any;
  let mockSupabaseService: any;

  const sampleUser: UserProfile = {
    id: 101,
    name: 'Radhika Sharma',
    email: 'radhika@example.com',
    role: 'customer',
    phone_no: '9876543210',
    gender: 'female',
    date_of_birth: '1995-05-15',
    is_active: true
  };

  const sampleAddresses: CustomerAddress[] = [
    {
      customer_address_id: 1,
      user_id: 101,
      address_type: 'Home',
      address: 'A-402, Lotus Residency, Kothrud',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      pin_code: '411038',
      is_default: true
    }
  ];

  beforeEach(async () => {
    currentUserSubject = new BehaviorSubject<UserProfile | null>(sampleUser);

    mockAuthService = {
      currentUser$: currentUserSubject.asObservable(),
      currentUser: sampleUser,
      updateProfile: vi.fn().mockResolvedValue({ success: true }),
      signOut: vi.fn().mockResolvedValue(undefined)
    };

    mockAddressService = {
      getCustomerAddresses: vi.fn().mockResolvedValue(sampleAddresses),
      saveAddress: vi.fn().mockResolvedValue({ success: true }),
      deleteAddress: vi.fn().mockResolvedValue(undefined)
    };

    mockSupabaseService = {
      resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null })
    };

    await TestBed.configureTestingModule({
      imports: [MyAccountPageComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: CustomerAddressService, useValue: mockAddressService },
        { provide: SupabaseService, useValue: mockSupabaseService },
        provideRouter([{ path: 'login', component: {} as any }])
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(MyAccountPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders customer initials and initial profile details accurately', () => {
    expect(component.userInitial).toBe('R');
    expect(component.profileName).toBe('Radhika Sharma');
    expect(component.profilePhone).toBe('9876543210');
    expect(component.profileGender).toBe('female');
    expect(component.profileDob).toBe('1995-05-15');
    expect(component.activeTab).toBe('profile');
  });

  it('switches tabs smoothly between profile, addresses, and security', () => {
    component.activeTab = 'addresses';
    expect(component.activeTab).toBe('addresses');

    component.activeTab = 'security';
    expect(component.activeTab).toBe('security');

    component.activeTab = 'profile';
    expect(component.activeTab).toBe('profile');
  });

  it('updates personal profile with sanitized inputs and triggers success feedback', async () => {
    component.profileName = 'Radhika Joshi';
    component.profilePhone = '9123456789';

    await component.saveProfile();

    expect(mockAuthService.updateProfile).toHaveBeenCalledWith({
      name: 'Radhika Joshi',
      phone_no: '9123456789',
      gender: 'female',
      date_of_birth: '1995-05-15'
    });
    expect(component.profileSuccess).toBe(true);
  });

  it('opens add address modal with sensible Maharashtra defaults', () => {
    component.openAddAddress();
    expect(component.showAddressModal).toBe(true);
    expect(component.currentAddress.city).toBe('Pune');
    expect(component.currentAddress.state).toBe('Maharashtra');
    expect(component.currentAddress.address_type).toBe('Home');
  });

  it('sends password reset link to user email via Supabase Auth', async () => {
    await component.sendPasswordReset();

    expect(mockSupabaseService.resetPasswordForEmail).toHaveBeenCalledWith('radhika@example.com');
    expect(component.resetSent).toBe(true);
    expect(component.resetMessage).toContain('instructions have been sent');
  });

  it('handles sign out by delegating to authService and navigating to login', async () => {
    await component.signOut();
    expect(mockAuthService.signOut).toHaveBeenCalled();
  });
});
