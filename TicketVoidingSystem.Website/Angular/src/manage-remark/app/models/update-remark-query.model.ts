import { AddRemarkModel } from "./add-remark.model";

export class UpdateRemarkQuery extends AddRemarkModel {
  remarkId: number;
  guid: string;
  sessionTime: number;
}

