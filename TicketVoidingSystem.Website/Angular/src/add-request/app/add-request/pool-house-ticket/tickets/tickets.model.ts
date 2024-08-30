
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

  handleCheckTicketByBetTypes(checkedBetTypes: number[]) {
    this.groups.forEach(group => {
      let indexTicket = 0;
      group.tickets.forEach(y => {
        y.isChecked = (checkedBetTypes.includes(Number(y.betTypeId)) && !y.isParlay) || (checkedBetTypes.includes(Number(y.subBetTypeId)) && y.isParlay);
        if (y.isChecked) {
          indexTicket++;
        }
        y.no = indexTicket;
      });
      group.displayTotalTickets = group.getCheckedTickets().length;
      group.isCheckAll = group.tickets.length === group.displayTotalTickets;
    });
  }

  checkAllTicketsForPoolHousePopup() {
    this.groups.forEach(group => {
      let indexTicket = 0;
      if (group.name !== 'Others') {
        group.tickets.forEach(y => {
          y.isChecked = true;
          indexTicket++;
          y.no = indexTicket;
        });
        group.isCheckAll = group.tickets.length === group.getCheckedTickets().length;
      } else {
        group.tickets.forEach(y => {
          y.isChecked = false;
          indexTicket++;
          y.no = indexTicket;
        });
        group.isCheckAll = false;
      }
    });
  }

  checkAllTickets() {
    this.groups.forEach(group => {
      let indexTicket = 0;
      group.tickets.forEach(y => {
        y.isChecked = true;
        indexTicket++;
        y.no = indexTicket;
      });
    });
  }

  checkTicketByBetTypesForLGEarlyPopup(checkedBetTypes: number[]) {
    this.groups.forEach(group => {
      let indexTicket = 0;
      group.tickets.forEach(y => {
        y.isChecked = checkedBetTypes.includes(y.groupBetTypeId);
        if (y.isChecked) {
          indexTicket++;
        }
        y.no = indexTicket;
      });
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
