import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';
import { ConfirmationComponent } from './confirmation.component';
import { LABELS } from '../../../utility/constants/labels';
import { VoidedReason } from '../../../utility/models/reason.model';
import { EventEmitter } from '@angular/core';

class Helper {
  static readonly fakeUserName = 'testUser';
  static readonly fakeVoidReason: VoidedReason = {
    reasonEnglish: 'Test Reason',
    reasonChineseSimplified: '测试原因'
  } as VoidedReason;
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
    expect(component.confirmation.voidReason).toEqual({
      reasonEnglish: '',
      reasonChineseSimplified: ''
    });
    expect(component.isDisabledButton).toBeFalsy();
  });

  it('should emit voidAll event when voidAllPage is called', () => {
    // Arrange
    component.voidAll = {
      emit: jest.fn()
    } as unknown as EventEmitter<boolean>;

    // Act
    component.voidAllPage();

    // Assert
    expect(component.voidAll.emit).toHaveBeenCalledWith(true);
  });

  describe('checkValidation', () => {
    it('should return false and display tooltip when reasonEnglish is empty', () => {
      // Arrange
      component.confirmation.voidReason.reasonEnglish = '';
      component.confirmation.voidReason.reasonChineseSimplified = '测试原因';
      component.confirmation.userPassword = 'password';
      component.tooltip.display = jest.fn();

      // Act
      const result = component.checkValidation();

      // Assert
      expect(result).toBeFalsy();
      expect(component.tooltip.display).toHaveBeenCalledWith('reason', LABELS.INPUT_REASON);
    });

    it('should return false and display tooltip when reasonChineseSimplified is empty', () => {
      // Arrange
      component.confirmation.voidReason.reasonEnglish = 'Test Reason';
      component.confirmation.voidReason.reasonChineseSimplified = '';
      component.confirmation.userPassword = 'password';
      component.tooltip.display = jest.fn();

      // Act
      const result = component.checkValidation();

      // Assert
      expect(result).toBeFalsy();
      expect(component.tooltip.display).toHaveBeenCalledWith('reasonSC', LABELS.INPUT_REASON);
    });

    it('should return false and display tooltip when password is empty', () => {
      // Arrange
      component.confirmation.voidReason.reasonEnglish = 'Test Reason';
      component.confirmation.voidReason.reasonChineseSimplified = '测试原因';
      component.confirmation.userPassword = '';
      component.tooltip.display = jest.fn();

      // Act
      const result = component.checkValidation();

      // Assert
      expect(result).toBeFalsy();
      expect(component.tooltip.display).toHaveBeenCalledWith('password', LABELS.INPUT_PASSWORD);
    });

    it('should return true when all fields are valid', () => {
      // Arrange
      component.confirmation.voidReason.reasonEnglish = 'Test Reason';
      component.confirmation.voidReason.reasonChineseSimplified = '测试原因';
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
      component.confirmation.voidReason.reasonEnglish = 'Test Reason';
      component.confirmation.voidReason.reasonChineseSimplified = '测试原因';
      component.confirmation.userPassword = 'password';

      // Act
      component.clearData();

      // Assert
      expect(component.confirmation.voidReason.reasonEnglish).toBe('');
      expect(component.confirmation.voidReason.reasonChineseSimplified).toBe('');
      expect(component.confirmation.userPassword).toBe('');
    });
  });
});
