import { Injectable } from '@angular/core';
import { AbnormalFilterBy, ActionVoidByIssueTypeConst, TVSRequestActionType } from '../../../../../utility/constants/config';

@Injectable({
  providedIn: 'root'
})
export class ActionVoidService {

  constructor(
  ) { }

  /* istanbul ignore next */
  public getActionVoidReducedOver(): number[] {
    return ActionVoidByIssueTypeConst.REDUCED_OVER;
  }

  /* istanbul ignore next */
  public getActionVoidWrongOdds(): number[] {
    return ActionVoidByIssueTypeConst.WRONG_ODDS;
  }

  /* istanbul ignore next */
  public getActionVoidDangerAccepted(): number[] {
    return ActionVoidByIssueTypeConst.DANGER_ACCEPTED;
  }

  /* istanbul ignore next */
  public getActionVoidWrongScore(): number[] {
    return ActionVoidByIssueTypeConst.WRONG_SCORE;
  }

  /* istanbul ignore next */
  public getActionVoidWrongHdp(): number[] {
    return ActionVoidByIssueTypeConst.WRONG_HDP;
  }

  /* istanbul ignore next */
  public getActionVoidWrong1stHdp(): number[] {
    return ActionVoidByIssueTypeConst.WRONG_1ST_HDP;
  }

  /* istanbul ignore next */
  public getActionVoidWrongOu(): number[] {
    return ActionVoidByIssueTypeConst.WRONG_OU;
  }

  /* istanbul ignore next */
  public getActionVoidWrong1stOu(): number[] {
    return ActionVoidByIssueTypeConst.WRONG_1ST_OU;
  }

  /* istanbul ignore next */
  public getActionVoidEarlyKickOff(): number[] {
    return ActionVoidByIssueTypeConst.EARLY_KICK_OFF;
  }

  /* istanbul ignore next */
  public getActionVoidWrongKickOff(): number[] {
    return ActionVoidByIssueTypeConst.WRONG_KICK_OFF;
  }

  /* istanbul ignore next */
  public getActionVoidRedCard(): number[] {
    return ActionVoidByIssueTypeConst.RED_CARD;
  }

  /* istanbul ignore next */
  public getActionVoidAbnormalAccount(): number[] {
    return ActionVoidByIssueTypeConst.ABNORMAL_ACCOUNT;
  }

  /* istanbul ignore next */
  public getActionVoidArchivedTicket(): number[] {
    return ActionVoidByIssueTypeConst.ARCHIVED_TICKET;
  }

  /* istanbul ignore next */
  public getActionVoidDuplicateTickets(isEdit: boolean, actionId: string): number[] {
    return isEdit && actionId === TVSRequestActionType.AUTO_VOID_INSTANT_ID.toString()
      ? ActionVoidByIssueTypeConst.DUPLICATE_TICKETS_AUTO_ADD_REQUEST
      : ActionVoidByIssueTypeConst.DUPLICATE_TICKETS_ADD_REQUEST;
  }

  /* istanbul ignore next */
  public getActionAbnormalBet(filterBy: number): number[] {
    return filterBy === AbnormalFilterBy.SINGLE
      ? ActionVoidByIssueTypeConst.ABNORMAL_BET_SINGLE
      : ActionVoidByIssueTypeConst.ABNORMAL_BET_MIX_OR_SYSTEM_PARLAY;
  }

  /* istanbul ignore next */
  public getActionVoidNotParticipate(): number[] {
    return ActionVoidByIssueTypeConst.NOT_PARTICIPATE;
  }

  /* istanbul ignore next */
  public getActionRecoverTicket(): number[] {
    return ActionVoidByIssueTypeConst.RECOVER_TICKET;
  }

  /* istanbul ignore next */
  public getActionVoidWrongMarketOffered(): number[] {
    return ActionVoidByIssueTypeConst.WRONG_MARKET_OFFERED;
  }

  /* istanbul ignore next */
  public getActionVoidTechnicalError(): number[] {
    return ActionVoidByIssueTypeConst.TECHNICAL_ERROR;
  }
}