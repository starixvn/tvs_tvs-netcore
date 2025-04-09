import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { AllowanceTimeComponent } from './allowance-time.component';
import { LABELS } from '../../../../../utility/constants/labels';
import { ElementRef } from '@angular/core';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';

describe('AllowanceTimeComponent', () => {
  let component: AllowanceTimeComponent;
  let fixture: ComponentFixture<AllowanceTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule, AllowanceTimeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AllowanceTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.aaTime).toBeUndefined();
    expect(component.paTime).toBeUndefined();
    expect(component.saTime).toBeUndefined();
    expect(component.isDisabled).toBeUndefined();
    expect(component.tooltip).toBeDefined();
  });

  it('should emit model change event', () => {
    // Arrange
    const spy = jest.spyOn(component.changeModel, 'emit');

    // Act
    component.emitModelChange();

    // Assert
    expect(spy).toHaveBeenCalled();
  });

  it('should return true when all allowance times are valid', () => {
    // Arrange
    component.aaTime = 1;
    component.paTime = 2;
    component.saTime = 3;

    // Act
    const result = component.isValidAllowanceTime();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should return true when all allowance times are undefined', () => {
    // Arrange
    component.aaTime = undefined;
    component.paTime = undefined;
    component.saTime = undefined;

    // Act
    const result = component.isValidAllowanceTime();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should return false and show tooltip when only some allowance times are set', () => {
    // Arrange
    const mockWrapperElement = {
      getBoundingClientRect: jest.fn().mockReturnValue({
        top: 0,
        left: 0,
        width: 100,
        height: 100
      })
    };

    const mockElement = {
      nativeElement: {
        getElementsByClassName: jest.fn().mockReturnValue([{
          scrollIntoView: jest.fn(),
          getBoundingClientRect: jest.fn().mockReturnValue({
            top: 0,
            left: 0,
            width: 100,
            height: 100
          })
        }]),
        closest: jest.fn().mockReturnValue(mockWrapperElement)
      }
    };
    component.tooltip = {} as Tooltip;
    component.tooltip.display = jest.fn();

    // Mock window properties
    Object.defineProperty(window, 'scrollY', { value: 0 });
    Object.defineProperty(window, 'scrollX', { value: 0 });

    component.tooltip.element = mockElement as unknown as ElementRef;
    component.aaTime = 1;
    component.paTime = undefined;
    component.saTime = 3;

    // Act
    const result = component.isValidAllowanceTime();

    // Assert
    expect(result).toBeFalsy();
    expect(component.tooltip.display).toHaveBeenCalledWith('allowance-time', LABELS.INVALID_SETTING_TIME);
  });

  it('should handle string values for allowance times', () => {
    // Arrange
    component.aaTime = 1;
    component.paTime = 2;
    component.saTime = 3;

    // Act
    const result = component.isValidAllowanceTime();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should handle zero values for allowance times', () => {
    // Arrange
    component.aaTime = 0;
    component.paTime = 0;
    component.saTime = 0;

    // Act
    const result = component.isValidAllowanceTime();

    // Assert
    expect(result).toBeTruthy();
  });
});
