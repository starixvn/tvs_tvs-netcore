import { Injectable } from '@angular/core';
import { ModalType } from '../../../../utility/components/modal/modal.model';
import { ModalService } from '../../../../utility/components/modal/modal.service';
import { LABELS } from '../../../../utility/constants/labels';

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

  showAddedRequestSuccessful(requestId: number, onOkCallback: () => void) {
    this.modalService.open(
      {
        title: LABELS.ADD_REQUEST_RESULT_TITLE,
        message: `<div>Request No.<strong>${requestId}</strong> added successfully!</div>`,
        type: ModalType.Alert
      },
      onOkCallback
    );
  }

  showAddedRequestSuccessfulWithMatches(requestId: number, matchIds: string, onOkCallback: () => void) {
    const matchIdsHtml = `<div class="ml-2 mt-1">- Match(es): <strong>${matchIds}</strong></div>`;
    this.modalService.open(
      {
        title: LABELS.ADD_REQUEST_RESULT_TITLE,
        message: `<div>Request No.<strong>${requestId}</strong> added successfully!</div>${matchIdsHtml}`,
        type: ModalType.Alert
      },
      onOkCallback
    );
  }
  
  showEditedRequestSuccessful(requestId: number, onOkCallback: () => void) {
    this.modalService.open(
      {
        title: LABELS.EDIT_REQUEST_RESULT_TITLE,
        message: `Request No.<strong>${requestId}</strong> edited successfully!`,
        type: ModalType.Alert
      },
      onOkCallback
    );
  }
  
  showSaveRequestError(errorMessage: string, titleMessage: string) {
    this.modalService.open(
      {
        title: titleMessage,
        message: `Error: ${errorMessage}`,
        type: ModalType.Error
      },
      () => { }
    );
  }

  showConfirm(messageContent: string,  onYesCallback?: () => void, onNoCallback?: () => void) {
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
}