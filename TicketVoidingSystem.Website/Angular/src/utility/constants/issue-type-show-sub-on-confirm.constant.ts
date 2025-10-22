import { IssueTypeConstant } from './issue-type.constant';

export class IssueTypeShowSubOnConfirmConstant {
  static readonly ISSUE_TYPES_WITH_SUB_ISSUES = [
    IssueTypeConstant.ABNORMAL_ACCOUNT,
    IssueTypeConstant.ABNORMAL_BET,
    IssueTypeConstant.DANGER_ACCEPTED,
    IssueTypeConstant.OTHER_ISSUES,
    IssueTypeConstant.RED_CARD,
    IssueTypeConstant.WRONG_1ST_HDP,
    IssueTypeConstant.WRONG_HDP,
    IssueTypeConstant.WRONG_ODDS,
    IssueTypeConstant.WRONG_OFFERED_NAME,
    IssueTypeConstant.WRONG_SCORE
  ];

  static shouldShowSubIssues(issueTypeId: string): boolean {
    return this.ISSUE_TYPES_WITH_SUB_ISSUES.includes(issueTypeId);
  }
}
