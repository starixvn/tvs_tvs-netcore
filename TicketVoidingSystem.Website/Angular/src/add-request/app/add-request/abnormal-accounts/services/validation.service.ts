import { Injectable } from '@angular/core';
import moment from 'moment-timezone';
import { UsernamesComponent } from '../../../../../utility/components/user-names/user-names.component';
import { DateTimeFormat, TVSRequestActionType } from '../../../../../utility/constants/config';
import { AddRequestApiService } from '../../add-request-api.service';
import { ConfirmAbnormalAccountModel } from '../confirm-abnormal-account/confirm-abnormal-account.model';
import { EventDateFilterComponent } from '../event-date-filter/event-date-filter.component';
import { CheckUsernamesViewModel, CheckValidUsernamesQuery, ValidationAbnormalAccount } from '../models/check-username.model';
import { ValidationBusinessRuleArgs, ValidationBusinessRuleOutput } from '../models/validation.model';
import { ProductFilterComponent } from '../product-filter/product-filter.component';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  constructor(private readonly addRequestApiService: AddRequestApiService) { }

  public isValidCommonData(productFilterComponent: ProductFilterComponent, eventDateFilterComponent: EventDateFilterComponent): boolean {
    return productFilterComponent.isValidComponent() && eventDateFilterComponent.isValidEventDate();
  }

  public async checkValidUsernames(args: ValidationBusinessRuleArgs): Promise<ValidationBusinessRuleOutput> {
    const usernames = args.usernamesComponent.groupUsername.getAllValue();
    try {
      args.primitiveProps.isShowError = false;
      if (args.primitiveProps.isCancelValidate) {
        args.primitiveProps.isCancelValidate = false;
        return { isValid: false } as ValidationBusinessRuleOutput;
      }

      if (usernames === '') {
        return { isValid: args.usernamesComponent.checkValidItems() } as ValidationBusinessRuleOutput;
      }
      args.usernamesComponent.groupUsername.resetAllValue();
      if (args.usernamesComponent.groupUsername.getDuplicatedItems(usernames).length > 0) {
        args.usernamesComponent.groupUsername.updateDuplicatedItems(usernames);
        return { isValid: args.usernamesComponent.checkValidItems() } as ValidationBusinessRuleOutput;
      }

      const viewModel = await this.getValidation(args, usernames);
      const invalidUsernames = viewModel.validation.invalidUserName;
      if (invalidUsernames) {
        return { isValid: this.highlightInvalidUsernames(args.usernamesComponent, invalidUsernames) } as ValidationBusinessRuleOutput;
      }
      if (viewModel.validation.isExceededTotalUsernames) {
        return { isValid: args.usernamesComponent.checkValidItems() } as ValidationBusinessRuleOutput;
      }
      if (viewModel.validation.isBeingMoveBetDate || viewModel.validation.isInvalidTotalTicket) {
        args.primitiveProps.isShowError = true;
        args.primitiveProps.isBeingMoveBetDate = viewModel.validation.isBeingMoveBetDate;
        args.primitiveProps.isInvalidTotalTicket = viewModel.validation.isInvalidTotalTicket;
        return { isValid: false } as ValidationBusinessRuleOutput;
      }
      return {
        isValid: this.highlightInvalidUsernames(args.usernamesComponent, invalidUsernames),
        confirmAbnormalAccountModel: this.getConfirmAbnormalBetModel(viewModel.validation),
        transInfoAddRequestModel: viewModel.transInfoAddRequestModel
      } as ValidationBusinessRuleOutput;
    } catch {
      return { isValid: this.highlightInvalidUsernames(args.usernamesComponent, usernames) } as ValidationBusinessRuleOutput;
    } finally {
      args.primitiveProps.isBlockUsernames = false;
    }
  }
  
  private getConfirmAbnormalBetModel(validation: ValidationAbnormalAccount): ConfirmAbnormalAccountModel {
    const confirmModel = new ConfirmAbnormalAccountModel();
    confirmModel.numberOfTicketsExistedInRequest = validation.numberOfTickets;
    
    return confirmModel;
  }
  
  private async getValidation(args: ValidationBusinessRuleArgs, usernames: string): Promise<CheckUsernamesViewModel> {
    const query: CheckValidUsernamesQuery = {
      usernames: usernames,
      requestId: args.requestId,
      actionId: args.actionId,
      productIds: args.abnormalAccountModel.productIds,
      statusIds: args.abnormalAccountModel.statusIds,
      fromDate: moment(args.abnormalAccountModel.fromDate).format(DateTimeFormat.FULL_DATE_TIME_FORMAT),
      toDate: moment(args.abnormalAccountModel.toDate).format(DateTimeFormat.FULL_DATE_TIME_FORMAT),
    };
    const results = await this.addRequestApiService.checkValidUsernames(query);
    
    return results;
  }

  private highlightInvalidUsernames(usernamesComponent: UsernamesComponent, invalidUsernames: string): boolean {
    usernamesComponent.groupUsername.updateInvalid(invalidUsernames);
    return usernamesComponent.checkValidItems();
  }

  public isHasWarningEditTakeNoteRequest(isEdit: boolean, currentActionId: string, actionIdOfFirstTime: string) {
    return isEdit && currentActionId === TVSRequestActionType.TAKE_NOTE_ID.toString() && currentActionId !== actionIdOfFirstTime;
  }

  public isEditingByAnotherUser(isEdit: boolean, editingBy: number, createdBy: number): boolean {
    return isEdit && editingBy !== createdBy;
  }
}