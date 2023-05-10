import { BetID } from '../../../utility/models/bet-id.model';
import { CommonTicketsModel } from '../../../utility/models/common.tickets.model';
import { GroupModel } from './group-tickets.model';
import { TicketModel } from './ticket.model';

enum IconCheckBox {
  none = 0,
  any = 1,
  all = 2
}

export class TicketsModel extends CommonTicketsModel<GroupModel> {
  totalItems: number;
  fromTime: string;
  toTime: string;
  singleCount: number;
  parlayCount: number;
  totalItemsList: BetID[];
  invalidTransIds: string;
  markedTransIds: string;
  movedTransIds: string;
  licenseesName: string;

  checkedTotalItems: number;
  uncheckedTransIds: string[];

  tempUncheckedList = new Array<string>();

  initData(data: TicketsModel) {
    this.totalItems = data.totalItems;
    this.fromTime = data.fromTime;
    this.toTime = data.toTime;
    this.tempUncheckedList = [];
    this.singleCount = data.singleCount;
    this.parlayCount = data.parlayCount;
    this.checkedTotalItems = data.totalItems;
    this.totalItemsList = data.totalItemsList;
    if (this.tempUncheckedList.length > 0) {
      this.checkedTotalItems = this.checkedTotalItems - this.tempUncheckedList.length;
    }
    this.mapGroups(data.groups);
    this.changeIconCheckBox();
    this.uncheckedTransIds = data.uncheckedTransIds;
  }

  mapGroups(groups: Array<GroupModel>) {
    this.groups = [];
    groups.forEach(item => {
      const group = new GroupModel(item.name, item.tickets, this.tempUncheckedList);
      this.groups.push(group);
    });
  }

  checkGroups() {
    if (this.groups.length > 0) {
      if (this.iconCheckBox !== IconCheckBox.none) {
        this.groups.forEach(group => {
          group.isCheckAll = false;
          group.checkAllTickets();
          this.updateCheckedTotalItem(group.tickets);
        });
        this.iconCheckBox = IconCheckBox.none;
      } else {
        this.groups.forEach(group => {
          group.isCheckAll = !group.isDisabled;
          group.checkAllTickets();
          this.updateCheckedTotalItem(group.tickets);
        });
        this.iconCheckBox = IconCheckBox.all;
      }
    }
  }

  getNumberOfTickets(): number {
    let result = 0;
    this.groups.forEach(item => result += item.tickets.length);
    return result;
  }

  getTicketsParam(): BetID[] {
    const result: BetID[] = [];
    this.groups.forEach(group => {
      group.tickets.forEach(ticket => {
        if (ticket.isChecked === true && ticket.isDisable === false) {
          result.push({
            transId: ticket.value,
            matchId: null,
            siteDbGroupId: ticket.siteDbGroupId
          });
        }
      });
    });
    return result;
  }

  getAllTickets(): BetID[] {
    const result: BetID[] = [];
    this.groups.forEach(group => {
      group.tickets.forEach(ticket => {
        result.push({
          transId: ticket.value,
          matchId: null,
          siteDbGroupId: ticket.siteDbGroupId
        });
      });
    });
    return result;
  }

  updateCheckedTotalItem(ticketModel: TicketModel[]) {
    ticketModel.forEach(ticket => {
      if (ticket.isChecked) {
        this.tempUncheckedList = this.tempUncheckedList.filter(item => item !== ticket.value);
        this.checkedTotalItems++;
      } else {
        const check = this.tempUncheckedList.find(item => ticket.value === item);
        if (check === null || check === undefined) {
          this.tempUncheckedList.push(ticket.value);
          this.checkedTotalItems--;
        }
      }
    });
  }

  getUncheckedTicketList(ticket: TicketModel): void {
    const getTicket = this.tempUncheckedList.find(item => item === ticket.value);
    if (ticket.isChecked) {
      this.checkedTotalItems++;
      if (getTicket !== null) {
        this.tempUncheckedList = this.tempUncheckedList.filter(value => value !== ticket.value);
      }
    } else {
      this.checkedTotalItems--;
      if (getTicket === null || getTicket === undefined) {
        this.tempUncheckedList.push(ticket.value);
      }
    }
  }

  getUncheckedTicketListFromGroup(group: GroupModel): void {
    group.tickets.forEach(item => {
      this.getUncheckedTicketList(item);
    });
  }

  getTicketsParamWithAllPage(): BetID[] {
    let tempList = this.totalItemsList;
    this.tempUncheckedList.forEach(item => {
      if (this.totalItemsList.some(x => x.transId === item)) {
        tempList = tempList.filter(x => x.transId !== item);
      }
    });

    return tempList;
  }
}
