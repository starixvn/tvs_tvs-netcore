import { AddRemarkModel } from "./add-remark.model";

export class AddRemarkQuery extends AddRemarkModel {
  guid: string;
}

export class AddRemarkResultData {
  matchId: number;
  remarkId: number;
}