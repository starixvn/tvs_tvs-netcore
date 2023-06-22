import { Component, ElementRef, OnInit } from '@angular/core';
import { ModalType } from '../../../utility/components/modal/modal.model';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { SiteDbGroupConstant } from '../../../utility/constants/config';
import { TEXT } from '../../../utility/constants/text';
import { AppApiService } from '../app-api.service';
import { ServiceStatusConstant } from '../app.model';
import {
    AutoVoidRequestQueueModel, AutoVoidRequestQueueViewModel,
    GetAutoVoidRequestQueueModel,
    UpdateAutoVoidRequestQueueModel
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
  autoVoidRequestQueueStatusSelection = ServiceStatusConstant.AutoVoidRequestQueueSelection;
  isBlock: boolean;
  filterBroadcastSessionIdValue: string;
  filterStatusIdValue = 0;
  filterBy = 0;

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
    this.autoVoidRequestQueuesOrigin = await this.appApiService.getAutoVoidRequestQueue(this.initGetQuery());
    this.autoVoidRequestQueuesViewModel = this.convertToAutoVoidRequestQueueViewModel(this.autoVoidRequestQueuesOrigin);
    this.isBlock = false;
  }

  confirmUpdateStatus(siteDbGroupId: number, queueId: number, statusIdSelected: number) {
    this.modalService.confirm({
      title: 'Confirm',
      message: `Are you sure you want to update:
      <br> - SiteDbGroupId: <strong>${siteDbGroupId}</strong>
      <br> - QueueId: <strong>${queueId}</strong>
      <br> - StatusId: <strong>${statusIdSelected}</strong>`
    },
      async () => {
        this.isBlock = true;
        const isUpdateSuccessful = await this.appApiService.updateAutoVoidRequestQueue(
          this.initUpdateQuery(siteDbGroupId, queueId, statusIdSelected));
        this.isBlock = false;
        this.openModelResult(isUpdateSuccessful);
      },
      () => { }
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
    this.filterBroadcastSessionIdValue = null;
    this.filterStatusIdValue = 0;
  }

  private convertToAutoVoidRequestQueueViewModel(queues: AutoVoidRequestQueueModel[]): AutoVoidRequestQueueViewModel[] {
    const results: AutoVoidRequestQueueViewModel[] = [];
    for (const server of SiteDbGroupConstant.ServerList) {
      const queuesInCurrentServer = queues.filter(x => x.siteDbGroupId === server.id);
      const viewModel = queuesInCurrentServer.map(x => {
        return {
          ...x,
          siteDbName: server.serverName,
          statusIdSelected: x.statusId
        } as AutoVoidRequestQueueViewModel;
      });

      results.push(...viewModel);
    }

    return results;
  }

  private resetOldResult(): void {
    this.autoVoidRequestQueuesOrigin = [];
    this.autoVoidRequestQueuesViewModel = [];
  }

  private isValidSearchQuery(): boolean {
    if (this.filterBy === 0 && (!this.filterBroadcastSessionIdValue || this.filterBroadcastSessionIdValue.trim() === '')) {
      this.tooltip.display('broadcast-session-id', TEXT.REQUIRED_INPUT);
      return false;
    }

    return true;
  }

  private initGetQuery(): GetAutoVoidRequestQueueModel {
    if (this.filterBy === 0) {
      return {
        broadcastSessionId: this.filterBroadcastSessionIdValue,
        statusId: null
      };
    }

    return {
      broadcastSessionId: null,
      statusId: this.filterStatusIdValue
    };
  }

  private initUpdateQuery(siteDbGroupId: number, queueId: number, statusIdSelected: number) {
    return {
      siteDbGroupId: siteDbGroupId,
      queueId: queueId,
      statusId: statusIdSelected
    } as UpdateAutoVoidRequestQueueModel;
  }
}
