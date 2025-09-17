import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { EventBaseLayoutComponent } from '../../../component/event-base-layout/event-base-layout.component';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { RequestModel } from '../../../models/request.model';
import { EventWrongMarketOfferedComponent } from './event-wrong-market-offered/event-wrong-market-offered.component';
import { OthersWrongHdpComponent } from '../../../component/others-wrong-hdp/others-wrong-hdp.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [EventBaseLayoutComponent, CommonModule, EventWrongMarketOfferedComponent, OthersWrongHdpComponent],
})
export class AppComponent {
  @ViewChild('eventWrongMarketOffered') eventWrongMarketOfferedComponent: EventWrongMarketOfferedComponent;
  model = new RequestModel();
  issueTypeId = IssueTypeConstant.WRONG_MARKET_OFFERED;

  public async saveRequest(): Promise<void> {
    this.eventWrongMarketOfferedComponent.saveRequest();
  }
}