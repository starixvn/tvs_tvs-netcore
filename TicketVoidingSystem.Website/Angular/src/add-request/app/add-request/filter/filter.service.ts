import { Injectable } from '@angular/core';
import { SportInfo } from '../../../../utility/models/event.model';
import { HttpService } from '../../../../utility/services/http.service';
import { IssueTypes } from './issue-types.model';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(
    private readonly httpService: HttpService
  ) { }

  async getIssueTypes(): Promise<IssueTypes> {
    return this.httpService.getJson('api/SharedApi/GetIssueTypes');
  }

  async getSportsType(): Promise<SportInfo[]> {
    return this.httpService.getJson('api/SharedApi/GetSportsType');
  }
}
