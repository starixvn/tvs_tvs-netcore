import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { jest } from '@jest/globals';
import { TooltipComponent } from '../../../../../../utility/components/tooltip/tooltip.component';
import { LABELS } from '../../../../../../utility/constants/labels';
import { AllowanceTimeComponent } from './allowance-time.component';

describe('AllowanceTimeComponent', () => {
  let component: AllowanceTimeComponent;
  let fixture: ComponentFixture<AllowanceTimeComponent>;

  beforeEach(async () => {
    // Mock DOM elements
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
        closest: jest.fn().mockReturnValue({
          getBoundingClientRect: jest.fn().mockReturnValue({
            top: 0,
            left: 0,
            width: 100,
            height: 100
          })
        })
      }
    };

    await TestBed.configureTestingModule({
      imports: [AllowanceTimeComponent, FormsModule, TooltipComponent],
      providers: [
        { provide: ElementRef, useValue: mockElement }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AllowanceTimeComponent);
    component = fixture.componentInstance;
    component.tooltip.element = mockElement as ElementRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit model change when emitModelChange is called', () => {
    const emitSpy = jest.spyOn(component.changeModel, 'emit');
    component.emitModelChange();
    expect(emitSpy).toHaveBeenCalled();
  });

  describe('isValidAllowanceTime', () => {
    it('should return true when all times are set', () => {
      component.aaTime = 1;
      component.paTime = 2;
      component.saTime = 3;
      expect(component.isValidAllowanceTime()).toBeTruthy();
    });

    it('should return true when all times are not set', () => {
      component.aaTime = undefined;
      component.paTime = undefined;
      component.saTime = undefined;
      expect(component.isValidAllowanceTime()).toBeTruthy();
    });

    it('should return false and display tooltip when only some times are set', () => {
      component.aaTime = 1;
      component.paTime = undefined;
      component.saTime = undefined;

      const displaySpy = jest.spyOn(component.tooltip, 'display');
      const result = component.isValidAllowanceTime();

      expect(result).toBeFalsy();
      expect(displaySpy).toHaveBeenCalledWith('allowance-time', LABELS.INVALID_SETTING_TIME);
    });

    it('should return false and display tooltip when only aaTime is set', () => {
      component.aaTime = 1;
      component.paTime = undefined;
      component.saTime = undefined;

      const displaySpy = jest.spyOn(component.tooltip, 'display');
      const result = component.isValidAllowanceTime();

      expect(result).toBeFalsy();
      expect(displaySpy).toHaveBeenCalledWith('allowance-time', LABELS.INVALID_SETTING_TIME);
    });

    it('should return false and display tooltip when only paTime is set', () => {
      component.aaTime = undefined;
      component.paTime = 1;
      component.saTime = undefined;

      const displaySpy = jest.spyOn(component.tooltip, 'display');
      const result = component.isValidAllowanceTime();

      expect(result).toBeFalsy();
      expect(displaySpy).toHaveBeenCalledWith('allowance-time', LABELS.INVALID_SETTING_TIME);
    });

    it('should return false and display tooltip when only saTime is set', () => {
      component.aaTime = undefined;
      component.paTime = undefined;
      component.saTime = 1;

      const displaySpy = jest.spyOn(component.tooltip, 'display');
      const result = component.isValidAllowanceTime();

      expect(result).toBeFalsy();
      expect(displaySpy).toHaveBeenCalledWith('allowance-time', LABELS.INVALID_SETTING_TIME);
    });
  });
});
