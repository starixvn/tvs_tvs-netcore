import { Injectable } from '@angular/core';
import { IssueTypeConstant } from 'src/utility/constants/issue-type.constant';
import { CommonService } from '../../../../utility/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class LogAccessIssueTypeService {

  constructor(
    private readonly commonService: CommonService
  ) { }

  async writeLog(isEditRequestPage: boolean, issueTypeId: string, accessIssueTypeCount: Map<string, number>): Promise<void> {
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