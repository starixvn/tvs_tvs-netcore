import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { EventBaseLayoutComponent } from '../../../component/event-base-layout/event-base-layout.component';
import { OthersWrongHdpComponent } from '../../../component/others-wrong-hdp/others-wrong-hdp.component';
import { RequestModel } from '../../../models/request.model';
import { EventWrongOddsSportsBookComponent } from './event-wrong-odds-sports-book/event-wrong-odds-sports-book.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [EventBaseLayoutComponent, CommonModule, EventWrongOddsSportsBookComponent, OthersWrongHdpComponent],
})
export class AppComponent {
  @ViewChild('eventWrongOddsSportsBook') eventWrongOddsSportsBookComponent: EventWrongOddsSportsBookComponent;
  model = new RequestModel();
  issueTypeId = IssueTypeConstant.WRONG_ODDS_SPORTS_BOOK;

  public async saveRequest(): Promise<void> {
    this.eventWrongOddsSportsBookComponent.saveRequest();
  }
}