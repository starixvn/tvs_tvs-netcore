import { inject, Injectable } from '@angular/core';
import moment from 'moment-timezone';
import { UsernamesComponent } from '../../../../../../utility/components/user-names/user-names.component';
import { CheckboxType, DateTimeFormat, TVSRequestActionType } from '../../../../../../utility/constants/config';
import { AddRequestApiService } from '../../../../../services/add-request-api.service';
import { EventDateFilterComponent } from '../event-date-filter/event-date-filter.component';
import { CheckUsernamesViewModel, CheckValidUsernamesQuery } from '../models/check-username.model';
import { ValidationBusinessRuleArgs, ValidationBusinessRuleOutput } from '../models/validation.model';
import { ProductFilterComponent } from '../product-filter/product-filter.component';
import { UserNameService } from '../../../../../../utility/components/user-names/user-name.service';

@Injectable()
export class ValidationService {
  private readonly addRequestApiService = inject(AddRequestApiService);
  private readonly userNameService = inject(UserNameService);

  isValidCommonData(productFilterComponent: ProductFilterComponent, eventDateFilterComponent: EventDateFilterComponent): boolean {
    return productFilterComponent.isValidComponent() && eventDateFilterComponent.isValidEventDate();
  }

  async checkBusinessRule(args: ValidationBusinessRuleArgs): Promise<ValidationBusinessRuleOutput> {
    const result = await this.checkValidUsernames(args);
    args.primitiveProps.isShowAccountWinLost = true;

    return result;
  }

  async checkValidUsernames(args: ValidationBusinessRuleArgs): Promise<ValidationBusinessRuleOutput> {
    const usernames = this.userNameService.getAllValue(args.usernamesComponent.groupUsername);
    try {
      args.primitiveProps.isShowError = false;
      args.primitiveProps.infoSiteDBDownModel = null;

      const earlyValidationResult = this.performEarlyValidation(args, usernames);
      if (earlyValidationResult) {
        return earlyValidationResult;
      }

      const duplicatedResult = this.checkDuplicatedUsernames(args, usernames);
      if (duplicatedResult) {
        return duplicatedResult;
      }

      const viewModel = await this.getValidation(args);

      return this.processValidationResults(args, viewModel, usernames);

    } catch {
      return { isValid: this.highlightInvalidUsernames(args.usernamesComponent, usernames) } as ValidationBusinessRuleOutput;
    } finally {
      args.primitiveProps.isBlockUsernames = false;
    }
  }

  private performEarlyValidation(args: ValidationBusinessRuleArgs, usernames: string): ValidationBusinessRuleOutput | null {
    if (args.primitiveProps.isCancelValidate) {
      args.primitiveProps.isCancelValidate = false;
      return { isValid: false } as ValidationBusinessRuleOutput;
    }

    if (!this.isValidCommonData(args.productFilterComponent, args.eventDateFilterComponent)) {
      return { isValid: false } as ValidationBusinessRuleOutput;
    }

    if (usernames === '') {
      return { isValid: args.usernamesComponent.checkValidItems() } as ValidationBusinessRuleOutput;
    }

    return null;
  }

  private checkDuplicatedUsernames(args: ValidationBusinessRuleArgs, usernames: string): ValidationBusinessRuleOutput | null {
    this.userNameService.resetAllValue(args.usernamesComponent.groupUsername);
    if (this.userNameService.getDuplicatedItems(usernames).length > 0) {
      this.userNameService.updateDuplicatedItems(args.usernamesComponent.groupUsername, usernames);
      return { isValid: args.usernamesComponent.checkValidItems() } as ValidationBusinessRuleOutput;
    }
    return null;
  }

