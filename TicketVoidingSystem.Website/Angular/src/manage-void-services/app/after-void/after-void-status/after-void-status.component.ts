import { Component, inject, Input, OnChanges, OnInit, SimpleChange } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import * as _ from 'lodash';
import { ModalType } from '../../../../utility/components/modal/modal.model';
import { ModalService } from '../../../../utility/components/modal/modal.service';
import { AppApiService } from '../../app-api.service';
import { Item, SELECTION_ITEM, VoidBetAutomationModel } from '../../app.model';

@Component({
  standalone: true,
  selector: 'after-void-status',
  templateUrl: './after-void-status.component.html',
  styleUrls: ['./after-void-status.component.scss'],
  imports: [CommonModule, FormsModule, NgSelectModule]
})
export class AfterVoidStatusComponent implements OnInit, OnChanges {
  @Input() model = new VoidBetAutomationModel();
  @Input() isAutoVoid: boolean;
  @Input() isRecoverTicket: boolean;
  @Input() isAbnormalBet: boolean;

  selectionItem: Item[] = SELECTION_ITEM;
  tmpModel;

  private readonly modalService = inject(ModalService);
  private readonly appApiService = inject(AppApiService);

  async ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes['model'] && this.model.requestId) {
      this.assignData();
    }
  }

  ngOnInit(): void {
    this.assignData();
  }

  private assignData(): void {
    this.tmpModel = _.clone(this.model);
    this.tmpModel.isRunExternalService = this.tmpModel.isRunExternalService ? this.tmpModel.isRunExternalService : 'null';
    this.tmpModel.isSentBatchMessage = this.tmpModel.isSentBatchMessage ? this.tmpModel.isSentBatchMessage : 'null';
    this.tmpModel.isSentMessageToAdminSite = this.tmpModel.isSentMessageToAdminSite ? this.tmpModel.isSentMessageToAdminSite : 'null';
    this.tmpModel.isInsertedVoidedTransaction = this.tmpModel.isInsertedVoidedTransaction ? this.tmpModel.isInsertedVoidedTransaction : 'null';
    this.tmpModel.isUpdatedVoidingHistory = this.tmpModel.isUpdatedVoidingHistory ? this.tmpModel.isUpdatedVoidingHistory : 'null';
    this.tmpModel.isSentEmail = this.tmpModel.isSentEmail ? this.tmpModel.isSentEmail : 'null';
    this.tmpModel.isDeletedZzzBetTrans = this.tmpModel.isDeletedZzzBetTrans ? this.tmpModel.isDeletedZzzBetTrans : 'null';
    this.tmpModel.isDeletedMessage = this.tmpModel.isDeletedMessage ? this.tmpModel.isDeletedMessage : 'null';
    this.tmpModel.isDeletedVoidedTransaction = this.tmpModel.isDeletedVoidedTransaction ? this.tmpModel.isDeletedVoidedTransaction : 'null';
    this.tmpModel.isSentToMTS = this.tmpModel.isSentToMTS ? this.tmpModel.isSentToMTS : 'null';
  }

  async confirmUpdateAfterVoidData() {
    this.modalService.confirm({
      title: 'Change after void history data confirm',
      message: `Are you sure you want to update after void history data`
      },
      async () => {
        const result = await this.appApiService.updateVoidBetAutomationInfo(this.initQueryUpdate());
        this.openModelResult(result);
      },
      () => {
        this.assignData();
      });
  }

  openModelResult(isSuccess: boolean) {
    this.modalService.open(
      {
        title: 'Change after void history data result',
        message: isSuccess ? 'Successful!' : 'Failed!',
        type: isSuccess ? ModalType.Alert : ModalType.Error
      });
  }

  initQueryUpdate(): VoidBetAutomationModel { //NOSONAR
    const model = new VoidBetAutomationModel();
    model.requestId = this.tmpModel.requestId;
    model.voidingHistoryId = this.tmpModel.voidingHistoryId;
    model.isRunExternalService = this.tmpModel.isRunExternalService === 'null' ? null : this.tmpModel.isRunExternalService;
    model.messageId = this.tmpModel.messageId;
    model.messageIdSpecial = this.tmpModel.messageIdSpecial;
    model.reasonId = this.tmpModel.reasonId;
    model.isSentBatchMessage = this.tmpModel.isSentBatchMessage === 'null' ? null : this.tmpModel.isSentBatchMessage;
    model.isSentMessageToAdminSite = this.tmpModel.isSentMessageToAdminSite === 'null' ? null : this.tmpModel.isSentMessageToAdminSite;
    model.isInsertedVoidedTransaction = this.tmpModel.isInsertedVoidedTransaction === 'null' ? null : this.tmpModel.isInsertedVoidedTransaction;
    model.isUpdatedVoidingHistory = this.tmpModel.isUpdatedVoidingHistory === 'null' ? null : this.tmpModel.isUpdatedVoidingHistory;
    model.isSentEmail = this.tmpModel.isSentEmail === 'null' ? null : this.tmpModel.isSentEmail;
    model.isDeletedZzzBetTrans = this.tmpModel.isDeletedZzzBetTrans === 'null' ? null : this.tmpModel.isDeletedZzzBetTrans;
    model.isDeletedMessage = this.tmpModel.isDeletedMessage === 'null' ? null : this.tmpModel.isDeletedMessage;
    model.isDeletedVoidedTransaction = this.tmpModel.isDeletedVoidedTransaction === 'null' ? null : this.tmpModel.isDeletedVoidedTransaction;
    model.isSentToMTS = this.tmpModel.isSentToMTS === 'null' ? null : this.tmpModel.isSentToMTS;

    return model;
  }
}
