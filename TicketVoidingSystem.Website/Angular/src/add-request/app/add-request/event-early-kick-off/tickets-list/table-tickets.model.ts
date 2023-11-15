import moment from 'moment-timezone';
import { GroupModel } from './group-tickets.model';

export class TableTicketsModel {
  id: string;
  groups = Array<GroupModel>();
  total: number;
  totalSingle: number;
  totalParlay: number;
  totalCancelCashOut: number;
  fromTime: Date;
  toTime: Date;
  strFromTime: string;
  strToTime: string;

  initData(data: TableTicketsModel) {
    this.total = data.total;
    this.totalSingle = data.totalSingle;
    this.totalParlay = data.totalParlay;
    this.totalCancelCashOut = data.totalCancelCashOut;
    this.fromTime = data.fromTime;
    this.toTime = data.toTime;
    this.strFromTime = moment(new Date(data.fromTime)).format('hh:mm:ss A');
    this.strToTime = moment(new Date(data.toTime)).format('hh:mm:ss A');
    this.mapGroups(data.groups);
  }

  private mapGroups(groups: Array<GroupModel>): void {
    this.groups = [];
    groups.forEach(item => {
      const group = new GroupModel(item.name, item.tickets, item.displayTotalTickets);
      this.groups.push(group);
    });
  }
}
