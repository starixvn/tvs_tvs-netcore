import { Result } from '../../models/result';

export class MessagesResult {
  isShow: boolean;
  header: string;
  results: Array<Result<string>>;
}
