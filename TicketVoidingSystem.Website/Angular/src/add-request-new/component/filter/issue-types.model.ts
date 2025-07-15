import { IssueType, SubIssueType } from '../../../utility/models/issue-type.model';
import * as _ from 'lodash';

export class IssueTypes {
  issueTypes: IssueType[] = [];
  subIssueTypes: SubIssueType[] = [];
  issueId: number;
  selectedSubIssueTypes: SubIssueType[] = [];
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
