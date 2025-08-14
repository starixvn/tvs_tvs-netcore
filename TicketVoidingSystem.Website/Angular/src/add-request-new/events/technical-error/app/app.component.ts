import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { EventBaseLayoutComponent } from '../../../../add-request-new/component/event-base-layout/event-base-layout.component';
import { OthersAbnormalBetComponent } from '../../../../add-request-new/component/others-abnormal-bet/others-abnormal-bet.component';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { RequestModel } from '../../../models/request.model';
import { EventDangerAcceptedComponent } from './event-danger-accepted/event-danger-accepted.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [EventBaseLayoutComponent, CommonModule, EventDangerAcceptedComponent, OthersAbnormalBetComponent],
})
export class AppComponent {
  @ViewChild('eventDangerAccepted') eventDangerAcceptedComponent: EventDangerAcceptedComponent;
  model = new RequestModel();
  issueTypeId = IssueTypeConstant.DANGER_ACCEPTED;

  public async saveRequest(): Promise<void> {
    this.eventDangerAcceptedComponent.saveRequest();
  }
}