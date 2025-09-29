import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoidReasonComponent } from './void-reason.component';
import { VoidedReason } from '../../../../utility/models/reason.model';

describe('VoidReasonComponent', () => {
  let component: VoidReasonComponent;
  let fixture: ComponentFixture<VoidReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();

    fixture = TestBed.createComponent(VoidReasonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should initialize with default values', () => {
      expect(component.enableCollapse).toBe(false);
      expect(component.isCollapse).toBe(false);
      expect(component.disabled).toBe(false);
      expect(component.voidReason).toBeUndefined();
      expect(component.initialReason).toBeUndefined();
    });

    it('should accept voidReason input', () => {
      const mockReason: VoidedReason = {
        reasonEnglish: 'Test English reason',
        reasonChineseSimplified: 'Test Chinese reason'
      };
      
      component.voidReason = mockReason;
      expect(component.voidReason).toEqual(mockReason);
    });

    it('should accept enableCollapse input', () => {
      component.enableCollapse = true;
      expect(component.enableCollapse).toBe(true);
    });

    it('should accept isCollapse input', () => {
      component.isCollapse = true;
      expect(component.isCollapse).toBe(true);
    });

    it('should accept disabled input', () => {
      component.disabled = true;
      expect(component.disabled).toBe(true);
    });
  });

  describe('ngOnChanges', () => {
    it('should set initialReason when voidReason changes for the first time', () => {
      const mockReason: VoidedReason = {
        reasonEnglish: 'Initial English reason',
        reasonChineseSimplified: 'Initial Chinese reason'
      };

      component.voidReason = mockReason;
      component.ngOnChanges({
        voidReason: {
          currentValue: mockReason,
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true
        }
      });

      expect(component.initialReason).toEqual(mockReason);
    });

    it('should not override initialReason when voidReason changes again', () => {
      const initialReason: VoidedReason = {
        reasonEnglish: 'Initial English reason',
        reasonChineseSimplified: 'Initial Chinese reason'
      };

      const updatedReason: VoidedReason = {
        reasonEnglish: 'Updated English reason',
        reasonChineseSimplified: 'Updated Chinese reason'
      };

      // Set initial reason first
      component.voidReason = initialReason;
      component.ngOnChanges({
        voidReason: {
          currentValue: initialReason,
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true
        }
      });

      // Update voidReason
      component.voidReason = updatedReason;
      component.ngOnChanges({
        voidReason: {
          currentValue: updatedReason,
          previousValue: initialReason,
          firstChange: false,
          isFirstChange: () => false
        }
      });

      expect(component.initialReason).toEqual(initialReason);
      expect(component.voidReason).toEqual(updatedReason);
    });

    it('should not set initialReason when voidReason is undefined', () => {
      component.ngOnChanges({
        voidReason: {
          currentValue: undefined,
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true
        }
      });

      expect(component.initialReason).toBeUndefined();
    });

    it('should not set initialReason when voidReason change is not detected', () => {
      component.ngOnChanges({});

      expect(component.initialReason).toBeUndefined();
    });
  });

  describe('Template Integration', () => {
    it('should render when voidReason is provided', () => {
      const mockReason: VoidedReason = {
        reasonEnglish: 'Test English reason',
        reasonChineseSimplified: 'Test Chinese reason'
      };

      component.voidReason = mockReason;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.reason-area')).toBeTruthy();
      expect(compiled.querySelector('.gray-header')).toBeTruthy();
    });

    it('should not render when voidReason is not provided', () => {
      component.voidReason = undefined;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.reason-area')).toBeFalsy();
    });

    it('should show collapse functionality when enableCollapse is true', () => {
      const mockReason: VoidedReason = {
        reasonEnglish: 'Test English reason',
        reasonChineseSimplified: 'Test Chinese reason'
      };

      component.voidReason = mockReason;
      component.enableCollapse = true;
      component.isCollapse = false;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const header = compiled.querySelector('.gray-header');
      expect(header).toBeTruthy();
    });

    it('should hide content when isCollapse is true', () => {
      const mockReason: VoidedReason = {
        reasonEnglish: 'Test English reason',
        reasonChineseSimplified: 'Test Chinese reason'
      };

      component.voidReason = mockReason;
      component.isCollapse = true;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('table')).toBeFalsy();
    });

    it('should show content when isCollapse is false', () => {
      const mockReason: VoidedReason = {
        reasonEnglish: 'Test English reason',
        reasonChineseSimplified: 'Test Chinese reason'
      };

      component.voidReason = mockReason;
      component.isCollapse = false;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('table')).toBeTruthy();
    });

    it('should enable textareas when disabled is false', () => {
      const mockReason: VoidedReason = {
        reasonEnglish: 'Test English reason',
        reasonChineseSimplified: 'Test Chinese reason'
      };

      component.voidReason = mockReason;
      component.disabled = false;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const textareas = compiled.querySelectorAll('textarea');
      textareas.forEach((textarea: HTMLTextAreaElement) => {
        expect(textarea.disabled).toBe(false);
      });
    });

    it('should update voidReason when textarea values change', () => {
      const mockReason: VoidedReason = {
        reasonEnglish: '',
        reasonChineseSimplified: ''
      };

      component.voidReason = mockReason;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const englishTextarea = compiled.querySelector('textarea.reason') as HTMLTextAreaElement;
      const chineseTextarea = compiled.querySelector('textarea.reasonSC') as HTMLTextAreaElement;

      englishTextarea.value = 'Updated English reason';
      englishTextarea.dispatchEvent(new Event('input'));

      chineseTextarea.value = 'Updated Chinese reason';
      chineseTextarea.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      expect(component.voidReason.reasonEnglish).toBe('Updated English reason');
      expect(component.voidReason.reasonChineseSimplified).toBe('Updated Chinese reason');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null voidReason', () => {
      component.voidReason = null as any;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('.reason-area')).toBeFalsy();
    });

    it('should handle voidReason with undefined properties', () => {
      const mockReason: VoidedReason = {
        reasonEnglish: undefined as any,
        reasonChineseSimplified: undefined as any
      };

      component.voidReason = mockReason;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const englishTextarea = compiled.querySelector('textarea.reason') as HTMLTextAreaElement;
      const chineseTextarea = compiled.querySelector('textarea.reasonSC') as HTMLTextAreaElement;

      expect(englishTextarea.value).toBe('');
      expect(chineseTextarea.value).toBe('');
    });
  });
});
