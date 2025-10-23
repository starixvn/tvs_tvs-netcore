import { inject, Injectable } from '@angular/core';
import { BetIdsComponent } from '../../../../../../utility/components/bet-ids/bet-ids.component';
import { CheckboxType, TVSRequestActionType } from '../../../../../../utility/constants/config';
import { TEXT } from '../../../../../../utility/constants/text';
import { AddRequestApiService } from '../../../../../services/add-request-api.service';
import { PermissionAddRequest } from '../../../../../models/permission-add-request.model';
import { CheckTransIdsQuery, ValidationAbnormalBet } from '../event-abnormal-bet.model';
import { ValidationBusinessRuleArgs, ValidationBusinessRuleOutput } from './validation.model';
import { NumberItemService } from '../../../../../../utility/components/bet-ids/number-item.service';

@Injectable()
export class ValidationService {
  private readonly addRequestApiService = inject(AddRequestApiService);
  private readonly numberItemService = inject(NumberItemService);

  initCheckAbnormalBetTransIdsQuery(args: ValidationBusinessRuleArgs): CheckTransIdsQuery {
    const transIds = args.betIdsComponent.getAllBetIds();
    return {
      transIds: transIds,
      requestId: args.requestId,
      actionId: args.actionId,
      filterBy: args.abnormalBetModel.filterBy,
      issueTypeId: Number(args.issueTypeId),
      subIssueTypeId: Number(args.abnormalBetModel.subIssueTypeId),
      isRemoveCustomerClass201: args.isValidateFromConfirmPopup ? args.confirmAbnormalBetComponent.model.checkboxState[CheckboxType.CUSTOMER_CLASS_201] : false,
      isRemoveCustomerClass4K: args.isValidateFromConfirmPopup ? args.confirmAbnormalBetComponent.model.checkboxState[CheckboxType.CUSTOMER_CLASS_4K] : false,
      isRemoveCreditCashService: args.isValidateFromConfirmPopup ? args.confirmAbnormalBetComponent.model.checkboxState[CheckboxType.CREDIT_CASH_SERVICE] : false,
      isAddSettledTickets: args.permission.isAddSettledTickets,
      isVoidAllArchivedTickets: args.permission.isVoidAllArchivedTickets
    } as CheckTransIdsQuery;
  }

  async exportExcelAbnormalBetTickets(args: ValidationBusinessRuleArgs) {
    const query = this.initCheckAbnormalBetTransIdsQuery(args);
    await this.addRequestApiService.exportExcelAbnormalBetTickets(query);
  }

  public async checkValidBusinessRule(args: ValidationBusinessRuleArgs): Promise<ValidationBusinessRuleOutput> {
    if (!args.betIdsComponent.isHasBetId()) {
      const transIdAreNotNumber = args.betIdsComponent.getAllBetIdsAreNotNumber();
      args.primitiveProps.isShowButtonRemoveInvalid = transIdAreNotNumber.length > 0;
      args.primitiveProps.invalidTransIds = transIdAreNotNumber;
      return { isValid: false } as ValidationBusinessRuleOutput;
    }
    this.numberItemService.resetAllItemsToValid(args.betIdsComponent.groupNumber);
    this.numberItemService.checkDuplicatedItems(args.betIdsComponent.groupNumber.items);
    const query = this.initCheckAbnormalBetTransIdsQuery(args);
    const checkTransIdViewModel = await this.addRequestApiService.checkValidTransIdsForAbnormalBet(query);

    if (!checkTransIdViewModel) {
      return { isValid: false } as ValidationBusinessRuleOutput;
    }
    args.abnormalBetModel.sendLetstalkModels = checkTransIdViewModel.sendLetstalkModels;
    args.abnormalBetModel.matches = checkTransIdViewModel.matches;

    const isHasPermissionAddSettledTicket = this.checkCanAddSettledTickets(args.permission, args.actionId);
    this.highlightInvalidTransIds(checkTransIdViewModel.validation, args.betIdsComponent, isHasPermissionAddSettledTicket, args.actionId);
    this.updateValidation(args, checkTransIdViewModel.validation, isHasPermissionAddSettledTicket);

    return {
      isValid: args.betIdsComponent.isAllBetIdsValid(),
      warningModel: checkTransIdViewModel.validation,
      transInfoAddRequestModel: checkTransIdViewModel.transInfoAddRequestModel,
      abnormalBetTicketRequests: checkTransIdViewModel.abnormalBetTicketRequests,
      infoSiteDBDownModel: checkTransIdViewModel.infoSiteDBDownModel
    } as ValidationBusinessRuleOutput;
  }

  public isValidationHasWarningTicket(permission: PermissionAddRequest, validationResult: ValidationAbnormalBet): boolean {
    return (permission.isAddSettledTickets && validationResult.settledTransIds?.length > 0)
      || (validationResult.transIdsOfVIPCustomer?.length > 0)
      || (validationResult.transIdsOfCustomerClass201?.length > 0)
      || (validationResult.transIdsOfCustomerClass4K?.length > 0)
      || (validationResult.transIdsOfCreditCashService?.length > 0);
  }

