import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PermissionManage } from 'src/manage-request/app/models/permission-manage.model';
import { BetIdsComponent } from 'src/utility/components/bet-ids/bet-ids.component';
import { AbnormalFilterBy } from 'src/utility/constants/config';
import { CommonService } from 'src/utility/services/common.service';
import { AddRequestStore } from '../add-request.store';
import { LeagueEventAbnormalComponent } from '../event-abnormal-bet/league-event-abnormal/league-event-abnormal.component';
import { FilterModel } from '../filter/filter.model';
import { EventDuplicateTicketsModel } from '../models/event-duplicate-tickets.model';
import { OthersModel } from '../others/others.model';
import { PopupService } from '../services/popup.service';
import { PrimitiveProperty } from './models/primitive-property.model';
import { SaveRequestArg } from './models/save-request-arg.model';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';

@Component({
  selector: 'event-duplicate-tickets',
  templateUrl: './event-duplicate-tickets.component.html',
  styleUrls: ['./event-duplicate-tickets.component.scss']
})
export class EventDuplicateTicketsComponent implements OnInit {
  // @Input() isEdit: boolean;
  // @Input() requestId?: number;
  // @Input() filter: FilterModel;
  // @Input() userId: number;
  // @Input() requestedBy: string;
  // @Input() others = new OthersModel();
  // @Input() actionIdOfFirstTimeAccess: string;
  // @Input() duplicateTicketsModel = new EventDuplicateTicketsModel();
  // @Output() updateMatchId = new EventEmitter<number>();

  @Input() isEdit: boolean;
  @Input() requestId?: number;
  @Input() filter = new FilterModel();
  @Input() userId: number;
  @Input() requestedBy: string;
  @Input() others = new OthersModel();
  @Input() actionIdOfFirstTimeAccess: string;
  @Input() duplicateTicketsModel = new EventDuplicateTicketsModel();
  @Output() updateMatchId = new EventEmitter<number>();

  @ViewChild('betIds') betIdsComponent: BetIdsComponent;
  @ViewChild('leagueEventAbnormal') leagueEventAbnormalComponent: LeagueEventAbnormalComponent;

  primitiveProps = new PrimitiveProperty();
  permission = new PermissionManage();
  isCancelAfterFocusOutBetIdsEvent = false;
  abnormalFilterBy = new AbnormalFilterBy();

  constructor(private readonly commonService: CommonService,
    private readonly popupService: PopupService,
    private readonly validationService: ValidationService,
    private readonly saveRequestService: SaveRequestService,
    private readonly addRequestStore: AddRequestStore
  ) { }

  async ngOnInit(): Promise<void> {
    if (!this.isEdit) {
      this.duplicateTicketsModel.filterBy = AbnormalFilterBy.SINGLE;
    }
    this.addRequestStore.changeAbnormalFilterBy(this.duplicateTicketsModel.filterBy);
    this.permission = await this.commonService.getPermissionManageRequest();
  }

  async afterFocusOutBetIds(): Promise<void> {
    if (!this.isCancelAfterFocusOutBetIdsEvent) {
      this.primitiveProps.isBlockBetIds = true;
      //await this.checkValidBusinessRule(false);
      this.primitiveProps.isBlockBetIds = false;
    }
  }

  async onYesConfirmWarningModal(): Promise<void> {
    // validate again
    this.addRequestStore.changeBlockingUiStatus(true);
    // const validation = this.filter.isVoided ? { isValid: true } as ValidationBusinessRuleOutput : await this.checkValidBusinessRule(true);
    // if (validation.isValid) {
    //   await this.executeApiSaveRequest();
    // } else {
    //   this.popupService.showError('There are some invalid Bet ID(s) in this request, please check again!');
    //   this.addRequestStore.changeSavingRequestStatus(false);
    // }
    // this.addRequestStore.changeBlockingUiStatus(false);
  }

