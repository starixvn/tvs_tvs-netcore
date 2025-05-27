import { Component, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalType } from '../../../utility/components/modal/modal.model';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { TEXT } from '../../../utility/constants/text';
import { AppApiService } from '../app-api.service';
import { ServiceStatusConstant } from '../app.model';
import { GetLetsTalkModel, LetsTalkModel, LetsTalkViewModel, UpdateLetsTalkModel } from './letstalk.model';
import { TooltipComponent } from '../../../utility/components/tooltip/tooltip.component';
import { BlockFullUiComponent } from '../../../utility/components/block-full-ui/block-full-ui.component';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  standalone: true,
  selector: 'letstalk',
  templateUrl: './letstalk.component.html',
  styleUrls: ['./letstalk.component.scss'],
  imports: [CommonModule, FormsModule, NgbAccordionModule, BlockFullUiComponent, TooltipComponent, NgSelectModule]
})
export class LetsTalkComponent {
  tooltip = new Tooltip();
  isBlock: boolean;
  requestId: number;
  broadcastSessionId: string;
  letsTalkModels: LetsTalkModel[] = [];
  letsTalkViewModels: LetsTalkViewModel[] = [];
  letsTalkSelection = ServiceStatusConstant.LetsTalkSelection;

  private readonly element = inject(ElementRef);
  private readonly appApiService = inject(AppApiService);
  private readonly modalService = inject(ModalService);

  constructor() {
    this.tooltip.element = this.element;
  }

  public async search(): Promise<void> {
    this.resetOldResult();
    if (!this.isValidSearchQuery()) {
      return;
    }
    this.isBlock = true;
    this.letsTalkModels = await this.appApiService.getLetsTalk(this.initGetQuery());
    this.letsTalkViewModels = this.convertToVoidServiceViewModel(this.letsTalkModels);
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

  private convertToVoidServiceViewModel(letsTalkData: LetsTalkModel[]): LetsTalkViewModel[] {
    return letsTalkData.map(x => {
      return {
        ...x,
        statusIdSelected: x.statusId
      } as LetsTalkViewModel;
    });
  }

  private initUpdateQuery(requestId: number, broadcastSessionId: string, statusIdSelected: number) {
    return {
      requestId: requestId,
      broadcastSessionId: broadcastSessionId,
      statusId: statusIdSelected
    } as UpdateLetsTalkModel;
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
    this.letsTalkModels = [];
    this.letsTalkViewModels = [];
  }

  private initGetQuery(): GetLetsTalkModel {
    return {
      broadcastSessionId: this.broadcastSessionId,
      requestId: this.requestId
    };
  }
}
