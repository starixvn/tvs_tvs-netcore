import { Injectable } from '@angular/core';
import { ModalType } from '../../../utility/components/modal/modal.model';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { TemplateMessageComponent } from '../../../utility/components/template-message/template-message/template-message.component';
import { LABELS } from '../../../utility/constants/labels';
import { TEXT } from '../../../utility/constants/text';
import { Result } from '../../../utility/models/result';
import { VoidPageCommonItem } from '../models/void-page-common-item.model';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  constructor(private readonly modalService: ModalService) { }

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
    const body = LABELS.EXPORT_LARGE_FILE;
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

  private getWarningInTemplateMessage(voidPageCommonItems: VoidPageCommonItem[], templateMessageComponents: TemplateMessageComponent[]): string {
    const matchesHaveWarning = this.getMatchesHaveWarning(voidPageCommonItems, templateMessageComponents);

    if (matchesHaveWarning.length > 0) {
      const matchIdList = `- Match Id: ${matchesHaveWarning.join(', ')}`;
      const warningMessage = `<div><i class="fa fa-exclamation-triangle pt-2 text-warn"></i>There are some message info you do not input in these matches:</div>
                                  <div>${matchIdList}</div></br>`;

      return warningMessage;
    }

    return '';
  }

  private getMatchesHaveWarning(voidPageCommonItems: VoidPageCommonItem[], templateMessageComponents: TemplateMessageComponent[]): number[] {
    const matchHasWarning = voidPageCommonItems.filter(voidPageCommonItem =>
      templateMessageComponents.find(x => x.value.matchId === voidPageCommonItem.matchModel.matchId).isHasWarningForDynamicInput());

    return matchHasWarning.map(x => x.matchModel.matchId);
  }
}