import { Injectable } from '@angular/core';
import { HttpService } from '../../utility/services/http.service';
import { RequestDetailViewModel } from './request.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private readonly httpService: HttpService
  ) { }

  async getRequestById(id: number): Promise<RequestDetailViewModel> {
    return this.httpService.getJson(`TicketVoidingSystem/ManageRequest/GetRequest/${id}`);
  }
}
