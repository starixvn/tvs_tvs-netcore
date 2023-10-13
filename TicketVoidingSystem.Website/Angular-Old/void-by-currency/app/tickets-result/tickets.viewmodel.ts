import { ElementRef } from '@angular/core';
import { PagingModel } from '../../../internal/components/paging/paging.model';
import { BetId } from '../../../internal/models/bet-id.model';
import { GroupViewModel } from './group.viewmodel';

enum IconCheckBox {
  none = 0,
  any = 1,
  all = 2
}

export class GroupTicketsViewModel {
  totalItems: number;
  pagingModel: PagingModel;
  groups: Array<GroupViewModel>;
  iconCheckBox: IconCheckBox;
  listCheckGroupTop: string;
  fromTransTime: Date;
  toTransTime: Date;

  updatePositionListCheckGroup(element: ElementRef) {
    const className = 'list-check-groups-input';
    const targetElement = element.nativeElement.getElementsByClassName(className);
    const top = targetElement[0].offsetParent.offsetTop + targetElement[0].offsetHeight;
    this.listCheckGroupTop = top + 'px';
  }

  getTicketEnable(): BetId[] {
    let result = [];
    this.groups.forEach(group => {
      const ticketInGroup = group.getEnableTickets();
      result.push(...ticketInGroup);
    });

    return result;
  }

  getAllTicket(): BetId[] {
    const result: BetId[] = [];
    this.groups.forEach(group => {
      const ticketInGroup = group.getTickets();
      result.push(...ticketInGroup);
    });

    return result;
  }
  getTicketCricket(): BetId[] {
    const result: BetId[] = [];
    this.groups.forEach(group => {
      const ticketInGroup = group.getTicketCricket();
      result.push(...ticketInGroup);
    });

    return result;
  }

  getTicketSold(): string {
    let result = '';
    this.groups.forEach(group => {
      const ticketInGroup = group.getTicketSold();
      result = ticketInGroup !== '' ?
        result !== '' ? result + ',' + ticketInGroup : ticketInGroup
        : result;
    });

    return result + this.getLastedSoldId();
  }

  getLastedSoldId(): string {
    const lastGroup = this.groups.length - 1;
    const lastedGroup = this.groups[lastGroup];
    const lastedTicket = lastedGroup.tickets[lastedGroup.tickets.length - 1];
    return lastedTicket.member.toLowerCase().indexOf('bettrade') !== -1 && lastedTicket.isChecked ?
      ',' + lastedTicket.soldId : '';
  }

  changeIconCheckBox() {
    let numberTickets = 0;
    let numberTicketsChecked = 0;
    this.groups.forEach(group => {
      group.tickets.forEach(ticket => {
        if (!ticket.isDisable) {
          numberTickets++;
          if (ticket.isChecked) {
            numberTicketsChecked++;
          }
        }
      });
    });
    this.iconCheckBox =
      numberTickets === 0 ? IconCheckBox.none :
        numberTickets === numberTicketsChecked ? IconCheckBox.all :
          numberTicketsChecked > 0 ? IconCheckBox.any : IconCheckBox.none;
  }

  checkGroups() {
    if (this.groups.length > 0) {
      if (this.iconCheckBox !== IconCheckBox.none) {
        this.groups.forEach(group => {
          group.isCheckAll = false;
          group.checkAllTickets();
        });
        this.iconCheckBox = IconCheckBox.none;
      }
      else {
        this.groups.forEach(group => {
          group.isCheckAll = !group.isDisabled;
          group.checkAllTickets();
        });
        this.iconCheckBox = IconCheckBox.all;
      }
    }
  }

  checkAllGroupsDropDown() {
    if (this.iconCheckBox !== IconCheckBox.all) {
      this.groups.forEach(group => {
        group.isCheckAll = !group.isDisabled;
        group.checkAllTickets();
      });
      this.iconCheckBox = IconCheckBox.all;
    }
    else {
      this.groups.forEach(group => {
        group.isCheckAll = false;
        group.checkAllTickets();
      });
      this.iconCheckBox = IconCheckBox.none;
    }
  }

  isAllItemsChecked(): boolean {
    let result = true;
    for (let i = 0; i < this.groups.length && result; i++) {
      for (let j = 0; j < this.groups[i].tickets.length && result; j++) {
        const ticket = this.groups[i].tickets[j];
        result = ticket.isChecked;
      }
    }

    return result;
  }
}
