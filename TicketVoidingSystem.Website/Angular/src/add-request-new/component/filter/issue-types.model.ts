import { IssueType, SubIssueType } from '../../../utility/models/issue-type.model';

export class IssueTypes {
  issueTypes: IssueType[] = [];
  subIssueTypes: SubIssueType[] = [];
  issueId: number;
  subIssueId: number;

  constructor(item = null) {
    if (item) {
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          this[key] = item[key];
        }
      }
    }
  }
}
