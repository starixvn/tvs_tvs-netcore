import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as _ from 'lodash';
import { BetIdsComponent } from '../../../../utility/components/bet-ids/bet-ids.component';
import { BlockUiModule } from '../../../../utility/components/block-ui/block-ui.module';
import { AbnormalFilterBy, TVSRequestActionType } from '../../../../utility/constants/config';
import { StaticService } from '../../../../utility/services/static.service';
import { AddRequestApiService } from '../add-request-api.service';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { IssueTypes } from '../filter/issue-types.model';
import { AbnormalBetModel } from '../models/abnormal-bet.model';
import { PermissionAddRequest } from '../models/permission-add-request.model';
import { OthersModel } from '../others/others.model';
import { PopupService } from '../services/popup.service';
import { ConfirmAbnormalBetComponent } from './confirm-abnormal-bet/confirm-abnormal-bet.component';
import { ConfirmAbnormalBetModel } from './confirm-abnormal-bet/confirm-abnormal-bet.model';
import { AbnormalBetTicketViewModel, PrimitiveProperty, ValidationAbnormalBet } from './event-abnormal-bet.model';
import { SaveRequestArg } from './services/save-request.model';
import { SaveRequestService } from './services/save-request.service';
import { ValidationBusinessRuleArgs, ValidationBusinessRuleOutput } from './services/validation.model';
import { ValidationService } from './services/validation.service';

@Component({
  selector: 'event-abnormal-bet',
  templateUrl: './event-abnormal-bet.component.html',
  styleUrls: ['./event-abnormal-bet.component.scss'],
  standalone: true,
  imports: [FormsModule, BetIdsComponent, ConfirmAbnormalBetComponent, BlockUiModule, CommonModule],
  providers: [SaveRequestService, ValidationService]
})
export class EventAbnormalBetComponent implements OnInit {
  @Input() isEdit: boolean;
  @Input() requestId?: number;
  @Input() filter: FilterModel;
  @Input() issueTypes = new IssueTypes();
  @Input() userId: number;
  @Input() requestedBy: string;
  @Input() others = new OthersModel();
  @Input() actionIdOfFirstTimeAccess: string;
  @Input() abnormalBetModel = new AbnormalBetModel();
  @ViewChild('betIds') betIdsComponent: BetIdsComponent;
  @ViewChild('confirmAbnormalBetComponent') confirmAbnormalBetComponent: ConfirmAbnormalBetComponent;

  primitiveProps = new PrimitiveProperty();
  permission = new PermissionAddRequest();
  confirmAbnormalBetModel = new ConfirmAbnormalBetModel();
  isCancelAfterFocusOutBetIdsEvent = false;
  abnormalFilterBy = new AbnormalFilterBy();
  exportTickets: AbnormalBetTicketViewModel[];
  private readonly popupService = inject(PopupService);
  private readonly validationService = inject(ValidationService);
  private readonly saveRequestService = inject(SaveRequestService);
  private readonly addRequestStore = inject(AddRequestStore);
  private readonly addRequestApiService = inject(AddRequestApiService);

  async ngOnInit(): Promise<void> {
    if (!this.isEdit) {
      this.abnormalBetModel.filterBy = AbnormalFilterBy.SINGLE;
    }
    this.addRequestStore.changeAbnormalFilterBy(this.abnormalBetModel.filterBy);
    this.permission = await this.addRequestApiService.getPermissionAddRequest();
  }

  isShowButtonExportTicket(): boolean {
    return this.betIdsComponent?.groupNumber?.items.length > 0 && !this.filter.isVoided;
  }

  async afterFocusOutBetIds(): Promise<void> {
    this.addRequestStore.changeStartTimeFilterAnalysis(new Date());
    this.updateAbnormalBetModel();
    if (!this.isCancelAfterFocusOutBetIdsEvent) {
      this.primitiveProps.isBlockBetIds = true;
      await this.checkValidBusinessRule(false);
      this.primitiveProps.isBlockBetIds = false;
    }
  }

