import { inject, Injectable } from '@angular/core';
import * as _ from 'lodash';
import { UsernamesComponent } from '../../../../../utility/components/user-names/user-names.component';
import { CheckboxType, TVSRequestActionType } from '../../../../../utility/constants/config';
import { TEXT } from '../../../../../utility/constants/text';
import { StaticService } from '../../../../../utility/services/static.service';
import { AddRequestService } from '../../add-request.service';
import { AbnormalAccountModel } from '../../models/abnormal-account.model';
import { AddRequestQuery } from '../../models/add-request.query';
import { PopupService } from '../../services/popup.service';
import { ConfirmAbnormalAccountComponent } from '../confirm-abnormal-account/confirm-abnormal-account.component';
import { ConfirmAbnormalAccountModel } from '../confirm-abnormal-account/confirm-abnormal-account.model';
import { AccountWinlostModel } from '../models/account-winlost.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { SaveRequestArg } from '../models/save-request.model';
import { ValidationBusinessRuleArgs } from '../models/validation.model';
import { ValidationService } from './validation.service';

@Injectable()
export class SaveRequestService {
  private readonly popupService = inject(PopupService);
  private readonly addRequestService = inject(AddRequestService);
  private readonly validationService = inject(ValidationService);

  async saveRequest(args: SaveRequestArg): Promise<void> {
    args.addRequestStore.changeBlockingUiStatus(true);
    args.isValidateFromConfirmPopup = false;
    this.cancelValidateUsernamesWhenFocusOut(args.primitiveProps, args.usernamesComponent);
    const isDataValid = args.filter.isVoided ? true : await this.recheckValidationBeforeSaveRequest(args);
    if (isDataValid) {
      this.showPopupConfirmSave(args);
    } else {
      args.addRequestStore.changeSavingRequestStatus(false);
    }
    args.addRequestStore.changeBlockingUiStatus(false);
  }

  async recheckValidationBeforeSaveRequest(args: SaveRequestArg) {
    args.addRequestStore.changeBlockingUiStatus(true);
    const validation = await this.validationService.checkBusinessRule(this.initValidationBusinessRuleArgs(args));
    args.primitiveProps.validAccountWinlostModels = this.getAccountWinlostWhenSaveRequest(args.primitiveProps.validAccountWinlostModels, validation.accountWinlostModels);
    args.primitiveProps.transInfoAddRequestModel = validation.transInfoAddRequestModel;
    args.primitiveProps.numberOfTicketsExistedInRequest = validation.numberOfTicketsExistedInRequest;
    args.primitiveProps.usernamesOfCreditCashService = validation.usernamesOfCreditCashService;
    args.addRequestStore.changeBlockingUiStatus(false);

    return validation.isValid;
  }

  async onClickConfirmSave(arg: SaveRequestArg) {
    // validate again for make sure
    arg.isValidateFromConfirmPopup = true;
    const isDataValidAgain = arg.filter.isVoided ? true : await this.recheckValidationBeforeSaveRequest(arg);
    arg.addRequestStore.changeBlockingUiStatus(true);
    if (isDataValidAgain) {
      await this.executeSaveRequestApi(arg);
    } else {
      this.popupService.showError(TEXT.INVALID_DATA_IN_REQUEST);
    }
    arg.addRequestStore.changeBlockingUiStatus(false);
  }

  private showPopupConfirmSave(arg: SaveRequestArg) {
    if (!arg.filter.isVoided) {
      arg.confirmAddRequest.isHasWarningTakenNote = StaticService.isHasWarningTakenNote(arg.filter.action, arg.actionIdOfFirstTimeAccess);
      arg.confirmAddRequest.isHasWarningAbnormalAccount = arg.primitiveProps.usernamesOfCreditCashService?.length > 0;
      arg.confirmAddRequest.usernamesOfCreditCashService = arg.primitiveProps.usernamesOfCreditCashService;
      arg.confirmAddRequest.allUsernames = arg.abnormalAccountModel.usernames;
      arg.confirmAddRequest.numberOfTicketsExistedInRequest = arg.primitiveProps.numberOfTicketsExistedInRequest;
    }
    arg.confirmAddRequest.issueTypeName = arg.issueTypes.issueTypes.find(x => x.issueTypeId.toString() === arg.filter.issueTypeId).issueTypeName;
    arg.confirmAddRequest.subIssueTypeName = arg.issueTypes.selectedSubIssueTypes.find(x => x.subIssueTypeId.toString() === arg.filter.subIssueTypeId).subIssueTypeName;
    arg.confirmAddRequest.actionName = TVSRequestActionType.NAME_MAPPING[arg.filter.action];
    arg.confirmAddRequest.isOpen = true;
    arg.confirmAddRequest.requestId = arg.requestId;
    arg.confirmAddRequest.requestedBy = arg.requestedBy;
    arg.confirmAddRequest.isEditingByAnotherUser = StaticService.isEditingByAnotherUser(arg.isEdit, arg.userId);
    arg.confirmAddRequest = _.clone(arg.confirmAddRequest);

  }

