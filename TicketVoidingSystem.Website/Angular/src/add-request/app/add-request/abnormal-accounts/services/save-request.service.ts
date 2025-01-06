import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { TEXT } from 'src/utility/constants/text';
import { StaticService } from 'src/utility/services/static.service';
import { UsernamesComponent } from '../../../../../utility/components/user-names/user-names.component';
import { AddRequestService } from '../../add-request.service';
import { AddRequestQuery } from '../../models/add-request.query';
import { PopupService } from '../../services/popup.service';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { SaveRequestArg } from '../models/save-request.model';
import { ValidationBusinessRuleArgs } from '../models/validation.model';
import { AbnormalAccountService } from './abnormal-account.service';
import { ValidationService } from './validation.service';

@Injectable({
  providedIn: 'root'
})
export class SaveRequestService {
  constructor(
    private readonly popupService: PopupService,
    private readonly addRequestService: AddRequestService,
    private readonly validationService: ValidationService,
    private readonly abnormalAccountService: AbnormalAccountService
    ) { }

  async saveRequest(args: SaveRequestArg): Promise<void> {
    args.addRequestStore.changeBlockingUiStatus(true);
    this.cancelValidateUsernamesWhenFocusOut(args.primitiveProps, args.usernamesComponent);

    const isDataValid = args.filter.isVoided ? true : await this.recheckValidationBeforeSaveRequest(args);

    if (isDataValid) {
      this.showPopupConfirmSave(args);
    } else {
      args.addRequestStore.changeSavingRequestStatus(false);
    }
    args.addRequestStore.changeBlockingUiStatus(false);
  }



  // private async saveWhenRequestVoided(args: SaveRequestArg): Promise<void> {
  //   const isHasWarning = await this.checkIfRequestHasWarning(args, null);
  //   if (isHasWarning) {
  //     this.openConfirmAbnormalAccount(args);
  //   } else {
  //     await this.executeSaveRequestApi(args);
  //   }
  // }

  // private async saveWhenRequestNotVoided(args: SaveRequestArg): Promise<void> {
  //   if (!this.validationService.isValidCommonData(args.productFilterComponent, args.eventDateFilterComponent)) {
  //     return;
  //   }
  //   const validation = await this.validationService.checkBusinessRule(this.initValidationBusinessRuleArgs(args));
  //   args.primitiveProps.validAccountWinlostModels = validation.accountWinlostModels;
  //   args.primitiveProps.transInfoAddRequestModel = validation.transInfoAddRequestModel;
  //   if (!validation.isValid) {
  //     return;
  //   }
  //   const isHasWarning = await this.checkIfRequestHasWarning(args, validation);
  //   if (isHasWarning) {
  //     this.openConfirmAbnormalAccount(args);
  //   } else {
  //     await this.executeSaveRequestApi(args);
  //   }
  // }


  async recheckValidationBeforeSaveRequest(args: SaveRequestArg) {
    args.addRequestStore.changeBlockingUiStatus(true);
    const validation = await this.validationService.checkBusinessRule(this.initValidationBusinessRuleArgs(args));
    args.primitiveProps.validAccountWinlostModels = validation.accountWinlostModels;
    args.primitiveProps.transInfoAddRequestModel = validation.transInfoAddRequestModel;
    args.primitiveProps.numberOfTicketsExistedInRequest = validation.numberOfTicketsExistedInRequest;
    args.addRequestStore.changeBlockingUiStatus(false);

    return validation.isValid;
  }


  async onClickConfirmSave(arg: SaveRequestArg) {
    // validate again for make sure
    const isDataValidAgain = arg.filter.isVoided ? true : await this.recheckValidationBeforeSaveRequest(arg);
    arg.addRequestStore.changeBlockingUiStatus(true);
    if (isDataValidAgain) {
      await this.executeSaveRequestApi(arg);
    } else {
      this.popupService.showError(TEXT.INVALID_DATA_IN_REQUEST);
    }
    arg.addRequestStore.changeBlockingUiStatus(false);
  }

  // async onYesConfirmWarningModal(args: SaveRequestArg): Promise<void> {
  //   args.addRequestStore.changeBlockingUiStatus(true);
  //   const validation = await this.validationService.checkBusinessRule(this.initValidationBusinessRuleArgs(args));
  //   args.primitiveProps.validAccountWinlostModels = validation.accountWinlostModels;
  //   args.primitiveProps.transInfoAddRequestModel = validation.transInfoAddRequestModel;
  //   if (validation.isValid) {
  //     await this.executeSaveRequestApi(args);
  //   } else {
  //     this.popupService.showError('There are some invalid in this request, please check again!');
  //   }
  //   args.addRequestStore.changeBlockingUiStatus(false);
  // }

