import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../../../utility/services/http.service';
import { CheckTicket14Query } from './event-ticket14/models/check-ticket14.query';
import { CheckTickets14Result } from './event-ticket14/models/check-tickets14-result.model';

@Injectable({
  providedIn: 'root'
})
export class EventTicket14ApiService {
  private readonly httpService = inject(HttpService);
  
  /* istanbul ignore next */
  async checkTickets14(query: CheckTicket14Query): Promise<CheckTickets14Result> {
    return this.httpService.postJson<CheckTicket14Query, CheckTickets14Result>(query, 'api/AddRequest/CheckTickets14');
  }
}