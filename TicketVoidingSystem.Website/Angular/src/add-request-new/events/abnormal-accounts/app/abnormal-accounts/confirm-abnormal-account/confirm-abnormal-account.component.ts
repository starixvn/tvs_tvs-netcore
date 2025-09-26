import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxType, TVSRequestActionType } from '../../../../../../utility/constants/config';
import { ConfirmAbnormalAccountModel } from './confirm-abnormal-account.model';

@Component({
  selector: 'confirm-abnormal-account',
  templateUrl: './confirm-abnormal-account.component.html',
  styleUrl: './confirm-abnormal-account.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ConfirmAbnormalAccountComponent implements OnChanges {
  @Input() isOpen: boolean;
  @Input() model = new ConfirmAbnormalAccountModel();
  @Input() siteDBDownInfoJson: string;
  @Input() action: string;
  @Output() clickCancel = new EventEmitter();
  @Output() clickOk = new EventEmitter();

  issueTypeName: string;
  subIssueTypeName: string
  actionName: string;
  checkboxType = CheckboxType;
  usernamesOfCreditCashService: string;
  isShowErrorCannotRemoveAllTickets = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen'] && this.isOpen) {
      this.updateData();
      this.checkMarkTicketSiteDbDown()
    }
  }
  
  private checkMarkTicketSiteDbDown(): void {
    const isShowCheckbox = this.siteDBDownInfoJson?.length > 0 && this.action !== TVSRequestActionType.TAKE_NOTE_ID.toString();
    this.model.isHasAffectedTicketSiteDBDown = isShowCheckbox;
    this.model.isMarkTicketSiteDbDown = isShowCheckbox;
  }

  private updateData(): void {
    if (this.model.isHasWarningAbnormalAccount) {
      this.usernamesOfCreditCashService = this.model.usernamesOfCreditCashService.replaceAll(',', ', ');

      this.updateRemoveUsernameStatus();

      this.model.checkboxes = {};
      this.model.checkboxState = {};
      if (this.model.usernamesOfCreditCashService && this.model.usernamesOfCreditCashService.trim() !== '') {
        this.model.checkboxes[CheckboxType.CREDIT_CASH_SERVICE] = this.model.usernamesOfCreditCashService;
      }

      this.autoCheckAvailableCheckboxes();
    }
  }

  onCheckboxToggle(key: CheckboxType): void {
    this.model.checkboxState[key] = !this.model.checkboxState[key];
    this.updateRemoveUsernameStatus();
  }

  onClickCancel() {
    this.model.isOpen = false;
    this.clickCancel.emit();
  }

  onClickOk() {
    this.model.isOpen = false;
    this.clickOk.emit();
  }

  isOkButtonDisabled(): boolean {
    const checkedUsernames = new Set<string>();
    Object.entries(this.model.checkboxState).forEach(([key, checked]) => {
      if (checked && this.model.checkboxes[key]) {
        const usernames = this.model.checkboxes[key].split(',').map(x => x.trim()).filter(x => x !== '');
        usernames.forEach(ticket => checkedUsernames.add(ticket));
      }
    });

    const allTransIds = this.model.allUsernames.split(',').map(x => x.trim()).filter(x => x !== '');
    const allUsernamesCanBeRemoved = allTransIds.every(transId => checkedUsernames.has(transId));

    return allUsernamesCanBeRemoved;
  }

  private updateRemoveUsernameStatus() {
    const transIdList = this.model.allUsernames.split(',').filter(x => x.trim() !== '');
    const ticketsOfCreditCashServiceList = this.model.usernamesOfCreditCashService.split(',').filter(x => x.trim() !== '');

    const ticketsCanRemove = [...new Set([
      ...ticketsOfCreditCashServiceList
    ])];

    this.isShowErrorCannotRemoveAllTickets = this.isAllTicketsCanRemove(transIdList, ticketsCanRemove);
  }

  private autoCheckAvailableCheckboxes(): void {
    Object.keys(this.model.checkboxes).forEach(key => {
      this.model.checkboxState[key] = true;
    });
  }

  private isAllTicketsCanRemove(originalTransIds: string[], compareTransIds: string[]): boolean {
    if (originalTransIds.filter(x => !compareTransIds?.includes(x)).length > 0) {
      return false;
    }
    return true;
  }
}