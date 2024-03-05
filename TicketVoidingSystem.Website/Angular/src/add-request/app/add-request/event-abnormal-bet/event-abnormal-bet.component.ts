import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { BetIdsComponent } from '../../../../utility/components/bet-ids/bet-ids.component';
import { AbnormalFilterBy } from '../../../../utility/constants/config';
import { StaticService } from '../../../../utility/services/static.service';
import { AddRequestApiService } from '../add-request-api.service';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { AbnormalBetModel } from '../models/abnormal-bet.model';
import { PermissionAddRequest } from '../models/permission-add-request.model';
import { OthersModel } from '../others/others.model';
import { PopupService } from '../services/popup.service';
import { ConfirmAbnormalBetComponent } from './confirm-abnormal-bet/confirm-abnormal-bet.component';
import { ConfirmAbnormalBetModel } from './confirm-abnormal-bet/confirm-abnormal-bet.model';
import { AbnormalBetTicketViewModel, PrimitiveProperty } from './event-abnormal-bet.model';
import { LeagueEventAbnormalComponent } from './league-event-abnormal/league-event-abnormal.component';
import { SaveRequestArg } from './services/save-request.model';
import { SaveRequestService } from './services/save-request.service';
import { ValidationBusinessRuleArgs, ValidationBusinessRuleOutput } from './services/validation.model';
import { ValidationService } from './services/validation.service';

@Component({
  selector: 'event-abnormal-bet',
  templateUrl: './event-abnormal-bet.component.html',
  styleUrls: ['./event-abnormal-bet.component.scss']
})
export class EventAbnormalBetComponent implements OnInit {
  @Input() isEdit: boolean;
  @Input() requestId?: number;
  @Input() filter: FilterModel;
  @Input() userId: number;
  @Input() requestedBy: string;
  @Input() others = new OthersModel();
  @Input() actionIdOfFirstTimeAccess: string;
  @Input() abnormalBetModel = new AbnormalBetModel();
  @Output() updateMatchId = new EventEmitter<number>();

  @ViewChild('betIds') betIdsComponent: BetIdsComponent;
  @ViewChild('leagueEventAbnormal') leagueEventAbnormalComponent: LeagueEventAbnormalComponent;
  @ViewChild('confirmAbnormalBetComponent') confirmAbnormalBetComponent: ConfirmAbnormalBetComponent;

  primitiveProps = new PrimitiveProperty();
  permission = new PermissionAddRequest();
  confirmAbnormalBetModel = new ConfirmAbnormalBetModel();
  isCancelAfterFocusOutBetIdsEvent = false;
  abnormalFilterBy = new AbnormalFilterBy();
  exportTickets: AbnormalBetTicketViewModel[];

  constructor(private readonly popupService: PopupService,
    private readonly validationService: ValidationService,
    private readonly saveRequestService: SaveRequestService,
    private readonly addRequestStore: AddRequestStore,
    private readonly addRequestApiService: AddRequestApiService
  ) { }

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
    this.addRequestStore.changeBlockingUiStatus(true);
    if (this.filter.isVoided) {
      await this.checkIfRequestHasWarning(new ConfirmAbnormalBetModel());
      this.addRequestStore.changeBlockingUiStatus(false);

      return;
    }

    await this.saveWhenRequestNotVoided();
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  public removeInvalidTransIds(): void {
    this.betIdsComponent.removeTransId(this.primitiveProps.invalidTransIds);
    this.primitiveProps.isShowButtonRemoveInvalid = false;
    let invalidTransIds = this.primitiveProps.invalidTransIds.split(',');
    this.exportTickets = this.exportTickets.filter(x => !(invalidTransIds.includes(x.betId)));
  }

  triggerCloseEvent() {
    this.addRequestStore.changeSavingRequestStatus(false);
  }

  changeFilterBy(filterBy: number) {
    this.abnormalBetModel.filterBy = filterBy;
    this.addRequestStore.changeAbnormalFilterBy(filterBy);
  }

  private async saveWhenRequestNotVoided(): Promise<void> {
    this.isCancelAfterFocusOutBetIdsEvent = true;
    this.betIdsComponent.triggerFocusOutBetIds();
    this.isCancelAfterFocusOutBetIdsEvent = false;

    const validation = await this.checkValidBusinessRule(false);
    if (validation.isValid) {
      this.confirmAbnormalBetModel = validation.warningModel;
      await this.checkIfRequestHasWarning(validation.warningModel);
    } else {
      this.addRequestStore.changeSavingRequestStatus(false);
    }
  }

