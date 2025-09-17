import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit } from '@angular/core';
import { EventBaseLayoutComponent } from '../../../component/event-base-layout/event-base-layout.component';
import { EventWrongHdpComponent } from './event-wrong-hdp/event-wrong-hdp.component';
import { OthersWrongHdpComponent } from '../../../component/others-wrong-hdp/others-wrong-hdp.component';
import { RequestModel } from '../../../models/request.model';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [EventBaseLayoutComponent, CommonModule, EventWrongHdpComponent, OthersWrongHdpComponent],
})
export class AppComponent implements OnInit {
  @ViewChild('eventWrongHDP') eventWrongHDPComponent: EventWrongHdpComponent;
  model = new RequestModel();
  issueTypeId: string;

  ngOnInit() {
    this.issueTypeId = window.issueTypeId || IssueTypeConstant.WRONG_HDP;
  }
  
  public async saveRequest(): Promise<void> {
    this.eventWrongHDPComponent.saveRequest();
  }
}