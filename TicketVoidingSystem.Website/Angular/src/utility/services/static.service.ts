import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import moment, { Moment } from 'moment-timezone';
import { GetLogInfoModel, ValidationMessage } from '../../add-request/app/add-request/models/get-log-info.model';
import { RequestDetailViewModel } from '../../edit-request/app/request.model';
import { ModalType } from '../components/modal/modal.model';
import { ModalService } from '../components/modal/modal.service';
import { MultipleSelection } from '../components/multiple-selection/multiple-selection';
import { Tooltip } from '../components/tooltip/tooltip.model';
import { AbnormalFilterBy, DateTimeFormat, FunctionConst, SubIssueTypeGroup, TVSRequestActionType } from '../constants/config';
import { IssueTypeConstant } from '../constants/issue-type.constant';
import { LABELS } from '../constants/labels';
import { RegexConstant } from '../constants/regex';

export class StaticService {
  static isVoidAction(actionId: number): boolean {
    return actionId === TVSRequestActionType.MANUAL_VOID_ID
      || actionId === TVSRequestActionType.AUTO_VOID_WINNING_ID
      || actionId === TVSRequestActionType.AUTO_VOID_INSTANT_ID
      || actionId === TVSRequestActionType.AUTO_VOID_INSTANT_WITHOUT_POLICY
      || actionId === TVSRequestActionType.AUTO_VOID_INSTANT_WITH_POLICY_ID
      || actionId === TVSRequestActionType.AUTO_VOID_RESULT_KEYED_ID;
  }

