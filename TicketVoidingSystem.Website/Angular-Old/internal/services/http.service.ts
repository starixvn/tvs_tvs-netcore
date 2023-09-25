import { BlockUIService } from './../../external/services/block-ui.service';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';


@Injectable()
export class HttpService {
  constructor(
    private http: HttpClient,
    private blockUIService: BlockUIService) {
  }

  public async getJson<T>(url: string): Promise<any> {
      this.blockUIService.blockUIEvent.emit(true);
      const response = await this.http.get(url)
          .toPromise()
          .catch((err) => this.handleError(err));
      this.blockUIService.blockUIEvent.emit(false);
      return response;
  }

  public async postJson<T>(object: any, url: string): Promise<any> {
      this.blockUIService.blockUIEvent.emit(true);
      const body = JSON.stringify(object);
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      const options = { headers: headers };

      const response = await this.http.post(url, body, options)
          .toPromise()
          .catch((err) => this.handleError(err));
      this.blockUIService.blockUIEvent.emit(false);
      return response;
  }

  private handleError(error: any) {
      const body = error.json();
      this.blockUIService.blockUIEvent.emit(false);
  }
}
