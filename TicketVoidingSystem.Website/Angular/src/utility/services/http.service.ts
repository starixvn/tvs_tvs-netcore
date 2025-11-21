import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { saveAs } from 'file-saver-es';
import { of } from "rxjs";
import { catchError, timeout } from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  http = inject(HttpClient);

  public async getJson<T>(url: string): Promise<T> {
    try {
      const response = await this.http.get(url).toPromise();
      return response as T;
    } catch (error) {
      return null;
    }
  }

  public async postJson<T, TResult>(object: T, url: string): Promise<TResult> {
    const body = JSON.stringify(object);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers };

    try {
      const result = await this.http.post(url, body, options).toPromise();
      return result as TResult;
    } catch (error) {
      return null;
    }
  }

  public async deleteJson<T>(url: string): Promise<T> {
    try {
      const response = await this.http.delete(url).toPromise();
      return response as T;
    } catch (error) {
      return null;
    }
  }

  public async downloadFile<T>(query: T, url: string, timeoutEvent?: () => void) {
    const response = await this.getResponseBlob(query, url, timeoutEvent);
    if(response) {
      const disposition = response.headers.get('content-disposition');
      if (disposition) {
        const fileName = disposition.split('filename=')[1];
        if (fileName) {
          saveAs(response.body, fileName);
        }
      }
    }
  }

  private async getResponseBlob<T>(query: T, url: string, timeoutEvent?: () => void): Promise<HttpResponse<Blob>> {
    const body = JSON.stringify(query);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' });
    const response = await this.http.post(url, body,
      { headers: headers, responseType: 'blob', observe: 'response' }).pipe(timeout(300000), catchError(_ => {
        if (timeoutEvent) {
          timeoutEvent();
        }
        return of(null);
      })).toPromise();
    return response;
  }
}
