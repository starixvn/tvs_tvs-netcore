import { Component, ElementRef, OnInit } from '@angular/core';
import { ModalType } from 'src/utility/components/modal/modal';
import { ModalService } from 'src/utility/components/modal/modal.service';
import { TEXT } from 'src/utility/constants/text';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { AppApiService } from '../app-api.service';
import { UpdateVoidServiceModel, VoidServiceModel, VoidServiceViewModel, VOID_SERVICE_STATUS_SELECTION } from './checking-void-status.model';

@Component({
  selector: 'checking-void-status',
  templateUrl: './checking-void-status.component.html',
  styleUrls: ['./checking-void-status.component.scss']
})
export class CheckingVoidStatusComponent implements OnInit {
  voidServiceDataOrigin: VoidServiceModel[] = [];
  voidServiceDataViewModel: VoidServiceViewModel[] = [];
  voidServiceSelection = VOID_SERVICE_STATUS_SELECTION;
  tooltip = new Tooltip();
  isBlock: boolean;
  inputBroadcastSessionId: string;

  constructor(private readonly element: ElementRef,
    private readonly appApiService: AppApiService,
    private readonly modalService: ModalService) {
    this.tooltip.element = this.element;
  }

  ngOnInit(): void {
  }

  async searchVoidServiceData(): Promise<void> {
    this.resetOldResult();
    if (!this.isValidSearchQuery()) {
      return;
    }
    this.isBlock = true;
    // this.autoVoidRequestQueuesOrigin = await this.appApiService.getAutoVoidRequestQueue(this.inputBroadcastSessionId);
    this.autoVoidRequestQueuesViewModel = this.convertToAutoVoidRequestQueueViewModel(this.autoVoidRequestQueuesOrigin);
    this.isBlock = false;
  }

  confirmUpdateStatus(siteDbGroupId: number, requestId: number, voidingHistoryId: number, statusIdSelected: number) {
    this.modalService.confirm({
      title: 'Confirm',
      message: `Are you sure you want to update:<br> - SiteDbGroupId: <strong>${siteDbGroupId}</strong>
                <br> - RequestId: <strong>${requestId}</strong><br> - VoidingHistoryId: <strong>${voidingHistoryId}</strong>
                <br> - StatusId: <strong>${statusIdSelected}</strong>`
    },
      async () => {
        this.isBlock = true;
        // const isUpdateSuccessful = await this.appApiService.updateAutoVoidRequestQueue(
        //   this.initUpdateQuery(siteDbGroupId, queueId, statusIdSelected));
        this.isBlock = false;
       // this.openModelResult(isUpdateSuccessful);
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
    this.inputBroadcastSessionId = null;
  }


  private resetOldResult(): void {
    this.autoVoidRequestQueuesOrigin = [];
    this.autoVoidRequestQueuesViewModel = [];
  }

  private convertToAutoVoidRequestQueueViewModel(voidServiceData: VoidServiceModel[]): VoidServiceViewModel[] {
    // const results: VoidServiceViewModel[] = [];
    // for (const server of SiteDbGroupConstant.ServerList) {
    //   const queuesInCurrentServer = voidServiceData.filter(x => x.siteDbGroupId === server.id);
    //   const viewModel = queuesInCurrentServer.map(x => {
    //     return {
    //       ...x,
    //       siteDbName: server.serverName,
    //       statusIdSelected: x.statusId
    //     } as AutoVoidRequestQueueViewModel;
    //   });

    //   results.push(...viewModel);
    // }

    // return results;
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
    } as UpdateVoidServiceModel;
  }

}
