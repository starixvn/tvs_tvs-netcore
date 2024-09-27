import { Selection } from 'src/utility/models/selection.model';
import { SubIssueType } from '../../../../utility/models/issue-type.model';
export class FilterModel {
  issueTypeId?: string;
  subIssueTypeId: string;
  action: string;
  isTest: boolean;
  isAbnormal: boolean;
  isVoided: boolean;
  subIssueTypes?: SubIssueType[];
  actions: Selection[];
  isChangeSubTypeManual?: boolean;
}
