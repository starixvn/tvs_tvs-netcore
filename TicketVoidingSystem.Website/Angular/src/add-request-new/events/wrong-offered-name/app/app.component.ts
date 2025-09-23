import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { EventBaseLayoutComponent } from '../../../component/event-base-layout/event-base-layout.component';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { RequestModel } from '../../../models/request.model';
import { EventWrongOfferedNameComponent } from './event-wrong-offered-name/event-wrong-offered-name.component';
import { OthersWrongHdpComponent } from '../../../component/others-wrong-hdp/others-wrong-hdp.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [EventBaseLayoutComponent, CommonModule, EventWrongOfferedNameComponent, OthersWrongHdpComponent],
})
export class AppComponent {
  @ViewChild('eventWrongOfferedName') eventWrongOfferedNameComponent: EventWrongOfferedNameComponent;
  model = new RequestModel();
  issueTypeId = IssueTypeConstant.WRONG_OFFERED_NAME;

  public async saveRequest(): Promise<void> {
    this.eventWrongOfferedNameComponent.saveRequest();
  }
}