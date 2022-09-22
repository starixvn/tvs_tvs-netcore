import { Component, ElementRef, OnInit } from '@angular/core';
import { SiteDbGroupConstant } from 'src/utility/constants/config';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { TEXT } from '../../../utility/constants/text';
import { AppApiService } from '../app-api.service';
import { AutoVoidRequestQueueModel, AutoVoidRequestQueueViewModel } from './scanning-auto-void.model';

@Component({
  selector: 'scanning-auto-void',
  templateUrl: './scanning-auto-void.component.html',
  styleUrls: ['./scanning-auto-void.component.scss']
})
export class ScanningAutoVoidComponent implements OnInit {
  autoVoidRequestQueues: AutoVoidRequestQueueModel[] = [];
  tooltip = new Tooltip();
  isBlock: boolean;
  inputBroadcastSessionId: string;

  constructor(private readonly element: ElementRef,
    private readonly appApiService: AppApiService) {
    this.tooltip.element = this.element;
  }

  ngOnInit(): void {
  }

  async searchAutoVoidRequestQueue(): Promise<void> {
    this.resetOldResult();
    if (!this.isValidSearchQuery()) {
      return;
    }
    this.isBlock = true;
    this.autoVoidRequestQueues = await this.appApiService.getAutoVoidRequestQueue(this.inputBroadcastSessionId);
    this.isBlock = false;
  }

  transformAutoVoidRequestQueueViewModel(queues: AutoVoidRequestQueueModel[]): AutoVoidRequestQueueViewModel[] {
    const transformViewModel = SiteDbGroupConstant.ServerList.map(x => {
      const viewModel = new AutoVoidRequestQueueViewModel();
      viewModel.siteDbGroupId = x.id;
      viewModel.siteDbName = x.serverName;
      const queueInCurrentServer = queues.find(y => y?.siteDbGroupId === x.id);
      if (queueInCurrentServer) {
        viewModel.queueId = queueInCurrentServer.queueId;
        viewModel.broadcastSessionId = queueInCurrentServer.broadcastSessionId;
        viewModel.action = queueInCurrentServer.action;
        viewModel.requestId = queueInCurrentServer.requestId;
        viewModel.matchId = queueInCurrentServer.matchId;
        viewModel.statusId = queueInCurrentServer.statusId;
        viewModel.errMsg = queueInCurrentServer.errMsg;
      }

      return viewModel;
    });

    return transformViewModel;
  }

  clearInput() {
    this.resetOldResult();
    this.inputBroadcastSessionId = null;
  }

  private resetOldResult(): void {
    this.autoVoidRequestQueues = [];
  }

  private isValidSearchQuery(): boolean {
    if (!this.inputBroadcastSessionId || this.inputBroadcastSessionId.trim() === '') {
      this.tooltip.display('broadcast-session-id', TEXT.REQUIRED_INPUT);
      return false;
    }

    return true;
  }
}
