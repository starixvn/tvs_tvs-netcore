import { IssueTypes } from './issue-types.model';
import { Injectable } from '@angular/core';
import { HttpService } from '../../../../utility/services/http.service';
import { SportInfo } from '../../../../utility/models/event.model';
import { IssueType } from '../../../../utility/models/issue-type.model';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(
    private readonly httpService: HttpService
  ) { }

  async getIssueTypes(): Promise<IssueTypes> {
    return this.httpService.getJson('TicketVoiding/GetIssueTypes');
  }

  async getSportsType(): Promise<SportInfo[]> {
    return this.httpService.getJson('TicketVoiding/GetSportsType');
  }
}
