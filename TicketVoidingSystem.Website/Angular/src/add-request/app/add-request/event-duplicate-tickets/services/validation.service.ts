import { inject, Injectable } from '@angular/core';
import { BetIdsComponent } from '../../../../../utility/components/bet-ids/bet-ids.component';
import { AbnormalFilterBy, MatchIdConstant, TVSRequestActionType } from '../../../../../utility/constants/config';
import { LABELS } from '../../../../../utility/constants/labels';
import { AddRequestApiService } from '../../add-request-api.service';
import { PermissionAddRequest } from '../../models/permission-add-request.model';
import { CheckDuplicateTicketsQuery, CheckDuplicateTicketsViewModel, ValidationDuplicateTickets } from '../models/check-duplicate-tickets.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { SaveRequestArg } from '../models/save-request-arg.model';

@Injectable()
export class ValidationService {
  private readonly addRequestApiService = inject(AddRequestApiService);

  public isFilterMixParlay(filterBy: number): boolean {
    return filterBy === AbnormalFilterBy.MIX_PARLAY;
  }

  public checkCanShowConfirmation(arg: SaveRequestArg): boolean {
    let isHasWarningEditTakeNoteRequest = false;

    if (!arg.filter.isVoided) {
      isHasWarningEditTakeNoteRequest = this.isHasWarningEditTakeNoteRequest(arg.isEdit, arg.filter.action, arg.actionIdOfFirstTimeAccess);
    }

    return isHasWarningEditTakeNoteRequest;
  }

  public validateCommonData(betIdsComponent: BetIdsComponent, primitiveProps: PrimitiveProperty): boolean {
    if (betIdsComponent.isHasBetId()) {
      return true;
    }

    const transIdAreNotNumber = betIdsComponent.getAllBetIdsAreNotNumber();
    primitiveProps.isShowButtonRemoveInvalid = transIdAreNotNumber.length > 0;
    primitiveProps.invalidTransIds = transIdAreNotNumber;

    return false;
  }

  public async checkValidBusinessRule(args: SaveRequestArg): Promise<boolean> {
    if (!this.validateCommonData(args.betIdsComponent, args.primitiveProps)) {
      return false;
    }

    this.updateBetIdsBeforeCallApi(args.betIdsComponent);
    const validationViewModel = await this.callApiCheckDuplicateTickets(args);
    this.updateModelAfterCallApi(args, validationViewModel);

    return args.betIdsComponent.isAllBetIdsValid();
  }

  public isHasWarningEditTakeNoteRequest(isEdit: boolean, currentActionId: string, actionIdOfFirstTime: string) {
    return isEdit && currentActionId === TVSRequestActionType.TAKE_NOTE_ID.toString() && currentActionId !== actionIdOfFirstTime;
  }

  private updateBetIdsBeforeCallApi(betIdsComponent: BetIdsComponent): void {
    betIdsComponent.groupNumber.resetAllItemsToValid();
    betIdsComponent.groupNumber.checkDuplicatedItems();
  }

  private updateModelAfterCallApi(args: SaveRequestArg, validationViewModel: CheckDuplicateTicketsViewModel): void {
    args.primitiveProps.transInfoAddRequestModel = validationViewModel.transInfoAddRequestModel;
    args.duplicateTicketsModel.matchId = validationViewModel.match?.matchId;

    if (!this.isFilterMixParlay(args.duplicateTicketsModel.filterBy)) {
      args.duplicateTicketsModel.name = validationViewModel.match?.name;
      args.duplicateTicketsModel.leagueName = validationViewModel.match?.leagueName;
    }
    const isHasPermissionAddSettledTicket = this.checkCanAddSettledTickets(args.permission, args.filter.action);
    this.highlightInvalidTransIds(validationViewModel.validation, args.betIdsComponent, isHasPermissionAddSettledTicket);
    this.updateValidation(args, validationViewModel.validation, isHasPermissionAddSettledTicket);
  }

  private async callApiCheckDuplicateTickets(args: SaveRequestArg): Promise<CheckDuplicateTicketsViewModel> {
    const transIds = args.betIdsComponent.getAllBetIds();
    const matchId = !this.isFilterMixParlay(args.duplicateTicketsModel.filterBy) ? args.duplicateTicketsModel.matchId : MatchIdConstant.Parlay;
    const filterBy = !this.isFilterMixParlay(args.duplicateTicketsModel.filterBy) ? null : args.duplicateTicketsModel.filterBy;
    const query: CheckDuplicateTicketsQuery = {
      matchId: matchId,
      transIds: transIds,
      requestId: args.requestId,
      actionId: args.filter.action,
      filterBy: filterBy,
      subIssueTypeId: Number(args.filter.subIssueTypeId)
    };

    return this.addRequestApiService.checkDuplicateTickets(query);
  }

  private highlightInvalidTransIds(model: ValidationDuplicateTickets, betIdsComponent: BetIdsComponent, isHasPermissionAddSettledTicket: boolean): void {
    betIdsComponent.groupNumber.updateMoved(model.movedTransIds);
    betIdsComponent.groupNumber.updateDifferent(model.differentMatchTransIds);
    betIdsComponent.groupNumber.updateInvalidItems(model.invalidTransIds, LABELS.INVALID_TICKETS);
    betIdsComponent.groupNumber.updateInvalidItems(model.unsupportedTransIds, LABELS.INVALID_UNSUPPORTED_TICKETS);
    betIdsComponent.groupNumber.updateInvalidItems(model.existingReqTransIds, LABELS.INVALID_EXISTING_ON_OTHER_REQUEST);

    if (!isHasPermissionAddSettledTicket) {
      betIdsComponent.groupNumber.updateInvalidItems(model.settledTransIds, LABELS.INVALID_SETTLED_TICKETS);
    }
  }

  private checkCanAddSettledTickets(permission: PermissionAddRequest, actionId: string): boolean {
    return actionId === TVSRequestActionType.TAKE_NOTE_ID.toString() ||  permission.isAddSettledTickets;
  }

  private checkCanShowButtonRemove(model: ValidationDuplicateTickets, isHasPermissionAddSettledTicket: boolean, transIdsAreNotNumber: string): boolean { // NOSONAR
    if (model.invalidTransIds || (model.settledTransIds && !isHasPermissionAddSettledTicket) || model.unsupportedTransIds || model.existingReqTransIds
      || transIdsAreNotNumber) {
      return true;
    }

    return false;
  }

  private updateValidation(args: SaveRequestArg, validationDuplicateTickets: ValidationDuplicateTickets, isHasPermissionAddSettledTicket: boolean): void {
    const transIdsAreNotNumber = args.betIdsComponent.getAllBetIdsAreNotNumber();
    args.primitiveProps.isShowButtonRemoveInvalid = this.checkCanShowButtonRemove(validationDuplicateTickets, isHasPermissionAddSettledTicket, transIdsAreNotNumber);
    args.primitiveProps.invalidTransIds = args.betIdsComponent.getInvalidItems();
  }
}
