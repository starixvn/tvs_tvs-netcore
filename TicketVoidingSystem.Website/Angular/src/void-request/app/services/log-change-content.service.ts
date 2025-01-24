import { inject } from '@angular/core';
import { Message } from '../../../utility/components/template-message/messages/message';
import { VoidedReason } from '../../../utility/models/reason.model';
import { CommonService } from '../../../utility/services/common.service';
import { MessageAreaComponent } from '../message-area/message-area.component';

export class LogChangeContentService {
  commonService = inject(CommonService);

  async writeLog(requestId: number, messageAreaComponents: MessageAreaComponent[]): Promise<void> {
    messageAreaComponents.forEach(x => {
      if (x.reasonComponent.initialReason.reasonEnglish !== x.voidReason.reasonEnglish) {
        this.writeLogEditVoidReason(requestId, x.reasonComponent.initialReason, x.voidReason);
      }

      if (x.templateMessageComponent.initialMessage.contentEnglish !== x.templateMessageComponent.message.contentEnglish) {
        this.writeLogEditVoidMessage(requestId, x.templateMessageComponent.initialMessage, x.templateMessageComponent.message);
      }
    });
  }

  async writeLogEditVoidReason(requestId: number, oldValue: VoidedReason, newValue: VoidedReason): Promise<void> {
    if (oldValue.reasonEnglish !== newValue.reasonEnglish || oldValue.reasonChineseSimplified !== newValue.reasonChineseSimplified) {
      const logContent = JSON.stringify({
        RequestId: requestId,
        OldValue: oldValue,
        NewValue: newValue
      });
      await this.commonService.logChangeContent('Void Request - Change Reason', logContent);
    }
  }

  async writeLogEditVoidMessage(requestId: number, oldValue: Message, newValue: Message): Promise<void> {
    const logContent = JSON.stringify({
      RequestId: requestId,
      OldValue: oldValue,
      NewValue: newValue
    });

    await this.commonService.logChangeContent('Void Request - Change Message', logContent);
  }
}