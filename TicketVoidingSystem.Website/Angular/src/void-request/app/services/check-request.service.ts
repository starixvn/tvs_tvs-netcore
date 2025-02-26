import { Injectable, inject } from '@angular/core';
import { ModalType } from '../../../utility/components/modal/modal.model';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { AppService } from '../app.service';

@Injectable(
  { providedIn: 'root' }
)
export class CheckRequestService {
  appService = inject(AppService);
  modalService = inject(ModalService);
  async isRequestModified(requestId: number, currentModifiedDate: Date): Promise<boolean> {
    const lastModifiedDate = (await this.appService.getLastModifiedDate(requestId)).lastModifiedDate;

    if (currentModifiedDate !== lastModifiedDate) {
      this.showWarningPopupRequestModified();
      return true;
    }

    return false;
  }

  private showWarningPopupRequestModified(): void {
    this.modalService.open({
      title: 'Warning',
      message: 'The request was changed. You are about to back the page and check again.',
      type: ModalType.Warning
    }, () => { window.location.reload(); });
  }
}