import { Injectable } from '@angular/core';
import { TicketModel } from './ticket.model';
import { BetID } from '../../models/bet-id.model';
import { CommonTicketModel } from '../../models/common.ticket.model';
import { GroupModel } from './group.model';
import { SPECIALGROUP } from '../../constants/tickets-list.constant';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  getCheckedTickets(tickets: TicketModel[]): string[] {
    return tickets
      .filter(ticket => ticket.isChecked)
      .map(ticket => ticket.mainTransId);
  }

  checkSettledTickets(tickets: TicketModel[]): boolean {
    return tickets.some(ticket => ticket.isChecked && ticket.status.isSettled());
  }

  getTicketSold(tickets: TicketModel[]): string {
    return tickets
      .filter(ticket => ticket.isChecked && ticket.status.toLowerCase().indexOf('sold') !== -1)
      .map(ticket => ticket.value)
      .join(',');
  }

  getTicketCricket(tickets: TicketModel[]): BetID[] {
    return tickets.filter(ticket => ticket.isChecked && ticket.isCricket).map(ticket => {
      return {
        transId: ticket.value,
        siteDbGroupId: ticket.siteDbGroupId
      } as BetID;
    });
  }

  getTickets(tickets: TicketModel[]): BetID[] {
    return tickets.map(ticket => {
      return {
        transId: ticket.value,
        siteDbGroupId: ticket.siteDbGroupId
      } as BetID;
    });
  }

  getEnableTickets(tickets: TicketModel[]): BetID[] {
    return tickets.filter(ticket => ticket.isChecked && !ticket.isDisable).map(ticket => {
      return {
        transId: ticket.value,
        siteDbGroupId: ticket.siteDbGroupId
      } as BetID;
    });
  }

  static setIsCheckAll(tickets: TicketModel[] | CommonTicketModel[]): boolean {
    return tickets.every(ticket => ticket.isChecked && !ticket.isDisable);
  }

  changeTicketChecked(group: GroupModel, ticket: TicketModel) {
    group.isCheckAll = GroupService.setIsCheckAll(group.tickets);
    GroupService.checkDisabledTicket(group, ticket);
  }

  private static checkDisabledTicket(group: GroupModel, ticket: TicketModel) {
    if (group.disabledTickets.indexOf(ticket.value) > -1) {
      group.tickets.find(item => item.mainTransId === ticket.value).isChecked = ticket.isChecked;
    }
  }

  private static numberTicketDisable(tickets: TicketModel[]): number {
    return tickets.filter(ticket => ticket.isDisable).length;
  }

  checkAllTickets(group: GroupModel) {
    group.tickets.forEach(ticket => {
      ticket.isChecked = ticket.isDisable ? ticket.isChecked : group.isCheckAll;
      GroupService.checkDisabledTicket(group, ticket);
    });
  }

  private static checkDisableTickets(group: GroupModel) {
    group.tickets.forEach(ticket => {
      this.checkDisabledTicket(group, ticket);
    });
  }

  private static defaultSpecialGroup(group: GroupModel) {
    if (SPECIALGROUP.LOWERCASE.indexOf(group.name.toLowerCase()) !== -1) {
      group.isCheckAll = false;
      group.tickets.forEach(item => item.isChecked = false);
    }
  }

  private static setDisabledTickets(group: GroupModel) {
    const list = group.tickets.map(function (item) {
      return item.mainTransId;
    });
    group.disabledTickets = list.filter(function (item, index) {
      return list.indexOf(item) === index && BigInt(item) > 0;
    });
  }

  static mapTickets(group: GroupModel, tickets: Array<TicketModel>) {
    group.tickets = [];
    tickets.forEach(item => {
      const ticket = new TicketModel(item);
      group.tickets.push(ticket);
    });
  }

  static setValue(group: GroupModel, name: string) {
    group.name = name;
    group.isExpanded = true;
    group.isCheckAll = group.tickets.length !== this.numberTicketDisable(group.tickets);
    group.isDisabled = group.tickets.length === this.numberTicketDisable(group.tickets);
    this.setDisabledTickets(group);
    this.checkDisableTickets(group);
    this.defaultSpecialGroup(group);
  }
}
