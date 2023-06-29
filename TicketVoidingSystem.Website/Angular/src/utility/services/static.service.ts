import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment-timezone';
import { RequestDetailViewModel } from '../../add-request/app/add-request/models/request.model';
import { Tooltip } from '../components/tooltip/tooltip.model';
import { DateTimeFormat, FunctionConst, SubIssueTypeGroup, TVSRequestActionType } from '../constants/config';
import { IssueTypeConstant } from '../constants/issue-type.constant';
import { LABELS } from '../constants/labels';
import { RegexConstant } from '../constants/regex';

export class StaticService {
  static isVoidAction(actionId: number): boolean {
    return actionId === TVSRequestActionType.MANUAL_VOID_ID
      || actionId === TVSRequestActionType.AUTO_VOID_WINNING_ID
      || actionId === TVSRequestActionType.AUTO_VOID_INSTANT_ID
      || actionId === TVSRequestActionType.AUTO_VOID_5M_BEFORE_KO_ID
      || actionId === TVSRequestActionType.AUTO_VOID_10M_BEFORE_KO_ID
      || actionId === TVSRequestActionType.AUTO_VOID_INSTANT_WITHOUT_POLICY;
  }

  static isAbnormalBet(issueTypeId: string): boolean {
    return issueTypeId === IssueTypeConstant.ABNORMAL_BET;
  }

  static isAbnormalBetRealMember(issueTypeId: string): boolean {
    return issueTypeId === IssueTypeConstant.ABNORMAL_BET_REAL_MEMBER;
  }

  static isDangerAccepted(issueTypeId: string): boolean {
    return issueTypeId === IssueTypeConstant.DANGER_ACCEPTED;
  }

  static isRedCard(issueTypeId: string): boolean {
    return issueTypeId === IssueTypeConstant.RED_CARD;
  }

  static isWrongScore(issueTypeId: string): boolean {
    return issueTypeId === IssueTypeConstant.WRONG_SCORE;
  }

  static isAbnormalAccount(issueTypeId: string): boolean {
    return issueTypeId === IssueTypeConstant.ABNORMAL_ACCOUNT;
  }

  static isEarlyKickOff(issueTypeId: string): boolean {
    return issueTypeId === IssueTypeConstant.EARLY_KICK_OFF;
  }

  static isWrongKickOff(issueTypeId: string): boolean {
    return issueTypeId === IssueTypeConstant.WRONG_KICK_OFF;
  }

  static isWrongOdds(issueTypeId: string): boolean {
    return issueTypeId === IssueTypeConstant.WRONG_ODDS;
  }

  static isWrongHDP(issueTypeId: string): boolean {
    return issueTypeId === IssueTypeConstant.WRONG_HDP;
  }

  static isWrong1stHDP(issueTypeId: string): boolean {
    return issueTypeId === IssueTypeConstant.WRONG_1ST_HDP;
  }

  static isWrongQuarterHDP(issueTypeId: string): boolean {
    return issueTypeId === IssueTypeConstant.WRONG_QUARTER_HDP;
  }

  static isWrongOU(issueTypeId: string): boolean {
    return issueTypeId === IssueTypeConstant.WRONG_OU;
  }

  static isWrong1stOU(issueTypeId: string): boolean {
    return issueTypeId === IssueTypeConstant.WRONG_1ST_OU;
  }

  static isArchivedTicket(issueTypeId: string): boolean {
    return issueTypeId === IssueTypeConstant.ARCHIVED_TICKET;
  }

  static isOtherIssues(issueTypeId: string): boolean {
    return issueTypeId === IssueTypeConstant.OTHER_ISSUES;
  }

  static isReducedOver(issueTypeId: string): boolean {
    return issueTypeId === IssueTypeConstant.REDUCED_OVER;
  }

  static convertToFullDate(ngbDate: NgbDate): string {
    const transformMonth = `0${ngbDate.month}`.slice(-2);
    const transformDay = `0${ngbDate.day}`.slice(-2);

    return `${ngbDate.year}/${transformMonth}/${transformDay}`;
  }

  static getSubIssueTypeId(requestDetail: RequestDetailViewModel): number {
    if (this.isWrongScore(requestDetail.request.issueTypeId.toString())) {
      return requestDetail.wrongScoreModels[0].subIssueTypeId;
    } else if (this.isDangerAccepted(requestDetail.request.issueTypeId.toString())) {
      return requestDetail.dangerAcceptedModels.find(x => x.isMainMatch).subIssueTypeId;
    } else if (this.isRedCard(requestDetail.request.issueTypeId.toString())) {
      return requestDetail.redCardModels.find(x => x.isMainMatch).subIssueTypeId;
    } else if (this.isWrongHDP(requestDetail.request.issueTypeId.toString()) || this.isWrong1stHDP(requestDetail.request.issueTypeId.toString())) {
      return requestDetail.wrongHdpModels.find(x => x.isMainMatch).subIssueTypeId;
    } else if (this.isWrongOU(requestDetail.request.issueTypeId.toString()) || this.isWrong1stOU(requestDetail.request.issueTypeId.toString())) {
      return requestDetail.wrongOuModels.find(x => x.isMainMatch).subIssueTypeId;
    } else if (this.isWrongOdds(requestDetail.request.issueTypeId.toString())) {
      return requestDetail.wrongOddsModels[0].subIssueTypeId;
    } else if (this.isReducedOver(requestDetail.request.issueTypeId.toString())) {
      return requestDetail.reducedOverModels[0].subIssueTypeId;
    } else {
      return requestDetail.event.subIssueTypeId;
    }
  }

