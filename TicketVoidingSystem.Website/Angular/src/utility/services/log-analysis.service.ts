import { Injectable } from '@angular/core';
import { IssueTypeConstant } from '../constants/issue-type.constant';
import { CommonService } from './common.service';

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
}