  async onYesConfirmWarningModal(): Promise<void> {
    // validate again
    this.addRequestStore.changeBlockingUiStatus(true);
    const validation = this.filter.isVoided ? { isValid: true } as ValidationBusinessRuleOutput : await this.checkValidBusinessRule(true);
    if (validation.isValid) {
      await this.executeApiSaveRequest();
    } else {
      this.popupService.showError('There are some invalid Bet ID(s) in this request, please check again!');
      this.addRequestStore.changeSavingRequestStatus(false);
    }
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  async saveRequest(): Promise<void> {
    this.updateAbnormalBetModel();
    this.addRequestStore.changeBlockingUiStatus(true);
    if (this.filter.isVoided) {
      this.openConfirmAbnormalBet(new ValidationAbnormalBet());
      this.addRequestStore.changeBlockingUiStatus(false);

      return;
    }

    await this.saveWhenRequestNotVoided();
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  public removeInvalidTransIds(): void {
    this.betIdsComponent.removeTransId(this.primitiveProps.invalidTransIds);
    this.primitiveProps.isShowButtonRemoveInvalid = false;
    const invalidTransIds = this.primitiveProps.invalidTransIds.split(',');
    this.exportTickets = this.exportTickets.filter(x => !(invalidTransIds.includes(x.betId)));
  }

  triggerCloseEvent() {
    this.addRequestStore.changeSavingRequestStatus(false);
  }

  changeFilterBy(filterBy: number) {
    this.abnormalBetModel.filterBy = filterBy;
    this.addRequestStore.changeAbnormalFilterBy(filterBy);
    if (!StaticService.isFilterBySingle(filterBy)) {
      this.abnormalBetModel.matches = [];
    }
  }

  private async saveWhenRequestNotVoided(): Promise<void> {
    this.isCancelAfterFocusOutBetIdsEvent = true;
    this.betIdsComponent.triggerFocusOutBetIds();
    this.isCancelAfterFocusOutBetIdsEvent = false;

    const validation = await this.checkValidBusinessRule(false);
    if (validation.isValid) {
      this.openConfirmAbnormalBet(validation.warningModel);
    } else {
      this.addRequestStore.changeSavingRequestStatus(false);
    }
  }

  private openConfirmAbnormalBet(validationResult: ValidationAbnormalBet): void {
    this.confirmAbnormalBetModel = new ConfirmAbnormalBetModel();
    this.confirmAbnormalBetModel.isOpenDialog = true;
    this.confirmAbnormalBetModel.issueTypeName = this.issueTypes.issueTypes.find(x => x.issueTypeId.toString() === this.filter.issueTypeId).issueTypeName;
    this.confirmAbnormalBetModel.subIssueTypeName = this.issueTypes.selectedSubIssueTypes.find(x => x.subIssueTypeId.toString() === this.filter.subIssueTypeId).subIssueTypeName;
    this.confirmAbnormalBetModel.actionName = TVSRequestActionType.NAME_MAPPING[this.filter.action];
    this.confirmAbnormalBetModel.isHasWarningForAbnormalBet = !this.filter.isVoided ? this.validationService.isValidationHasWarningTicket(this.permission, validationResult) : false;
    this.confirmAbnormalBetModel.isHasWarningEditTakeNoteRequest = !this.filter.isVoided ? this.validationService.isHasWarningEditTakeNoteRequest(this.isEdit, this.filter.action, this.actionIdOfFirstTimeAccess) : false;
    this.confirmAbnormalBetModel.settledTickets = validationResult.settledTransIds;
    this.confirmAbnormalBetModel.ticketsOfVIPCustomer = validationResult.transIdsOfVIPCustomer;
    this.confirmAbnormalBetModel.ticketsOfCustomerClass201 = validationResult.transIdsOfCustomerClass201;
    this.confirmAbnormalBetModel.ticketsOfCustomerClass4K = validationResult.transIdsOfCustomerClass4K;
    this.confirmAbnormalBetModel.isHasWarningRemovedTickets = validationResult.isHasWarningRemovedTickets;
    this.confirmAbnormalBetModel.isEditingByAnotherUser = this.validationService.isEditingByAnotherUser(this.isEdit, Number(document.getElementById('body').getAttribute('user-id')), this.userId);
    this.confirmAbnormalBetModel.transIds = this.betIdsComponent.getAllBetIds();
    this.confirmAbnormalBetModel.requestId = this.requestId;
    this.confirmAbnormalBetModel.requestedBy = this.requestedBy;
    this.confirmAbnormalBetModel = _.clone(this.confirmAbnormalBetModel);
  }

  initCheckValidBusinessRuleQuery(isValidateFromConfirmPopup: boolean): ValidationBusinessRuleArgs {
    const args = new ValidationBusinessRuleArgs();
    args.actionId = this.filter.action;
    args.requestId = this.requestId;
    args.permission = this.permission;
    args.betIdsComponent = this.betIdsComponent;
    args.issueTypeId = this.filter.issueTypeId;
    args.abnormalBetModel = this.abnormalBetModel;
    args.confirmAbnormalBetComponent = this.confirmAbnormalBetComponent;
    args.primitiveProps = this.primitiveProps;
    args.isValidateFromConfirmPopup = isValidateFromConfirmPopup;

    return args;
  }

  private async checkValidBusinessRule(isValidateFromConfirmPopup: boolean): Promise<ValidationBusinessRuleOutput> {
    const args = this.initCheckValidBusinessRuleQuery(isValidateFromConfirmPopup);
    const validation = await this.validationService.checkValidBusinessRule(args);
    this.exportTickets = validation.abnormalBetTicketRequests;
    this.primitiveProps.transInfoAddRequestModel = validation.transInfoAddRequestModel;

    return validation;
  }

  private async executeApiSaveRequest(): Promise<void> {
    const args = new SaveRequestArg();
    args.primitiveProps = this.primitiveProps;
    args.requestId = this.requestId;
    args.isEdit = this.isEdit;
    args.filter = this.filter;
    args.abnormalBetModel = this.abnormalBetModel;
    args.others = this.others;
    args.confirmAbnormalBetModel = this.confirmAbnormalBetModel;
    args.confirmAbnormalBetComponent = this.confirmAbnormalBetComponent;
    args.addRequestStore = this.addRequestStore;

    await this.saveRequestService.executeSave(args);
  }

  public isAbnormalBet(): boolean {
    return StaticService.isAbnormalBet(this.filter.issueTypeId);
  }

  public isFilterBySingle(): boolean {
    return StaticService.isFilterBySingle(this.abnormalBetModel.filterBy);
  }

  public async exportExcel() {
    this.primitiveProps.isBlockUI = true;
    const args = this.initCheckValidBusinessRuleQuery(false);
    await this.validationService.exportExcelAbnormalBetTickets(args)
    this.primitiveProps.isBlockUI = false;
  }

  private updateAbnormalBetModel() {
    this.abnormalBetModel.transIds = this.betIdsComponent.getAllBetIds();
    this.abnormalBetModel.subIssueTypeId = Number(this.filter.subIssueTypeId)
  }
}