  public isHasWarningEditTakeNoteRequest(isEdit: boolean, currentActionId: string, actionIdOfFirstTime: string) {
    return isEdit && currentActionId === TVSRequestActionType.TAKE_NOTE_ID.toString() && currentActionId !== actionIdOfFirstTime;
  }

  private highlightInvalidTransIds(model: ValidationAbnormalBet, betIdsComponent: BetIdsComponent, isHasPermissionAddSettledTicket: boolean, actionId: string): void {
    this.numberItemService.updateInvalidItems(betIdsComponent.groupNumber.items, model.invalidTransIds, TEXT.INVALID_TICKETS);  // RemarkId = 1
    this.numberItemService.updateInvalidItems(betIdsComponent.groupNumber.items, model.movedTransIds);  // RemarkId = 2
    this.numberItemService.updateInvalidItems(betIdsComponent.groupNumber.items, model.differentMatchTransIds);  // RemarkId = 3
    if (!isHasPermissionAddSettledTicket || actionId === TVSRequestActionType.AUTO_VOID_WINNING_ID.toString()) {
      this.numberItemService.updateInvalidItems(betIdsComponent.groupNumber.items, model.settledTransIds, TEXT.INVALID_SETTLED_TICKETS);  // RemarkId = 4
    }
    this.numberItemService.updateInvalidItems(betIdsComponent.groupNumber.items, model.unsupportedTransIds, TEXT.INVALID_UNSUPPORTED_TICKETS);  // RemarkId = 5
    this.numberItemService.updateInvalidItems(betIdsComponent.groupNumber.items, model.existingReqTransIds, TEXT.INVALID_EXISTING_ON_OTHER_REQUEST);  // RemarkId = 6
    this.numberItemService.updateInvalidItems(betIdsComponent.groupNumber.items, model.nonLiveTransIds, TEXT.INVALID_NONLIVE_TICKETS);  // RemarkId = 7
    this.numberItemService.updateInvalidItems(betIdsComponent.groupNumber.items, model.differentLiveScoreTransIds, TEXT.INVALID_DIFFERENT_LIVE_SCORE);  // RemarkId = 8
    this.numberItemService.updateInvalidItems(betIdsComponent.groupNumber.items, model.abWhiteListTransIds, TEXT.INVALID_AB_WHITE_LIST_TICKETS);  // RemarkId = 9
    this.numberItemService.updateWarningSiteDBDown(betIdsComponent.groupNumber.items, model.transIdsOfSiteDBDown, TEXT.INVALID_SITE_DB_DOWN); // RemarkId = 10
    this.numberItemService.updateMoved(betIdsComponent.groupNumber.items, model.balanceUpTransIds, TEXT.AFTER_BALANCE_UP_TICKETS); // RemarkId = 11
  }

  private checkCanAddSettledTickets(permission: PermissionAddRequest, actionId: string): boolean {
    return actionId === TVSRequestActionType.TAKE_NOTE_ID.toString() || permission.isAddSettledTickets;
  }

  public isEditingByAnotherUser(isEdit: boolean, editingBy: number, createdBy: number): boolean {
    return isEdit && editingBy !== createdBy;
  }

  private checkCanShowButtonRemove(model: ValidationAbnormalBet, isHasPermissionAddSettledTicket: boolean, transIdsAreNotNumber: string): boolean { // NOSONAR
    if (model.invalidTransIds || (model.settledTransIds && !isHasPermissionAddSettledTicket) || model.unsupportedTransIds || model.existingReqTransIds
    || model.nonLiveTransIds || model.differentLiveScoreTransIds || model.abWhiteListTransIds || transIdsAreNotNumber || model.balanceUpTransIds) {
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
    if (model.balanceUpTransIds) {
      transIds.push(model.balanceUpTransIds);
    }
    
    return transIds.join(',');
  }

  private updateValidation(args: ValidationBusinessRuleArgs, validationAbnormalBet: ValidationAbnormalBet, isHasPermissionAddSettledTicket: boolean): void {
    const transIdsAreNotNumber = args.betIdsComponent.getAllBetIdsAreNotNumber();

    args.primitiveProps.isShowButtonRemoveInvalid = this.checkCanShowButtonRemove(validationAbnormalBet, isHasPermissionAddSettledTicket, transIdsAreNotNumber);
    args.primitiveProps.invalidTransIds = this.getInvalidTransIds(validationAbnormalBet, isHasPermissionAddSettledTicket, transIdsAreNotNumber);
    args.primitiveProps.isAllUusTickets = validationAbnormalBet.isAllUusTickets;
    args.primitiveProps.balanceUpTransIds = validationAbnormalBet.balanceUpTransIds;
  }
}
