import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import * as _ from 'lodash';
import { SortingComponent } from '../../../../../utility/components/sorting/sorting/sorting.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { RegexConstant } from '../../../../../utility/constants/regex';
import { AddRequestApiService } from '../../add-request-api.service';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { AbnormalAccountModel } from '../../models/abnormal-account.model';
import { AccountWinlostModel } from '../models/account-winlost.model';
import { ValidationBusinessRuleArgs } from '../models/validation.model';
import { ValidationService } from '../services/validation.service';

@Component({
  selector: 'account-table',
  templateUrl: './account-table.component.html',
  styleUrls: ['./account-table.component.scss']
})
export class AccountTableComponent {
  @Input() filter: FilterModel;
  @Input() requestId?: number;
  @Input() abnormalAccountModel: AbnormalAccountModel;
  @Input() accountWinlostModels: AccountWinlostModel[];
  @Output() changeTable = new EventEmitter();
  @ViewChildren('sortingComponent') sortingComponents: QueryList<SortingComponent>;
  tooltip = new Tooltip();
  isCancelRecalculateAmount: boolean;

  constructor(
    private readonly element: ElementRef,
    private readonly addRequestStore: AddRequestStore,
    private readonly appService: AddRequestApiService,
    private readonly validationService: ValidationService
  ) {
    this.tooltip.element = this.element;
  }

  public async reCalculate(account: AccountWinlostModel, index: number): Promise<void> {
    account.isShowInput = false;
    if (this.isCancelRecalculateAmount) {
      this.isCancelRecalculateAmount = false;
      return;
    }

    if (!this.isCorrectFormatVoidLimit(account, index)) {
      return;
    }
    this.addRequestStore.changeBlockingUiStatus(true);
    const viewModel = await this.validationService.getValidation(this.createValidationBusinessRuleArgs(account));
    const updatedAccountAmount = viewModel.accountWinlostModels.find(x => x.custId === account.custId);
    if (updatedAccountAmount) {
      account.isHighlight = updatedAccountAmount.isHighlight;
      account.givenCredit = updatedAccountAmount.givenCredit;
      account.currentLosing = updatedAccountAmount.currentLosing;
      account.currentWinning = updatedAccountAmount.currentWinning;
      account.estimateVoidAmount = updatedAccountAmount.estimateVoidAmount;
      account.winLostAfterVoid = updatedAccountAmount.winLostAfterVoid;
    }
    this.changeTable.emit();
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  public sorting(isDesc: boolean, orderBy: string, componentId: number): void {
    this.addRequestStore.changeBlockingUiStatus(true);
    this.sortingComponents.filter(x => x.id !== componentId).forEach(x => x.isDesc = null);
    this.accountWinlostModels = _.orderBy(_.uniqBy(this.accountWinlostModels, x => x.custId), [orderBy], [isDesc ? 'desc' : 'asc']);
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  async exportExcel(): Promise<void> {
    if (this.accountWinlostModels?.length > 0) {
      await this.appService.exportAccount(this.accountWinlostModels);
    }
  }

  private createValidationBusinessRuleArgs(account: AccountWinlostModel): ValidationBusinessRuleArgs {
    const arg = new ValidationBusinessRuleArgs();
    arg.requestId = this.requestId;
    arg.actionId = this.filter.action;
    arg.abnormalAccountModel = this.abnormalAccountModel;
    arg.abnormalAccountModel.accountWinlostModels = [account];

    return arg;
  }

  public isValid(): boolean {
    if (this.accountWinlostModels) {
      return this.accountWinlostModels.every(x => this.isCorrectFormatVoidLimit(x, this.accountWinlostModels.indexOf(x)))
    }

    return true;
  }

  public onChangeAdjustGV(account: AccountWinlostModel, index: number): void {
    this.isCorrectFormatVoidLimit(account, index);
  }

  public isCorrectFormatVoidLimit(account: AccountWinlostModel, index: number): boolean {
    if (!account.adjustVoidLimit) {
      account.adjustVoidLimitString = null
      return true;
    }

    if (!RegexConstant.ACCOUNT_VOID_LIMIT.test(account.adjustVoidLimit?.toString())) {
      account.adjustVoidLimitString = account.adjustVoidLimit.toString();
      this.tooltip.display('adjust-gv' + index, 'Invalid Amount.');
      return false;
    }
    const numberValue = Number(account.adjustVoidLimit.toString().replaceAll(',', ''));
    account.adjustVoidLimitString = this.showDecimalWithComma(numberValue);
    this.tooltip.hide();

    return true;
  }

  public showDecimalWithComma(amount: number): string {
    return amount?.toLocaleString(undefined, { maximumFractionDigits: 4 })
  }

  public mouseDownEventAdjustGV(account: AccountWinlostModel): void {
    if (!this.filter.isVoided) {
      account.isShowInput = !account.isShowInput;
    }
  }
}
