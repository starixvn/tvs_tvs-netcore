import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { EventBaseLayoutComponent } from '../../../component/event-base-layout/event-base-layout.component';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { OthersWrongHdpComponent } from '../../../component/others-wrong-hdp/others-wrong-hdp.component';
import { RequestModel } from '../../../models/request.model';
import { EventTechnicalErrorComponent } from './event-technical-error/event-technical-error.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [EventBaseLayoutComponent, CommonModule, EventTechnicalErrorComponent, OthersWrongHdpComponent],
})
export class AppComponent {
  @ViewChild('eventTechnicalError') eventTechnicalErrorComponent: EventTechnicalErrorComponent;
  model = new RequestModel();
  issueTypeId: string;

  ngOnInit() {
    this.issueTypeId = window.issueTypeId || IssueTypeConstant.TECHNICAL_ERROR;
  }

  public async saveRequest(): Promise<void> {
    this.eventTechnicalErrorComponent.saveRequest();
  }
}