  private processValidationResults(args: ValidationBusinessRuleArgs, viewModel: CheckUsernamesViewModel, usernames: string): ValidationBusinessRuleOutput {
    const siteDbDownResult = this.handleSiteDbDown(args, viewModel);
    if (siteDbDownResult) {
      return siteDbDownResult;
    }

    if (viewModel.validation.isTicketLimitExceeded) {
      args.usernamesComponent.showErrorTicketLimitExceeded();
      return { isValid: false } as ValidationBusinessRuleOutput;
    }

    const invalidUsernames = viewModel.validation.invalidUserName;
    if (invalidUsernames) {
      return {
        isValid: this.highlightInvalidUsernames(args.usernamesComponent, invalidUsernames)
      } as ValidationBusinessRuleOutput;
    }

    const exceededResult = this.handleExceededTotalUsernames(args, viewModel);
    if (exceededResult) {
      return exceededResult;
    }

    const moveBetResult = this.handleMoveBetDateOrInvalidTicket(args, viewModel);
    if (moveBetResult) {
      return moveBetResult;
    }

    return {
      isValid: this.highlightInvalidUsernames(args.usernamesComponent, invalidUsernames || ''),
      numberOfTicketsExistedInRequest: viewModel.validation.numberOfTickets,
      usernamesOfCreditCashService: viewModel.validation.usernamesOfCreditCashService,
      transInfoAddRequestModel: viewModel.transInfoAddRequestModel,
      accountWinlostModels: viewModel.accountWinlostModels
    } as ValidationBusinessRuleOutput;
  }

  private handleSiteDbDown(args: ValidationBusinessRuleArgs, viewModel: CheckUsernamesViewModel): ValidationBusinessRuleOutput | null {
    args.primitiveProps.infoSiteDBDownModel = viewModel.infoSiteDBDownModel;
    if (viewModel.infoSiteDBDownModel) {
      this.userNameService.updateWarningSiteDBDown(args.usernamesComponent.groupUsername, viewModel.infoSiteDBDownModel.usernames);
      if (args.usernamesComponent.isAllUsernamesOffSiteDbDown()) {
        return { isValid: false } as ValidationBusinessRuleOutput;
      }
    }
    return null;
  }

  private handleExceededTotalUsernames(args: ValidationBusinessRuleArgs, viewModel: CheckUsernamesViewModel): ValidationBusinessRuleOutput | null {
    args.usernamesComponent.groupUsername.isExceededTotalUsernames = viewModel.validation.isExceededTotalUsernames;
    if (viewModel.validation.isExceededTotalUsernames) {
      return {
        isValid: args.usernamesComponent.checkValidItems(),
        accountWinlostModels: viewModel.accountWinlostModels
      } as ValidationBusinessRuleOutput;
    }
    return null;
  }

  private handleMoveBetDateOrInvalidTicket(args: ValidationBusinessRuleArgs, viewModel: CheckUsernamesViewModel): ValidationBusinessRuleOutput | null {
    if (viewModel.validation.isBeingMoveBetDate || viewModel.validation.isInvalidTotalTicket) {
      args.primitiveProps.isShowError = true;
      args.primitiveProps.isBeingMoveBetDate = viewModel.validation.isBeingMoveBetDate;
      args.primitiveProps.isInvalidTotalTicket = viewModel.validation.isInvalidTotalTicket;
      return {
        isValid: false,
        accountWinlostModels: viewModel.accountWinlostModels
      } as ValidationBusinessRuleOutput;
    }
    return null;
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
      isRemoveCreditCashService: args.isValidateFromConfirmPopup ? args.confirmAbnormalAccountComponent.model.checkboxState[CheckboxType.CREDIT_CASH_SERVICE] : false,
    };
    const results = await this.addRequestApiService.checkValidUsernames(query);

    return results;
  }

  private highlightInvalidUsernames(usernamesComponent: UsernamesComponent, invalidUsernames: string): boolean {
    this.userNameService.updateInvalid(usernamesComponent.groupUsername, invalidUsernames);
    return usernamesComponent.checkValidItems();
  }

  public isAutoVoidWithPolicy(actionId: string): boolean {
    return actionId === TVSRequestActionType.AUTO_VOID_INSTANT_WITH_POLICY_ID.toString();
  }
}