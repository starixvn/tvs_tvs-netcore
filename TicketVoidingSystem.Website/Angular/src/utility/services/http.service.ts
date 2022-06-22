import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
@Injectable()
export class HttpService {
  constructor(
    private readonly http: HttpClient) {
  }

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

  public async downloadFile<T>(query: T, url: string) {
    const response = await this.getResponseBlob(query, url);
    const disposition = response.headers.get('content-disposition');
    const fileName = disposition.split('filename=')[1];
    saveAs(response.body, fileName);
  }

  private async getResponseBlob<T>(query: T, url: string): Promise<HttpResponse<Blob>> {
    const body = JSON.stringify(query);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' });
    const response = await this.http.post(url, body,
      { headers: headers, responseType: 'blob', observe: 'response' }).toPromise();
    return response;
  }
}
