import { inject, Injectable} from '@angular/core';
import { ModalType } from '../../../utility/components/modal/modal.model';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { TEXT } from '../../../utility/constants/text';
import { Result } from '../../../utility/models/result';

@Injectable(
  { providedIn: 'root' }
)
export class PopupService {
  modalService = inject(ModalService);

  showVoidBetConfirm(confirmMessage: string, onYesCallback: () => void) {
    this.modalService.confirm(
      {
        title: 'Void Bet Confirm',
        message: confirmMessage
      }, onYesCallback,
      () => { });
  }

  showWarningVoidBetPermission(message: string) {
    this.modalService.open({
      title: 'Warning!',
      message: message,
      type: ModalType.Warning
    }, () => window.location.reload());
  }

  showWarningExportExcel() {
    const header = 'Export Excel Result';
    const body = TEXT.EXPORT_LARGE_FILE;
    this.modalService.open({ title: header, message: body, type: ModalType.Warning });
  }

  showSubmitVoidRequestSuccess() {
    this.modalService.open({
      title: 'Confirmation Result ',
      message: TEXT.REQUEST_CONFIRMED_SUCCESSFULLY,
      type: ModalType.Alert
    }, () => { window.close(); });
  }

  showSubmitVoidRequestError(insertQueueResult: Result<null>) {
    this.modalService.open({
      title: 'Error',
      message: insertQueueResult.errorMsg,
      type: ModalType.Error
    }, () => {
      const WRONG_PASSWORD_CODE = 121;
      if (insertQueueResult.errorCode !== WRONG_PASSWORD_CODE) {
        window.close();
      }
    });
  }
}