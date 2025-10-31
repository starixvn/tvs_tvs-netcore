export class LogModel {
  no: number;
  actionId: number;
  logDate: Date;
  action: string;
  matchId: number;
  event: string;
  kickOffTime: Date;
  htScore: string;
  ftScore: string;
  singleTickets: string[];
  parlayTickets: string[];
  hybridParlayTickets: string[];
  count: number;
  doneBy: string;
  childMatchId?:  number;
}

export class LogsModel {
  logList: Array<LogModel>;
  totalLogs: number;
}