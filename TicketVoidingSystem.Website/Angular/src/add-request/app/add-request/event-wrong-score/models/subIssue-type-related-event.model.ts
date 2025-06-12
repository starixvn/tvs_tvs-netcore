import { SubIssueTypeConstant } from "src/utility/constants/sub-issue-type.constant";

export class SubIssueTypeRelatedEvent{
  static readonly SubIssueTypeMapHasRelatedEvent = new Map<number, number>([
    [SubIssueTypeConstant.NO_INDICATION_HOME_GOAL_NO_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL_HOME],
    [SubIssueTypeConstant.NO_INDICATION_HOME_GOAL_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL_HOME],
    [SubIssueTypeConstant.NO_INDICATION_AWAY_GOAL_NO_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL_AWAY],
    [SubIssueTypeConstant.NO_INDICATION_AWAY_GOAL_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL_AWAY],
    [SubIssueTypeConstant.NO_INDICATION_HOME_GOAL_KICK_NO_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL_KICK],
    [SubIssueTypeConstant.NO_INDICATION_HOME_GOAL_KICK_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL_KICK],
    [SubIssueTypeConstant.NO_INDICATION_AWAY_GOAL_KICK_NO_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL_KICK],
    [SubIssueTypeConstant.NO_INDICATION_AWAY_GOAL_KICK_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL_KICK],
    [SubIssueTypeConstant.NO_INDICATION_HOME_CORNER_NO_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_CORNER_HOME],
    [SubIssueTypeConstant.NO_INDICATION_HOME_CORNER_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_CORNER_HOME],
    [SubIssueTypeConstant.NO_INDICATION_AWAY_CORNER_NO_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_CORNER_AWAY],
    [SubIssueTypeConstant.NO_INDICATION_AWAY_CORNER_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_CORNER_AWAY],
    [SubIssueTypeConstant.NO_INDICATION_HOME_BOOKING_NO_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_BOOKING],
    [SubIssueTypeConstant.NO_INDICATION_HOME_BOOKING_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_BOOKING],
    [SubIssueTypeConstant.NO_INDICATION_AWAY_BOOKING_NO_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_BOOKING],
    [SubIssueTypeConstant.NO_INDICATION_AWAY_BOOKING_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_BOOKING]
  ]);

  public static isSubTypeFilterByAcceptedTime(subIssueTypeId: string): boolean {
    const allSubIssueType = [...SubIssueTypeRelatedEvent.SubIssueTypeMapHasRelatedEvent.values(),
      ...SubIssueTypeRelatedEvent.SubIssueTypeMapHasRelatedEvent.keys()];

    return allSubIssueType.includes(Number(subIssueTypeId));
  }

  public static getChildMatchSubIssueType(filterSubTypeId: string): number | null {
    return SubIssueTypeRelatedEvent.SubIssueTypeMapHasRelatedEvent.get(Number(filterSubTypeId)) || null;
  }

  public static isLinkMatchSubIssueTypeAutoAdd(subIssueTypeId): boolean {
    const SUB_TYPE_AUTO_SELECT_LIST = [...SubIssueTypeRelatedEvent.SubIssueTypeMapHasRelatedEvent.values()];
    return SUB_TYPE_AUTO_SELECT_LIST.includes(subIssueTypeId);
  }

  public static isHasRelatedEvent(filterSubTypeId: number): boolean {
    return SubIssueTypeRelatedEvent.SubIssueTypeMapHasRelatedEvent.has(filterSubTypeId);
  }
}
