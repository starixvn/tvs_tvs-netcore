import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { EventBaseLayoutComponent } from '../../../component/event-base-layout/event-base-layout.component';
import { OthersWrongHdpComponent } from '../../../component/others-wrong-hdp/others-wrong-hdp.component';
import { RequestModel } from '../../../models/request.model';
import { EventWrongOuComponent } from './event-wrong-ou/event-wrong-ou.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [EventBaseLayoutComponent, CommonModule, EventWrongOuComponent, OthersWrongHdpComponent],
})
export class AppComponent implements OnInit {
  @ViewChild('eventWrongOU') eventWrongOUComponent: EventWrongOuComponent;
  model = new RequestModel();
  issueTypeId: string;

  ngOnInit() {
    this.issueTypeId = window.issueTypeId || IssueTypeConstant.WRONG_OU;
  }

  public async saveRequest(): Promise<void> {
    this.eventWrongOUComponent.saveRequest();
  }
}