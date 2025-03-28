import { Injectable } from '@angular/core';
import { AbnormalFilterBy, ActionVoidByIssueTypeConst, TVSRequestActionType } from '../../../../../utility/constants/config';
import { IssueTypeConstant } from '../../../../../utility/constants/issue-type.constant';
import { Selection } from '../../../../../utility/models/selection.model';
@Injectable()
export class ActionVoidService {

  public getVoidActionsSelectionByIssueType(issueTypeId: number, filterBy: number, isEdit: boolean, currentActionId: string, originActions: Selection[]): Selection[] {
    if (!issueTypeId) {
      return originActions;
    }

    const actionMapping: { [key: string]: number[] } = {
      [IssueTypeConstant.REDUCED_OVER]: ActionVoidByIssueTypeConst.REDUCED_OVER,
      [IssueTypeConstant.ABANDONED]: ActionVoidByIssueTypeConst.ABANDONED,
      [IssueTypeConstant.WRONG_ODDS]: ActionVoidByIssueTypeConst.WRONG_ODDS,
      [IssueTypeConstant.DANGER_ACCEPTED]: ActionVoidByIssueTypeConst.DANGER_ACCEPTED,
      [IssueTypeConstant.WRONG_SCORE]: ActionVoidByIssueTypeConst.WRONG_SCORE,
      [IssueTypeConstant.WRONG_HDP]: ActionVoidByIssueTypeConst.WRONG_HDP,
      [IssueTypeConstant.WRONG_1ST_HDP]: ActionVoidByIssueTypeConst.WRONG_1ST_HDP,
      [IssueTypeConstant.WRONG_OU]: ActionVoidByIssueTypeConst.WRONG_OU,
      [IssueTypeConstant.WRONG_1ST_OU]: ActionVoidByIssueTypeConst.WRONG_1ST_OU,
      [IssueTypeConstant.EARLY_KICK_OFF]: ActionVoidByIssueTypeConst.EARLY_KICK_OFF,
      [IssueTypeConstant.WRONG_KICK_OFF]: ActionVoidByIssueTypeConst.WRONG_KICK_OFF,
      [IssueTypeConstant.RED_CARD]: ActionVoidByIssueTypeConst.RED_CARD,
      [IssueTypeConstant.ABNORMAL_ACCOUNT]: ActionVoidByIssueTypeConst.ABNORMAL_ACCOUNT,
      [IssueTypeConstant.ARCHIVED_TICKET]: ActionVoidByIssueTypeConst.ARCHIVED_TICKET,
      [IssueTypeConstant.NOT_PARTICIPATE]: ActionVoidByIssueTypeConst.NOT_PARTICIPATE,
      [IssueTypeConstant.RECOVER_TICKET]: ActionVoidByIssueTypeConst.RECOVER_TICKET,
      [IssueTypeConstant.WRONG_MARKET_OFFERED]: ActionVoidByIssueTypeConst.WRONG_MARKET_OFFERED,
      [IssueTypeConstant.TECHNICAL_ERROR]: ActionVoidByIssueTypeConst.TECHNICAL_ERROR,
      [IssueTypeConstant.WRONG_ODDS_SPORTS_BOOK]: ActionVoidByIssueTypeConst.WRONG_ODDS_SPORTS_BOOK,
      [IssueTypeConstant.ABNORMAL_BET]: [],
      [IssueTypeConstant.DUPLICATE_TICKETS]: [],
      [IssueTypeConstant.WRONG_OFFERED_NAME]: ActionVoidByIssueTypeConst.WRONG_OFFERRED_NAME,
      [IssueTypeConstant.OTHER_ISSUES]: ActionVoidByIssueTypeConst.OTHER_ISSUES
    };

    let actionIds: number[] = [];
    if (issueTypeId?.toString() === IssueTypeConstant.ABNORMAL_BET) {
      actionIds = this.getActionAbnormalBet(filterBy);
    } else if (issueTypeId?.toString() === IssueTypeConstant.DUPLICATE_TICKETS) {
      actionIds = this.getActionVoidDuplicateTickets(isEdit, currentActionId);
    } else {
      actionIds = actionMapping[issueTypeId];
    }

    return this.mapActionIdsToSelections(actionIds, originActions);
  }

  private getActionAbnormalBet(filterBy: number): number[] {
    return filterBy === AbnormalFilterBy.SINGLE
      ? ActionVoidByIssueTypeConst.ABNORMAL_BET_SINGLE
      : ActionVoidByIssueTypeConst.ABNORMAL_BET_MIX_OR_SYSTEM_PARLAY;
  }

  private getActionVoidDuplicateTickets(isEdit: boolean, currentActionId: string): number[] {
    return isEdit && currentActionId === TVSRequestActionType.AUTO_VOID_INSTANT_ID.toString()
      ? ActionVoidByIssueTypeConst.DUPLICATE_TICKETS_AUTO_ADD_REQUEST
      : ActionVoidByIssueTypeConst.DUPLICATE_TICKETS_ADD_REQUEST;
  }

  private mapActionIdsToSelections(actionIds: number[], originActions: Selection[]): Selection[] {
    return actionIds.map(id => {
      const foundAction = originActions.find((action) => action.value === id.toString());
      const name = foundAction ? foundAction.name : '';
      return { value: id.toString(), name };
    });
  }
}

