import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ConfirmationComponent } from './confirmation.component';
import { ToolTipModule } from '../../modules/tooltip/tooltip.module';
import { LABELS } from '../../constants/labels';
import { Tooltip } from '../../modules/tooltip/tooltip.model';

describe('ConfirmationComponent', () => {
  let component: ConfirmationComponent;
  let fixture: ComponentFixture<ConfirmationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationComponent ],
      imports: [
        ToolTipModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
  });

  it('ngOnInit', () => {
    // Arrange
    // Action and Asert
    component.ngOnInit();
  });

  it('Void current page', () => {
    // Arrange
    spyOn(component.voidCurrent, 'emit');
    // Action and Asert
    component.voidCurrentPage();
    expect(component.voidCurrent.emit).toHaveBeenCalledWith(true);
  });

  it('Void all page', () => {
    // Arrange
    spyOn(component.voidAll, 'emit');
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
    spyOn(component.tooltip, 'display');
    // Action and Asert
    testCases.forEach(item => {
        component.confirmation.reason = item.reason;
        component.confirmation.reasonSC = item.reasonSC;
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
    expect(component.confirmation.reason).toBe('');
    expect(component.confirmation.reasonSC).toBe('');
    expect(component.confirmation.userPassword).toBe('');
  });
});
