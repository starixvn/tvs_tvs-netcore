
import { CommonTicketsModel } from '../../../../../utility/models/common.tickets.model';
import { GroupModel } from './group-tickets.model';
import { TicketModel } from './ticket.model';

export class TicketsModel extends CommonTicketsModel<GroupModel> {
  totalSingle: number;
  totalParlay: number;
  selectedSingle: number;
  selectedParlay: number;
  isHasSettledTicket: boolean;
  fromTime: Date;
  toTime: Date;

  initData(data: TicketsModel) {
    this.totalSingle = data.totalSingle;
    this.totalParlay = data.totalParlay;
    this.isHasSettledTicket = data.isHasSettledTicket;
    this.fromTime = data.fromTime;
    this.toTime = data.toTime;
    this.mapGroups(data.groups);
    this.mapOtherGroups(data.groupOtherTickets);
    this.changeIconCheckBox();
    this.checkAllTickets();
  }

  mapGroups(groups: Array<GroupModel>) {
    this.groups = [];
    groups.forEach(item => {
      const group = new GroupModel(item.name, item.tickets, item.displayTotalTickets);
      this.groups.push(group);
    });
  }

  mapOtherGroups(groups: Array<GroupModel>) {
    this.groupOtherTickets = [];
    groups.forEach(item => {
      const group = new GroupModel(item.name, item.tickets, item.displayTotalTickets);
      this.groupOtherTickets.push(group);
    });
  }

  private isCheckedTicket(ticket:  TicketModel,checkedBetTypes: number[]){
    return (checkedBetTypes.includes(Number(ticket.betTypeId)) && !ticket.isParlay)
      || (checkedBetTypes.includes(Number(ticket.subBetTypeId)) && ticket.isParlay)
  }

  checkAllTicketsForPoolHousePopup() {
    this.groups.forEach(group => {
      let indexTicket = 0;
      group.tickets.forEach(y => {
        y.isChecked = group.name !== 'Others';
        y.no = ++indexTicket;
      });
      group.isCheckAll = group.tickets.length === group.getCheckedTickets().length;
    });
  }

  checkAllTickets() {
    this.groups.forEach(group => {
        group.tickets.forEach((ticket, index) => {
            ticket.isChecked = true;
            ticket.no = index + 1;
        });
    });
  }

  checkTicketByBetTypesForLGEarlyPopup(betTypeNames: string[]) {
    this.groups.forEach(group => {
      let indexTicket = 0;
      group.tickets.forEach(y => {
        y.isChecked = betTypeNames.includes(y.betType);
        y.no = y.isChecked ? ++indexTicket: indexTicket;
      });
      group.displayTotalTickets = group.getCheckedTickets().length;
      group.isCheckAll = group.tickets.length === group.displayTotalTickets;
    });
  }

  handleCheckTicketByBetTypes(checkedBetTypes: number[]) {
    this.groups.forEach(group => {
      let indexTicket = 0;
      group.tickets.forEach(y => {
        y.isChecked = this.isCheckedTicket(y, checkedBetTypes);
        y.no = y.isChecked ? ++indexTicket : indexTicket;
      });
      group.displayTotalTickets = group.getCheckedTickets().length;
      group.isCheckAll = group.tickets.length === group.displayTotalTickets;
    });
  }

  checkGroups() {
    if (this.groups.length > 0) {
      this.groups.forEach(group => {
        group.isCheckAll = group.tickets.length === group.getCheckedTickets().length;
      });
    }
  }

  updateSelectedTickets() {
    const affectedPoolHouseTickets: TicketModel[] = [];
    this.groups.filter(x => x.name !== 'Others').forEach(x => {
      affectedPoolHouseTickets.push(...x.tickets);
    });

    this.selectedSingle = affectedPoolHouseTickets.filter(x => !x.isParlay && x.isChecked).length;
    this.selectedParlay = affectedPoolHouseTickets.filter(x => x.isParlay && x.isChecked).length;
  }
}
