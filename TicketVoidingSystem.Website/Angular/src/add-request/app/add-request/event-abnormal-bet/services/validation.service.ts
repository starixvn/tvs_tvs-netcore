import { Injectable } from '@angular/core';
import { BetIdsComponent } from '../../../../../utility/components/bet-ids/bet-ids.component';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { LABELS } from '../../../../../utility/constants/labels';
import { StaticService } from '../../../../../utility/services/static.service';
import { AddRequestApiService } from '../../add-request-api.service';
import { PermissionAddRequest } from '../../models/permission-add-request.model';
import { ConfirmAbnormalBetModel } from '../confirm-abnormal-bet/confirm-abnormal-bet.model';
import { CheckTransIdsQuery, ValidationAbnormalBet } from '../event-abnormal-bet.model';
import { ValidationBusinessRuleArgs, ValidationBusinessRuleOutput } from './validation.model';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  constructor(
    private readonly addRequestApiService: AddRequestApiService,
    ) { }

  initCheckAbnormalBetTransIdsQuery(args: ValidationBusinessRuleArgs): CheckTransIdsQuery{
    const transIds = args.betIdsComponent.getAllBetIds();
    const matchId = !this.isAbnormalBetMixOrSystemParlay(args) ? args.leagueEventAbnormalComponent?.selectedMatchId : 29;
    const filterBy = !this.isAbnormalBetMixOrSystemParlay(args) ? null : args.filterBy;

    return {
      matchId: matchId,
      transIds: transIds,
      requestId: args.requestId,
      actionId: args.actionId,
      filterBy: filterBy,
      issueTypeId: Number(args.issueTypeId),
      subIssueTypeId: Number(args.subIssueTypeId),
      isRemoveCustomerClass201: args.isValidateFromConfirmPopup ? args.confirmAbnormalBetComponent.isRemoveCustomerClass201 : false,
      isRemoveCustomerClass4K: args.isValidateFromConfirmPopup ? args.confirmAbnormalBetComponent.isRemoveCustomerClass4K : false,
      isAddSettledTickets: args.permission.isAddSettledTickets,
      isVoidAllArchivedTickets: args.permission.isVoidAllArchivedTickets
    } as CheckTransIdsQuery;
  }

  async exportExcelAbnormalBetTickets(args: ValidationBusinessRuleArgs){
    const query = this.initCheckAbnormalBetTransIdsQuery(args);
    await this.addRequestApiService.exportExcelAbnormalBetTickets(query);
  }

  public async checkValidBusinessRule(args: ValidationBusinessRuleArgs): Promise<ValidationBusinessRuleOutput> {
    if (!args.betIdsComponent.isHasBetId()) {
      if (!StaticService.isFilterByMixOrSystemParlay(args.filterBy)) {
        args.leagueEventAbnormalComponent.updateUndefinedMatchAndLeague();
      }

      const transIdAreNotNumber = args.betIdsComponent.getAllBetIdsAreNotNumber();
      args.primitiveProps.isShowButtonRemoveInvalid = transIdAreNotNumber.length > 0;
      args.primitiveProps.invalidTransIds = transIdAreNotNumber;
      return { isValid: false } as ValidationBusinessRuleOutput;
    }

    args.betIdsComponent.groupNumber.resetAllItemsToValid();
    args.betIdsComponent.groupNumber.checkDuplicatedItems();

    const query = this.initCheckAbnormalBetTransIdsQuery(args);
    const checkTransIdViewModel = await this.addRequestApiService.checkValidTransIdsForAbnormalBet(query);

    if (checkTransIdViewModel === null) {
      return { isValid: false} as ValidationBusinessRuleOutput;
    }

    if (!this.isAbnormalBetMixOrSystemParlay(args)) {
      args.leagueEventAbnormalComponent.updateInfoWithOnlyOneMatch(checkTransIdViewModel.match);
    }

    const isHasPermissionAddSettledTicket = this.checkCanAddSettledTickets(args.permission, args.actionId);
    this.highlightInvalidTransIds(checkTransIdViewModel.validation, args.betIdsComponent, isHasPermissionAddSettledTicket, args.actionId);
    this.updateValidation(args, checkTransIdViewModel.validation, isHasPermissionAddSettledTicket);

    return {
      isValid: args.betIdsComponent.isAllBetIdsValid(),
      warningModel: this.getConfirmAbnormalBetModel(checkTransIdViewModel.validation),
      transInfoAddRequestModel: checkTransIdViewModel.transInfoAddRequestModel,
      abnormalBetTicketRequests: checkTransIdViewModel.abnormalBetTicketRequests
    } as ValidationBusinessRuleOutput;
  }

  public isValidationHasWarningTicket(permission: PermissionAddRequest, confirmModel: ConfirmAbnormalBetModel): boolean {
    return (permission.isAddSettledTickets && confirmModel.settledTickets?.length > 0)
      || (confirmModel.ticketsOfVIPCustomer?.length > 0)
      || (confirmModel.ticketsOfCustomerClass201?.length > 0)
      || (confirmModel.ticketsOfCustomerClass4K?.length > 0);
  }

  public isHasWarningEditTakeNoteRequest(isEdit: boolean, currentActionId: string, actionIdOfFirstTime: string) {
    return isEdit && currentActionId === TVSRequestActionType.TAKE_NOTE_ID.toString() && currentActionId !== actionIdOfFirstTime;
  }

  private highlightInvalidTransIds(model: ValidationAbnormalBet, betIdsComponent: BetIdsComponent, isHasPermissionAddSettledTicket: boolean, actionId: string): void {
    this.highlightFirstGroupError(model, betIdsComponent, isHasPermissionAddSettledTicket, actionId);
    this.highlightSecondGroupError(model, betIdsComponent);
  }

  private highlightFirstGroupError(model: ValidationAbnormalBet, betIdsComponent: BetIdsComponent, isHasPermissionAddSettledTicket: boolean, actionId: string): void {
    if (model.invalidTransIds?.length > 0) {
      betIdsComponent.groupNumber.updateInvalidItems(model.invalidTransIds, LABELS.INVALID_TICKETS);
    }
    if (model.movedTransIds?.length > 0) {
      betIdsComponent.groupNumber.updateMoved(model.movedTransIds);
    }
    if (model.differentMatchTransIds?.length > 0) {
      betIdsComponent.groupNumber.updateDifferent(model.differentMatchTransIds);
    }
    if (model.settledTransIds?.length > 0 && (!isHasPermissionAddSettledTicket || actionId === TVSRequestActionType.AUTO_VOID_WINNING_ID.toString())) {
      betIdsComponent.groupNumber.updateInvalidItems(model.settledTransIds, LABELS.INVALID_SETTLED_TICKETS);
    }
    if (model.unsupportedTransIds?.length > 0) {
      betIdsComponent.groupNumber.updateInvalidItems(model.unsupportedTransIds, LABELS.INVALID_UNSUPPORTED_TICKETS);
    }
  }

  private highlightSecondGroupError(model: ValidationAbnormalBet, betIdsComponent: BetIdsComponent): void {
    if (model.existingReqTransIds?.length > 0) {
      betIdsComponent.groupNumber.updateInvalidItems(model.existingReqTransIds, LABELS.INVALID_EXISTING_ON_OTHER_REQUEST);
    }
    if (model.nonLiveTransIds?.length > 0) {
      betIdsComponent.groupNumber.updateInvalidItems(model.nonLiveTransIds, LABELS.INVALID_NONLIVE_TICKETS);
    }
    if (model.differentLiveScoreTransIds?.length > 0) {
      betIdsComponent.groupNumber.updateInvalidItems(model.differentLiveScoreTransIds, LABELS.INVALID_DIFFERENT_LIVE_SCORE);
    }
    if (model.abWhiteListTransIds?.length > 0) {
      betIdsComponent.groupNumber.updateInvalidItems(model.abWhiteListTransIds, LABELS.INVALID_AB_WHITE_LIST_TICKETS);
    }
  }

  private getConfirmAbnormalBetModel(result: ValidationAbnormalBet): ConfirmAbnormalBetModel {
    const confirmModel = new ConfirmAbnormalBetModel();
    confirmModel.settledTickets = result.settledTransIds;
    confirmModel.ticketsOfVIPCustomer = result.transIdsOfVIPCustomer;
    confirmModel.ticketsOfCustomerClass201 = result.transIdsOfCustomerClass201;
    confirmModel.ticketsOfCustomerClass4K = result.transIdsOfCustomerClass4K;
    confirmModel.isHasWarningRemovedTickets = result.isHasWarningRemovedTickets;
    confirmModel.listBettype = result.listBettype;
    confirmModel.listBetteam = result.listBetteam;

    return confirmModel;
  }

  private isAbnormalBetMixOrSystemParlay(args: ValidationBusinessRuleArgs): boolean {
    return StaticService.isAbnormalBet(args.issueTypeId) && StaticService.isFilterByMixOrSystemParlay(args.filterBy);
  }

  private checkCanAddSettledTickets(permission: PermissionAddRequest, actionId: string): boolean {
    return actionId === TVSRequestActionType.TAKE_NOTE_ID.toString() || permission.isAddSettledTickets;
  }

  public isEditingByAnotherUser(isEdit: boolean, editingBy: number, createdBy: number): boolean {
    return isEdit && editingBy !== createdBy;
  }

  private checkCanShowButtonRemove(model: ValidationAbnormalBet, isHasPermissionAddSettledTicket: boolean, transIdsAreNotNumber: string): boolean { // NOSONAR
    if (model.invalidTransIds || (model.settledTransIds && !isHasPermissionAddSettledTicket) || model.unsupportedTransIds || model.existingReqTransIds
     || model.nonLiveTransIds || model.differentLiveScoreTransIds || model.abWhiteListTransIds || transIdsAreNotNumber) {
        return true;
      }

      return false;
  }

  private getInvalidTransIds(model: ValidationAbnormalBet, isHasPermissionAddSettledTicket: boolean, transIdsAreNotNumber: string): string { // NOSONAR
    const transIds: string[] = [];
    if (model.invalidTransIds) {
      transIds.push(model.invalidTransIds);
    }
    if (model.settledTransIds && !isHasPermissionAddSettledTicket) {
      transIds.push(model.settledTransIds);
    }
    if (model.unsupportedTransIds) {
      transIds.push(model.unsupportedTransIds);
    }
    if (model.existingReqTransIds) {
      transIds.push(model.existingReqTransIds);
    }
    if (model.nonLiveTransIds) {
      transIds.push(model.nonLiveTransIds);
    }
    if (model.differentLiveScoreTransIds) {
      transIds.push(model.differentLiveScoreTransIds);
    }
    if (model.abWhiteListTransIds) {
      transIds.push(model.abWhiteListTransIds);
    }
    if (transIdsAreNotNumber) {
      transIds.push(transIdsAreNotNumber);
    }

    return transIds.join(',');
  }

  private updateValidation(args: ValidationBusinessRuleArgs, validationAbnormalBet: ValidationAbnormalBet, isHasPermissionAddSettledTicket: boolean): void {
    const transIdsAreNotNumber = args.betIdsComponent.getAllBetIdsAreNotNumber();

    args.primitiveProps.isShowButtonRemoveInvalid = this.checkCanShowButtonRemove(validationAbnormalBet, isHasPermissionAddSettledTicket, transIdsAreNotNumber);
    args.primitiveProps.invalidTransIds = this.getInvalidTransIds(validationAbnormalBet, isHasPermissionAddSettledTicket, transIdsAreNotNumber);
    args.primitiveProps.isHasUusTickets = validationAbnormalBet.isHasUusTickets;
  }
}
