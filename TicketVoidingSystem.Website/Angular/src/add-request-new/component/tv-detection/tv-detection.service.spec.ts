import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { TvDetectionType } from '../../../utility/constants/config';
import { TestingModule } from '../../../utility/modules/testing.module';
import { TvDetectionModel } from './tv-detection.model';
import { TvDetectionService } from './tv-detection.service';

describe('TvDetectionService', () => {
  let service: TvDetectionService;
  let mockElementRef: ElementRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [TvDetectionService]
    });

    service = TestBed.inject(TvDetectionService);
    mockElementRef = {
      nativeElement: document.createElement('div')
    } as ElementRef;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isValid', () => {
    it('should return true when tvDetectionValue is NONE', () => {
      const model = { tvDetectionValue: TvDetectionType.NONE } as TvDetectionModel;
      const tooltip = new Tooltip();
      tooltip.element = mockElementRef;

      expect(service.isValid(model, tooltip)).toBeTruthy();
    });

    it('should validate all fields when tvDetectionValue is not NONE', () => {
      const model = {
        tvDetectionValue: TvDetectionType.SLOW,
        serviceAcceptTime: '10:00:00 AM',
        actualTime: '09:55:00 AM',
        secondOffset: '30',
        minuteOffset: '5'
      } as TvDetectionModel;
      const tooltip = new Tooltip();
      tooltip.element = mockElementRef;

      expect(service.isValid(model, tooltip)).toBeTruthy();
    });
  });

  describe('isValiditySecond', () => {
    it('should return true for valid second', () => {
      const tooltip = new Tooltip();
      tooltip.element = mockElementRef;
      expect(service.isValiditySecond('30', tooltip)).toBeTruthy();
    });

    it('should return false for invalid second (negative)', () => {
      const tooltip = new Tooltip();
      tooltip.element = mockElementRef;
      expect(service.isValiditySecond('-1', tooltip)).toBeFalsy();
    });

    it('should return false for invalid second (over 59)', () => {
      const tooltip = new Tooltip();
      tooltip.element = mockElementRef;
      expect(service.isValiditySecond('60', tooltip)).toBeFalsy();
    });

    it('should return false for non-numeric second', () => {
      const tooltip = new Tooltip();
      tooltip.element = mockElementRef;
      expect(service.isValiditySecond('abc', tooltip)).toBeFalsy();
    });
  });

  describe('isValidityMinute', () => {
    it('should return true for valid minute', () => {
      const tooltip = new Tooltip();
      tooltip.element = mockElementRef;
      expect(service.isValidityMinute('5', tooltip)).toBeTruthy();
    });

    it('should return false for invalid minute (negative)', () => {
      const tooltip = new Tooltip();
      tooltip.element = mockElementRef;
      expect(service.isValidityMinute('-1', tooltip)).toBeFalsy();
    });

    it('should return false for non-numeric minute', () => {
      const tooltip = new Tooltip();
      tooltip.element = mockElementRef;
      expect(service.isValidityMinute('abc', tooltip)).toBeFalsy();
    });
  });

  describe('isValidityTime', () => {
    it('should return true for valid time format', () => {
      const tooltip = new Tooltip();
      tooltip.element = mockElementRef;
      expect(service.isValidityTime('10:00:00 AM', 'test-class', tooltip)).toBeTruthy();
    });

    it('should return false for invalid time format', () => {
      const tooltip = new Tooltip();
      tooltip.element = mockElementRef;
      expect(service.isValidityTime('25:00', 'test-class', tooltip)).toBeFalsy();
    });

    it('should return false for empty time', () => {
      const tooltip = new Tooltip();
      tooltip.element = mockElementRef;
      expect(service.isValidityTime('', 'test-class', tooltip)).toBeFalsy();
    });
  });

  describe('getActualTime', () => {
    it('should calculate actual time for SLOW detection type', () => {
      const model = {
        tvDetectionValue: TvDetectionType.SLOW,
        serviceAcceptTime: '10:00:00 AM',
        secondOffset: '30',
        minuteOffset: '5'
      } as TvDetectionModel;
      const tooltip = new Tooltip();
      tooltip.element = mockElementRef;

      const result = service.getActualTime(model, tooltip);
      expect(result).toBe('09:54:30 AM');
    });

    it('should calculate actual time for FAST detection type', () => {
      const model = {
        tvDetectionValue: TvDetectionType.FAST,
        serviceAcceptTime: '10:00:00 AM',
        secondOffset: '30',
        minuteOffset: '5'
      } as TvDetectionModel;
      const tooltip = new Tooltip();
      tooltip.element = mockElementRef;

      const result = service.getActualTime(model, tooltip);
      expect(result).toBe('10:05:30 AM');
    });

    it('should return null for invalid inputs', () => {
      const model = {
        tvDetectionValue: TvDetectionType.SLOW,
        serviceAcceptTime: 'invalid',
        secondOffset: '30',
        minuteOffset: '5'
      } as TvDetectionModel;
      const tooltip = new Tooltip();
      tooltip.element = mockElementRef;

      const result = service.getActualTime(model, tooltip);
      expect(result).toBeNull();
    });
  });

  describe('addSeconds', () => {
    it('should add seconds correctly', () => {
      const result = service.addSeconds('10:00:00 AM', 90);
      expect(result).toBe('10:01:30 AM');
    });

    it('should handle minute overflow', () => {
      const result = service.addSeconds('10:59:00 AM', 120);
      expect(result).toBe('11:01:00 AM');
    });
  });

  describe('subtractSeconds', () => {
    it('should subtract seconds correctly', () => {
      const result = service.subtractSeconds('10:00:00 AM', 90);
      expect(result).toBe('09:58:30 AM');
    });

    it('should handle minute underflow', () => {
      const result = service.subtractSeconds('10:00:00 AM', 120);
      expect(result).toBe('09:58:00 AM');
    });
  });
});