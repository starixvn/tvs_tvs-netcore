import { Injectable } from '@angular/core';
import { ModalType } from '../../../../utility/components/modal/modal.model';
import { ModalService } from '../../../../utility/components/modal/modal.service';
import { LABELS } from '../../../../utility/constants/labels';
import { Result } from '../../../../utility/models/result';
import { StaticService } from '../../../../utility/services/static.service';
import { AddRequestQuery } from '../models/add-request.query';
import { AddRequestResultModel } from '../models/request.model';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  constructor(private readonly modalService: ModalService) { }

  showError(messageContent: string, onYesCallback?: () => void) {
    this.modalService.open(
      {
        title: LABELS.ADD_REQUEST_RESULT_TITLE,
        message: `Error: ${messageContent}`,
        type: ModalType.Error
      },
      onYesCallback
    );
  }



  showAddedRequestSuccessful(query: AddRequestQuery, addRequestResult: AddRequestResultModel, onOkCallback: () => void) {
    const matchIdsContent = this.getMatchIdsContent(query, addRequestResult);
    const markTicketsContent = this.getMarkTicketsContent(query, addRequestResult);

    this.modalService.open(
      {
        title: LABELS.ADD_REQUEST_RESULT_TITLE,
        message: `<div>Request No.<strong>${addRequestResult.requestId}</strong> added successfully!</div>${matchIdsContent}${markTicketsContent}`,
        type: ModalType.Alert
      },
      onOkCallback
    );
  }

  showEditedRequestSuccessful(query: AddRequestQuery, addRequestResult: AddRequestResultModel, onOkCallback: () => void) {
    const markTicketsContent = this.getMarkTicketsContent(query, addRequestResult);

    this.modalService.open(
      {
        title: LABELS.EDIT_REQUEST_RESULT_TITLE,
        message: `Request No.<strong>${addRequestResult.requestId}</strong> edited successfully!${markTicketsContent}`,
        type: ModalType.Alert
      },
      onOkCallback
    );
  }

  showSaveRequestError(query: AddRequestQuery, addResult: Result<AddRequestResultModel>, titleMessage: string) {
    const markTicketsContent = this.getMarkTicketsContent(query, addResult.data);
    
    this.modalService.open(
      {
        title: titleMessage,
        message: `Error: ${addResult.errorMsg}${markTicketsContent}`,
        type: ModalType.Error
      },
      () => { }
    );
  }

  showConfirm(messageContent: string, onYesCallback?: () => void, onNoCallback?: () => void) {
    this.modalService.confirm(
      {
        title: 'Confirm',
        message: messageContent,
        type: ModalType.Confirm
      },
      onYesCallback,
      onNoCallback
    );
  }

  showPermissionError(errorMessage: string) {
    this.modalService.open(
      {
        title: 'Permission',
        message: errorMessage,
        type: ModalType.Error
      },
      () => { }
    );
  }

  private getMatchIdsContent(query: AddRequestQuery, addRequestResult: AddRequestResultModel): string {
    const isShowResultWithoutMatches =
      StaticService.isAbnormalAccount(query.issueTypeId)
      || StaticService.isArchivedTicket(query.issueTypeId)
      || StaticService.isRecoverTicket(query.issueTypeId);

    if (isShowResultWithoutMatches) {
      return '';
    }

    return `<div class="ml-2 mt-1">- Match(es): <strong>${addRequestResult.matchId}</strong></div>`;
  }

  private getMarkTicketsContent(query: AddRequestQuery, addRequestResult: AddRequestResultModel): string {
    const totalTicketsMarked = addRequestResult.markedTicketsSuccessful.length;
    if (StaticService.isAbnormalBet(query.issueTypeId) && totalTicketsMarked) {
      const totalTicketsInputted = query.abnormalBetInfo.transIds.split(',').length;
      return `<div>Marked Ticket(s): <strong>${totalTicketsMarked}/${totalTicketsInputted}</strong></div>`;
    }

    return '';
  }
}