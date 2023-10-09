import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response, ResponseContentType } from '@angular/http';
import * as FileSaver from 'file-saver';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { BlockUIService } from '../../external/services/block-ui.service';

@Injectable()
export class HttpRequestService {
    constructor(
        private http: Http,
        private blockUIService: BlockUIService) {
    }

    public postJson<T>(object: any, url: string): Observable<T> {
        this.blockUIService.blockUIEvent.emit(true);
        const body = JSON.stringify(object);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers });

        return this.http.post(url, body, options)
            .map((response) => this.parseResponse(response))
            .catch((err) => this.handleError(err));
    }

    public getJson<T>(url: string): Observable<T> {
        this.blockUIService.blockUIEvent.emit(true);
        return this.http.get(url)
            .map((response) => this.parseResponse(response))
            .catch((err) => this.handleError(err));
    }

    private parseResponse(response: Response) {
        const body = response.json();
        this.blockUIService.blockUIEvent.emit(false);

        return body;
    }

    private handleError(error: any) {
        const body = error.json();
        this.blockUIService.blockUIEvent.emit(false);

        return Observable.throw(body);
    }

    public downloadFile(query: any, url: string, ) {
        this.blockUIService.blockUIEvent.emit(true);
        const body = JSON.stringify(query);
        const headers = new Headers({ 'Content-Type': 'application/json;charset=UTF-8' });
        const options = new RequestOptions({
            headers: headers,
            responseType: ResponseContentType.Blob
        });
        this.http.post(url, body, options)
            .subscribe(
            (response: any) => {
                const blob = response.blob();
                const disposition = response.headers.get('content-disposition');
                const fileName = disposition.split('filename=')[1];
                FileSaver.saveAs(blob, fileName);
                this.blockUIService.blockUIEvent.emit(false);
            });
    }
}