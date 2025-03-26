import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { MenuBarComponent } from '../../utility/components/menu-bar/menu-bar.component';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { AddRequestComponent } from './add-request/add-request.component';
import { InitializedRequestModel, RequestModel } from './add-request/models/request.model';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [MenuBarComponent, AddRequestComponent]
})
export class AppComponent implements OnInit {
  model = new RequestModel();
  isExternalUrl = false;

  constructor(private readonly signalRService: SignalRService) { }

 async ngOnInit() {
    const element = document.getElementById('addrequest-init-data');
    if (!_.isNil(element)) {
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
}
