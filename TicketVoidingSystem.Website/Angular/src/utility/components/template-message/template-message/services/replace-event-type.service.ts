import { Injectable } from '@angular/core';
import moment from 'moment';
import { EventType } from 'src/utility/constants/sport.constant';
import { Message } from '../../messages/message';
import { FormatDateTime,  SubIssueTypeId, TemplateContentConst, TemplateReplace } from '../template.const';
import { TemplateValue } from '../template.model';
import { ReplaceMessageService } from './replace-message.service';
import { IssueTypeConstant } from 'src/utility/constants/issue-type.constant';

@Injectable()
export class ReplaceEventTypeService {

  constructor(private readonly replaceMessageService: ReplaceMessageService) { }

  public execute(templateValue: TemplateValue, issueTypeId: number, subIssueTypeId: number, outputMessage: Message): void {
    if (templateValue.eventType === EventType.LIVE) {
      templateValue.isCheckedEarlyEvent = false;
      this.replaceMessageService.replaceEachLanguage(outputMessage, TemplateReplace.EVENT_TYPE, TemplateContentConst.LIVE);
      return;
    }

    if (templateValue.isCheckedEarlyEvent) {
      this.replaceMessageService.replaceEachLanguage(outputMessage, TemplateReplace.EVENT_TYPE, TemplateContentConst.EARLY);
      return;
    }

    if (this.isCanUpdateEventTypeToBlank(templateValue, issueTypeId, subIssueTypeId)) {
      this.replaceMessageService.replaceAll(outputMessage, TemplateReplace.EVENT_TYPE, '');
    } else {
      this.replaceMessageService.replaceEachLanguage(outputMessage, TemplateReplace.EVENT_TYPE, TemplateContentConst.EARLY);
    }
  }

  private isCanUpdateEventTypeToBlank(templateValue: TemplateValue, issueTypeId: number, subIssueTypeId: number): boolean {
    const issueTypes = [
      IssueTypeConstant.DANGER_ACCEPTED,
      IssueTypeConstant.WRONG_SCORE,
      IssueTypeConstant.RED_CARD,
      IssueTypeConstant.WRONG_MARKET_OFFERED,
      IssueTypeConstant.REDUCED_OVER,
      IssueTypeConstant.ABANDONED,
      IssueTypeConstant.MATCH_COMPLETED,
      IssueTypeConstant.NOT_PARTICIPATE,
      IssueTypeConstant.WRONG_QUARTER_HDP
    ];

    const subIssueTypeS = [
      SubIssueTypeId.GAME_CRASHED_VOID_LIVE,
      SubIssueTypeId.TECHNICAL_ERROR
    ];

    const isSpecialIssueType = issueTypes.includes(issueTypeId.toString()) || (issueTypeId.toString() === IssueTypeConstant.OTHER_ISSUES && subIssueTypeS.includes(subIssueTypeId));
    const isDateMismatched = templateValue.eventDate !== moment.utc().tz('America/Caracas').format(FormatDateTime.EVENT_DATE);

    if (isSpecialIssueType && isDateMismatched) {
      return false;
    }

    const issueTypesHasCheckBoxEarlyEvent = [
      IssueTypeConstant.WRONG_ODDS,
      IssueTypeConstant.WRONG_HDP,
      IssueTypeConstant.WRONG_1ST_HDP,
      IssueTypeConstant.WRONG_OU,
      IssueTypeConstant.WRONG_1ST_OU
    ];

    const isCheckedEarlyEvent = issueTypesHasCheckBoxEarlyEvent.includes(issueTypeId.toString()) && templateValue.isCheckedEarlyEvent;

    return !isCheckedEarlyEvent;
  }
}