import { AddRemarkModel } from "./add-remark.model";

export class AddRemarkQuery extends AddRemarkModel {
  remarkId?: number;
  guid: string;
  sessionTime: number;
}

export class AddRemarkResultData {
  matchId: string;
  remarkId: number;
}