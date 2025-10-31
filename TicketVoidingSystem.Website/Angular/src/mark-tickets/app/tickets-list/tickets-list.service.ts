import { Injectable } from '@angular/core';
import { IconCheckBox } from '../../../utility/constants/config';
import { SPECIALGROUP } from '../../../utility/constants/tickets-list.constant';
import { BetID } from '../../../utility/models/bet-id.model';
import { GroupModel } from './group-tickets.model';
import { TicketModel } from './ticket.model';
import { TicketsModel } from './tickets.model';

@Injectable({
  providedIn: 'root'
})
export class TicketsListService {
  initData(ticketsModel: TicketsModel, data: TicketsModel) {
    ticketsModel.totalItems = data.totalItems;
    ticketsModel.fromTime = data.fromTime;
    ticketsModel.toTime = data.toTime;
    ticketsModel.tempUncheckedList = [];
    ticketsModel.singleCount = data.singleCount;
    ticketsModel.parlayCount = data.parlayCount;
    ticketsModel.checkedTotalItems = data.totalItems;
    ticketsModel.totalItemsList = data.totalItemsList;
    if (ticketsModel.tempUncheckedList.length > 0) {
      ticketsModel.checkedTotalItems = ticketsModel.checkedTotalItems - ticketsModel.tempUncheckedList.length;
    }
    this.mapGroups(ticketsModel, data.groups);
    ticketsModel.changeIconCheckBox();
    ticketsModel.uncheckedTransIds = data.uncheckedTransIds;
  }

  private mapGroups(ticketsModel: TicketsModel, groups: Array<GroupModel>) {
    ticketsModel.groups = [];
    groups.forEach(item => {
      const group = this.initGroup(item.name, item.tickets, ticketsModel.tempUncheckedList);
      ticketsModel.groups.push(group);
    });
  }

  checkGroups(ticketsModel: TicketsModel) {
    if (ticketsModel.groups.length > 0) {
      if (ticketsModel.iconCheckBox !== IconCheckBox.none) {
        ticketsModel.groups.forEach(group => {
          group.isCheckAll = false;
          group.checkAllTickets();
          this.updateCheckedTotalItem(ticketsModel, group.tickets);
        });
        ticketsModel.iconCheckBox = IconCheckBox.none;
      } else {
        ticketsModel.groups.forEach(group => {
          group.isCheckAll = !group.isDisabled;
          group.checkAllTickets();
          this.updateCheckedTotalItem(ticketsModel, group.tickets);
        });
        ticketsModel.iconCheckBox = IconCheckBox.all;
      }
    }
  }

  getNumberOfTickets(groups: Array<GroupModel>): number {
    let result = 0;
    groups.forEach(item => result += item.tickets.length);
    return result;
  }

  getTicketsParam(groups: Array<GroupModel>): BetID[] {
    const result: BetID[] = [];
    groups.forEach(group => {
      group.tickets.forEach(ticket => {
        if (ticket.isChecked === true && ticket.isDisable === false) {
          result.push({
            isHybrid: ticket.isHybrid,
            transId: ticket.value,
            matchId: null,
            siteDbGroupId: ticket.siteDbGroupId
          } as BetID);
        }
      });
    });
    return result;
  }

  getAllTickets(groups: Array<GroupModel>): BetID[] {
    const result: BetID[] = [];
    groups.forEach(group => {
      group.tickets.forEach(ticket => {
        result.push({
          isHybrid: ticket.isHybrid,
          transId: ticket.value,
          matchId: null,
          siteDbGroupId: ticket.siteDbGroupId
        } as BetID);
      });
    });
    return result;
  }

  private updateCheckedTotalItem(ticketsModel: TicketsModel, ticketModel: TicketModel[]) {
    ticketModel.forEach(ticket => {
      if (ticket.isChecked) {
        ticketsModel.tempUncheckedList = ticketsModel.tempUncheckedList.filter(item => item !== ticket.value);
        ticketsModel.checkedTotalItems++;
      } else {
        const check = ticketsModel.tempUncheckedList.find(item => ticket.value === item);
        if (check === null || check === undefined) {
          ticketsModel.tempUncheckedList.push(ticket.value);
          ticketsModel.checkedTotalItems--;
        }
      }
    });
  }

  getUncheckedTicketList(ticketsModel: TicketsModel, ticket: TicketModel): void {
    const getTicket = ticketsModel.tempUncheckedList.find(item => item === ticket.value);
    if (ticket.isChecked) {
      ticketsModel.checkedTotalItems++;
      if (getTicket !== null) {
        ticketsModel.tempUncheckedList = ticketsModel.tempUncheckedList.filter(value => value !== ticket.value);
      }
    } else {
      ticketsModel.checkedTotalItems--;
      if (getTicket === null || getTicket === undefined) {
        ticketsModel.tempUncheckedList.push(ticket.value);
      }
    }
  }

  getUncheckedTicketListFromGroup(ticketsModel: TicketsModel, group: GroupModel): void {
    group.tickets.forEach(item => {
      this.getUncheckedTicketList(ticketsModel, item);
    });
  }

  getTicketsParamWithAllPage(ticketsModel: TicketsModel): BetID[] {
    let tempList = ticketsModel.totalItemsList;
    ticketsModel.tempUncheckedList.forEach(item => {
      if (ticketsModel.totalItemsList.some(x => x.transId === item)) {
        tempList = tempList.filter(x => x.transId !== item);
      }
    });

    return tempList;
  }

  private mapTickets(group: GroupModel, tickets: Array<TicketModel>) {
    group.tickets = [];
    tickets.forEach(item => {
      const ticket = new TicketModel(item);
      const indexTicket = group.uncheckedTicketList.indexOf(item.value);
      if (indexTicket >= 0) {
        ticket.isChecked = false;
      }
      group.tickets.push(ticket);
    });
  }

  private setValue(group: GroupModel, name: string) {
    group.name = name;
    group.isExpanded = true;
    group.isCheckAll = group.tickets.length !== group.numberTicketDisable();
    group.isDisabled = group.tickets.length === group.numberTicketDisable();
    group.setDisabledTickets();
    group.checkDisableTickets();
    this.defaultSpecialGroup(group);
  }

  private defaultSpecialGroup(group: GroupModel) {
    if (SPECIALGROUP.LOWERCASE.indexOf(group.name.toLowerCase()) !== -1) {
      group.isCheckAll = false;
      group.tickets.forEach(item => item.isChecked = false);
    }
  }

  initGroup(
    name: string,
    tickets: Array<TicketModel>,
    uncheckedTicketsList: Array<string>) {
    const group = new GroupModel();
    group.uncheckedTicketList = uncheckedTicketsList;
    this.mapTickets(group, tickets);
    this.setValue(group, name);
    return group;
  }
}