  private async executeSaveRequestApi(args: SaveRequestArg): Promise<void> {
    const query = this.initAddRequestQuery(args);
    await this.addRequestService.executeSaveRequest(args.isEdit, args.requestId, query, args.addRequestStore);
  }

  private initValidationBusinessRuleArgs(args: SaveRequestArg): ValidationBusinessRuleArgs {
    const model = new ValidationBusinessRuleArgs();
    model.actionId = args.filter.action;
    model.requestId = args.requestId;
    model.usernamesComponent = args.usernamesComponent;
    model.abnormalAccountModel = args.abnormalAccountModel;
    model.primitiveProps = args.primitiveProps;
    model.issueTypeId = args.filter.issueTypeId;
    model.productFilterComponent = args.productFilterComponent;
    model.eventDateFilterComponent = args.eventDateFilterComponent;
    model.confirmAbnormalAccountComponent = args.confirmAddRequestComponent;
    model.isValidateFromConfirmPopup = args.isValidateFromConfirmPopup;

    return model;
  }

  private initAddRequestQuery(model: SaveRequestArg): AddRequestQuery {
    const query: AddRequestQuery = new AddRequestQuery();
    query.transInfoJson = model.primitiveProps.transInfoAddRequestModel?.transInfoJson;
    query.unMarkTransIds = model.primitiveProps.transInfoAddRequestModel?.unMarkTransIds;
    query.markTransIds = model.primitiveProps.transInfoAddRequestModel?.markTransIds;
    query.issueTypeId = model.filter.issueTypeId;
    query.subIssueTypeId = model.filter.subIssueTypeId;
    query.actionId = model.filter.action;
    query.isTest = model.filter.isTest;
    query.isVoided = model.filter.isVoided;
    query.abnormalAccountInfo = this.createAbnormalAccountModel(model);
    query.decidedBy = model.others.decidedBy;
    query.remark = model.others.remark;

    return query;
  }

  private createAbnormalAccountModel(args: SaveRequestArg): AbnormalAccountModel {
    const model = _.clone(args.abnormalAccountModel);
    model.usernames = this.getUsernamesForSaveRequest(args.confirmAddRequest, args.abnormalAccountModel.usernames, args.confirmAddRequestComponent);
    return model;
  }

  private getUsernamesForSaveRequest(confirmModel: ConfirmAbnormalAccountModel, originalUsernames: string, confirmComponent: ConfirmAbnormalAccountComponent): string {
    let usernames = originalUsernames.split(',');
    if (confirmModel.usernamesOfCreditCashService && confirmComponent.model.checkboxState[CheckboxType.CREDIT_CASH_SERVICE]) {
      usernames = usernames.filter(x => !(confirmModel.usernamesOfCreditCashService).split(',').includes(x));
    }
    return usernames.join(',');
  }

  private cancelValidateUsernamesWhenFocusOut(primitiveProps: PrimitiveProperty, usernamesComponent: UsernamesComponent) {
    primitiveProps.isCancelValidate = true;
    usernamesComponent.triggerFocusOutUsernames();
  }

  private getAccountWinlostWhenSaveRequest(originalAccounts: AccountWinlostModel[], newAccounts: AccountWinlostModel[]) {
    if (originalAccounts?.length > 0) {
      const originalMap = new Map(originalAccounts.map(acc => [acc.custId, acc]));
      return newAccounts.map(account => {
        const originalAccount = originalMap.get(account.custId);
        if (originalAccount) {
          return {
            ...account,
            estimateVoidAmount: originalAccount.estimateVoidAmount,
            winLostAfterVoid: originalAccount.winLostAfterVoid,
          };
        }
        return account;
      });
    }

    return newAccounts;
  }
}