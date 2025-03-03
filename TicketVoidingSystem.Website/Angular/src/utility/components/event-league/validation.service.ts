import { Injectable } from "@angular/core";
import { SubIssueTypeConstant } from "../../constants/sub-issue-type.constant";

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  checkValidSubType(subIssueTypeId?: string, matchSubTypeId?: number): boolean {
    if (!subIssueTypeId || !matchSubTypeId) {
      return true;
    }

    const filterSubTypeId = Number(subIssueTypeId);
  
    return !this.isInvalidGoalMatch(filterSubTypeId, matchSubTypeId)
      && !this.isInvalidGoalKickMatch(filterSubTypeId, matchSubTypeId)
      && !this.isInvalidCornerMatch(filterSubTypeId, matchSubTypeId)
      && !this.isInvalidBookingMatch(filterSubTypeId, matchSubTypeId);
  }

  private isInvalidGoalMatch(filterSubTypeId: number, matchSubTypeId: number): boolean {
    const minSubTypeGoalMatch = 400;
    const maxSubTypeGoalMatch = 599;
    const goalMatchSubTypeIds = [
      SubIssueTypeConstant.NO_INDICATION_HOME_GOAL_NO_ONWARDS,
      SubIssueTypeConstant.NO_INDICATION_HOME_GOAL_ONWARDS,
      SubIssueTypeConstant.NO_INDICATION_AWAY_GOAL_NO_ONWARDS,
      SubIssueTypeConstant.NO_INDICATION_AWAY_GOAL_ONWARDS
    ];
    const isGoalMatchSubType = goalMatchSubTypeIds.includes(filterSubTypeId);
    const isInRange = minSubTypeGoalMatch <= matchSubTypeId && matchSubTypeId <= maxSubTypeGoalMatch;

    return isGoalMatchSubType && !isInRange;
  }

  private isInvalidGoalKickMatch(filterSubTypeId: number, matchSubTypeId: number): boolean {
    const minSubTypeGoalKickMatchRange1 = 3900;
    const maxSubTypeGoalKickMatchRange1 = 3999;
    const minSubTypeGoalKickMatchRange2 = 4300;
    const maxSubTypeGoalKickMatchRange2 = 4399;
    const goalKickMatchSubTypeIds = [
      SubIssueTypeConstant.NO_INDICATION_HOME_GOAL_KICK_NO_ONWARDS,
      SubIssueTypeConstant.NO_INDICATION_HOME_GOAL_KICK_ONWARDS,
      SubIssueTypeConstant.NO_INDICATION_AWAY_GOAL_KICK_NO_ONWARDS,
      SubIssueTypeConstant.NO_INDICATION_AWAY_GOAL_KICK_ONWARDS
    ];

    const isGoalKickMatchSubType = goalKickMatchSubTypeIds.includes(filterSubTypeId);
    const isInRange1 = minSubTypeGoalKickMatchRange1 <= matchSubTypeId && matchSubTypeId <= maxSubTypeGoalKickMatchRange1;
    const isInRange2 = minSubTypeGoalKickMatchRange2 <= matchSubTypeId && matchSubTypeId <= maxSubTypeGoalKickMatchRange2;

    return isGoalKickMatchSubType && !(isInRange1 || isInRange2);
  }

  private isInvalidCornerMatch(filterSubTypeId: number, matchSubTypeId: number): boolean {
    const minSubTypeCornerMatchRange1 = 2100;
    const maxSubTypeCornerMatchRange1 = 2199;
    const minSubTypeCornerMatchRange2 = 2600;
    const maxSubTypeCornerMatchRange2 = 2699;
    const cornerMatchSubTypeIds = [
      SubIssueTypeConstant.NO_INDICATION_HOME_CORNER_NO_ONWARDS,
      SubIssueTypeConstant.NO_INDICATION_HOME_CORNER_ONWARDS,
      SubIssueTypeConstant.NO_INDICATION_AWAY_CORNER_NO_ONWARDS,
      SubIssueTypeConstant.NO_INDICATION_AWAY_CORNER_ONWARDS
    ];

    const isCornerMatchSubType = cornerMatchSubTypeIds.includes(filterSubTypeId);
    const isInRange1 = minSubTypeCornerMatchRange1 <= matchSubTypeId && matchSubTypeId <= maxSubTypeCornerMatchRange1;
    const isInRange2 = minSubTypeCornerMatchRange2 <= matchSubTypeId && matchSubTypeId <= maxSubTypeCornerMatchRange2;

    return isCornerMatchSubType && !(isInRange1 || isInRange2);
  }

  private isInvalidBookingMatch(filterSubTypeId: number, matchSubTypeId: number): boolean {
    const minSubTypeBookingMatchRange1 = 2900;
    const maxSubTypeBookingMatchRange1 = 2999;
    const minSubTypeBookingMatchRange2 = 3400;
    const maxSubTypeBookingMatchRange2 = 3499;
    const bookingMatchSubTypeIds = [
      SubIssueTypeConstant.NO_INDICATION_HOME_BOOKING_NO_ONWARDS,
      SubIssueTypeConstant.NO_INDICATION_HOME_BOOKING_ONWARDS,
      SubIssueTypeConstant.NO_INDICATION_AWAY_BOOKING_NO_ONWARDS,
      SubIssueTypeConstant.NO_INDICATION_AWAY_BOOKING_ONWARDS
    ];

    const isBookingMatchSubType = bookingMatchSubTypeIds.includes(filterSubTypeId);
    const isInRange1 = minSubTypeBookingMatchRange1 <= matchSubTypeId && matchSubTypeId <= maxSubTypeBookingMatchRange1;
    const isInRange2 = minSubTypeBookingMatchRange2 <= matchSubTypeId && matchSubTypeId <= maxSubTypeBookingMatchRange2;

    return isBookingMatchSubType && !(isInRange1 || isInRange2);
  }
}