import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild, OnInit } from '@angular/core';
import { EventBaseLayoutComponent } from '../../../component/event-base-layout/event-base-layout.component';
import { EventWrongHdpComponent } from './event-wrong-hdp/event-wrong-hdp.component';
import { OthersWrongHdpComponent } from '../../../component/others-wrong-hdp/others-wrong-hdp.component';
import { EditRequestService } from '../../../services/edit-request/edit-request.service';
import { RequestModel } from '../../../models/request.model';
import { PrimitiveProperty } from '../../../models/primitive-property.model';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [EventBaseLayoutComponent, CommonModule, EventWrongHdpComponent, OthersWrongHdpComponent],
})
export class AppComponent implements OnInit {
  @ViewChild('eventWrongHDP') eventWrongHDPComponent: EventWrongHdpComponent;
  editRequestService = inject(EditRequestService);

  model = new RequestModel();
  primitiveProperty = new PrimitiveProperty();
  issueTypeId: string;

  ngOnInit() {
    this.issueTypeId = window.issueTypeId || IssueTypeConstant.WRONG_HDP;
  }
  
  public async saveRequest(): Promise<void> {
    this.eventWrongHDPComponent.saveRequest();
  }
}