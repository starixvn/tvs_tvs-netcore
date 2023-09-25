import { Result } from '../../models/result';

export class MessagesResult {
    isShow: boolean;
    header: string;
    results: Array<Result>;

    open(header: string, results: Array<Result>) {
        this.header = header;
        this.results = results;
        this.isShow = true;
    }
}