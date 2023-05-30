import { Component, ElementRef } from '@angular/core';
import { ModalType } from '../../../utility/components/modal/modal.model';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { TEXT } from '../../../utility/constants/text';
import { AppApiService } from '../app-api.service';
import { ServiceStatusConstant } from '../app.model';
import { GetLetstalkModel, LetstalkModel, LetstalkViewModel, UpdateLetstalkModel } from './letstalk.model';

@Component({
  selector: 'letstalk',
  templateUrl: './letstalk.component.html',
  styleUrls: ['./letstalk.component.scss']
})
export class LetstalkComponent {
  tooltip = new Tooltip();
  isBlock: boolean;
  requestId: number;
  broadcastSessionId: string;
  letstalkModels: LetstalkModel[] = [];
  letstalkViewModels: LetstalkViewModel[] = [];
  letstalkSelection = ServiceStatusConstant.LetstalkSelection;

  constructor(private readonly element: ElementRef,
    private readonly appApiService: AppApiService,
    private readonly modalService: ModalService) {
    this.tooltip.element = this.element;
  }

  public async search(): Promise<void> {
    this.resetOldResult();
    if (!this.isValidSearchQuery()) {
      return;
    }
    this.isBlock = true;
    this.letstalkModels = await this.appApiService.getLetstalk(this.initGetQuery());
    this.letstalkViewModels = this.convertToVoidServiceViewModel(this.letstalkModels);
    this.isBlock = false;
  }

  public clearInput() {
    this.resetOldResult();
    this.requestId = null;
    this.broadcastSessionId = null;
  }


  public confirmUpdateStatus(requestId: number, broadcastSessionId: string, statusIdSelected: number) {
    this.modalService.confirm({
      title: 'Confirm',
      message: `Are you sure you want to update:
      <br> - Request Id: <strong>${requestId}</strong>
      <br> - BroadcastSessionId: <strong>${broadcastSessionId}</strong>
      <br> - StatusId: <strong>${statusIdSelected}</strong>`
    },
      async () => {
        this.isBlock = true;
        const isUpdateSuccessful = await this.appApiService.updateLetstalk(
          this.initUpdateQuery(requestId, broadcastSessionId, statusIdSelected));
        this.isBlock = false;
        this.openModelResult(isUpdateSuccessful);
      },
      () => { }
    );
  }

  private isValidSearchQuery(): boolean {
    if (!this.requestId) {
      this.tooltip.display('request-id', TEXT.REQUIRED_REQUEST_ID);
      return false;
    }

    return true;
  }

  private convertToVoidServiceViewModel(letstalkData: LetstalkModel[]): LetstalkViewModel[] {
    return letstalkData.map(x => {
      return {
        ...x,
        statusIdSelected: x.statusId
      } as LetstalkViewModel;
    });
  }

  private initUpdateQuery(requestId: number, broadcastSessionId: string, statusIdSelected: number) {
    return {
      requestId: requestId,
      broadcastSessionId: broadcastSessionId,
      statusId: statusIdSelected
    } as UpdateLetstalkModel;
  }

  private openModelResult(isSuccess: boolean) {
    this.modalService.open(
      {
        title: 'Update result',
        message: isSuccess ? 'Successful!' : 'Failed!',
        type: isSuccess ? ModalType.Alert : ModalType.Error
      });
  }

  private resetOldResult(): void {
    this.letstalkModels = [];
    this.letstalkViewModels = [];
  }

  private initGetQuery(): GetLetstalkModel {
    return {
      broadcastSessionId: this.broadcastSessionId,
      requestId: this.requestId
    };
  }
}
