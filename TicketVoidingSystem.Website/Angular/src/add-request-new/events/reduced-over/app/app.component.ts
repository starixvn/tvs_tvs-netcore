import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { EventBaseLayoutComponent } from '../../../component/event-base-layout/event-base-layout.component';
import { OthersWrongHdpComponent } from '../../../component/others-wrong-hdp/others-wrong-hdp.component';
import { PrimitiveProperty } from '../../../models/primitive-property.model';
import { RequestModel } from '../../../models/request.model';
import { EditRequestService } from '../../../services/edit-request/edit-request.service';
import { EventReducedOverComponent } from './event-reduced-over/event-reduced-over.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [EventBaseLayoutComponent, CommonModule, EventReducedOverComponent, OthersWrongHdpComponent],
})
export class AppComponent implements OnInit {
  @ViewChild('eventWrongHDP') eventReducedOverComponent: EventReducedOverComponent;
  editRequestService = inject(EditRequestService);

  model = new RequestModel();
  primitiveProperty = new PrimitiveProperty();
  issueTypeId: string;

  ngOnInit() {
    this.issueTypeId = window.issueTypeId || IssueTypeConstant.ABANDONED;
  }
  
  public async saveRequest(): Promise<void> {
    this.eventReducedOverComponent.saveRequest();
  }
}