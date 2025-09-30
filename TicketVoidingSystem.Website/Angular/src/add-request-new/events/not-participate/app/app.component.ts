import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { EventBaseLayoutComponent } from '../../../component/event-base-layout/event-base-layout.component';
import { OthersWrongHdpComponent } from '../../../component/others-wrong-hdp/others-wrong-hdp.component';
import { PrimitiveProperty } from '../../../models/primitive-property.model';
import { RequestModel } from '../../../models/request.model';
import { EditRequestService } from '../../../services/edit-request/edit-request.service';
import { EventNotParticipateComponent } from './event-not-participate/event-not-participate.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [EventBaseLayoutComponent, CommonModule, EventNotParticipateComponent, OthersWrongHdpComponent],
})
export class AppComponent implements OnInit {
  @ViewChild('eventNotParticipate') eventNotParticipateComponent: EventNotParticipateComponent;
  editRequestService = inject(EditRequestService);

  model = new RequestModel();
  primitiveProperty = new PrimitiveProperty();
  issueTypeId: string;

  ngOnInit() {
    this.issueTypeId = window.issueTypeId || IssueTypeConstant.NOT_PARTICIPATE;
  }
  
  public async saveRequest(): Promise<void> {
    this.eventNotParticipateComponent.saveRequest();
  }
}