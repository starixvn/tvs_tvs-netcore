
import { CommonTicketsModel } from '../../../../../utility/models/common.tickets.model';
import { GroupModel } from './group-tickets.model';
import { TicketModel } from './ticket.model';

export class TicketsModel extends CommonTicketsModel<GroupModel> {
  totalSingle: number;
  totalParlay: number;
  selectedSingle: number;
  selectedParlay: number;

  initData(data: TicketsModel) {
    this.totalSingle = data.totalSingle;
    this.totalParlay = data.totalParlay;
    this.mapGroups(data.groups);
    this.changeIconCheckBox();
  }

  mapGroups(groups: Array<GroupModel>) {
    this.groups = [];
    groups.forEach(item => {
      const group = new GroupModel(item.name, item.tickets, item.displayTotalTickets);
      this.groups.push(group);
    });
  }

  handlecheckTicketByBetTypes(checkedBetTypes: number[]) {
    this.groups.forEach(group => {
      group.tickets.forEach(y => {
        y.isChecked = (checkedBetTypes.includes(Number(y.betTypeId)) && !y.isParlay) || (checkedBetTypes.includes(Number(y.subBetTypeId)) && y.isParlay);
      });
      group.displayTotalTickets = group.getCheckedTickets().length;
      group.isCheckAll = group.tickets.length === group.displayTotalTickets;
    });
  }
  
  checkAllTickets() {
    this.groups.forEach(group => {
      if (group.name !== 'Others') {
        group.tickets.forEach(y => {
          y.isChecked = true;
        });
        group.isCheckAll = group.tickets.length === group.getCheckedTickets().length;
      } else {
        group.tickets.forEach(y => {
          y.isChecked = false;
        });
        group.isCheckAll = false;
      }
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
