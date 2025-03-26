import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { SortingComponent } from '../../../../../utility/components/sorting/sorting/sorting.component';
import { TooltipComponent } from '../../../../../utility/components/tooltip/tooltip.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { RegexConstant } from '../../../../../utility/constants/regex';
import { AddRequestApiService } from '../../add-request-api.service';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { AbnormalAccountModel } from '../../models/abnormal-account.model';
import { PermissionAddRequest } from '../../models/permission-add-request.model';
import { AccountWinlostModel } from '../models/account-winlost.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { ValidationBusinessRuleArgs } from '../models/validation.model';
import { ValidationService } from '../services/validation.service';
import DescriptionTableAdjustVoidConfig from './describe-table-adjust-void.json';

@Component({
    selector: 'account-table',
    templateUrl: './account-table.component.html',
    styleUrls: ['./account-table.component.scss'],
    standalone: true,
    imports: [SortingComponent, TooltipComponent, NgbTooltip, FormsModule, CommonModule]
})
export class AccountTableComponent {
  @Input() filter: FilterModel;
  @Input() requestId?: number;
  @Input() viewOnly: boolean;
  @Input() abnormalAccountModel: AbnormalAccountModel;
  @Input() accountWinlostModels: AccountWinlostModel[];
  @Input() permission: PermissionAddRequest;
  @Input() primitiveProps: PrimitiveProperty;
  @Output() reCalculateByAccountEvent = new EventEmitter<number>();
  @Output() openPopupAdjustTicketEvent = new EventEmitter<number>();
  @ViewChildren('sortingComponent') sortingComponents: QueryList<SortingComponent>;
  tooltip = new Tooltip();
  isCancelRecalculateAmount: boolean;
  isCheckedShowAdjustAccount: boolean;
  message = `Current Losing (L)\n
  Sum winlost (without actual stake) of all LOSE tickets\n
  Display L as negative number`;
  constructor(
    private readonly element: ElementRef,
    private readonly addRequestStore: AddRequestStore,
    private readonly appService: AddRequestApiService,
    private readonly validationService: ValidationService
  ) {
    this.tooltip.element = this.element;
  }

  async reCalculate(account: AccountWinlostModel, index: number) {
    account.isShowInput = false;
    if (this.isCancelRecalculateAmount) {
      this.isCancelRecalculateAmount = false;
      return;
    }

    if (!this.isCorrectFormatVoidLimit(account, index)) {
      return;
    }

    account.isShowInput = false;
    await this.delayForEventFocus();
    this.addRequestStore.changeBlockingUiStatus(true);
    const viewModel = await this.validationService.getValidation(this.createValidationBusinessRuleArgs(account));
    const updatedAccountAmount = viewModel.accountWinlostModels.find(x => x.custId === account.custId);
    if (updatedAccountAmount) {
      account.isShowOnTable = (!this.primitiveProps.isCheckedShowAdjustAccount && !updatedAccountAmount.isCanEditTicket) || updatedAccountAmount.isCanEditTicket;
      account.isHighlight = updatedAccountAmount.isHighlight;
      account.givenCredit = updatedAccountAmount.givenCredit;
      account.currentLosing = updatedAccountAmount.currentLosing;
      account.currentWinning = updatedAccountAmount.currentWinning;
      account.estimateVoidAmount = updatedAccountAmount.estimateVoidAmount;
      account.estimateVoidAmountUnEditableTickets = updatedAccountAmount.estimateVoidAmountUnEditableTickets;
      account.winLostAfterVoid = updatedAccountAmount.winLostAfterVoid;
      account.isCanEditTicket = updatedAccountAmount.isCanEditTicket;
      account.transInfoAccountJson = viewModel.transInfoAddRequestModel.transInfoJson;
      account.adjustVoidLimit = updatedAccountAmount.adjustVoidLimit;
      account.isEditedTicket = false;
    }
    this.reCalculateByAccountEvent.emit(account.custId);
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  async exportExcel() {
    if (this.accountWinlostModels?.length > 0) {
      await this.appService.exportAccount(this.accountWinlostModels);
    }
  }

  adjustInputFocus(event: MouseEvent): void {
    (event.target as HTMLInputElement).focus();
  }

  sorting(isDesc: boolean, orderBy: string, componentId: number) {
    this.addRequestStore.changeBlockingUiStatus(true);
    this.sortingComponents.filter(x => x.id !== componentId).forEach(x => x.isDesc = null);
    this.accountWinlostModels = _.orderBy(_.uniqBy(this.accountWinlostModels, x => x.custId), [orderBy], [isDesc ? 'desc' : 'asc']);
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  isValid() {
    if (this.accountWinlostModels) {
      return this.accountWinlostModels.every(x => this.isCorrectFormatVoidLimit(x, this.accountWinlostModels.indexOf(x)))
    }

    return true;
  }

  onChangeAdjustGV(account: AccountWinlostModel, index: number) {
    this.isCorrectFormatVoidLimit(account, index);
  }

  isCorrectFormatVoidLimit(account: AccountWinlostModel, index: number) {
    if (!account.adjustVoidLimit) {
      account.adjustVoidLimitString = null
      return true;
    }

    if (!RegexConstant.ACCOUNT_VOID_LIMIT.test(account.adjustVoidLimit.toString())) {
      account.adjustVoidLimitString = account.adjustVoidLimit.toString();
      this.tooltip.display('adjust-gv' + index, 'Invalid Amount.');
      return false;
    }
    const numberValue = Number(account.adjustVoidLimit.toString().replaceAll(',', ''));
    account.adjustVoidLimitString = this.showDecimalWithComma(numberValue);
    this.tooltip.hide();

    return true;
  }

  showDecimalWithComma(amount: number) {
    return amount?.toLocaleString(undefined, { maximumFractionDigits: 4 })
  }

  mouseDownEventAdjustGV(account: AccountWinlostModel) {
    this.isCancelRecalculateAmount = false;
    if (!this.filter.isVoided) {
      account.isShowInput = true;
    }
  }

  openPopupAdjustTicket(cusId: number) {
    this.openPopupAdjustTicketEvent.emit(cusId);
  }

  isShowAccounts() {
    return this.accountWinlostModels?.some(x => x.isShowOnTable);
  }

  private async delayForEventFocus() {
    await new Promise(f => setTimeout(f, 100));
  }

  private createValidationBusinessRuleArgs(account: AccountWinlostModel): ValidationBusinessRuleArgs {
    const arg = new ValidationBusinessRuleArgs();
    arg.requestId = this.requestId;
    arg.actionId = this.filter.action;
    arg.abnormalAccountModel = this.abnormalAccountModel;
    arg.abnormalAccountModel.accountWinlostModels = [account];
    arg.primitiveProps = new PrimitiveProperty();
    arg.primitiveProps.permission = this.permission;
    return arg;
  }

  getDescription(columnName: string) {
    return DescriptionTableAdjustVoidConfig.find(x => x.name === columnName)?.description || '';
  }
}
