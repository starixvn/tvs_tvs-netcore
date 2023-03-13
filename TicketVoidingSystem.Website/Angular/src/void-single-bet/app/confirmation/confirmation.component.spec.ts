import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Shallow } from 'shallow-render';
import { TEXT } from '../../../utility/constants/text';
import { ToolTipModule } from '../../../utility/modules/tooltip/tooltip.module';
import { ConfirmationComponent } from './confirmation.component';

class Helper {
  static readonly fieldsetSelector = 'fieldset';
  static readonly reasonSelector = 'textarea.reason';
  static readonly reasonSCSelector = 'textarea.reasonSC';
  static readonly passwordSelector = 'input[type=password]';
  static readonly voidBetButtonSelector = 'input[type=button]';
}

describe('ConfirmationComponent', () => {
  @NgModule({
    imports: [
      BrowserModule,
      FormsModule,
      ToolTipModule
    ],
  })
  class AppModuleTest { }

  let shallow: Shallow<ConfirmationComponent>;

  beforeEach(() => {
    shallow = new Shallow(ConfirmationComponent, AppModuleTest);
  });

  it('ConfirmationComponent should init match snapshot', async () => {
    // Arrange
    const { find, fixture } = await shallow.render(
      '<confirmation-single [isShowConfirm]="true"></confirmation-single>'
    );
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
    expect(find(Helper.fieldsetSelector)).toHaveFound(1);
  });

  it('Should return expected model after manipulate elements', async () => {
    // Arrange
    const { find, fixture, instance } = await shallow.render(
      '<confirmation-single [isShowConfirm]="true"></confirmation-single>'
    );
    fixture.detectChanges();
    
    const reason = find(Helper.reasonSelector);
    reason.nativeElement.value = 'reason';
    reason.triggerEventHandler('input', { target: reason.nativeElement });
    const reasonSC = find(Helper.reasonSCSelector);
    reasonSC.nativeElement.value = 'reasonSC';
    reasonSC.triggerEventHandler('input', { target: reasonSC.nativeElement });
    const password = find(Helper.passwordSelector);
    password.nativeElement.value = '1234aa';
    password.triggerEventHandler('input', { target: password.nativeElement });

    // Assert
    expect(instance.confirmation.reason).toBe('reason');
    expect(instance.confirmation.reasonSC).toBe('reasonSC');
    expect(instance.confirmation.userPassword).toBe('1234aa');
  });

  it('Should call #voidBet when click voidbet button', async() => {
    // Arrange
    const { find, fixture, instance } = await shallow.render(
      '<confirmation-single [isShowConfirm]="true"></confirmation-single>'
    );
    const spyVoidBet = jest.spyOn(instance, 'voidBet');
    fixture.detectChanges();
    const button = find(Helper.voidBetButtonSelector);
    button.triggerEventHandler('click', {});

    // Assert
    expect(spyVoidBet).toHaveBeenCalledTimes(1);
    expect(instance.voidEvent.emit).toHaveBeenCalledWith(true);
  });

  it('#checkValidation should return false and display tooltip', async () => {
    // Arrange
    const { instance } = await shallow.render(
      '<confirmation-single [isShowConfirm]="true"></confirmation-single>'
    );
    const testCases = [
      { reason: '', reasonSC: '', userPassword: '', title: 'reason',  message:  TEXT.INPUT_REASON },
      { reason: 'reason', reasonSC: '', userPassword: '', title: 'reasonSC', message:  TEXT.INPUT_REASON, },
      { reason: 'reason', reasonSC: 'reasonSC', userPassword: '', title: 'password', message:  TEXT.INPUT_PASSWORD, },
    ];
    instance.tooltip.display = jest.fn();
    
    // Action and Assert
    for (const item of testCases) {
      instance.confirmation.reason = item.reason;
      instance.confirmation.reasonSC = item.reasonSC;
      instance.confirmation.userPassword = item.userPassword;
      const actualResult = instance.checkValidation();
      expect(instance.tooltip.display).toHaveBeenCalledWith(item.title, item.message);
      expect(actualResult).toBe(false);
    }
  });

  it('#checkValidation should return true', async () => {
    // Arrange
    const { instance } = await shallow.render(
      '<confirmation-single [isShowConfirm]="true"></confirmation-single>'
    );
    instance.confirmation.reason = 'reason';
    instance.confirmation.reasonSC = 'reasonSC';
    instance.confirmation.userPassword = '1234aa';

    // Action
    const actualResult = instance.checkValidation();

    // Assert
    expect(actualResult).toBe(true);
  });

  it('#clearData should return empty confirmation model', async () => {
    // Arrange
    const { instance } = await shallow.render(
      '<confirmation-single [isShowConfirm]="true"></confirmation-single>'
    );
    instance.confirmation.reason = 'reason';
    instance.confirmation.reasonSC = 'reasonSC';
    instance.confirmation.userPassword = '1234aa';

    // Action
    instance.clearData();

    // Assert
    expect(instance.confirmation.reason).toBe('');
    expect(instance.confirmation.reasonSC).toBe('');
    expect(instance.confirmation.userPassword).toBe('');
  });
});