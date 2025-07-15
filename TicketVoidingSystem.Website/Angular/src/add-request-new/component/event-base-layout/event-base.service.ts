import { Injectable, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { EditRequestService } from 'src/add-request-new/events/services/edit-request/edit-request.service';
import { LocalStorageCacheConstant } from 'src/utility/constants/local-storage-cache.constant';
import { CommonService } from 'src/utility/services/common.service';
import { SignalRService } from 'src/utility/services/signal-r.service.native';
import { RequestModel } from 'src/add-request-new/events/models/request.model';
import { AddRequestApiService } from 'src/add-request-new/events/services/add-request-api.service';
import { PrimitiveProperty } from 'src/add-request-new/events/models/primitive-property.model';
import { IssueTypes } from '../filter/issue-types.model';

@Injectable({
  providedIn: 'root'
})
export class EventBaseService {
  private readonly commonService = inject(CommonService);

  public isEdit: boolean = false;
  public isBlock: boolean = false;
  public isDisabledSaveButton: boolean = false;
  public savingRequestSubscription: Subscription;

  public cachingIssueType(issueTypeId: string): void {
    if (!this.isEdit) {
      const userId = document.getElementById('body')?.getAttribute('user-id');
      if (userId) {
        localStorage.setItem(
          LocalStorageCacheConstant.PREVIOUS_SELECTED_ISSUETYPE_ADD_REQUEST + userId,
          issueTypeId
        );
      }
    }
  }

  async checkPermissionIssueType(issueTypeId: number): Promise<void> {
    const issueTypesPermission = await this.commonService.getIssueTypePermissionList();
    if(issueTypesPermission?.length === 0 || issueTypesPermission?.findIndex(x => x.issueTypeId === issueTypeId) === -1){
      this.backToAccessDeniedPage();
    }
  }

  private backToAccessDeniedPage() {
    window.location.assign(`Home/AccessDenied`);
  }

  public backToManagePage(): void {
    window.location.assign(`TicketVoidingSystem/ManageRequest/Index`);
  }

  public destroy(): void {
    this.savingRequestSubscription?.unsubscribe();
  }
} 