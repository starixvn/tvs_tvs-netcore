import { Injectable } from '@angular/core';
import { AbnormalFilterBy, ActionVoidByIssueTypeConst, TVSRequestActionType } from '../../../../../utility/constants/config';

@Injectable({
  providedIn: 'root'
})
export class ActionVoidService {

  constructor(
  ) { }


  public getActionVoidReducedOver(): number[] {
    return ActionVoidByIssueTypeConst.REDUCED_OVER;
  }

  public getActionVoidWrongOdds(): number[] {
    return ActionVoidByIssueTypeConst.WRONG_ODDS;
  }

  public getActionVoidDangerAccepted(): number[] {
    return ActionVoidByIssueTypeConst.DANGER_ACCEPTED;
  }

  public getActionVoidWrongScore(): number[] {
    return ActionVoidByIssueTypeConst.WRONG_SCORE;
  }

  public getActionVoidWrongHdp(): number[] {
    return ActionVoidByIssueTypeConst.WRONG_HDP;
  }

  public getActionVoidWrong1stHdp(): number[] {
    return ActionVoidByIssueTypeConst.WRONG_1ST_HDP;
  }

  public getActionVoidWrongOu(): number[] {
    return ActionVoidByIssueTypeConst.WRONG_OU;
  }

  public getActionVoidWrong1stOu(): number[] {
    return ActionVoidByIssueTypeConst.WRONG_1ST_OU;
  }

  public getActionVoidEarlyKickOff(): number[] {
    return ActionVoidByIssueTypeConst.EARLY_KICK_OFF;
  }

  public getActionVoidWrongKickOff(): number[] {
    return ActionVoidByIssueTypeConst.WRONG_KICK_OFF;
  }

  public getActionVoidRedCard(): number[] {
    return ActionVoidByIssueTypeConst.RED_CARD;
  }

  public getActionVoidAbnormalAccount(): number[] {
    return ActionVoidByIssueTypeConst.ABNORMAL_ACCOUNT;
  }

  public getActionVoidAbnormalBetRealMember(): number[] {
    return ActionVoidByIssueTypeConst.ABNORMAL_BET_REAL_MEMBER;
  }

  public getActionVoidArchivedTicket(): number[] {
    return ActionVoidByIssueTypeConst.ARCHIVED_TICKET;
  }

  public getActionVoidDuplicateTickets(isEdit: boolean, actionId: string): number[] {
    return isEdit && actionId === TVSRequestActionType.AUTO_VOID_INSTANT_ID.toString()
      ? ActionVoidByIssueTypeConst.DUPLICATE_TICKETS_AUTO_ADD_REQUEST
      : ActionVoidByIssueTypeConst.DUPLICATE_TICKETS_ADD_REQUEST;
  }

  public getActionAbnormalBet(filterBy: number): number[] {
    return filterBy === AbnormalFilterBy.SINGLE
      ? ActionVoidByIssueTypeConst.ABNORMAL_BET_SINGLE
      : ActionVoidByIssueTypeConst.ABNORMAL_BET_MIX_PARLAY;
  }

  public getActionVoidNotParticipate(): number[] {
    return ActionVoidByIssueTypeConst.NOT_PARTICIPATE;
  }

  public getActionRecoverTicket(): number[] {
    return ActionVoidByIssueTypeConst.RECOVER_TICKET;
  }
}