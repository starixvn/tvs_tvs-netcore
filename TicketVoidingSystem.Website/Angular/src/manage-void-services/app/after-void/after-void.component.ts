import { Component, ElementRef } from '@angular/core';
import { IssueTypeConstant } from 'src/utility/constants/issue-type.constant';
import { CommonService } from 'src/utility/services/common.service';
import { ModalType } from '../../../utility/components/modal/modal.model';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { TEXT } from '../../../utility/constants/text';
import { AppApiService } from '../app-api.service';
import { SelectVoidBetAutomationInfoQuery, ServiceStatusConstant, VoidBetAutomationModel } from '../app.model';

@Component({
  selector: 'after-void',
  templateUrl: './after-void.component.html',
  styleUrls: ['./after-void.component.scss']
})
export class AfterVoidComponent {
  selectionItem = ServiceStatusConstant.AfterVoidSelection;
  model = new VoidBetAutomationModel();
  requestId: number;
  voidingHistoryId: number;
  isBlock: boolean;
  isNoData = false;
  orgStatusId: number;
  tmpStatusId: number;
  isRecoverTicket: boolean;
  isAbnormalBet: boolean;
  tooltip = new Tooltip();

  constructor(
    readonly element: ElementRef,
    private readonly appApiService: AppApiService,
    private readonly modalService: ModalService,
    private readonly commonService: CommonService
  ) {
    this.tooltip.element = this.element;
  }

  resetData() {
    this.isNoData = false;
    this.model = new VoidBetAutomationModel();
  }

  async search() {
    this.resetData();
    if (!this.isValidSearchQuery()) {
      return;
    }
    this.isBlock = true;
    this.model = await this.appApiService.getVoidBetAutomationInfo(this.initQuerySelect());
    await this.updateInfoRequest();
    this.isBlock = false;
    if (!this.model || !this.model.requestId) {
      this.isNoData = true;
    }
    this.orgStatusId = this.tmpStatusId = this.model?.statusId;
  }

  async updateInfoRequest() {
    const requestDetailViewModel = await this.commonService.getRequestById(this.model.requestId);
    this.isRecoverTicket = requestDetailViewModel.request.issueTypeId.toString() === IssueTypeConstant.RECOVER_TICKET;
    this.isAbnormalBet = requestDetailViewModel.request.issueTypeId.toString() === IssueTypeConstant.ABNORMAL_BET;
  }

  initQuerySelect(): SelectVoidBetAutomationInfoQuery {
    const query: SelectVoidBetAutomationInfoQuery = {
      requestId: this.requestId,
      voidingHistoryId: this.voidingHistoryId
    };

    return query;
  }

  isValidSearchQuery(): boolean {
    if (this.requestId && this.voidingHistoryId) {
      return true;
    } else if (!this.requestId) {
      this.tooltip.display('request-id', TEXT.REQUIRED_REQUEST_ID);
    } else if (!this.voidingHistoryId) {
      this.tooltip.display('voiding-history-id', TEXT.REQUIRED_VOIDING_HISTORY_ID);
    }

    return false;
  }

  confirmUpdateStatus() {
    this.modalService.confirm({
      title: 'Change Status VoidBet Automation Data Confirm',
      message: `Are you sure you want to update status`
    },
      async () => {
        this.isBlock = true;
        const result = await this.appApiService.updateVoidBetAutomationInfo(this.initQueryUpdate());
        this.isBlock = false;
        this.openModelResult(result);
      },
      () => {
        this.tmpStatusId = this.orgStatusId;
      }
    );
  }

  openModelResult(isSuccess: boolean) {
    this.modalService.open(
      {
        title: 'Change Status VoidBet Automation Data result',
        message: isSuccess ? 'Successful!' : 'Failed!',
        type: isSuccess ? ModalType.Alert : ModalType.Error
      });
  }

  initQueryUpdate(): VoidBetAutomationModel {
    const model = new VoidBetAutomationModel();
    model.requestId = this.model.requestId;
    model.voidingHistoryId = this.model.voidingHistoryId;
    model.statusId = Number(this.tmpStatusId);

    return model;
  }

  isShow(): boolean {
    if (this.model && this.model.requestId) {
      return true;
    }

    return false;
  }
}
