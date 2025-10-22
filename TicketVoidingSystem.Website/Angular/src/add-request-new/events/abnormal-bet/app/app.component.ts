import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { EventBaseLayoutComponent } from '../../../component/event-base-layout/event-base-layout.component';
import { InitializedRequestModel, RequestModel } from '../../../models/request.model';
import { EventAbnormalBetComponent } from './event-abnormal-bet/event-abnormal-bet.component';
import { OthersAbnormalBetComponent } from '../../../component/others-abnormal-bet/others-abnormal-bet.component';
import { SignalRService } from '../../../../utility/services/signal-r.service.native';
import isNil from 'lodash/isNil';

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
  isExternalUrl = false;
  private readonly signalRService = inject(SignalRService);

  async ngOnInit() {
    const element = document.getElementById('addrequest-init-data');
    if (!isNil(element)) {
      const requestData = (element as HTMLInputElement).value;
      const initializedRequestModel = JSON.parse(requestData);
      this.mapModel(initializedRequestModel);
      this.isExternalUrl = true;
    }

    await this.signalRService.initializeConnection();
  }

  private mapModel(requestModel: InitializedRequestModel) {
    this.model.filter.issueTypeId = requestModel.issueTypeId;
    this.model.filter.subIssueTypeId = requestModel.subIssueTypeId;
    this.model.filter.action = requestModel.actionId;
    this.model.filter.isTest = requestModel.isTest;
    this.model.abnormalBetModel.transIds = requestModel.transIds;
  }

  public async saveRequest(): Promise<void> {
    this.eventAbnormalBetComponent.saveRequest();
  }
}