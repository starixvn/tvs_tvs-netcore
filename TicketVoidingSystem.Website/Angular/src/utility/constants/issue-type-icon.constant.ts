import { IssueTypeConstant } from './issue-type.constant';

export class IssueTypeIconConstant {
  /**
   * Maps issue type IDs to FontAwesome icon classes
   * Used for displaying icons on the home page
   */
  static readonly HDP_ICON = 'fas fa-balance-scale';
  static readonly ISSUE_TYPE_ICONS = new Map<string, string>([
    [IssueTypeConstant.ABNORMAL_BET, 'fas fa-exclamation-triangle'],
    [IssueTypeConstant.ABNORMAL_ACCOUNT, 'fas fa-user-shield'],
    [IssueTypeConstant.EARLY_KICK_OFF, 'fas fa-clock'],
    [IssueTypeConstant.WRONG_KICK_OFF, 'fas fa-clock'],
    [IssueTypeConstant.DANGER_ACCEPTED, 'fas fa-shield-alt'],
    [IssueTypeConstant.RED_CARD, 'fas fa-mobile-button'],
    [IssueTypeConstant.WRONG_ODDS, 'fas fa-percentage'],
    [IssueTypeConstant.WRONG_SCORE, 'fas fa-list-ol'],
    [IssueTypeConstant.WRONG_OU, 'fas fa-equals'],
    [IssueTypeConstant.WRONG_1ST_OU, 'fas fa-equals'],
    [IssueTypeConstant.WRONG_HDP, this.HDP_ICON],
    [IssueTypeConstant.WRONG_1ST_HDP, this.HDP_ICON],
    [IssueTypeConstant.WRONG_QUARTER_HDP, this.HDP_ICON],
    [IssueTypeConstant.ARCHIVED_TICKET, 'fas fa-archive'],
    [IssueTypeConstant.OTHER_ISSUES, 'fas fa-ellipsis-h'],
    [IssueTypeConstant.REDUCED_OVER, 'fas fa-minus-circle'],
    [IssueTypeConstant.DUPLICATE_TICKETS, 'fas fa-copy'],
    [IssueTypeConstant.NOT_PARTICIPATE, 'fas fa-user-injured'],
    [IssueTypeConstant.RECOVER_TICKET, 'fas fa-undo'],
    [IssueTypeConstant.ABANDONED, 'fas fa-times-circle'],
    [IssueTypeConstant.WRONG_MARKET_OFFERED, 'fas fa-ticket-alt'],
    [IssueTypeConstant.TECHNICAL_ERROR, 'fas fa-bug'],
    [IssueTypeConstant.WRONG_ODDS_SPORTS_BOOK, 'fas fa-percentage'],
    [IssueTypeConstant.WRONG_OFFERED_NAME, 'fas fa-tag'],
    [IssueTypeConstant.MATCH_COMPLETED, 'fas fa-check-circle'],
    [IssueTypeConstant.MATCH_EARLY_COMPLETED, 'fas fa-check-circle'],
    [IssueTypeConstant.AB_REAL_MEMBER, 'fas fa-user-check']
  ]);

  /**
   * Get icon class for a specific issue type ID
   * @param issueTypeId - The issue type ID
   * @returns FontAwesome icon class or default icon if not found
   */
  static getIconClass(issueTypeId: string | number): string {
    const iconClass = this.ISSUE_TYPE_ICONS.get(issueTypeId.toString());
    return iconClass || 'fas fa-question-circle'; // Default icon if not found
  }

  /**
   * Get icon class for issue type from the home page model
   * @param issueType - The issue type from home page API
   * @returns FontAwesome icon class
   */
  static getIconClassFromHomePage(issueType: { issueTypeId: number }): string {
    return this.getIconClass(issueType.issueTypeId);
  }
}
