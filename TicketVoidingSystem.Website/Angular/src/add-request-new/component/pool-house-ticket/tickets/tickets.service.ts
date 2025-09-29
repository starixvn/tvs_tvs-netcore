import { Injectable } from '@angular/core';
import { GroupModel } from './group-tickets.model';
import { TicketModel } from './ticket.model';
import { TicketsModel } from './tickets.model';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  initData(data: TicketsModel) {
    const tickets = new TicketsModel();
    tickets.totalSingle = data.totalSingle;
    tickets.totalParlay = data.totalParlay;
    tickets.isHasSettledTicket = data.isHasSettledTicket;
    tickets.fromTime = data.fromTime;
    tickets.toTime = data.toTime;
    this.mapGroups(tickets, data.groups);
    this.mapOtherGroups(tickets, data.groupOtherTickets);
    tickets.changeIconCheckBox();
    this.checkAllTickets(tickets.groups);

    return tickets;
  }

  private mapGroups(tickets: TicketsModel, groups: Array<GroupModel>) {
    tickets.groups = [];
    groups.forEach(item => {
      const group = new GroupModel(item.name, item.tickets, item.displayTotalTickets);
      tickets.groups.push(group);
    });
  }

  private mapOtherGroups(tickets: TicketsModel, groups: Array<GroupModel>) {
    tickets.groupOtherTickets = [];
    groups?.forEach(item => {
      const group = new GroupModel(item.name, item.tickets, item.displayTotalTickets);
      tickets.groupOtherTickets.push(group);
    });
  }

  private isCheckedTicket(ticket: TicketModel, checkedBetTypes: number[]) {
    return (checkedBetTypes.includes(Number(ticket.betTypeId)) && !ticket.isParlay)
      || (checkedBetTypes.includes(Number(ticket.subBetTypeId)) && ticket.isParlay)
  }

  checkAllTicketsForPoolHousePopup(groups: Array<GroupModel>) {
    groups.forEach(group => {
      group.tickets.forEach((y, idx) => {
        y.isChecked = group.name !== 'Others';
        y.no = idx + 1;
      });
      group.isCheckAll = group.tickets.length === group.getCheckedTickets().length;
    });
  }

  checkAllTickets(groups: Array<GroupModel>) {
    groups.forEach(group => {
      group.tickets.forEach((ticket, index) => {
        ticket.isChecked = true;
        ticket.no = index + 1;
      });
    });
  }

  checkTicketByBetTypesForLGEarlyPopup(groups: Array<GroupModel>, betTypeNames: string[]) {
    groups.forEach(group => {
      let indexTicket = 0;
      group.tickets.forEach(y => {
        y.isChecked = betTypeNames.includes(y.isParlay ? y.subBetType : y.betType);
        if (y.isChecked) {
          ++indexTicket;
          y.no = indexTicket;
        } else {
          y.no = indexTicket;
        }
      });
      group.displayTotalTickets = group.getCheckedTickets().length;
      group.isCheckAll = group.tickets.length === group.displayTotalTickets;
    });
  }

  handleCheckTicketByBetTypes(groups: Array<GroupModel>, checkedBetTypes: number[]) {
    groups.forEach(group => {
      let indexTicket = 0;
      group.tickets.forEach(y => {
        y.isChecked = this.isCheckedTicket(y, checkedBetTypes);
        if (y.isChecked) {
          ++indexTicket;
          y.no = indexTicket;
        } else {
          y.no = indexTicket;
        }
      });

      group.displayTotalTickets = group.getCheckedTickets().length;
      group.isCheckAll = group.tickets.length === group.displayTotalTickets;
    });
  }

  updateSelectedTickets(tickets: TicketsModel) {
    const affectedPoolHouseTickets: TicketModel[] = [];
    tickets.groups.filter(x => x.name !== 'Others').forEach(x => {
      affectedPoolHouseTickets.push(...x.tickets);
    });

    tickets.selectedSingle = affectedPoolHouseTickets.filter(x => !x.isParlay && x.isChecked).length;
    tickets.selectedParlay = affectedPoolHouseTickets.filter(x => x.isParlay && x.isChecked).length;
  }
}
