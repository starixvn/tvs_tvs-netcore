import { inject, Injectable } from '@angular/core';
import { IssueTypes } from '../../../add-request/app/add-request/filter/issue-types.model';
import { CommonService } from '../../../utility/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class EventBaseService {
  commonService = inject(CommonService);

  public backToAccessDeniedPage() {
    window.location.assign(`Home/AccessDenied`);
  }

  public backToManagePage(): void {
    window.location.assign(`TicketVoidingSystem/ManageRequest/Index`);
  }

  public async getSubIssueTypes(issueTypeId: number): Promise<IssueTypes> {
    const data = await this.commonService.getIssueTypes();

    return {
      issueTypes: data.issueTypes?.filter(x => x.issueTypeId === issueTypeId) ?? [],
      subIssueTypes: data.subIssueTypes?.filter(x => x.issueTypeId === issueTypeId) ?? [],
    } as IssueTypes;
  }
}