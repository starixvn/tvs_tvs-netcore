import { Injectable } from '@angular/core';
import { TEXT } from '../../../../../utility/constants/text';
import { AddRequestService } from '../../add-request.service';
import { AddRequestQuery } from '../../models/add-request.query';
import { PopupService } from '../../services/popup.service';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { ValidationService } from './validation.service';

@Injectable({
  providedIn: 'root'
})
export class SaveRequestService {

  constructor(
    private readonly addRequestService: AddRequestService,
    private readonly validationService: ValidationService,
    private readonly popupService: PopupService
  ) { }

  async saveRequest(arg: SaveRequestArg): Promise<void> {
    arg.addRequestStore.changeSavingRequestStatus(true);
    const isDataValid = arg.filter.isVoided ? true : await this.recheckBeforeSaveRequest(arg);
    if (isDataValid) {
      this.proceedSaveRequest(arg);
    } else {
      arg.addRequestStore.changeSavingRequestStatus(false);
    }
  }

  private async recheckBeforeSaveRequest(arg: SaveRequestArg): Promise<boolean> {
    arg.addRequestStore.changeBlockingUiStatus(true);
    const result = await this.validationService.checkBusinessRule(arg.betIdsComponent, arg.recoverTicketModel, arg.filter, arg.requestId);
    arg.primitiveProps.transInfoJson = result.transInfoJson;
    arg.addRequestStore.changeBlockingUiStatus(false);

    return result.isValid;
  }

  private proceedSaveRequest(arg: SaveRequestArg) {
    this.popupService.showConfirm(
      this.getMessageConfirmation(),
      async () => {
        await this.onClickConfirmSave(arg);
      },
      () => {
        arg.addRequestStore.changeSavingRequestStatus(false);
      }
    );
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

  async executeSaveRequestApi(arg: SaveRequestArg): Promise<void> {
    arg.addRequestStore.changeBlockingUiStatus(true);
    const query = this.initAddRequestQuery(arg);
    await this.addRequestService.executeSaveRequest(arg.isEdit, arg.requestId, query, arg.addRequestStore);
    arg.addRequestStore.changeBlockingUiStatus(false);
  }

  private initAddRequestQuery(args: SaveRequestArg): AddRequestQuery {
    const query: AddRequestQuery = new AddRequestQuery();
    query.transInfoJson = args.primitiveProps.transInfoJson;
    query.issueTypeId = args.filter.issueTypeId;
    query.subIssueTypeId = args.filter.subIssueTypeId;
    query.actionId = args.filter.action;
    query.isTest = args.filter.isTest;
    query.isVoided = args.filter.isVoided;
    query.decidedBy = args.others.decidedBy;
    query.remark = args.others.remark;

    if (!args.filter.isVoided) {
      query.recoverTicketInfo = args.recoverTicketModel;
    }

    return query;
  }

  private getMessageConfirmation(): string {
    return 'Bet ticket(s) will be recovered and resettled immediately.'
    + `<div class='mg-top-10'><i class="fa fa-question-circle text-confirm"></i> ARE YOU SURE YOU WANT TO PROCESS WITH ABOVE INFO?</div>`;
  }
}