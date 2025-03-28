import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../../../utility/services/http.service';
import { IssueTypes } from './issue-types.model';

@Injectable()
export class FilterService {
  private readonly httpService = inject(HttpService);

  async getIssueTypes(): Promise<IssueTypes> {
    return this.httpService.getJson('api/SharedApi/GetIssueTypes');
  }
}
