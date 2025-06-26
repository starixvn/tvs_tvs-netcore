import { inject, Injectable } from '@angular/core';
import moment from 'moment-timezone';
import { UsernamesComponent } from '../../../../../utility/components/user-names/user-names.component';
import { DateTimeFormat, TVSRequestActionType } from '../../../../../utility/constants/config';
import { AddRequestApiService } from '../../add-request-api.service';
import { EventDateFilterComponent } from '../event-date-filter/event-date-filter.component';
import { CheckUsernamesViewModel, CheckValidUsernamesQuery } from '../models/check-username.model';
import { ValidationBusinessRuleArgs, ValidationBusinessRuleOutput } from '../models/validation.model';
import { ProductFilterComponent } from '../product-filter/product-filter.component';

@Injectable()
export class ValidationService {
  private readonly addRequestApiService = inject(AddRequestApiService);

  isValidCommonData(productFilterComponent: ProductFilterComponent, eventDateFilterComponent: EventDateFilterComponent): boolean {
    return productFilterComponent.isValidComponent() && eventDateFilterComponent.isValidEventDate();
  }

  async checkBusinessRule(args: ValidationBusinessRuleArgs): Promise<ValidationBusinessRuleOutput> {
    const result = await this.checkValidUsernames(args);
    args.primitiveProps.isShowAccountWinLost = true;

    return result;
  }

  async checkValidUsernames(args: ValidationBusinessRuleArgs): Promise<ValidationBusinessRuleOutput> {
    const usernames = args.usernamesComponent.groupUsername.getAllValue();
    try {
      args.primitiveProps.isShowError = false;
      if (args.primitiveProps.isCancelValidate) {
        args.primitiveProps.isCancelValidate = false;
        return { isValid: false } as ValidationBusinessRuleOutput;
      }

      if (!this.isValidCommonData(args.productFilterComponent, args.eventDateFilterComponent)) {
        return { isValid: false } as ValidationBusinessRuleOutput;
      }

      if (usernames.length === 0) {
        return { isValid: args.usernamesComponent.checkValidItems() } as ValidationBusinessRuleOutput;
      }
      args.usernamesComponent.groupUsername.resetAllValue();
      if (args.usernamesComponent.groupUsername.getDuplicatedItems(usernames).length > 0) {
        args.usernamesComponent.groupUsername.updateDuplicatedItems(usernames);
        return { isValid: args.usernamesComponent.checkValidItems() } as ValidationBusinessRuleOutput;
      }

      const viewModel = await this.getValidation(args);
      if(viewModel.validation.isTicketLimitExceeded){
        args.usernamesComponent.showErrorTicketLimitExceeded();
        return { isValid: false } as ValidationBusinessRuleOutput;
      }

      const invalidUsernames = viewModel.validation.invalidUserName;
      if (invalidUsernames) {
        return {
          isValid: this.highlightInvalidUsernames(args.usernamesComponent, invalidUsernames)
        } as ValidationBusinessRuleOutput;
      }

      args.usernamesComponent.groupUsername.isExceededTotalUsernames = viewModel.validation.isExceededTotalUsernames;
      if (viewModel.validation.isExceededTotalUsernames) {
        return {
          isValid: args.usernamesComponent.checkValidItems(),
          accountWinlostModels: viewModel.accountWinlostModels
        } as ValidationBusinessRuleOutput;
      }
      if (viewModel.validation.isBeingMoveBetDate || viewModel.validation.isInvalidTotalTicket) {
        args.primitiveProps.isShowError = true;
        args.primitiveProps.isBeingMoveBetDate = viewModel.validation.isBeingMoveBetDate;
        args.primitiveProps.isInvalidTotalTicket = viewModel.validation.isInvalidTotalTicket;
        return {
          isValid: false,
          accountWinlostModels: viewModel.accountWinlostModels
         } as ValidationBusinessRuleOutput;
      }

      return {
        isValid: this.highlightInvalidUsernames(args.usernamesComponent, invalidUsernames),
        numberOfTicketsExistedInRequest: viewModel.validation.numberOfTickets,
        usernamesOfCreditCashService: viewModel.validation.usernamesOfCreditCashService,
        transInfoAddRequestModel: viewModel.transInfoAddRequestModel,
        accountWinlostModels: viewModel.accountWinlostModels
      } as ValidationBusinessRuleOutput;
    } catch {
      return { isValid: this.highlightInvalidUsernames(args.usernamesComponent, usernames) } as ValidationBusinessRuleOutput;
    } finally {
      args.primitiveProps.isBlockUsernames = false;
    }
  }

  async getValidation(args: ValidationBusinessRuleArgs): Promise<CheckUsernamesViewModel> {
    const query: CheckValidUsernamesQuery = {
      usernames: args.abnormalAccountModel.usernames,
      requestId: args.requestId,
      actionId: args.actionId,
      productIds: args.abnormalAccountModel.productIds,
      statusIds: args.abnormalAccountModel.statusIds,
      fromDate: moment(args.abnormalAccountModel.fromDate).format(DateTimeFormat.FULL_DATE_TIME_FORMAT),
      toDate: moment(args.abnormalAccountModel.toDate).format(DateTimeFormat.FULL_DATE_TIME_FORMAT),
      isVoidAllArchivedTickets: args.primitiveProps.permission.isVoidAllArchivedTickets,
      accountWinlostModels: this.isAutoVoidWithPolicy(args.actionId) ? args.abnormalAccountModel.accountWinlostModels : null,
    };
    const results = await this.addRequestApiService.checkValidUsernames(query);

    return results;
  }

  private highlightInvalidUsernames(usernamesComponent: UsernamesComponent, invalidUsernames: string): boolean {
    usernamesComponent.groupUsername.updateInvalid(invalidUsernames);
    return usernamesComponent.checkValidItems();
  }

  public isAutoVoidWithPolicy(actionId: string): boolean {
    return actionId === TVSRequestActionType.AUTO_VOID_INSTANT_WITH_POLICY_ID.toString();
  }
}