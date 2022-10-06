import { Component, ElementRef, OnInit } from '@angular/core';
import { ModalType } from 'src/utility/components/modal/modal';
import { ModalService } from 'src/utility/components/modal/modal.service';
import { Tooltip } from 'src/utility/components/tooltip/tooltip.model';
import { TEXT } from 'src/utility/constants/text';
import { AppApiService } from '../app-api.service';
import { ServiceStatusConstant } from '../app.model';
import { UpdateVoidingHistory, VoidingHistoryModel, VoidingHistoryViewModel } from './voiding-history.model';

@Component({
  selector: 'voiding-history',
  templateUrl: './voiding-history.component.html',
  styleUrls: ['./voiding-history.component.scss']
})
export class VoidingHistoryComponent implements OnInit {

  voidingHistoryOrigin: VoidingHistoryModel[] = [];
  voidingHistoryViewModel: VoidingHistoryViewModel[] = [];
  voidingHistorySelection = ServiceStatusConstant.VoidingHistorySelection;
  tooltip = new Tooltip();
  isBlock: boolean;
  inputRequestId: number;

  constructor(private readonly element: ElementRef,
    private readonly appApiService: AppApiService,
    private readonly modalService: ModalService) {
    this.tooltip.element = this.element;
  }

  ngOnInit(): void {
  }

  async searchVoidingHistory(): Promise<void> {
    this.resetOldResult();
    if (!this.isValidSearchQuery()) {
      return;
    }

    this.isBlock = true;
    this.voidingHistoryOrigin = await this.appApiService.getVoidingHistory(this.inputRequestId);
    this.voidingHistoryViewModel = this.convertToVoidingHistoryViewModel(this.voidingHistoryOrigin);
    this.isBlock = false;
  }

  confirmUpdateStatus(voidingHistoryId: number, statusIdSelected: number) {
    this.modalService.confirm({
      title: 'Confirm',
      message: `Are you sure you want to update:
                <br> - VoidingHistoryId: <strong>${voidingHistoryId}</strong>
                <br> - StatusId: <strong>${statusIdSelected}</strong>`
    },
      async () => {
        this.isBlock = true;
        const isUpdateSuccessful = await this.appApiService.updateVoidingHistory(
          this.initUpdateQuery(voidingHistoryId, statusIdSelected));
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
    this.inputRequestId = null;
  }

  private convertToVoidingHistoryViewModel(items: VoidingHistoryModel[]): VoidingHistoryViewModel[] {
    return items.map(x => {
      return {
        ...x,
        statusIdSelected: x.statusId
      } as VoidingHistoryViewModel;
    });
  }

  private resetOldResult(): void {
    this.voidingHistoryOrigin = [];
    this.voidingHistoryViewModel = [];
  }

  private isValidSearchQuery(): boolean {
    if (!this.inputRequestId || this.inputRequestId <= 0 || isNaN(Number(this.inputRequestId))) {
      this.tooltip.display('request-id', TEXT.REQUIRED_INPUT);
      return false;
    }

    return true;
  }

  private initUpdateQuery(voidingHistoryId: number, statusIdSelected: number) {
    return {
      voidingHistoryId: voidingHistoryId,
      statusId: statusIdSelected
    } as UpdateVoidingHistory;
  }
}
