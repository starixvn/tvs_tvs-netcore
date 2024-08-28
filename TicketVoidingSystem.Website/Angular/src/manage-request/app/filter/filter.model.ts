import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export class FilterModel {
  requestId?: number;
  matchId?: number;
  ngbFromDate: NgbDate;
  ngbToDate: NgbDate;
  issueTypeId: string;
  subIssueType: string;
  status: string;
  createdBy: string;
  isExcludeTest = true;
  isDisplayMissingInfo = false;
}
