import { inject, Injectable } from '@angular/core';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { TEXT } from '../../../../../utility/constants/text';
import { AddRequestService } from '../../add-request.service';
import { AddRequestQuery } from '../../models/add-request.query';
import { PopupService } from '../../services/popup.service';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { ValidationService } from './validation.service';

@Injectable()
export class SaveRequestService {
  private readonly addRequestApiService = inject(AddRequestService);
  private readonly popupService = inject(PopupService);
  private readonly validationService = inject(ValidationService);
  private readonly ORG_TRANS_ID_CLASS = 'org-transId';

  async saveRequest(arg: SaveRequestArg): Promise<void> {
    arg.addRequestStore.changeSavingRequestStatus(true);
    const isDataValid = arg.filter.isVoided || arg.filter.action === TVSRequestActionType.AUTO_VOID_INSTANT_ID.toString()
      ? true : await this.recheckBeforeSaveRequest(arg);
    if (isDataValid) {
      this.proceedSaveRequest(arg);
    } else {
      arg.addRequestStore.changeSavingRequestStatus(false);
    }
  }

  private async recheckBeforeSaveRequest(arg: SaveRequestArg): Promise<boolean> {
    arg.addRequestStore.changeBlockingUiStatus(true);
    const result = await this.checkValidBusinessRuleBeforeSave(arg);
    arg.addRequestStore.changeBlockingUiStatus(false);

    return result;
  }

  private async checkValidBusinessRuleBeforeSave(arg: SaveRequestArg): Promise<boolean> {
    if (!arg.duplicateTicketsModel.orgTransIds) {
      arg.tooltip.display(this.ORG_TRANS_ID_CLASS, TEXT.REQUIRED_FIELD)
      return false;
    }
    return this.validationService.checkValidBusinessRule(arg);
  }

  private proceedSaveRequest(arg: SaveRequestArg) {
    if (this.validationService.checkCanShowConfirmation(arg)) {
      this.popupService.showConfirm(
        this.getMessageConfirmation(arg),
        async () => {
          await this.onClickConfirmSave(arg);
        },
        () => {
          arg.addRequestStore.changeSavingRequestStatus(false);
        });
    } else {
      this.executeSaveRequestApi(arg);
    }
  }

  private async onClickConfirmSave(arg: SaveRequestArg) {
    // validate again for make sure
    const isDataValidAgain = arg.filter.isVoided ? true : await this.recheckBeforeSaveRequest(arg);
    if (isDataValidAgain) {
      await this.executeSaveRequestApi(arg);
    } else {
      this.popupService.showError(TEXT.INVALID_DATA_IN_REQUEST);
    }
  }

  private async executeSaveRequestApi(arg: SaveRequestArg): Promise<void> {
    arg.addRequestStore.changeBlockingUiStatus(true);
    const query = this.initAddRequestQuery(arg);
    await this.addRequestApiService.executeSaveRequest(arg.isEdit, arg.requestId, query, arg.addRequestStore);
    arg.addRequestStore.changeBlockingUiStatus(false);
  }

  private initAddRequestQuery(args: SaveRequestArg): AddRequestQuery {
    const query: AddRequestQuery = new AddRequestQuery();
    query.issueTypeId = args.filter.issueTypeId;
    query.unMarkTransIds = args.primitiveProps.transInfoAddRequestModel?.unMarkTransIds;
    query.markTransIds = args.primitiveProps.transInfoAddRequestModel?.markTransIds;
    query.removeTransIds = args.primitiveProps.transInfoAddRequestModel?.removeTransIds;
    query.actionId = args.filter.action;
    query.isTest = args.filter.isTest;
    query.isVoided = args.filter.isVoided;
    query.mistakenBy = this.validationService.isFilterMixParlay(args.duplicateTicketsModel.filterBy) ? null : args.others.mistakenBy;
    query.operatorsList = this.validationService.isFilterMixParlay(args.duplicateTicketsModel.filterBy) ? null : args.others.operatorsList;
    query.provider = this.validationService.isFilterMixParlay(args.duplicateTicketsModel.filterBy) ? null : args.others.provider;
    query.source = this.validationService.isFilterMixParlay(args.duplicateTicketsModel.filterBy) ? null : args.others.source;
    query.decidedBy = args.others.decidedBy;
    query.remark = args.others.remark;
    query.transInfoJson = args.primitiveProps.transInfoAddRequestModel?.transInfoJson;
    query.duplicateTicketsInfo = args.duplicateTicketsModel;

    return query;
  }

  private getMessageConfirmation(arg: SaveRequestArg): string {
    let message = '';

    if (arg.isEdit && arg.filter.action === TVSRequestActionType.TAKE_NOTE_ID.toString() && arg.filter.action !== arg.actionIdOfFirstTimeAccess) {
      message = `${message}<div>Ticket(s) on request will be unmarked.</div>`;
    }

    return `${message}<div class='mg-top-10'><i class="fa fa-question-circle text-confirm"></i> ARE YOU SURE YOU WANT TO PROCESS WITH ABOVE INFO?</div>`;
  }
}
