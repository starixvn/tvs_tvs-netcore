import { Injectable } from '@angular/core';
import { UsernamesComponent } from '../../../../../utility/components/user-names/user-names.component';
import { AddRequestService } from '../../add-request.service';
import { AddRequestQuery } from '../../models/add-request.query';
import { PopupService } from '../../services/popup.service';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { SaveRequestArg } from '../models/save-request.model';
import { ValidationBusinessRuleArgs, ValidationBusinessRuleOutput } from '../models/validation.model';
import { ValidationService } from './validation.service';

@Injectable({
  providedIn: 'root'
})
export class SaveRequestService {
  constructor(
    private readonly popupService: PopupService,
    private readonly addRequestService: AddRequestService,
    private readonly validationService: ValidationService
    ) { }
  
  async saveRequest(args: SaveRequestArg): Promise<void> {
    args.addRequestStore.changeSavingRequestStatus(true);
    args.addRequestStore.changeBlockingUiStatus(true);
    this.cancelValidateUsernamesWhenFocusOut(args.primitiveProps, args.usernamesComponent);
    if (args.filter.isVoided) {
      await this.saveWhenRequestVoided(args);
    } else {
      await this.saveWhenRequestNotVoided(args);
    }
    args.addRequestStore.changeBlockingUiStatus(false);
    args.addRequestStore.changeSavingRequestStatus(false);
  }

  private async saveWhenRequestVoided(args: SaveRequestArg): Promise<void> {
    const isHasWarning = await this.checkIfRequestHasWarning(args, null);
    if (isHasWarning) {
      this.openConfirmAbnormalAccount(args);
    } else {
      await this.executeApiSaveRequest(args);
    }
  }

  private async saveWhenRequestNotVoided(args: SaveRequestArg): Promise<void> {
    if (!this.validationService.isValidCommonData(args.productFilterComponent, args.eventDateFilterComponent)) {
      return;
    }
    const validation = await this.validationService.checkValidUsernames(this.initValidationBusinessRuleArgs(args));
    if (!validation.isValid) {
      return;
    }
    args.primitiveProps.transInfoAddRequestModel = validation.transInfoAddRequestModel;
    const isHasWarning = await this.checkIfRequestHasWarning(args, validation);
    if (isHasWarning) {
      this.openConfirmAbnormalAccount(args);
    } else {
      await this.executeApiSaveRequest(args);
    }
  }

  async onYesConfirmWarningModal(args: SaveRequestArg): Promise<void> {
    args.addRequestStore.changeBlockingUiStatus(true);
    const validation = await this.validationService.checkValidUsernames(this.initValidationBusinessRuleArgs(args));
    if (validation.isValid) {
      args.primitiveProps.transInfoAddRequestModel = validation.transInfoAddRequestModel;
      await this.executeApiSaveRequest(args);
    } else {
      this.popupService.showError('There are some invalid Bet ID(s) in this request, please check again!');
    }
    args.addRequestStore.changeBlockingUiStatus(false);
  }
  
  private async checkIfRequestHasWarning(args: SaveRequestArg, validation: ValidationBusinessRuleOutput): Promise<boolean> {
    if (!args.filter.isVoided) {
      args.confirmAbnormalAccount.isHasWarningTicketsExistedInRequest = validation.confirmAbnormalAccountModel.numberOfTicketsExistedInRequest > 0;
      args.confirmAbnormalAccount.numberOfTicketsExistedInRequest = validation.confirmAbnormalAccountModel.numberOfTicketsExistedInRequest;
      args.confirmAbnormalAccount.isHasWarningEditTakeNoteRequest
        = this.validationService.isHasWarningEditTakeNoteRequest(args.isEdit, args.filter.action, args.actionIdOfFirstTimeAccess);
    }
    args.confirmAbnormalAccount.isEditingByAnotherUser =
      this.validationService.isEditingByAnotherUser(args.isEdit, Number(document.getElementById('body').getAttribute('user-id')), args.userId);

    return args.confirmAbnormalAccount.isHasWarningTicketsExistedInRequest
      || args.confirmAbnormalAccount.isHasWarningEditTakeNoteRequest
      || args.confirmAbnormalAccount.isEditingByAnotherUser;
  }
  
  private openConfirmAbnormalAccount(args: SaveRequestArg) {
    args.confirmAbnormalAccount.requestId = args.requestId;
    args.confirmAbnormalAccount.requestedBy = args.requestedBy;
    args.confirmAbnormalAccount.isOpenDialog = true;
  }

  private async executeApiSaveRequest(args: SaveRequestArg): Promise<void> {
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

    return model;
  }

  private initAddRequestQuery(model: SaveRequestArg): AddRequestQuery {
    model.abnormalAccountModel.usernames = model.usernamesComponent.groupUsername.getAllValue();    
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