import { Injectable } from '@angular/core';
import { IssueTypeConstant } from 'src/utility/constants/issue-type.constant';
import { MessageAreaComponent } from 'src/void-request/app/message-area/message-area.component';
import { Message } from '../components/template-message/messages/message';
import { VoidedReason } from '../models/reason.model';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class LogAnalysisService {

  constructor(
    private readonly commonService: CommonService
  ) { }

  async writeLogAccessFunction(isEditRequestPage: boolean, issueTypeId: string, accessIssueTypeCount: Map<string, number>): Promise<void> {
    if (isEditRequestPage) {
      return;
    }

    let currentAccessCount = accessIssueTypeCount.get(issueTypeId) ?? 0;
    if (currentAccessCount === 0) {
      const isLogged = await this.commonService.logAccessFunction(`AddRequest/${IssueTypeConstant.NAME_WRITE_LOG.get(issueTypeId)}`);
      if (isLogged) {
        currentAccessCount++;
        accessIssueTypeCount.set(issueTypeId, currentAccessCount);
      }
    }
  }

  async writeLogVoidPage(requestId: number, messageAreaComponents: MessageAreaComponent[]): Promise<void> {
    messageAreaComponents.forEach(x => {
      if(x.reasonComponent.initialReason.reasonEnglish !== x.voidReason.reasonEnglish) {
        this.writeLogEditVoidReason(requestId, x.reasonComponent.initialReason, x.voidReason);
      }

      if(x.templateMessageComponent.initialMessage.contentEnglish !== x.templateMessageComponent.message.contentEnglish) {
        this.writeLogEditVoidMessage(requestId, x.templateMessageComponent.initialMessage, x.templateMessageComponent.message);
      }
    });
  }

  async writeLogEditVoidReason(requestId: number, oldValue: VoidedReason, newValue: VoidedReason): Promise<void> {
    if (oldValue.reasonEnglish !== newValue.reasonEnglish || oldValue.reasonChineseSimplified !== newValue.reasonChineseSimplified) {
      const logContent = JSON.stringify({
        RequestId: `${requestId}`,
        OldValue: JSON.stringify(oldValue),
        NewValue: JSON.stringify(newValue)
      });
      await this.commonService.logChangeContent('Void Request - Change Reason', logContent);
    }
  }

  async writeLogEditVoidMessage(requestId: number, oldValue: Message, newValue: Message): Promise<void> {
    const logContent = JSON.stringify({
      RequestId: `${requestId}`,
      OldValue: JSON.stringify(oldValue),
      NewValue: JSON.stringify(newValue)
    });

    await this.commonService.logChangeContent('Void Request - Change Message', logContent);
  }
}