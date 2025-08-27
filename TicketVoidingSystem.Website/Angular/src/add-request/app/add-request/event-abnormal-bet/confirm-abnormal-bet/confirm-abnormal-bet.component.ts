import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxType, TVSRequestActionType } from '../../../../../utility/constants/config';
import { ConfirmAbnormalBetModel } from './confirm-abnormal-bet.model';

@Component({
  selector: 'confirm-abnormal-bet',
  templateUrl: './confirm-abnormal-bet.component.html',
  styleUrls: ['./confirm-abnormal-bet.component.scss'],
  standalone: true,
  imports: [FormsModule]
})
export class ConfirmAbnormalBetComponent implements OnChanges {
  @Input() isOpen: boolean;
  @Input() model = new ConfirmAbnormalBetModel();
  @Input() isEdit: boolean;
  @Input() siteDBDownInfoJson: string;
  @Input() action: string;
  @Output() close = new EventEmitter();
  @Output() save = new EventEmitter();

  checkboxType = CheckboxType;
  ticketsOfVIPCustomer: string;
  settledTickets: string;
  ticketsOfCustomerClass201: string;
  ticketsOfCustomerClass4K: string;
  ticketsOfCreditCashService: string;
  isShowErrorCannotRemoveAllTickets = false;
  isConfirmCalculator = true;
  isMarkTicketSiteDbDown: boolean;

  onCheckboxToggle(key: CheckboxType): void {
    this.model.checkboxState[key] = !this.model.checkboxState[key];
    this.updateRemoveTicketStatus();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen'] && this.isOpen) {
      this.updateData();
      this.onChangeInfoMarkTicketSiteDBDown();
    }
  }

  private onChangeInfoMarkTicketSiteDBDown() {
    const isShowCheckbox = this.siteDBDownInfoJson?.length > 0 && this.action !== TVSRequestActionType.TAKE_NOTE_ID.toString();
    this.model.isHasAffectedTicketSiteDBDown = isShowCheckbox;
    this.isMarkTicketSiteDbDown = isShowCheckbox;
  }

  private updateData(): void {
    if (this.model.isHasWarningForAbnormalBet) {
      this.ticketsOfVIPCustomer = this.model.ticketsOfVIPCustomer.replaceAll(',', ', ');
      this.settledTickets = this.model.settledTickets.replaceAll(',', ', ');
      this.ticketsOfCustomerClass201 = this.model.ticketsOfCustomerClass201.replaceAll(',', ', ');
      this.ticketsOfCustomerClass4K = this.model.ticketsOfCustomerClass4K.replaceAll(',', ', ');
      this.ticketsOfCreditCashService = this.model.ticketsOfCreditCashService.replaceAll(',', ', ');

      this.updateRemoveTicketStatus();

      this.model.checkboxes = {};
      this.model.checkboxState = {};

      if (this.model.ticketsOfCustomerClass201 && this.model.ticketsOfCustomerClass201.trim() !== '') {
        this.model.checkboxes[CheckboxType.CUSTOMER_CLASS_201] = this.model.ticketsOfCustomerClass201;
      }

      if (this.model.ticketsOfCustomerClass4K && this.model.ticketsOfCustomerClass4K.trim() !== '') {
        this.model.checkboxes[CheckboxType.CUSTOMER_CLASS_4K] = this.model.ticketsOfCustomerClass4K;
      }

      if (this.model.ticketsOfCreditCashService && this.model.ticketsOfCreditCashService.trim() !== '') {
        this.model.checkboxes[CheckboxType.CREDIT_CASH_SERVICE] = this.model.ticketsOfCreditCashService;
      }

      this.autoCheckAvailableCheckboxes();
    }
  }

  private updateRemoveTicketStatus() {
    const transIdList = this.model.transIds.split(',').filter(x => x.trim() !== '');
    const ticketsOfCreditCashServiceList = this.model.ticketsOfCreditCashService.split(',').filter(x => x.trim() !== '');
    const ticketsOfCustomerClass201List = this.model.ticketsOfCustomerClass201.split(',').filter(x => x.trim() !== '');
    const ticketsOfCustomerClass4KList = this.model.ticketsOfCustomerClass4K.split(',').filter(x => x.trim() !== '');

    const ticketsCanRemove = [...new Set([
      ...ticketsOfCreditCashServiceList,
      ...ticketsOfCustomerClass201List,
      ...ticketsOfCustomerClass4KList
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

  isExistAtleastOneCheckboxChecked(): boolean {
    return Object.values(this.model.checkboxState).some(value => value);
  }

  isOkButtonDisabled(): boolean {
    const checkedTickets = new Set<string>();
    Object.entries(this.model.checkboxState).forEach(([key, checked]) => {
      if (checked && this.model.checkboxes[key]) {
        const tickets = this.model.checkboxes[key].split(',').map(x => x.trim()).filter(x => x !== '');
        tickets.forEach(ticket => checkedTickets.add(ticket));
      }
    });

    const allTransIds = this.model.transIds.split(',').map(x => x.trim()).filter(x => x !== '');
    const allTicketsCanBeRemoved = allTransIds.every(transId => checkedTickets.has(transId));

    return allTicketsCanBeRemoved;
  }

  closeClick() {
    this.model.isOpenDialog = false;
    this.isShowErrorCannotRemoveAllTickets = false;
    Object.keys(this.model.checkboxes).forEach(key => {
      this.model.checkboxState[key] = false;
    });
    this.close.emit();
  }

  saveClick() {
    this.model.isOpenDialog = false;
    this.save.emit();
  }
}
