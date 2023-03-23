import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ToolTipModule } from '../../../utility/modules/tooltip/tooltip.module';
import { BetIdsComponent } from './bet-ids.component';
import { CSSCLASS } from './bet-ids.model';


describe('BetIdsComponent', () => {
  let component: BetIdsComponent;
  let fixture: ComponentFixture<BetIdsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BetIdsComponent],
      imports: [
        ToolTipModule,
        FormsModule
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetIdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('ngOnInit', () => {
    // Arrange
    // Action and Assert
    component.ngOnInit();
    expect(component.groupNumber).toBeDefined();
  });

  it('Focus transid', () => {
    // Arrange
    // Action and Assert
    component.focusTransId();
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('.trans-id:focus');
    expect(input).not.toBeNull();
  });

  it('Add item', () => {
    // Arrange
    component.ngOnInit();
    const testCases = [
      { value: '12345' },
      { value: '11111111111111111111111111111111111111111111111111111111111111111111111114511' },
    ];
    // Action and Assert
    testCases.forEach(item => {
      component.addNewId(item.value);
    });
    expect(component.transId).toBe('');
    expect(component.groupNumber.items.length).toBe(2);
    expect(component.groupNumber.items[0].value).toBe('12345');
    expect(component.groupNumber.items[1].value).toBe('111111111111111111111111111111111111111111111111111111111111111111111111145...');
  });

  it('Paste Item', () => {
    // Arrange
    component.ngOnInit();
    const pasteData = new DataTransfer();
    pasteData.setData('text', '12345 54321,98765\r\n56789\n012345');
    const pasteEvent = new ClipboardEvent('paste', {
      clipboardData: pasteData
    } as any);
    // Action and Assert
    component.pasteItem(pasteEvent);
    expect(component.groupNumber.items.length).toBe(5);
    expect(component.transId).toBe('');
  });

  it('Select Items', () => {
    // Arrange
    component.ngOnInit();
    component.addNewId('12345');
    component.addNewId('67890');
    component.groupNumber.items[0].changeSelected();
    component.lastItem = component.groupNumber.items[1];
    // Action and Assert
    component.selectItems(component.groupNumber.items[0]);
    expect(component.groupNumber.items[0].cssClass).toBe(CSSCLASS.SELECTED);
  });

  it('Check Validation Of Special Keys', () => {
    // Arrange
    const testCases = [
      { ctrlKey: true, code: 48, expectedValue: true }, { ctrlKey: true, code: 57, expectedValue: true },
      { ctrlKey: true, code: 99, expectedValue: true }, { ctrlKey: true, code: 118, expectedValue: true },
      { ctrlKey: true, code: 69, expectedValue: true }, { ctrlKey: true, code: 72, expectedValue: true },
      { ctrlKey: false, code: 48, expectedValue: true }, { ctrlKey: false, code: 57, expectedValue: true },
      { ctrlKey: false, code: 99, expectedValue: false }, { ctrlKey: false, code: 118, expectedValue: false },
      { ctrlKey: false, code: 69, expectedValue: true }, { ctrlKey: false, code: 72, expectedValue: true }
    ];
    // Action and Assert
    testCases.forEach(item => {
      const keyboardEvent = new KeyboardEvent('keydown', { 'ctrlKey': item.ctrlKey });
      expect(component.checkValidationOfSpecialKeys(keyboardEvent, item.code)).toBe(item.expectedValue);
    });
  });

  it('Is ShiftKey And Not Digital Key', () => {
    // Arrange
    const testCases = [
      { shiftKey: true, code: 48, expectedValue: true }, { shiftKey: true, code: 57, expectedValue: true },
      { shiftKey: false, code: 48, expectedValue: false }, { shiftKey: false, code: 57, expectedValue: false },
    ];
    // Action and Assert
    testCases.forEach(item => {
      const keyboardEvent = new KeyboardEvent('keydown', { 'shiftKey': item.shiftKey });
      expect(component.IsShiftKeyAndNotDigitalKey(keyboardEvent, item.code)).toBe(item.expectedValue);
    });
  });

  it('Is CtrlKey And Numpad1 Key', () => {
    // Arrange
    const testCases = [
      { ctrlKey: true, code: 97, expectedValue: true }, { ctrlKey: true, code: 57, expectedValue: false }
    ];
    // Action and Assert
    testCases.forEach(item => {
      const keyboardEvent = new KeyboardEvent('keydown', { 'ctrlKey': item.ctrlKey });
      expect(component.IsCtrlKeyAndNumpad1Key(keyboardEvent, item.code)).toBe(item.expectedValue);
    });
  });

  it('OnKey', () => {
    // Arrange
    const testCases = [
      {
        key: 'Backspace', transId: '', IsShiftKeyAndNotDigitalKey: false,
        IsCtrlKeyAndNumpad1Key: false, checkValidationOfSpecialKeys: false, maxItems: 2000
      },
      {
        key: 'Backspace', transId: '12345', IsShiftKeyAndNotDigitalKey: true,
        IsCtrlKeyAndNumpad1Key: false, checkValidationOfSpecialKeys: false, maxItems: 2000
      },
      {
        key: '0', transId: '', IsShiftKeyAndNotDigitalKey: true,
        IsCtrlKeyAndNumpad1Key: false, checkValidationOfSpecialKeys: false, maxItems: 2000
      },
      {
        key: '0', transId: '12345', IsShiftKeyAndNotDigitalKey: true,
        IsCtrlKeyAndNumpad1Key: false, checkValidationOfSpecialKeys: false, maxItems: 2000
      },
      {
        key: '0', transId: '12345', IsShiftKeyAndNotDigitalKey: false,
        IsCtrlKeyAndNumpad1Key: true, checkValidationOfSpecialKeys: false, maxItems: 2000
      },
      {
        key: 'Delete', transId: '12345', IsShiftKeyAndNotDigitalKey: false,
        IsCtrlKeyAndNumpad1Key: false, checkValidationOfSpecialKeys: false, maxItems: 2000
      },
      {
        key: ';', transId: '12345', IsShiftKeyAndNotDigitalKey: false,
        IsCtrlKeyAndNumpad1Key: false, checkValidationOfSpecialKeys: false, maxItems: 2000
      },
      {
        key: 'E', transId: '', IsShiftKeyAndNotDigitalKey: false,
        IsCtrlKeyAndNumpad1Key: false, checkValidationOfSpecialKeys: false, maxItems: 2000
      },
      {
        key: '0', transId: '12345', IsShiftKeyAndNotDigitalKey: false,
        IsCtrlKeyAndNumpad1Key: false, checkValidationOfSpecialKeys: true, maxItems: 1
      },
      {
        key: '0', transId: '12345', IsShiftKeyAndNotDigitalKey: false,
        IsCtrlKeyAndNumpad1Key: false, checkValidationOfSpecialKeys: true, maxItems: 2000
      },
    ];
    // Action and Assert
    testCases.forEach(item => {
      component.ngOnInit();
      component.addNewId('12345');
      component.groupNumber.items[0].isSelected = true;
      component.addNewId('56789');
      const keyboardEvent = new KeyboardEvent('keydown', { 'key': item.key });
      component.transId = item.transId;
      component.maxItems = item.maxItems;
      component.IsShiftKeyAndNotDigitalKey = jasmine.createSpy().and.returnValue(item.IsShiftKeyAndNotDigitalKey);
      component.IsCtrlKeyAndNumpad1Key = jasmine.createSpy().and.returnValue(item.IsCtrlKeyAndNumpad1Key);
      component.checkValidationOfSpecialKeys = jasmine.createSpy().and.returnValue(item.checkValidationOfSpecialKeys);
      const result = component.onKey(keyboardEvent);
      const count = component.groupNumber.items.length;
      if (item.key === 'Backspace' && item.transId === '') {
        expect(count).toBe(1);
      } else if (item.IsShiftKeyAndNotDigitalKey) {
        expect(count).toBe(2);
      } else if (item.IsCtrlKeyAndNumpad1Key) {
        expect(component.groupNumber.isSelectedAll).toBe(true);
      } else if (item.key === 'Delete') {
        expect(count).toBe(1);
      } else if (item.key === ';' || item.key === 'Space') {
        if (item.transId === '') {
          expect(count).toBe(2);
        } else {
          expect(count).toBe(3);
        }
      } else if (count > item.maxItems) {
        expect(result).toBe(false);
      } else {
        expect(component.checkValidationOfSpecialKeys(keyboardEvent, 0)).toBe(item.checkValidationOfSpecialKeys);
      }
    });
  });

  it('Check validation', () => {
    // Arrange
    component.ngOnInit();
    const testCases = [
      { valueOfGroupNumber: '', expectedValue: false },
      { valueOfGroupNumber: '12345', expectedValue: true }
    ];
    // Action and Assert
    testCases.forEach(item => {
      component.groupNumber.getValue = jasmine.createSpy().and.returnValue(item.valueOfGroupNumber);
      expect(component.checkValidate()).toBe(item.expectedValue);
    });
  });

  it('Clear betid', () => {
    // Arrange
    component.ngOnInit();
    component.addNewId('12345');
    // Action and Assert
    component.clearBetId();
    expect(component.groupNumber.items.length).toBe(0);
  });
});
