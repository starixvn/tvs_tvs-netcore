import { AmendmentReponse } from "../models/query.model";

export class MessagesResponse {
  isShow: boolean;
  header: string;
  results: AmendmentReponse[];

  open(header: string, results: AmendmentReponse[]) {
    this.header = header;
    this.results = results;
    this.isShow = true;
  }
}
