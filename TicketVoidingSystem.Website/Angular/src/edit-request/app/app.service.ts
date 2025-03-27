import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../utility/services/http.service';
import { RequestDetailViewModel } from './request.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  httpService = inject(HttpService);

  async getRequestById(id: number): Promise<RequestDetailViewModel> {
    return this.httpService.getJson(`api/ManageRequest/GetRequest/${id}`);
  }
}
