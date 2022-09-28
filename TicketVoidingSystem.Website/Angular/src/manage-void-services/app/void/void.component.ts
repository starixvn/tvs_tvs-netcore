import { Component, ElementRef, OnInit } from '@angular/core';
import { ModalType } from '../../../utility/components/modal/modal';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { SiteDbGroupConstant } from '../../../utility/constants/config';
import { TEXT } from '../../../utility/constants/text';
import { AppApiService } from '../app-api.service';
import { ServiceStatusConstant } from '../app.model';
import { FailedVoidingQueueViewModel, TicketVoidingQueueModel, TicketVoidingQueueViewModel, UpdateTicketVoidingQueueModel } from './void.model';

@Component({
  selector: 'void',
  templateUrl: './void.component.html',
  styleUrls: ['./void.component.scss']
})
export class VoidComponent implements OnInit {
  voidingQueueStatusSelection = ServiceStatusConstant.TicketVoidingQueueSelection;
  inputVoidingHistoryId: number;
  isBlock: boolean;
  voidingQueuesOrigin: TicketVoidingQueueModel[] = [];
  voidingQueuesViewModel: TicketVoidingQueueViewModel[] = [];
  failedVoidingQueues: FailedVoidingQueueViewModel[] = [];
  tooltip = new Tooltip();

  constructor(private readonly element: ElementRef,
    private readonly appApiService: AppApiService,
    private readonly modalService: ModalService) {
    this.tooltip.element = this.element;
  }

  ngOnInit(): void {
  }

  async searchVoidingQueue(): Promise<void> {
    this.resetOldResult();
    if (!this.isValidSearchQuery()) {
      return;
    }
    this.isBlock = true;
    this.voidingQueuesOrigin = await this.appApiService.getTicketVoidingQueue(this.inputVoidingHistoryId);
    this.voidingQueuesViewModel = this.convertToTicketVoidingQueueViewModel(this.voidingQueuesOrigin);
    this.failedVoidingQueues = this.getFailedVoidingQueues(this.voidingQueuesOrigin);
    this.isBlock = false;
  }

  confirmUpdateFailedQueuesToRunning(siteDbGroupId: number, queueIds: string): Promise<void> {
    if (!queueIds || queueIds.trim() === '') {
      return;
    }

    this.modalService.confirm({
      title: 'Confirm',
      message: `Are you sure you want to update:
                <br> - SiteDbGroupId: <strong>${siteDbGroupId}</strong>
                <br> - Failed Queues: <strong>${queueIds}</strong>
                <br> - Status: <strong>Running</strong>`
    },
      async () => {
        this.isBlock = true;
        const isUpdateSuccessful = await this.appApiService.updateTicketVoidingQueue(
          this.initUpdateQuery(siteDbGroupId, queueIds, ServiceStatusConstant.Running));
        this.isBlock = false;
        this.openModelResult(isUpdateSuccessful);
      },
      () => {}
    );
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
        const isUpdateSuccessful = await this.appApiService.updateTicketVoidingQueue(
          this.initUpdateQuery(siteDbGroupId, queueId.toString(), statusIdSelected));
        this.isBlock = false;
        this.openModelResult(isUpdateSuccessful);
      },
      () => {}
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
    this.inputVoidingHistoryId = null;
  }

  private convertToTicketVoidingQueueViewModel(queues: TicketVoidingQueueModel[]): TicketVoidingQueueViewModel[] {
    const results: TicketVoidingQueueViewModel[] = [];
    for (const server of SiteDbGroupConstant.ServerList) {
      const queuesInCurrentServer = queues.filter(x => x.siteDbGroupId === server.id);
      const viewModel = queuesInCurrentServer.map(x => {
        return {
          ...x,
          siteDbName: server.serverName,
          statusIdSelected: x.statusId
        } as TicketVoidingQueueViewModel;
      });

      results.push(...viewModel);
    }

    return results;
  }

  private getFailedVoidingQueues(queues: TicketVoidingQueueModel[]): FailedVoidingQueueViewModel[] {
    const results: FailedVoidingQueueViewModel[] = [];
    for (const server of SiteDbGroupConstant.ServerList) {
      const failedQueues = queues.filter(x => x.siteDbGroupId === server.id && x.statusId === ServiceStatusConstant.Failed)
        .map(x => x.queueId);
      if (failedQueues.length > 0) {
        results.push({
          siteDbName: server.serverName,
          siteDbGroupId: server.id,
          queueIds: failedQueues.join(',')
        });
      }
    }

    return results;
  }

  private resetOldResult(): void {
    this.voidingQueuesOrigin = [];
    this.voidingQueuesViewModel = [];
    this.failedVoidingQueues = [];
  }

  private isValidSearchQuery(): boolean {
    if (!this.inputVoidingHistoryId || this.inputVoidingHistoryId <= 0) {
      this.tooltip.display('voiding-history-id', TEXT.REQUIRED_INPUT);
      return false;
    }

    return true;
  }

  private initUpdateQuery(siteDbGroupId: number, queueIds: string, statusIdSelected: number) {
    return {
      siteDbGroupId: siteDbGroupId,
      queueIds: queueIds,
      statusId: statusIdSelected
    } as UpdateTicketVoidingQueueModel;
  }
}
