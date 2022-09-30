import { Component, ElementRef, OnInit } from '@angular/core';
import { ModalType } from 'src/utility/components/modal/modal';
import { ModalService } from 'src/utility/components/modal/modal.service';
import { TEXT } from 'src/utility/constants/text';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { AppApiService } from '../app-api.service';
import { ServiceStatusConstant } from '../app.model';
import { UpdateVoidServiceModel, VoidServiceModel, VoidServiceViewModel } from './checking-void-status.model';

@Component({
  selector: 'checking-void-status',
  templateUrl: './checking-void-status.component.html',
  styleUrls: ['./checking-void-status.component.scss']
})
export class CheckingVoidStatusComponent implements OnInit {
  voidServiceDataOrigin: VoidServiceModel[] = [];
  voidServiceDataViewModel: VoidServiceViewModel[] = [];
  voidServiceSelection = ServiceStatusConstant.VoidServiceSelection;
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
    this.voidServiceDataOrigin = await this.appApiService.getVoidServiceData(this.inputBroadcastSessionId);
    this.voidServiceDataViewModel = this.convertToVoidServiceViewModel(this.voidServiceDataOrigin);
    this.isBlock = false;
  }

  confirmUpdateStatus(siteDbGroupId: number, requestId: number, voidingHistoryId: number, statusIdSelected: number) {
    this.modalService.confirm({
      title: 'Confirm',
      message: `Are you sure you want to update:
                <br> - SiteDbGroupId: <strong>${siteDbGroupId}</strong>
                <br> - RequestId: <strong>${requestId}</strong>
                <br> - VoidingHistoryId: <strong>${voidingHistoryId}</strong>
                <br> - StatusId: <strong>${statusIdSelected}</strong>`
    },
      async () => {
        this.isBlock = true;
        const isUpdateSuccessful = await this.appApiService.updateVoidServiceData(
          this.initUpdateQuery(siteDbGroupId, requestId, voidingHistoryId, statusIdSelected));
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
    this.inputBroadcastSessionId = null;
  }


  private resetOldResult(): void {
    this.voidServiceDataOrigin = [];
    this.voidServiceDataViewModel = [];
  }

  private convertToVoidServiceViewModel(voidServiceData: VoidServiceModel[]): VoidServiceViewModel[] {
    return voidServiceData.map(x => {
      return {
        ...x,
        statusIdSelected: x.statusId
      } as VoidServiceViewModel;
    });
  }

  private isValidSearchQuery(): boolean {
    if (!this.inputBroadcastSessionId || this.inputBroadcastSessionId.trim() === '') {
      this.tooltip.display('broadcast-session-id', TEXT.REQUIRED_INPUT);
      return false;
    }

    return true;
  }

  private initUpdateQuery(siteDbGroupId: number, requestId: number, voidingHistoryId: number, statusIdSelected: number) {
    return {
      siteDbGroupId: siteDbGroupId,
      requestId: requestId,
      voidingHistoryId: voidingHistoryId,
      statusId: statusIdSelected
    } as UpdateVoidServiceModel;
  }
}
