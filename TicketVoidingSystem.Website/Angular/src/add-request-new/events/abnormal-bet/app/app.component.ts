import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { EventBaseLayoutComponent } from '../../../component/event-base-layout/event-base-layout.component';
import { RequestModel } from '../../../models/request.model';
import { EventAbnormalBetComponent } from './event-abnormal-bet/event-abnormal-bet.component';
import { OthersAbnormalBetComponent } from '../../../component/others-abnormal-bet/others-abnormal-bet.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [EventBaseLayoutComponent, CommonModule, EventAbnormalBetComponent, OthersAbnormalBetComponent],
})
export class AppComponent {
  @ViewChild('eventAbnormalBet') eventAbnormalBetComponent: EventAbnormalBetComponent;
  model = new RequestModel();
  issueTypeId = IssueTypeConstant.ABNORMAL_BET;

  public async saveRequest(): Promise<void> {
    this.eventAbnormalBetComponent.saveRequest();
  }
}