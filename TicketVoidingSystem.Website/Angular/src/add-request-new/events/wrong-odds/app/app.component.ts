import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { EventBaseLayoutComponent } from '../../../component/event-base-layout/event-base-layout.component';
import { OthersWrongHdpComponent } from '../../../component/others-wrong-hdp/others-wrong-hdp.component';
import { EditRequestService } from '../../../services/edit-request/edit-request.service';
import { RequestModel } from '../../../models/request.model';
import { PrimitiveProperty } from '../../../models/primitive-property.model';
import { IssueTypeConstant } from 'src/utility/constants/issue-type.constant';
import { EventWrongOddsComponent } from './event-wrong-odds/event-wrong-odds.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [EventBaseLayoutComponent, CommonModule, EventWrongOddsComponent, OthersWrongHdpComponent],
})
export class AppComponent {
  @ViewChild('eventWrongOdds') eventWrongOddsComponent: EventWrongOddsComponent;
  editRequestService = inject(EditRequestService);

  model = new RequestModel();
  primitiveProperty = new PrimitiveProperty();
  issueTypeId = IssueTypeConstant.WRONG_ODDS;
  
  public async saveRequest(): Promise<void> {
    this.eventWrongOddsComponent.saveRequest();
  }
}