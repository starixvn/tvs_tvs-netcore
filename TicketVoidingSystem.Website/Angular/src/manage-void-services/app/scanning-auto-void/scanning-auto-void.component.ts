import { Component, ElementRef, OnInit } from '@angular/core';
import { ModalType } from '../../../utility/components/modal/modal';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { SiteDbGroupConstant } from '../../../utility/constants/config';
import { TEXT } from '../../../utility/constants/text';
import { AppApiService } from '../app-api.service';
import {
  AutoVoidRequestQueueModel, AutoVoidRequestQueueViewModel,
  AUTO_VOID_REQUEST_QUEUE_STATUS_SELECTION, UpdateAutoVoidRequestQueueModel
} from './scanning-auto-void.model';

@Component({
  selector: 'scanning-auto-void',
  templateUrl: './scanning-auto-void.component.html',
  styleUrls: ['./scanning-auto-void.component.scss']
})
export class ScanningAutoVoidComponent implements OnInit {
  autoVoidRequestQueuesOrigin: AutoVoidRequestQueueModel[] = [];
  autoVoidRequestQueuesViewModel: AutoVoidRequestQueueViewModel[] = [];
  tooltip = new Tooltip();
  autoVoidRequestQueueStatusSelection = AUTO_VOID_REQUEST_QUEUE_STATUS_SELECTION;
  isBlock: boolean;
  inputBroadcastSessionId: string;

  constructor(private readonly element: ElementRef,
    private readonly appApiService: AppApiService,
    private readonly modalService: ModalService) {
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
    this.autoVoidRequestQueuesOrigin = await this.appApiService.getAutoVoidRequestQueue(this.inputBroadcastSessionId);
    this.autoVoidRequestQueuesViewModel = this.transformAutoVoidRequestQueueViewModel(this.autoVoidRequestQueuesOrigin);
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
        viewModel.statusIdSelected = queueInCurrentServer.statusId;
        viewModel.errMsg = queueInCurrentServer.errMsg;
      }

      return viewModel;
    });

    console.log(transformViewModel);
    return transformViewModel;
  }

  confirmUpdateStatus(siteDbName: string, siteDbGroupId: number, queueId: number, statusIdSelected: number) {
    this.modalService.confirm({
      title: 'Confirm',
      message: `Are you sure you want to update:<br> - <strong>${siteDbName}</strong><br> - QueueId: <strong>${queueId}</strong><br> - StatusId: <strong>${statusIdSelected}</strong>`
    },
      async () => {
        this.isBlock = true;
        const isUpdateSuccessful = await this.appApiService.updateAutoVoidRequestQueue(
          this.initUpdateQuery(siteDbGroupId, queueId, statusIdSelected));
        this.isBlock = false;
        this.openModelResult(isUpdateSuccessful);
      },
      () => {
        // this.tmpStatusId = this.orgStatusId;
      }
    );
  }

  openModelResult(isSuccess: boolean) {
    this.modalService.open(
      {
        title: 'Update result',
        message: isSuccess ? 'Successful!' : 'Failed!',
        type: isSuccess ? ModalType.Alert : ModalType.Error
      });
  }

  clearInput() {
    this.resetOldResult();
    this.inputBroadcastSessionId = null;
  }

  private resetOldResult(): void {
    this.autoVoidRequestQueuesOrigin = [];
    this.autoVoidRequestQueuesViewModel = [];
  }

  private isValidSearchQuery(): boolean {
    if (!this.inputBroadcastSessionId || this.inputBroadcastSessionId.trim() === '') {
      this.tooltip.display('broadcast-session-id', TEXT.REQUIRED_INPUT);
      return false;
    }

    return true;
  }

  private initUpdateQuery(siteDbGroupId: number, queueId: number, statusIdSelected: number) {
    return {
      siteDbGroupId: siteDbGroupId,
      queueId: queueId,
      statusId: statusIdSelected
    } as UpdateAutoVoidRequestQueueModel;
  }
}