  private showPopupConfirmSave(arg: SaveRequestArg) {
    if (!arg.filter.isVoided) {
      arg.confirmAddRequest.isHasWarningTakenNote = StaticService.isHasWarningTakenNote(arg.filter.action, arg.actionIdOfFirstTimeAccess);
      arg.confirmAddRequest.extraWarningModel = this.abnormalAccountService.getExtraWarningModel(arg.primitiveProps.numberOfTicketsExistedInRequest);
      arg.confirmAddRequest.isHasWarningTakenNote
        = this.validationService.isHasWarningEditTakeNoteRequest(arg.isEdit, arg.filter.action, arg.actionIdOfFirstTimeAccess);
    }
    arg.confirmAddRequest.isOpen = true;
    arg.confirmAddRequest.requestId = arg.requestId;
    arg.confirmAddRequest.requestedBy = arg.requestedBy;
    arg.confirmAddRequest.isEditingByAnotherUser = StaticService.isEditingByAnotherUser(arg.isEdit, arg.userId);
    arg.confirmAddRequest = _.clone(arg.confirmAddRequest);
  }

  // private async checkIfRequestHasWarning(args: SaveRequestArg, validation: ValidationBusinessRuleOutput): Promise<boolean> {
  //   if (!args.filter.isVoided) {
  //     args.confirmAbnormalAccount.isAutoVoid = this.validationService.isAutoVoidAction(args.filter.action);
  //     args.confirmAbnormalAccount.isHasWarningTicketsExistedInRequest = validation.confirmAbnormalAccountModel.numberOfTicketsExistedInRequest > 0;
  //     args.confirmAbnormalAccount.numberOfTicketsExistedInRequest = validation.confirmAbnormalAccountModel.numberOfTicketsExistedInRequest;
  //     args.confirmAbnormalAccount.isHasWarningEditTakeNoteRequest
  //       = this.validationService.isHasWarningEditTakeNoteRequest(args.isEdit, args.filter.action, args.actionIdOfFirstTimeAccess);
  //   }
  //   args.confirmAbnormalAccount.isEditingByAnotherUser =
  //     this.validationService.isEditingByAnotherUser(args.isEdit, Number(document.getElementById('body').getAttribute('user-id')), args.userId);

  //   return args.confirmAbnormalAccount.isAutoVoid
  //     || args.confirmAbnormalAccount.isHasWarningTicketsExistedInRequest
  //     || args.confirmAbnormalAccount.isHasWarningEditTakeNoteRequest
  //     || args.confirmAbnormalAccount.isEditingByAnotherUser;
  // }

  // private openConfirmAbnormalAccount(args: SaveRequestArg) {
  //   args.confirmAbnormalAccount.requestId = args.requestId;
  //   args.confirmAbnormalAccount.requestedBy = args.requestedBy;
  //   args.confirmAbnormalAccount.isOpenDialog = true;
  // }

  private async executeSaveRequestApi(args: SaveRequestArg): Promise<void> {
    const query = this.initAddRequestQuery(args);
    await this.addRequestService.executeSaveRequest(args.isEdit, args.requestId, query, args.addRequestStore);
  }

  public initValidationBusinessRuleArgs(args: SaveRequestArg): ValidationBusinessRuleArgs {
    const model = new ValidationBusinessRuleArgs();
    model.actionId = args.filter.action;
    model.requestId = args.requestId;
    model.usernamesComponent = args.usernamesComponent;
    model.abnormalAccountModel = args.abnormalAccountModel;
    model.primitiveProps = args.primitiveProps;
    model.issueTypeId = args.filter.issueTypeId;
    model.productFilterComponent = args.productFilterComponent;
    model.eventDateFilterComponent = args.eventDateFilterComponent;

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
    query.abnormalAccountInfo = model.abnormalAccountModel;
    query.decidedBy = model.others.decidedBy;
    query.remark = model.others.remark;

    return query;
  }

  private cancelValidateUsernamesWhenFocusOut(primitiveProps: PrimitiveProperty, usernamesComponent: UsernamesComponent): void {
    primitiveProps.isCancelValidate = true;
    usernamesComponent.triggerFocusOutUsernames();
  }
}