  static getEventDate(requestDetail: RequestDetailViewModel): Date {
    if (this.isWrongScore(requestDetail.request.issueTypeId.toString())) {
      return requestDetail.wrongScoreModels[0].eventDate;
    } else if (this.isDangerAccepted(requestDetail.request.issueTypeId.toString())) {
      return requestDetail.dangerAcceptedModels.find(x => x.isMainMatch).eventDate;
    } else if (this.isRedCard(requestDetail.request.issueTypeId.toString())) {
      return requestDetail.redCardModels.find(x => x.isMainMatch).eventDate;
    } else if (this.isWrongHDP(requestDetail.request.issueTypeId.toString()) || this.isWrong1stHDP(requestDetail.request.issueTypeId.toString())) {
      return requestDetail.wrongHdpModels.find(x => x.isMainMatch).eventDate;
    } else if (this.isWrongOU(requestDetail.request.issueTypeId.toString()) || this.isWrong1stOU(requestDetail.request.issueTypeId.toString())) {
      return requestDetail.wrongOuModels.find(x => x.isMainMatch).eventDate;
    } else if (this.isWrongOdds(requestDetail.request.issueTypeId.toString())) {
      return requestDetail.wrongOddsModels[0].eventDate;
    } else {
      return requestDetail.event.eventDate;
    }
  }

  static checkHandlingCashOutAsUnSettledTicketByFunction(functionId: number): boolean {
    return functionId === FunctionConst.SINGLE;
  }

  static checkHandlingCashOutAsUnSettledTicketByIssueTypeId(issueTypeId: string): boolean {
    return issueTypeId === IssueTypeConstant.DANGER_ACCEPTED ||
      issueTypeId === IssueTypeConstant.RED_CARD ||
      issueTypeId === IssueTypeConstant.WRONG_SCORE ||
      issueTypeId === IssueTypeConstant.EARLY_KICK_OFF ||
      issueTypeId === IssueTypeConstant.WRONG_KICK_OFF;
  }

  static isShowCountInfo(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return this.isShowCashOutCount(cashOutCount) || this.isShowSettleCount(settleCount)
      || this.isShowInstantlySettleIncluded(instantlySettleCount);
  }

  static isShowCashOutCount(cashOutCount: number): boolean {
    return (cashOutCount > 0) ? true : false;
  }

  static isShowSettleCount(settleCount: number): boolean {
    return (settleCount > 0) ? true : false;
  }

  static isShowInstantlySettleIncluded(instantlySettleCount: number): boolean {
    return (instantlySettleCount > 0) ? true : false;
  }

  static countInfoContent(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    const info: string[] = [];
    if (this.isShowCashOutCount(cashOutCount)) {
      info.push(`Cash Out: <strong>${cashOutCount}</strong>`);
    }

    if (this.isShowSettleCount(settleCount)) {
      info.push(`Settled: <strong>${settleCount}</strong>`);
    }

    if (this.isShowInstantlySettleIncluded(instantlySettleCount)) {
      info.push(`Instantly Settled: <strong>${instantlySettleCount}</strong>`);
    }

    return ` (${info.join(', ')})`;
  }

  static isCorrectFormatMultipleDecimal(value: string): boolean {
    return RegexConstant.MULTIPLE_DECIMAL.test(value);
  }

  static isFromTimeSameOrBeforeToTime(fromDateTime: string, toDateTime: string, tooltip: Tooltip, fromDateTimeClass: string): boolean {
    const momentFromDateTime = moment(fromDateTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
    const momentToDateTime = moment(toDateTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
    if (!momentFromDateTime.isSameOrBefore(momentToDateTime)) {
      tooltip.display(fromDateTimeClass, LABELS.FROM_TIME_MUST_SMALLER_THAN_TO_TIME);
      return false;
    }

    return true;
  }

  static isShowVarCheck(subIssueTypeId: number) {
    return subIssueTypeId && SubIssueTypeGroup.SUBTYPE_VAR.includes(subIssueTypeId);
  }

  static isHaveCancelCashOutTicket(issueTypeId: string): boolean {
    return issueTypeId === IssueTypeConstant.DANGER_ACCEPTED ||
      issueTypeId === IssueTypeConstant.RED_CARD ||
      issueTypeId === IssueTypeConstant.WRONG_SCORE;
  }

  static isStringHasLength(value: string): boolean {
    return value && value.length > 0;
  }

  static convertStringToBetId8xxx(text: string): string {
    if (!this.isStringHasLength(text)) {
      return null;
    }

    const LENGTH_OF_OVER = 3;
    const PREFIX = '8';
    let value = text;
    if (value.length < LENGTH_OF_OVER && value.length > 0) {
      value = value.padStart(LENGTH_OF_OVER, '0');
    }

    return `${PREFIX}${value}`;
  }
}