import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChanges } from '@angular/core';
import { ConfirmAbnormalAccountComponent } from './confirm-abnormal-account.component';
import { CheckboxType, TVSRequestActionType } from '../../../../../../utility/constants/config';

describe('ConfirmAbnormalAccountComponent', () => {
  let component: ConfirmAbnormalAccountComponent;
  let fixture: ComponentFixture<ConfirmAbnormalAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmAbnormalAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmAbnormalAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should not call updateData when isOpen is false', () => {
      component['updateData'] = jest.fn();
      component['checkMarkTicketSiteDbDown'] = jest.fn();
      
      const changes: SimpleChanges = {
        isOpen: {
          currentValue: false,
          previousValue: true,
          firstChange: false,
          isFirstChange: () => false
        }
      };
      
      component.ngOnChanges(changes);
      
      expect(component['updateData']).not.toHaveBeenCalled();
      expect(component['checkMarkTicketSiteDbDown']).not.toHaveBeenCalled();
    });
  });

  describe('checkMarkTicketSiteDbDown', () => {
    it('should set isHasAffectedTicketSiteDBDown and isMarkTicketSiteDbDown to true when siteDBDownInfoJson has content and action is not TAKE_NOTE_ID', () => {
      component.siteDBDownInfoJson = 'some content';
      component.action = 'SOME_ACTION';
      
      component['checkMarkTicketSiteDbDown']();
      
      expect(component.model.isHasAffectedTicketSiteDBDown).toBe(true);
      expect(component.model.isMarkTicketSiteDbDown).toBe(true);
    });

    it('should set isHasAffectedTicketSiteDBDown and isMarkTicketSiteDbDown to false when siteDBDownInfoJson is empty', () => {
      component.siteDBDownInfoJson = '';
      component.action = 'SOME_ACTION';
      
      component['checkMarkTicketSiteDbDown']();
      
      expect(component.model.isHasAffectedTicketSiteDBDown).toBe(false);
      expect(component.model.isMarkTicketSiteDbDown).toBe(false);
    });

    it('should set isHasAffectedTicketSiteDBDown and isMarkTicketSiteDbDown to false when action is TAKE_NOTE_ID', () => {
      component.siteDBDownInfoJson = 'some content';
      component.action = TVSRequestActionType.TAKE_NOTE_ID.toString();
      
      component['checkMarkTicketSiteDbDown']();
      
      expect(component.model.isHasAffectedTicketSiteDBDown).toBe(false);
      expect(component.model.isMarkTicketSiteDbDown).toBe(false);
    });
  });

  describe('updateData', () => {
    it('should update usernamesOfCreditCashService and call updateRemoveUsernameStatus when isHasWarningAbnormalAccount is true', () => {
      component.model.isHasWarningAbnormalAccount = true;
      component.model.usernamesOfCreditCashService = 'user1,user2,user3';
      component['updateRemoveUsernameStatus'] = jest.fn();
      component['autoCheckAvailableCheckboxes'] = jest.fn();
      
      component['updateData']();
      
      expect(component.usernamesOfCreditCashService).toBe('user1, user2, user3');
      expect(component.model.checkboxes[CheckboxType.CREDIT_CASH_SERVICE]).toBe('user1,user2,user3');
      expect(component['updateRemoveUsernameStatus']).toHaveBeenCalled();
      expect(component['autoCheckAvailableCheckboxes']).toHaveBeenCalled();
    });

    it('should not update data when isHasWarningAbnormalAccount is false', () => {
      component.model.isHasWarningAbnormalAccount = false;
      component['updateRemoveUsernameStatus'] = jest.fn();
      component['autoCheckAvailableCheckboxes'] = jest.fn();
      
      component['updateData']();
      
      expect(component['updateRemoveUsernameStatus']).not.toHaveBeenCalled();
      expect(component['autoCheckAvailableCheckboxes']).not.toHaveBeenCalled();
    });
  });

  describe('onCheckboxToggle', () => {
    it('should toggle checkbox state and call updateRemoveUsernameStatus', () => {
      const key = CheckboxType.CREDIT_CASH_SERVICE;
      component.model.checkboxState[key] = false;
      component['updateRemoveUsernameStatus'] = jest.fn();
      
      component.onCheckboxToggle(key);
      
      expect(component.model.checkboxState[key]).toBe(true);
      expect(component['updateRemoveUsernameStatus']).toHaveBeenCalled();
    });
  });

  describe('onClickCancel', () => {
    it('should set isOpen to false and emit clickCancel event', () => {
      component.clickCancel.emit = jest.fn();
      
      component.onClickCancel();
      
      expect(component.model.isOpen).toBe(false);
      expect(component.clickCancel.emit).toHaveBeenCalled();
    });
  });

  describe('onClickOk', () => {
    it('should set isOpen to false and emit clickOk event', () => {
      component.clickOk.emit = jest.fn();
      
      component.onClickOk();
      
      expect(component.model.isOpen).toBe(false);
      expect(component.clickOk.emit).toHaveBeenCalled();
    });
  });

  describe('isOkButtonDisabled', () => {
    it('should return true when all usernames can be removed', () => {
      component.model.allUsernames = 'user1,user2,user3';
      component.model.checkboxState[CheckboxType.CREDIT_CASH_SERVICE] = true;
      component.model.checkboxes[CheckboxType.CREDIT_CASH_SERVICE] = 'user1,user2,user3';
      
      const result = component.isOkButtonDisabled();
      
      expect(result).toBe(true);
    });

    it('should return false when not all usernames can be removed', () => {
      component.model.allUsernames = 'user1,user2,user3,user4';
      component.model.checkboxState[CheckboxType.CREDIT_CASH_SERVICE] = true;
      component.model.checkboxes[CheckboxType.CREDIT_CASH_SERVICE] = 'user1,user2,user3';
      
      const result = component.isOkButtonDisabled();
      
      expect(result).toBe(false);
    });

    it('should return false when no checkboxes are checked', () => {
      component.model.allUsernames = 'user1,user2,user3';
      component.model.checkboxState[CheckboxType.CREDIT_CASH_SERVICE] = false;
      component.model.checkboxes[CheckboxType.CREDIT_CASH_SERVICE] = 'user1,user2,user3';
      
      const result = component.isOkButtonDisabled();
      
      expect(result).toBe(false);
    });
  });

  describe('updateRemoveUsernameStatus', () => {
    it('should set isShowErrorCannotRemoveAllTickets to true when all tickets can be removed', () => {
      component.model.allUsernames = 'user1,user2,user3';
      component.model.usernamesOfCreditCashService = 'user1,user2,user3';
      
      component['updateRemoveUsernameStatus']();
      
      expect(component.isShowErrorCannotRemoveAllTickets).toBe(true);
    });

    it('should set isShowErrorCannotRemoveAllTickets to false when not all tickets can be removed', () => {
      component.model.allUsernames = 'user1,user2,user3,user4';
      component.model.usernamesOfCreditCashService = 'user1,user2,user3';
      
      component['updateRemoveUsernameStatus']();
      
      expect(component.isShowErrorCannotRemoveAllTickets).toBe(false);
    });
  });

  describe('autoCheckAvailableCheckboxes', () => {
    it('should set all checkbox states to true', () => {
      component.model.checkboxes = {
        [CheckboxType.CREDIT_CASH_SERVICE]: 'user1,user2'
      };
      component.model.checkboxState = {
        [CheckboxType.CREDIT_CASH_SERVICE]: false
      };
      
      component['autoCheckAvailableCheckboxes']();
      
      expect(component.model.checkboxState[CheckboxType.CREDIT_CASH_SERVICE]).toBe(true);
    });
  });

  describe('isAllTicketsCanRemove', () => {
    it('should return true when all original tickets are in compare list', () => {
      const originalTransIds = ['user1', 'user2', 'user3'];
      const compareTransIds = ['user1', 'user2', 'user3'];
      
      const result = component['isAllTicketsCanRemove'](originalTransIds, compareTransIds);
      
      expect(result).toBe(true);
    });

    it('should return false when some original tickets are not in compare list', () => {
      const originalTransIds = ['user1', 'user2', 'user3', 'user4'];
      const compareTransIds = ['user1', 'user2', 'user3'];
      
      const result = component['isAllTicketsCanRemove'](originalTransIds, compareTransIds);
      
      expect(result).toBe(false);
    });

    it('should return true when original list is empty', () => {
      const originalTransIds: string[] = [];
      const compareTransIds = ['user1', 'user2'];
      
      const result = component['isAllTicketsCanRemove'](originalTransIds, compareTransIds);
      
      expect(result).toBe(true);
    });
  });
});
