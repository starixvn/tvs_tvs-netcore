import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordAreaComponent } from './password-area.component';
import { CommonPrimitiveProperty } from '../models/common-primitive-property.model';

describe('PasswordAreaComponent', () => {
  let component: PasswordAreaComponent;
  let fixture: ComponentFixture<PasswordAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();

    fixture = TestBed.createComponent(PasswordAreaComponent);
    component = fixture.componentInstance;
    component.primitiveProperty = {userName:'testuser'} as CommonPrimitiveProperty;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display username correctly', () => {
    const usernameInput = fixture.debugElement.nativeElement.querySelector('input[name="username"]');
    expect(usernameInput.value).toBe('testuser');
    expect(usernameInput.disabled).toBe(true);
  });

  it('should bind password input correctly', () => {
    const passwordInput = fixture.debugElement.nativeElement.querySelector('input[name="password"]');
    expect(passwordInput.type).toBe('password');
    expect(passwordInput.value).toBe('');
    
    // Test two-way binding
    passwordInput.value = 'testpassword';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    
    expect(component.primitiveProperty.userPassword).toBe('testpassword');
  });

  it('should display void all button with correct text', () => {
    const voidButton = fixture.debugElement.nativeElement.querySelector('.btn-void-all-matches');
    expect(voidButton.value).toBe('Void All');
  });

  it('should disable void all button when isBlockUI is true', () => {
    component.primitiveProperty.isBlockUI = true;
    fixture.detectChanges();
    
    const voidButton = fixture.debugElement.nativeElement.querySelector('.btn-void-all-matches');
    expect(voidButton.disabled).toBe(true);
  });

  it('should enable void all button when isBlockUI is false', () => {
    component.primitiveProperty.isBlockUI = false;
    fixture.detectChanges();
    
    const voidButton = fixture.debugElement.nativeElement.querySelector('.btn-void-all-matches');
    expect(voidButton.disabled).toBe(false);
  });

  it('should display error message when errorMessage is provided', () => {
    component.primitiveProperty.errorMessage = 'Test error message';
    fixture.detectChanges();
    
    const errorDiv = fixture.debugElement.nativeElement.querySelector('.error-text');
    expect(errorDiv).toBeTruthy();
    expect(errorDiv.textContent.trim()).toContain('Test error message');
  });

  it('should not display error message when errorMessage is empty', () => {
    component.primitiveProperty.errorMessage = '';
    fixture.detectChanges();
    
    const errorDiv = fixture.debugElement.nativeElement.querySelector('.error-text');
    expect(errorDiv).toBeFalsy();
  });

  it('should not display error message when errorMessage is null', () => {
    component.primitiveProperty.errorMessage = null as any;
    fixture.detectChanges();
    
    const errorDiv = fixture.debugElement.nativeElement.querySelector('.error-text');
    expect(errorDiv).toBeFalsy();
  });

  it('should have correct CSS classes on elements', () => {
    const fieldset = fixture.debugElement.nativeElement.querySelector('fieldset');
    expect(fieldset.classList.contains('confirm-delete')).toBe(true);
    
    const usernameInput = fixture.debugElement.nativeElement.querySelector('input[name="username"]');
    expect(usernameInput.classList.contains('form-control')).toBe(true);
    expect(usernameInput.classList.contains('form-control-sm')).toBe(true);
    
    const passwordInput = fixture.debugElement.nativeElement.querySelector('input[name="password"]');
    expect(passwordInput.classList.contains('password')).toBe(true);
    expect(passwordInput.classList.contains('form-control')).toBe(true);
    expect(passwordInput.classList.contains('form-control-sm')).toBe(true);
    
    const voidButton = fixture.debugElement.nativeElement.querySelector('.btn-void-all-matches');
    expect(voidButton.classList.contains('btn')).toBe(true);
    expect(voidButton.classList.contains('btn-success')).toBe(true);
    expect(voidButton.classList.contains('btn-sm')).toBe(true);
    expect(voidButton.classList.contains('font-weight-bold')).toBe(true);
  });

  it('should have correct autocomplete attribute on password input', () => {
    const passwordInput = fixture.debugElement.nativeElement.querySelector('input[name="password"]');
    expect(passwordInput.getAttribute('autocomplete')).toBe('new-password');
  });

  it('should display required indicator (*) for password field', () => {
    const requiredSpan = fixture.debugElement.nativeElement.querySelector('span');
    expect(requiredSpan.textContent.trim()).toBe('(*)');
  });
});
