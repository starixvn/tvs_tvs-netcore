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
  doneBy: string;
}

export class LogsModel {
  logList: Array<LogModel>;
  totalLogs: number;
}