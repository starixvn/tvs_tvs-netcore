import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationComponent } from './confirmation.component';
import { Confirmation } from './confirmation.model';
import { TestingModule } from '../../../utility/modules/testing.module';

class Helper {
  static createMockConfirmation(overrides: Partial<Confirmation> = {}) {
    return {
      userName: 'Test User',
      reason: '',
      reasonSC: '',
      userPassword: '',
      ...overrides
    } as Confirmation;
  }

  static readonly mockConfirmation = Helper.createMockConfirmation();
}

describe('ConfirmationComponent', () => {
  let component: ConfirmationComponent;
  let fixture: ComponentFixture<ConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.confirmation).toBeDefined();
    expect(component.confirmation.userName).toBeDefined();
    expect(component.confirmation.reason).toBe('');
    expect(component.confirmation.reasonSC).toBe('');
    expect(component.confirmation.userPassword).toBe('');
  });

  it('#voidBet should emit voidEvent with true', () => {
    // Arrange
    component.voidEvent.emit = jest.fn();
    
    // Act
    component.voidBet();
    
    // Assert
    expect(component.voidEvent.emit).toHaveBeenCalledWith(true);
  });

  it('#checkValidation should return false when reason is empty', () => {
    // Arrange
    component.confirmation = Helper.createMockConfirmation({
      reason: '',
      reasonSC: 'Test SC',
      userPassword: 'Test Password'
    });
    
    // Act
    const result = component.checkValidation();
    
    // Assert
    expect(result).toBe(false);
  });

  it('#checkValidation should return false when reasonSC is empty', () => {
    // Arrange
    component.confirmation = Helper.createMockConfirmation({
      reason: 'Test Reason',
      reasonSC: '',
      userPassword: 'Test Password'
    });
    
    // Act
    const result = component.checkValidation();
    
    // Assert
    expect(result).toBe(false);
  });

  it('#checkValidation should return false when password is empty', () => {
    // Arrange
    component.confirmation = Helper.createMockConfirmation({
      reason: 'Test Reason',
      reasonSC: 'Test SC',
      userPassword: ''
    });
    
    // Act
    const result = component.checkValidation();
    
    // Assert
    expect(result).toBe(false);
  });

  it('#checkValidation should return true when all fields are filled', () => {
    // Arrange
    component.confirmation = Helper.createMockConfirmation({
      reason: 'Test Reason',
      reasonSC: 'Test SC',
      userPassword: 'Test Password'
    });
    
    // Act
    const result = component.checkValidation();
    
    // Assert
    expect(result).toBe(true);
  });

  it('#clearData should reset all form fields', () => {
    // Arrange
    component.confirmation = Helper.createMockConfirmation({
      reason: 'Test Reason',
      reasonSC: 'Test SC',
      userPassword: 'Test Password'
    });
    
    // Act
    component.clearData();
    
    // Assert
    expect(component.confirmation.reason).toBe('');
    expect(component.confirmation.reasonSC).toBe('');
    expect(component.confirmation.userPassword).toBe('');
  });
});
