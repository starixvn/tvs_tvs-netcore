import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LABELS } from '../../constants/labels';
import { Tooltip } from '../tooltip/tooltip.model';
import { ConfirmationComponent } from './confirmation.component';

describe('ConfirmationComponent', () => {
  let component: ConfirmationComponent;
  let fixture: ComponentFixture<ConfirmationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
  })

  it('Void all page', () => {
    // Arrange
    jest.spyOn(component.voidAll, 'emit');
    // Action and Asert
    component.voidAllPage();
    expect(component.voidAll.emit).toHaveBeenCalledWith(true);
  });

  it('Check validation', () => {
    // Arrange
    const testCases = [
        { reason: '', reasonSC: '', userPassword: '', tooltipClassName: 'reason', tooltipMessage: LABELS.INPUT_REASON, expectedValue: false },
        { reason: 'reason', reasonSC: '', userPassword: '', tooltipClassName: 'reasonSC', tooltipMessage: LABELS.INPUT_REASON, expectedValue: false },
        { reason: 'reason', reasonSC: 'reasonSC', userPassword: '', tooltipClassName: 'password', tooltipMessage: LABELS.INPUT_PASSWORD, expectedValue: false },
        { reason: 'reason', reasonSC: 'reasonSC', userPassword: 'password', tooltipClassName: '', tooltipMessage: '', expectedValue: true }
    ];
    let actualValue = false;
    component.tooltip = new Tooltip();
    jest.spyOn(component.tooltip, 'display');
    component.tooltip.display = jest.fn();
    // Action and Asert
    testCases.forEach(item => {
        component.confirmation.voidReason.reasonEnglish = item.reason;
        component.confirmation.voidReason.reasonChineseSimplified = item.reasonSC;
        component.confirmation.userPassword = item.userPassword;
        actualValue = component.checkValidation();
        expect(actualValue).toBe(item.expectedValue);
        if (item.tooltipMessage !== '') {
            expect(component.tooltip.display).toHaveBeenCalledWith(item.tooltipClassName, item.tooltipMessage);
        }
    });
  });

  it('Clear data', () => {
    // Arrange
    // Action and Asert
    component.clearData();
    expect(component.confirmation.voidReason.reasonEnglish).toBe('');
    expect(component.confirmation.voidReason.reasonChineseSimplified).toBe('');
    expect(component.confirmation.userPassword).toBe('');
  });
});
