export class OthersModel {
  mistakenBy?: string;
  decidedBy: string;
  operatorsList?: OperatorInfo[];
  provider?: string;
  source?: string;
  remark: string;
}

export class Provider {
  matchId: number;
  providerName: string;
}

export class OperatorType {
  static readonly TRADER = 1;
  static readonly SUSPENDER = 2;
}

export class GroupOperator {
  name: string;
  items: OperatorInfo[];
  selected: OperatorInfo[];

  constructor(
    name: string,
    items: OperatorInfo[]) {
    this.name = name;
    this.items = items;
    this.selected = [];
  }
}

export interface OperatorInfo {
  matchId: number;
  operatorId: number;
  operatorType: number;
  userName: string;
  groupName: string;
}

export class OperatorDefault {
  static readonly TRADER: OperatorInfo = { matchId: 0, userName: 'N/A', groupName: 'Trader', operatorId: 0, operatorType: 1 };
  static readonly SUSPENDER: OperatorInfo = { matchId: 0, userName: 'N/A', groupName: 'Suspender', operatorId: 0, operatorType: 2 };
}