  static isAbnormalBet(issueTypeId: string): boolean {
    return issueTypeId === IssueTypeConstant.ABNORMAL_BET;
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

  static isAbandoned(issueTypeId: string): boolean {
    return issueTypeId === IssueTypeConstant.ABANDONED;
  }

  static isDuplicateTickets(issueTypeId: string): boolean {
    return issueTypeId === IssueTypeConstant.DUPLICATE_TICKETS;
  }

  static isNotParticipate(issueTypeId: string): boolean {
    return issueTypeId === IssueTypeConstant.NOT_PARTICIPATE;
  }

  static isRecoverTicket(issueTypeId: string): boolean {
    return issueTypeId === IssueTypeConstant.RECOVER_TICKET;
  }

  static isLikelyWrongMarketOffered(issueTypeId: string): boolean {
    return issueTypeId === IssueTypeConstant.WRONG_MARKET_OFFERED || issueTypeId === IssueTypeConstant.TECHNICAL_ERROR;
  }

  static isWrongOddsSportsBook(issueTypeId: string): boolean {
    return issueTypeId === IssueTypeConstant.WRONG_ODDS_SPORTS_BOOK;
  }

  static isFilterByMixOrSystemParlay(filterBy: number): boolean {
    return filterBy === AbnormalFilterBy.MIX_PARLAY || filterBy === AbnormalFilterBy.SYSTEM_PARLAY;
  }

  static isFilterBySingle(filterBy: number): boolean {
    return filterBy === AbnormalFilterBy.SINGLE;
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
    } else if (this.isReducedOver(requestDetail.request.issueTypeId.toString()) || this.isAbandoned(requestDetail.request.issueTypeId.toString())) {
      return requestDetail.reducedOverModels[0].subIssueTypeId;
    } else if (this.isNotParticipate(requestDetail.request.issueTypeId.toString())) {
      return requestDetail.notParticipateModels[0].subIssueTypeId;
    } else if (this.isDuplicateTickets(requestDetail.request.issueTypeId.toString())) {
      return requestDetail.duplicateTicketsModel.subIssueTypeId;
    } else if (this.isEarlyKickOff(requestDetail.request.issueTypeId.toString()) || this.isWrongKickOff(requestDetail.request.issueTypeId.toString())) {
      return requestDetail.earlyKickOffModels.find(x => x.isMainMatch).subIssueTypeId;
    } else if (this.isAbnormalAccount(requestDetail.request.issueTypeId.toString())) {
      return requestDetail.abnormalAccountModel.subIssueTypeId;
    } else if (this.isRecoverTicket(requestDetail.request.issueTypeId.toString())) {
      return requestDetail.recoverTicketModel.subIssueTypeId;
    } else if (this.isAbnormalBet(requestDetail.request.issueTypeId.toString())) {
      return requestDetail.abnormalBetModel.subIssueTypeId;
    } else if (this.isLikelyWrongMarketOffered(requestDetail.request.issueTypeId.toString())) {
      return requestDetail.wrongMarketOfferedModel.subIssueTypeId;
    } else if (this.isWrongOddsSportsBook(requestDetail.request.issueTypeId.toString())) {
      return requestDetail.wrongOddsSportsBookModel.subIssueTypeId;
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
    } else if (this.isReducedOver(requestDetail.request.issueTypeId.toString()) || this.isAbandoned(requestDetail.request.issueTypeId.toString())) {
      return requestDetail.reducedOverModels[0].eventDate;
    } else if (this.isNotParticipate(requestDetail.request.issueTypeId.toString())) {
      return requestDetail.notParticipateModels[0].eventDate;
    } else if (this.isEarlyKickOff(requestDetail.request.issueTypeId.toString()) || this.isWrongKickOff(requestDetail.request.issueTypeId.toString())) {
      return requestDetail.earlyKickOffModels.find(x => x.isMainMatch).eventDate;
    } else if (
      this.isAbnormalAccount(requestDetail.request.issueTypeId.toString())
      || this.isRecoverTicket(requestDetail.request.issueTypeId.toString())
      || this.isDuplicateTickets(requestDetail.request.issueTypeId.toString())
      || this.isAbnormalBet(requestDetail.request.issueTypeId.toString())
      || this.isLikelyWrongMarketOffered(requestDetail.request.issueTypeId.toString())
      || this.isWrongOddsSportsBook(requestDetail.request.issueTypeId.toString())) {
      return null;
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
    return (cashOutCount > 0);
  }

  static isShowSettleCount(settleCount: number): boolean {
    return (settleCount > 0);
  }

  static isShowInstantlySettleIncluded(instantlySettleCount: number): boolean {
    return (instantlySettleCount > 0);
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
      issueTypeId === IssueTypeConstant.WRONG_SCORE ||
      issueTypeId === IssueTypeConstant.WRONG_MARKET_OFFERED ||
      issueTypeId === IssueTypeConstant.TECHNICAL_ERROR;
  }

  static isCorrectFormatMultipleDecimal(value: string, element: string, tooltip: Tooltip, errorText: string): boolean {
    if (!StaticService.isCorrectRegexMultipleDecimal(value)) {
      tooltip.display(element, errorText);
      return false;
    }
    tooltip.hide();

    return true;
  }

  static isCorrectFormatSingleDecimal(value: string, element: string, tooltip: Tooltip, errorText: string): boolean {
    if (!StaticService.isCorrectRegexSingleDecimal(value)) {
      tooltip.display(element, errorText);
      return false;
    }
    tooltip.hide();

    return true;
  }

  static isCorrectFormatOnlyNumber(value: string, element: string, tooltip: Tooltip, errorText: string): boolean {
    if (!StaticService.isCorrectRegexOnlyNumber(value)) {
      tooltip.display(element, errorText);
      return false;
    }
    tooltip.hide();

    return true;
  }

  static isCorrectRegexSingleDecimal(value: string): boolean {
    return RegexConstant.SINGLE_DECIMAL.test(value);
  }

  static isCorrectRegexMultipleDecimal(value: string): boolean {
    return RegexConstant.MULTIPLE_DECIMAL.test(value);
  }

  static isCorrectRegexOnlyNumber(value: string): boolean {
    return RegexConstant.ONLY_NUMBER.test(value);
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

  static openPopupTransIds(requestId: number, transIds: string, modalService: ModalService): void {
    modalService.open(
      {
        title: `List tickets existed in Request: ${requestId} (Click on the list to copy)`,
        type: ModalType.Alert,
        copyContent: true,
        content: [{ title: 'Tickets:', message: transIds }]
      });
  }

  static getValidationMessageList(logInfoModel: GetLogInfoModel, filterFromTime?: string, secondAcceptValue?: number): ValidationMessage[] {
    const messageList: ValidationMessage[] = [];
    if (logInfoModel.validation.isInvalidTotalTickets) {
      messageList.push({
        isError: true,
        reason: LABELS.NO_VALID_TICKETS_IN_RANGE
      });
    }

    if (logInfoModel.validation.isExistsSecondAccept) {
      const toDateTimeExist = new Date(filterFromTime);
      toDateTimeExist.setSeconds(Number(secondAcceptValue) + toDateTimeExist.getSeconds());
      const fromTime = `${moment(logInfoModel.logInfoDetail.highlightMinTime).format(DateTimeFormat.TIME_FORMAT)}`;
      const toTime = `${moment(toDateTimeExist).format(DateTimeFormat.TIME_FORMAT)}`;

      messageList.push({
        isError: false,
        reason: `Exist Second Accept ticket between ${fromTime} - ${toTime}`
      });
    }
    if (logInfoModel.validation.isExistedInOtherRequest) {
      logInfoModel.ticketRequest.forEach(request => {
        const transIds = request.transIds.split(",");
        const warningCreatedBy = request.createdBy ? ` - ${transIds.length} ticket(s) - By ${request.createdBy}` : '';
        const message: ValidationMessage = {
          isError: false,
          reason: `Tickets ${request.transIds} existed in Request: ${request.requestId}${warningCreatedBy}`
        };
        if (transIds.length > 8) {
          message.isShowPopup = true;
          message.reason = `Tickets ${transIds.slice(0, 8).join(",")},... existed in Request: ${request.requestId}${warningCreatedBy}`;
          message.requestId = request.requestId;
          message.transIds = request.transIds;
        }
        messageList.push(message);
      });
    }

    return messageList;
  }

  static initDefaultMultipleSelection(widthPx: string, numberItemsDisplay: number): MultipleSelection {
    const multipleSelection = new MultipleSelection();
    multipleSelection.checkAllCheckBoxText = 'All';
    multipleSelection.allItemsCheckedText = 'All';
    multipleSelection.noneItemCheckedText = 'Select options';
    multipleSelection.maxWidth = widthPx;
    multipleSelection.numberItemsDisplay = numberItemsDisplay;

    return multipleSelection;
  }

  static getDurations(fromTime: Moment, toTime: Moment): string {
    const MILLISECONDS_IN_A_MINUTE = 60000;
    const durations = toTime.diff(fromTime);
    const minutes = Math.floor(durations / MILLISECONDS_IN_A_MINUTE);
    const seconds = ((durations % MILLISECONDS_IN_A_MINUTE) / 1000).toFixed(0);

    return `${minutes}m${seconds}s`;
  }

  static isEditingByAnotherUser(isEdit: boolean, createdBy: number): boolean {
    const editingBy = Number(document.getElementById('body').getAttribute('user-id'));
    return isEdit && editingBy !== createdBy;
  }
  
  static isHasWarningTakenNote(currentAction: string, actionIdOfFirstTimeAccess: string): boolean {
    return currentAction === TVSRequestActionType.TAKE_NOTE_ID.toString() && currentAction !== actionIdOfFirstTimeAccess;
  }
}