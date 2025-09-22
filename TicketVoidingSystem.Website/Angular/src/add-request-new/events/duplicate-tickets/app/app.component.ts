import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { EventBaseLayoutComponent } from '../../../component/event-base-layout/event-base-layout.component';
import { RequestModel } from '../../../models/request.model';
import { EventDuplicateTicketsComponent } from './event-duplicate-tickets/event-duplicate-tickets.component';
import { OthersAbnormalBetComponent } from '../../../component/others-abnormal-bet/others-abnormal-bet.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [EventBaseLayoutComponent, CommonModule, EventDuplicateTicketsComponent, OthersAbnormalBetComponent],
})
export class AppComponent {
  @ViewChild('eventDuplicateTickets') eventDuplicateTickets: EventDuplicateTicketsComponent;
  model = new RequestModel();
  issueTypeId = IssueTypeConstant.DUPLICATE_TICKETS;

  public async saveRequest(): Promise<void> {
    this.eventDuplicateTickets.saveRequest();
  }
}