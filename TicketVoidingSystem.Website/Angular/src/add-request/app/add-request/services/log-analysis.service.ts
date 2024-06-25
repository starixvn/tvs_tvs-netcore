import { Injectable } from '@angular/core';
import moment from 'moment-timezone';
import { IssueTypeConstant } from 'src/utility/constants/issue-type.constant';
import { LogAnalysisConstant } from 'src/utility/constants/log-analysis.constant';
import { CommonService } from '../../../../utility/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class LogAnalysisService {

  constructor(
    private readonly commonService: CommonService
  ) { }

  async writeLogAccessFunction(isEditRequestPage: boolean, issueTypeId: string, accessIssueTypeCount: Map<string, number>): Promise<void> {
    if (isEditRequestPage) {
      return;
    }

    let currentAccessCount = accessIssueTypeCount.get(issueTypeId) ?? 0;
    if (currentAccessCount === 0) {
      const isLogged = await this.commonService.logAccessFunction(`AddRequest/${IssueTypeConstant.NAME_WRITE_LOG.get(issueTypeId)}`);
      if (isLogged) {
        currentAccessCount++;
        accessIssueTypeCount.set(issueTypeId, currentAccessCount);
      }
    }
  }

  async writeLogCalculateTimeFilterTickets(isEditRequestPage: boolean, issueTypeId: string, fromTime: Date, toTime: Date, requestId: number): Promise<void> {
    if (isEditRequestPage) {
      return;
    }

    this.commonService.logChangeContent(LogAnalysisConstant[issueTypeId],
      `RequestId-${requestId};Time-${moment(toTime).diff(moment(fromTime), 'seconds')}s`);
  }
}