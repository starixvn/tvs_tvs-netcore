import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { EventBaseLayoutComponent } from '../../../component/event-base-layout/event-base-layout.component';
import { RequestModel } from '../../../models/request.model';
import { OthersAbnormalBetComponent } from '../../../component/others-abnormal-bet/others-abnormal-bet.component';
import { EventRecoverTicketComponent } from './event-recover-ticket/event-recover-ticket.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [EventBaseLayoutComponent, CommonModule, EventRecoverTicketComponent, OthersAbnormalBetComponent],
})
export class AppComponent {
  @ViewChild('eventRecoverTicket') eventRecoverTicketComponent: EventRecoverTicketComponent;
  model = new RequestModel();
  issueTypeId = IssueTypeConstant.RECOVER_TICKET;

  public async saveRequest(): Promise<void> {
    this.eventRecoverTicketComponent.saveRequest();
  }
}