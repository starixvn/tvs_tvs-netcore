import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { EventBaseLayoutComponent } from '../../../component/event-base-layout/event-base-layout.component';
import { RequestModel } from '../../../models/request.model';
import { AbnormalAccountsComponent } from './abnormal-accounts/abnormal-accounts.component';
import { AbnormalAccountOtherComponent } from './abnormal-accounts/abnormal-accounts-other/abnormal-accounts-other.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [EventBaseLayoutComponent, CommonModule, AbnormalAccountsComponent, AbnormalAccountOtherComponent],
})
export class AppComponent {
  @ViewChild('abnormalAccount') abnormalAccountComponent: AbnormalAccountsComponent;
  model = new RequestModel();
  issueTypeId = IssueTypeConstant.ABNORMAL_ACCOUNT;

  public async saveRequest(): Promise<void> {
    this.abnormalAccountComponent.saveRequest();
  }
}