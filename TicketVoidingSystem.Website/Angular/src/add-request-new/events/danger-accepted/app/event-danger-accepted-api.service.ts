import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../../../utility/services/http.service';
import { CheckDangerAcceptedResult } from './event-danger-accepted/models/check-danger-accepted-result.model';
import { CheckDangerAcceptedQuery } from './event-danger-accepted/models/check-danger-accepted.query';

@Injectable({
  providedIn: 'root'
})
export class EventDangerAcceptedApiService {
  private readonly httpService = inject(HttpService);

  /* istanbul ignore next */
  async checkDangerAccepted(query: CheckDangerAcceptedQuery): Promise<CheckDangerAcceptedResult> {
    return this.httpService.postJson<CheckDangerAcceptedQuery, CheckDangerAcceptedResult>(query, 'api/AddRequest/CheckDangerAccepted');
  }
}