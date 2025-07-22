import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventBaseService {
  public isEdit: boolean = false;
  public isBlock: boolean = false;
  public isDisabledSaveButton: boolean = false;
  public savingRequestSubscription: Subscription;

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