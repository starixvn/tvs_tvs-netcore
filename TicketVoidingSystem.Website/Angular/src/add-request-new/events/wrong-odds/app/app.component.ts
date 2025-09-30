import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { EventBaseLayoutComponent } from '../../../component/event-base-layout/event-base-layout.component';
import { OthersWrongHdpComponent } from '../../../component/others-wrong-hdp/others-wrong-hdp.component';
import { RequestModel } from '../../../models/request.model';
import { EventWrongOddsComponent } from './event-wrong-odds/event-wrong-odds.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [EventBaseLayoutComponent, CommonModule, EventWrongOddsComponent, OthersWrongHdpComponent],
})
export class AppComponent {
  @ViewChild('eventWrongOdds') eventWrongOddsComponent: EventWrongOddsComponent;
  model = new RequestModel();
  issueTypeId = IssueTypeConstant.WRONG_ODDS;

  public async saveRequest(): Promise<void> {
    this.eventWrongOddsComponent.saveRequest();
  }
}