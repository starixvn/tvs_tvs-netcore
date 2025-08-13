import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../../../utility/services/http.service';
import { CheckRedCardResult } from './event-red-card/models/check-red-card-result.model';
import { CheckRedCardQuery } from './event-red-card/models/check-red-card.query';

@Injectable({
  providedIn: 'root'
})
export class EventRedCardApiService {
  private readonly httpService = inject(HttpService);

  /* istanbul ignore next */
  async checkRedCard(query: CheckRedCardQuery): Promise<CheckRedCardResult> {
    return this.httpService.postJson<CheckRedCardQuery, CheckRedCardResult>(query, 'api/AddRequest/CheckRedCard');
  }
}