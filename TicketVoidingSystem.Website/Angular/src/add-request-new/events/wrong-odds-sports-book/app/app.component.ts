import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { EventBaseLayoutComponent } from '../../../../add-request-new/component/event-base-layout/event-base-layout.component';
import { OthersWrongHdpComponent } from '../../../component/others-wrong-hdp/others-wrong-hdp.component';
import { EditRequestService } from '../../../services/edit-request/edit-request.service';
import { RequestModel } from '../../../models/request.model';
import { PrimitiveProperty } from '../../../models/primitive-property.model';
import { IssueTypeConstant } from 'src/utility/constants/issue-type.constant';
import { EventWrongOddsSportsBookComponent } from './event-wrong-odds-sports-book/event-wrong-odds-sports-book.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [EventBaseLayoutComponent, CommonModule, EventWrongOddsSportsBookComponent, OthersWrongHdpComponent],
})
export class AppComponent {
  @ViewChild('eventWrongOddsSportsBook') eventWrongOddsSportsBookComponent: EventWrongOddsSportsBookComponent;
  editRequestService = inject(EditRequestService);

  model = new RequestModel();
  primitiveProperty = new PrimitiveProperty();
  issueTypeId = IssueTypeConstant.WRONG_ODDS_SPORTS_BOOK;

  public async saveRequest(): Promise<void> {
    this.eventWrongOddsSportsBookComponent.saveRequest();
  }
}