import { Result } from '../../models/result';

export class MessagesResult {
  isShow: boolean;
  header: string;
  results: Array<Result<string>>;

  open(header: string, results: Array<Result<string>>) {
    this.header = header;
    this.results = results;
    this.isShow = true;
  }
}
