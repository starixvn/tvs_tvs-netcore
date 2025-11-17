import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../utility/services/http.service';
import { AddRemarkQuery, AddRemarkResultData } from './models/add-remark-query.model';
import { Result } from '../../utility/models/result';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private readonly httpService = inject(HttpService);

  /* istanbul ignore next */
  async getIptv(matchId: number, eventDate: Date): Promise<string> {
    const response = await this.httpService.postJson<{ matchId: number, eventDate: Date }, { value: string }>(
      { matchId: matchId, eventDate: eventDate }, 'api/ManageReMark/GetIPTV'
    );
    return response.value || "";
  }

  /* istanbul ignore next */
  async addRemark(query: AddRemarkQuery): Promise<Result<AddRemarkResultData>> {
    return await this.httpService.postJson<AddRemarkQuery, Result<AddRemarkResultData>>(query, 'api/ManageReMark/AddRemark');
  }
}
