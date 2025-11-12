export class TicketTableModel {
  no: number;
  betId: string;
  value: string;
  transDate: string;
  member: string;
  betType: string;
  betTypeId: number;
  subBetTypeId: number;
  odds: string;
  stake: string;
  winLoss: string;
  currency: string;
  status: string;
  score: string;
  handicap: string;
  choice: string;
  mainTransId: string;
  isParlay: boolean;
  siteDbGroupId: number;
  groupName: string;
  isChecked: boolean;
  subTransId: string;
  isHybrid: boolean;

  constructor(init?: Partial<TicketTableModel>) {
    Object.assign(this, init);
  }
}

export class GroupTicketTableModel {
  name: string;
  id: number;
  tickets: TicketTableModel[];
  displayTotalTickets: number;
  isChecked: boolean;
  isExpanded: boolean;

  constructor(init?: Partial<GroupTicketTableModel>) {
    Object.assign(this, init);
    this.tickets = init?.tickets.map(ticket => new TicketTableModel(ticket));
    this.isExpanded = true;
  }

  changeGroupToTickets() {
    this.tickets.forEach(tickets => {
      tickets.isChecked = this.isChecked;
    });
  }

  changeTicketToGroup() {
    this.isChecked = this.tickets.every(ticket => ticket.isChecked);
  }

  getCheckedTickets() {
    return this.tickets.filter(ticket => ticket.isChecked);
  }
}

export class TicketTableViewModel {
  groups: GroupTicketTableModel[];
  isChecked: boolean;
  isExpanded: boolean;

  constructor(init?: Partial<TicketTableViewModel>) {
    Object.assign(this, init);
    this.groups = init?.groups.map((group, index) => {
      const newGroup = new GroupTicketTableModel(group);
      newGroup.id = index;
      return newGroup;
    });
    this.isExpanded = true;
  }

  changeModelToGroups() {
    this.groups.forEach(group => {
      group.isChecked = this.isChecked;
      group.changeGroupToTickets();
    });
  }

  changeGroupToModel() {
    this.isChecked = this.groups.every(group => group.isChecked);
  }

  getAllCheckedTickets() {
    return this.groups.flatMap(group => group.getCheckedTickets());
  }
}