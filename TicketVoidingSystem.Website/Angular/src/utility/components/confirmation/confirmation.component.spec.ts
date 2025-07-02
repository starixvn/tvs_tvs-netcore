import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';
import { ConfirmationComponent } from './confirmation.component';
import { TEXT } from '../../../utility/constants/text';
import { EventEmitter } from '@angular/core';

class Helper {
  static readonly fakeUserName = 'testUser';
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
    document.body.setAttribute('user-name', Helper.fakeUserName);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.confirmation.userName).toBe(Helper.fakeUserName);
    expect(component.confirmation.userPassword).toBe('');
    expect(component.confirmation.reason).toBe('');
    expect(component.confirmation.reasonSC).toBe('');
    expect(component.isShowConfirm).toBeUndefined();
  });

  it('should emit voidEvent when voidBet is called', () => {
    // Arrange
    component.voidEvent = {
      emit: jest.fn()
    } as unknown as EventEmitter<boolean>;

    // Act
    component.voidBet();

    // Assert
    expect(component.voidEvent.emit).toHaveBeenCalledWith(true);
  });

  describe('checkValidation', () => {
    it('should return false and display tooltip when reason is empty', () => {
      // Arrange
      component.confirmation.reason = '';
      component.confirmation.reasonSC = '测试原因';
      component.confirmation.userPassword = 'password';
      component.tooltip.display = jest.fn();

      // Act
      const result = component.checkValidation();

      // Assert
      expect(result).toBeFalsy();
      expect(component.tooltip.display).toHaveBeenCalledWith('reason', TEXT.INPUT_REASON);
    });

    it('should return false and display tooltip when reasonSC is empty', () => {
      // Arrange
      component.confirmation.reason = 'Test Reason';
      component.confirmation.reasonSC = '';
      component.confirmation.userPassword = 'password';
      component.tooltip.display = jest.fn();

      // Act
      const result = component.checkValidation();

      // Assert
      expect(result).toBeFalsy();
      expect(component.tooltip.display).toHaveBeenCalledWith('reasonSC', TEXT.INPUT_REASON);
    });

    it('should return false and display tooltip when password is empty', () => {
      // Arrange
      component.confirmation.reason = 'Test Reason';
      component.confirmation.reasonSC = '测试原因';
      component.confirmation.userPassword = '';
      component.tooltip.display = jest.fn();

      // Act
      const result = component.checkValidation();

      // Assert
      expect(result).toBeFalsy();
      expect(component.tooltip.display).toHaveBeenCalledWith('password', TEXT.INPUT_PASSWORD);
    });

    it('should return true when all fields are valid', () => {
      // Arrange
      component.confirmation.reason = 'Test Reason';
      component.confirmation.reasonSC = '测试原因';
      component.confirmation.userPassword = 'password';
      component.tooltip.display = jest.fn();

      // Act
      const result = component.checkValidation();

      // Assert
      expect(result).toBeTruthy();
      expect(component.tooltip.display).not.toHaveBeenCalled();
    });
  });

  describe('clearData', () => {
    it('should clear all form data', () => {
      // Arrange
      component.confirmation.reason = 'Test Reason';
      component.confirmation.reasonSC = '测试原因';
      component.confirmation.userPassword = 'password';

      // Act
      component.clearData();

      // Assert
      expect(component.confirmation.reason).toBe('');
      expect(component.confirmation.reasonSC).toBe('');
      expect(component.confirmation.userPassword).toBe('');
    });
  });
});
