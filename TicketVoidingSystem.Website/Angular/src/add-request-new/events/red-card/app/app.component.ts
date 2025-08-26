import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { EventBaseLayoutComponent } from '../../../../add-request-new/component/event-base-layout/event-base-layout.component';
import { OthersComponent } from '../../../../add-request-new/component/others/others.component';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { RequestModel } from '../../../models/request.model';
import { EventRedCardComponent } from './event-red-card/event-red-card.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [EventBaseLayoutComponent, CommonModule, EventRedCardComponent, OthersComponent],
})
export class AppComponent {
  @ViewChild('eventRedCard') eventRedCardComponent: EventRedCardComponent;
  model = new RequestModel();
  issueTypeId = IssueTypeConstant.RED_CARD;

  public async saveRequest(): Promise<void> {
    this.eventRedCardComponent.saveRequest();
  }
}