  private async checkIfRequestHasWarning(warningModel: ConfirmAbnormalBetModel): Promise<void> {
    let isHasWarningForAbnormalBet = false;
    let isHasWarningEditTakeNoteRequest = false;

    if (!this.filter.isVoided) {
      isHasWarningForAbnormalBet = this.validationService.isValidationHasWarningTicket(this.permission, warningModel);
      isHasWarningEditTakeNoteRequest = this.validationService.isHasWarningEditTakeNoteRequest(this.isEdit, this.filter.action, this.actionIdOfFirstTimeAccess);
    }

    warningModel.isEditingByAnotherUser =
      this.validationService.isEditingByAnotherUser(this.isEdit, Number(document.getElementById('body').getAttribute('user-id')), this.userId);
    if (isHasWarningForAbnormalBet || isHasWarningEditTakeNoteRequest || warningModel.isEditingByAnotherUser || warningModel.isHasWarningRemovedTickets) {
      this.openConfirmAbnormalBet(isHasWarningForAbnormalBet, isHasWarningEditTakeNoteRequest, this.betIdsComponent.getAllBetIds(), warningModel);
    } else {
      await this.executeApiSaveRequest();
    }
  }

  private openConfirmAbnormalBet(isHasWarningForAbnormalBet: boolean, isHasWarningEditTakeNoteRequest: boolean, transIds: string, warningModel: ConfirmAbnormalBetModel): void {
    this.confirmAbnormalBetModel = warningModel;
    this.confirmAbnormalBetModel.isOpenDialog = true;
    this.confirmAbnormalBetModel.isHasWarningForAbnormalBet = isHasWarningForAbnormalBet;
    this.confirmAbnormalBetModel.isHasWarningEditTakeNoteRequest = isHasWarningEditTakeNoteRequest;
    this.confirmAbnormalBetModel.isHasWarningRemovedTickets = warningModel.isHasWarningRemovedTickets;
    this.confirmAbnormalBetModel.transIds = transIds;
    this.confirmAbnormalBetModel.requestId = this.requestId;
    this.confirmAbnormalBetModel.requestedBy = this.requestedBy;
    this.confirmAbnormalBetModel = _.clone(this.confirmAbnormalBetModel);
  }

  initCheckValidBusinessRuleQuery(isValidateFromConfirmPopup: boolean): ValidationBusinessRuleArgs{
    const args = new ValidationBusinessRuleArgs();
    args.actionId = this.filter.action;
    args.requestId = this.requestId;
    args.permission = this.permission;
    args.betIdsComponent = this.betIdsComponent;
    args.filterBy = this.abnormalBetModel.filterBy;
    args.issueTypeId = this.filter.issueTypeId;
    args.subIssueTypeId = this.filter.subIssueTypeId;
    args.leagueEventAbnormalComponent = this.leagueEventAbnormalComponent;
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
    if (this.abnormalBetModel.filterBy !== AbnormalFilterBy.MIX_PARLAY) {
      this.updateMatchId.emit(this.leagueEventAbnormalComponent.selectedMatchId);
    }
    return validation;
  }

  private async executeApiSaveRequest(): Promise<void> {
    const args = new SaveRequestArg();
    args.primitiveProps = this.primitiveProps;
    args.requestId = this.requestId;
    args.isEdit = this.isEdit;
    args.transIds = this.betIdsComponent.getAllBetIds();
    args.filter = this.filter;
    args.filterBy = this.abnormalBetModel.filterBy;
    args.abnormalBetModel = this.abnormalBetModel;
    args.others = this.others;
    args.confirmAbnormalBetModel = this.confirmAbnormalBetModel;
    args.leagueEventAbnormalComponent = this.leagueEventAbnormalComponent;
    args.confirmAbnormalBetComponent = this.confirmAbnormalBetComponent;
    args.addRequestStore = this.addRequestStore;

    await this.saveRequestService.executeSave(args);
  }

  public isAbnormalBet(): boolean {
    return StaticService.isAbnormalBet(this.filter.issueTypeId);
  }

  public isShowLeagueEvent(): boolean {
    return !(this.isAbnormalBet() && this.abnormalBetModel.filterBy === AbnormalFilterBy.MIX_PARLAY);
  }

  public async exportExcel() {
    this.primitiveProps.isBlockUI = true;
    const args = this.initCheckValidBusinessRuleQuery(false);
    await this.validationService.exportExcelAbnormalBetTickets(args)
    this.primitiveProps.isBlockUI = false;
  }
}
