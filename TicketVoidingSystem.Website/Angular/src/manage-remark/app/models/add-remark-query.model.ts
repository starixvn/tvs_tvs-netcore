import { AddRemarkModel } from "./add-remark.model";

export class AddRemarkQuery extends AddRemarkModel {
  guid: string;
  sessionTime: number;
}

export class AddRemarkResultData {
  matchId: number;
  remarkId: number;
}