import { Injectable, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/utility/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class EventBaseService {
  private readonly commonService = inject(CommonService);

  public isEdit: boolean = false;
  public isBlock: boolean = false;
  public isDisabledSaveButton: boolean = false;
  public savingRequestSubscription: Subscription;

  async checkPermissionIssueType(issueTypeId: number): Promise<void> {
    const issueTypesPermission = await this.commonService.getIssueTypePermissionList();
    if(issueTypesPermission?.length === 0 || issueTypesPermission?.findIndex(x => x.issueTypeId === issueTypeId) === -1){
      this.backToAccessDeniedPage();
    }
  }

  public backToAccessDeniedPage() {
    window.location.assign(`Home/AccessDenied`);
  }

  public backToManagePage(): void {
    window.location.assign(`TicketVoidingSystem/ManageRequest/Index`);
  }

  public destroy(): void {
    this.savingRequestSubscription?.unsubscribe();
  }
} 