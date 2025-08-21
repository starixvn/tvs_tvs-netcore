import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { EventBaseLayoutComponent } from '../../../component/event-base-layout/event-base-layout.component';
import { OthersAbnormalBetComponent } from '../../../component/others-abnormal-bet/others-abnormal-bet.component';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { RequestModel } from '../../../models/request.model';
import { EventTicket14Component } from './event-ticket14/event-ticket14.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [EventBaseLayoutComponent, CommonModule, EventTicket14Component, OthersAbnormalBetComponent],
})
export class AppComponent {
  @ViewChild('eventTicket14') eventTicket14Component: EventTicket14Component;
  model = new RequestModel();
  issueTypeId = IssueTypeConstant.ARCHIVED_TICKET;

  public async saveRequest(): Promise<void> {
    this.eventTicket14Component.saveRequest();
  }
}