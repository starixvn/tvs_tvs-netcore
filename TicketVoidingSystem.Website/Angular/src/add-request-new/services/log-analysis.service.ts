import { inject, Injectable } from '@angular/core';
import { IssueTypeConstant } from '../../utility/constants/issue-type.constant';
import { CommonService } from '../../utility/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class LogAnalysisService {
  private readonly commonService = inject(CommonService);

  async writeLogAccessFunction(isEditRequestPage: boolean, issueTypeId: string, accessIssueTypeCount: Map<string, number>): Promise<void> {
    const pageName = isEditRequestPage ? 'EditRequest' : 'AddRequest';
    let currentAccessCount = accessIssueTypeCount.get(issueTypeId) ?? 0;
    if (currentAccessCount === 0) {
      const isLogged = await this.commonService.logAccessFunction(`${pageName}/${IssueTypeConstant.NAME_WRITE_LOG.get(issueTypeId)}`);
      if (isLogged) {
        currentAccessCount++;
        accessIssueTypeCount.set(issueTypeId, currentAccessCount);
      }
    }
  }

  async writeLogClickLiveGameDetails(issueTypeId: string): Promise<void> {
    const actionName = 'OpenLGDetails';
    await this.commonService.logAccessFunction(`${actionName}/${IssueTypeConstant.NAME_WRITE_LOG.get(issueTypeId)}`);
  }

  async writeLogClickPoolHouseDetails(issueTypeId: string): Promise<void> {
    const actionName = 'OpenPHDetails';
    await this.commonService.logAccessFunction(`${actionName}/${IssueTypeConstant.NAME_WRITE_LOG.get(issueTypeId)}`);
  }
}