  async saveRequest(): Promise<void> {
    this.addRequestStore.changeBlockingUiStatus(true);
    if (this.filter.isVoided) {
      //await this.checkIfRequestHasWarning(new ConfirmAbnormalBetModel());
      this.addRequestStore.changeBlockingUiStatus(false);

      return;
    }

    await this.saveWhenRequestNotVoided();
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  public removeInvalidTransIds(): void {
    this.betIdsComponent.removeTransId(this.primitiveProps.invalidTransIds);
    this.primitiveProps.isShowButtonRemoveInvalid = false;
  }

  triggerCloseEvent() {
    this.addRequestStore.changeSavingRequestStatus(false);
  }

  changeFilterBy(filterBy: number) {
    this.duplicateTicketsModel.filterBy = filterBy;
    this.addRequestStore.changeAbnormalFilterBy(filterBy);
  }

  private async saveWhenRequestNotVoided(): Promise<void> {
    this.isCancelAfterFocusOutBetIdsEvent = true;
    this.betIdsComponent.triggerFocusOutBetIds();
    this.isCancelAfterFocusOutBetIdsEvent = false;

    // const validation = await this.checkValidBusinessRule(false);
    // //this.confirmAbnormalBetModel = validation.warningModel;
    // if (validation.isValid) {
    //   //await this.checkIfRequestHasWarning(validation.warningModel);
    // } else {
    //   this.addRequestStore.changeSavingRequestStatus(false);
    // }
  }

  // private async checkIfRequestHasWarning(warningModel: ConfirmAbnormalBetModel): Promise<void> {
  //   let isHasWarningEditTakeNoteRequest = false;

  //   if (!this.filter.isVoided) {
  //     isHasWarningEditTakeNoteRequest = this.validationService.isHasWarningEditTakeNoteRequest(this.isEdit, this.filter.action, this.actionIdOfFirstTimeAccess);
  //   }

  //   warningModel.isEditingByAnotherUser =
  //     this.validationService.isEditingByAnotherUser(this.isEdit, Number(document.getElementById('body').getAttribute('user-id')), this.userId);
  //   if (isHasWarningForAbnormalBet || isHasWarningEditTakeNoteRequest || warningModel.isEditingByAnotherUser || warningModel.isHasWarningRemovedTickets) {
  //     this.openConfirmAbnormalBet(isHasWarningForAbnormalBet, isHasWarningEditTakeNoteRequest, this.betIdsComponent.getAllBetIds(), warningModel);
  //   } else {
  //     await this.executeApiSaveRequest();
  //   }
  // }

  // private openConfirmAbnormalBet(isHasWarningForAbnormalBet: boolean, isHasWarningEditTakeNoteRequest: boolean, transIds: string, warningModel: ConfirmAbnormalBetModel): void {
  //   this.confirmAbnormalBetModel = warningModel;
  //   this.confirmAbnormalBetModel.isOpenDialog = true;
  //   this.confirmAbnormalBetModel.isHasWarningForAbnormalBet = isHasWarningForAbnormalBet;
  //   this.confirmAbnormalBetModel.isHasWarningEditTakeNoteRequest = isHasWarningEditTakeNoteRequest;
  //   this.confirmAbnormalBetModel.isHasWarningRemovedTickets = warningModel.isHasWarningRemovedTickets;
  //   this.confirmAbnormalBetModel.transIds = transIds;
  //   this.confirmAbnormalBetModel.requestId = this.requestId;
  //   this.confirmAbnormalBetModel.requestedBy = this.requestedBy;
  //   this.confirmAbnormalBetModel = _.clone(this.confirmAbnormalBetModel);
  // }

  // private async checkValidBusinessRule(isValidateFromConfirmPopup: boolean): Promise<ValidationBusinessRuleOutput> {
  //   const args = new ValidationBusinessRuleArgs();
  //   args.actionId = this.filter.action;
  //   args.requestId = this.requestId;
  //   args.permission = this.permission;
  //   args.betIdsComponent = this.betIdsComponent;
  //   args.filterBy = this.duplicateTicketsModel.filterBy;
  //   args.issueTypeId = this.filter.issueTypeId;
  //   args.subIssueTypeId = this.filter.subIssueTypeId;
  //   args.leagueEventAbnormalComponent = this.leagueEventAbnormalComponent;
  //   //args.confirmAbnormalBetComponent = this.confirmAbnormalBetComponent;
  //   args.primitiveProps = this.primitiveProps;
  //   args.isValidateFromConfirmPopup = isValidateFromConfirmPopup;
  //   const validation = await this.validationService.checkValidBusinessRule(args);
  //   this.primitiveProps.transInfoAddRequestModel = validation.transInfoAddRequestModel;
  //   if (this.duplicateTicketsModel.filterBy !== AbnormalFilterBy.MIX_PARLAY) {
  //     this.updateMatchId.emit(this.leagueEventAbnormalComponent.selectedMatchId);
  //   }
  //   return validation;
  // }

  private async executeApiSaveRequest(): Promise<void> {
    const args = new SaveRequestArg();
    args.primitiveProps = this.primitiveProps;
    args.requestId = this.requestId;
    args.isEdit = this.isEdit;
    args.transIds = this.betIdsComponent.getAllBetIds();
    args.filter = this.filter;
    args.filterBy = this.duplicateTicketsModel.filterBy;
    args.duplicateTicketsModel = this.duplicateTicketsModel;
    args.others = this.others;
    //args.confirmAbnormalBetModel = this.confirmAbnormalBetModel;
    args.leagueEventAbnormalComponent = this.leagueEventAbnormalComponent;
    //args.confirmAbnormalBetComponent = this.confirmAbnormalBetComponent;
    args.addRequestStore = this.addRequestStore;

    await this.saveRequestService.executeSave(args);
  }

  public isShowLeagueEvent(): boolean {
    return this.duplicateTicketsModel.filterBy === AbnormalFilterBy.SINGLE;
  }
}
