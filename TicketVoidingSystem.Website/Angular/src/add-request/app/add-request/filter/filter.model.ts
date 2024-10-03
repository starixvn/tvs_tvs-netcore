import { SubIssueType } from '../../../../utility/models/issue-type.model';
export class FilterModel {
  issueTypeId?: string;
  subIssueTypeId: string;
  action: string;
  isTest: boolean;
  isAbnormal: boolean;
  isVoided: boolean;
  subIssueTypes?: SubIssueType[];
  isChangeSubTypeManual?: boolean;
}
