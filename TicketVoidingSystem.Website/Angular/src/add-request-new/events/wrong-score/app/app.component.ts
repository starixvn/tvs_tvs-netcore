import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { OthersComponent } from 'src/add-request-new/component/others/others.component';
import { EventWrongScoreComponent } from 'src/add-request/app/add-request/event-wrong-score/event-wrong-score.component';
import { EventBaseLayoutComponent } from '../../../../add-request-new/component/event-base-layout/event-base-layout.component';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { RequestModel } from '../../models/request.model';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
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