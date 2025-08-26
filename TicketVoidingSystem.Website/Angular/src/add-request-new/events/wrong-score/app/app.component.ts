import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { EventBaseLayoutComponent } from '../../../component/event-base-layout/event-base-layout.component';
import { OthersComponent } from '../../../component/others/others.component';
import { RequestModel } from '../../../models/request.model';
import { EventWrongScoreComponent } from './event-wrong-score/event-wrong-score.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [EventBaseLayoutComponent, CommonModule, EventWrongScoreComponent, OthersComponent],
})
export class AppComponent {
  @ViewChild('eventWrongScore') eventWrongScoreComponent: EventWrongScoreComponent;
  model = new RequestModel();
  issueTypeId = IssueTypeConstant.WRONG_SCORE;

  public async saveRequest(): Promise<void> {
    this.eventWrongScoreComponent.saveRequest();
  }
}