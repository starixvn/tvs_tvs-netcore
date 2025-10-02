import { Component, DebugElement, ElementRef, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BlockUiComponent } from './block-ui.component';
import { BlockUiDirective } from './block-ui.directive';

@Component({
  template: `
    <div [blockUi]="isBlock" data-testid="test-element">
      Test Content
    </div>
  `,
  standalone: true,
  imports: [BlockUiDirective]
})
class TestHostComponent {
  isBlock = false;
}

describe('BlockUiDirective', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let directive: BlockUiDirective;
  let element: DebugElement;
  let viewContainerRef: ViewContainerRef;
  let elementRef: ElementRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, BlockUiDirective, BlockUiComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.query(By.directive(BlockUiDirective));
    directive = element.injector.get(BlockUiDirective);
    
    // Get ViewContainerRef and ElementRef from the directive
    viewContainerRef = directive['viewContainerRef'];
    elementRef = directive['elRef'];
    
    fixture.detectChanges();
  });

  it('should create directive', () => {
    expect(directive).toBeTruthy();
  });

  it('should have isBlock input property', () => {
    expect(directive.isBlock).toBeDefined();
  });

  describe('ngOnChanges', () => {
    it('should call openBlock when isBlock changes', () => {
      const openBlockMock = jest.fn();
      directive['openBlock'] = openBlockMock;
      
      const changes = {
        isBlock: {
          currentValue: true,
          previousValue: false,
          firstChange: false,
          isFirstChange: () => false
        }
      };
      
      directive.ngOnChanges(changes);
      
      expect(openBlockMock).toHaveBeenCalled();
    });

    it('should not call openBlock when other properties change', () => {
      const openBlockMock = jest.fn();
      directive['openBlock'] = openBlockMock;
      
      const changes = {
        otherProperty: {
          currentValue: 'new value',
          previousValue: 'old value',
          firstChange: false,
          isFirstChange: () => false
        }
      };
      
      directive.ngOnChanges(changes);
      
      expect(openBlockMock).not.toHaveBeenCalled();
    });

    it('should handle changes when isBlock property is not present', () => {
      const openBlockMock = jest.fn();
      directive['openBlock'] = openBlockMock;
      
      const changes = {};
      
      directive.ngOnChanges(changes);
      
      expect(openBlockMock).not.toHaveBeenCalled();
    });
  });

  describe('openBlock', () => {
    beforeEach(() => {
      // Clear any existing components
      viewContainerRef.clear();
    });

    it('should create and append BlockUiComponent when isBlock is true', () => {
      directive.isBlock = true;
      
      directive['openBlock']();
      
      expect(directive['blockUiComponent']).toBeDefined();
      expect(directive['blockUiComponent']).toBeInstanceOf(Object);
    });

    it('should not create component when isBlock is false', () => {
      directive.isBlock = false;
      
      directive['openBlock']();
      
      expect(directive['blockUiComponent']).toBeUndefined();
    });
  });

  describe('Integration tests', () => {
    it('should show block UI when isBlock is true', () => {
      component.isBlock = true;
      fixture.detectChanges();
      
      const blockUiElement = fixture.debugElement.query(By.css('block-ui'));
      expect(blockUiElement).toBeTruthy();
    });

    it('should hide block UI when isBlock is false', () => {
      component.isBlock = false;
      fixture.detectChanges();
      
      const blockUiElement = fixture.debugElement.query(By.css('block-ui'));
      expect(blockUiElement).toBeFalsy();
    });

    it('should toggle block UI when isBlock changes', () => {
      // Initially false
      component.isBlock = false;
      fixture.detectChanges();
      
      let blockUiElement = fixture.debugElement.query(By.css('block-ui'));
      expect(blockUiElement).toBeFalsy();
      
      // Change to true
      component.isBlock = true;
      fixture.detectChanges();
      
      blockUiElement = fixture.debugElement.query(By.css('block-ui'));
      expect(blockUiElement).toBeTruthy();
      
      // Change back to false
      component.isBlock = false;
      fixture.detectChanges();
      
      blockUiElement = fixture.debugElement.query(By.css('block-ui'));
      expect(blockUiElement).toBeFalsy();
    });
  });

  describe('Edge cases', () => {
    it('should handle multiple rapid changes', () => {
      const openBlockMock = jest.fn();
      directive['openBlock'] = openBlockMock;
      
      const changes = {
        isBlock: {
          currentValue: true,
          previousValue: false,
          firstChange: false,
          isFirstChange: () => false
        }
      };
      
      // Multiple rapid changes
      directive.ngOnChanges(changes);
      directive.ngOnChanges(changes);
      directive.ngOnChanges(changes);
      
      expect(openBlockMock).toHaveBeenCalledTimes(3);
    });

    it('should handle undefined isBlock value', () => {
      directive.isBlock = undefined as any;
      
      expect(() => directive['openBlock']()).not.toThrow();
    });

    it('should handle null isBlock value', () => {
      directive.isBlock = null as any;
      
      expect(() => directive['openBlock']()).not.toThrow();
    });

    it('should handle empty changes object', () => {
      const openBlockMock = jest.fn();
      directive['openBlock'] = openBlockMock;
      
      directive.ngOnChanges({});
      
      expect(openBlockMock).not.toHaveBeenCalled();
    });
  });

  describe('Jest fake functions advanced usage', () => {
    it('should track function calls with jest.fn()', () => {
      const mockFunction = jest.fn();
      directive['openBlock'] = mockFunction;
      
      const changes = {
        isBlock: {
          currentValue: true,
          previousValue: false,
          firstChange: false,
          isFirstChange: () => false
        }
      };
      
      directive.ngOnChanges(changes);
      
      expect(mockFunction).toHaveBeenCalledTimes(1);
      expect(mockFunction).toHaveBeenCalledWith();
    });

    it('should use jest.fn() with return values', () => {
      const mockCreateComponent = jest.fn().mockReturnValue({
        location: { nativeElement: document.createElement('div') }
      });
      const mockAppendChild = jest.fn();
      
      // Mock ViewContainerRef methods
      viewContainerRef.createComponent = mockCreateComponent;
      elementRef.nativeElement = { appendChild: mockAppendChild };
      
      directive.isBlock = true;
      directive['openBlock']();
      
      expect(mockCreateComponent).toHaveBeenCalledWith(BlockUiComponent);
      expect(mockAppendChild).toHaveBeenCalled();
    });

    it('should use jest.fn() with implementation', () => {
      const mockImplementation = jest.fn().mockImplementation(() => {});
      directive['openBlock'] = mockImplementation;
      
      directive.isBlock = true;
      directive['openBlock']();
      
      expect(mockImplementation).toHaveBeenCalled();
    });
  });
});
