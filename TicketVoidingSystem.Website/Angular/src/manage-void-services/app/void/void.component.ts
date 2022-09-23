import { Component, ElementRef, OnInit } from '@angular/core';
import { ModalType } from '../../../utility/components/modal/modal';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { SiteDbGroupConstant } from '../../../utility/constants/config';
import { TEXT } from '../../../utility/constants/text';
import { AppApiService } from '../app-api.service';
import { TicketVoidingQueueModel, TicketVoidingQueueViewModel, VOIDING_QUEUE_STATUS_SELECTION } from './void.model';

@Component({
  selector: 'void',
  templateUrl: './void.component.html',
  styleUrls: ['./void.component.scss']
})
export class VoidComponent implements OnInit {
  voidingQueueStatusSelection = VOIDING_QUEUE_STATUS_SELECTION;
  inputVoidingHistoryId: number;
  isBlock: boolean;
  voidingQueuesOrigin: TicketVoidingQueueModel[] = [];
  voidingQueuesViewModel: TicketVoidingQueueViewModel[] = [];
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
    this.isBlock = false;
  }

  confirmUpdateStatus(siteDbName: string, siteDbGroupId: number, queueId: number, statusIdSelected: number) {
    this.modalService.confirm({
      title: 'Confirm',
      message: `Are you sure you want to update:<br> - <strong>${siteDbName}</strong><br> - QueueId: <strong>${queueId}</strong><br> - StatusId: <strong>${statusIdSelected}</strong>`
    },
      async () => {
        // this.isBlock = true;
        // const isUpdateSuccessful = await this.appApiService.updateAutoVoidRequestQueue(
        //   this.initUpdateQuery(siteDbGroupId, queueId, statusIdSelected));
        // this.isBlock = false;
        // this.openModelResult(isUpdateSuccessful);
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

  private resetOldResult(): void {
    this.voidingQueuesOrigin = [];
    this.voidingQueuesViewModel = [];
  }

  private isValidSearchQuery(): boolean {
    if (!this.inputVoidingHistoryId || this.inputVoidingHistoryId <= 0) {
      this.tooltip.display('voiding-history-id', TEXT.REQUIRED_INPUT);
      return false;
    }

    return true;
  }
}
