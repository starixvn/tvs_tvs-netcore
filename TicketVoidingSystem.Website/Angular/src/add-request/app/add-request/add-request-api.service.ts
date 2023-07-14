import { Injectable } from '@angular/core';
import { GetLinkedLogQuery, LinkedLogsViewModel } from '../../../utility/components/pool-house-ticket/linked-log/linked-log.model';
import { GetPoolHouseTicketQuery, PoolHouseTicketViewModel } from '../../../utility/components/pool-house-ticket/pool-house-ticket.model';
import { Result } from '../../../utility/models/result';
import { HttpService } from '../../../utility/services/http.service';
import { AddRequestQuery } from '../add-request/models/add-request.query';
import { WrongScoreModel } from '../add-request/models/event-wrong-score.model';
import { LastTimeScore, LastTimeScoreQuery } from '../add-request/models/last-time-score.model';
import { ChildMatchModel } from '../add-request/models/related-event.model';
import { AddRequestResultModel } from '../add-request/models/request.model';
import { SubIssueTypeLinkMatch, SubIssueTypeLinkMatchQuery } from '../add-request/models/sub-type-link-match.model';
import { CheckUsernamesViewModel, CheckValidUsernamesQuery } from './abnormal-accounts/models/check-username.model';
import { CheckTransIdsQuery, CheckTransIdsViewModel } from './event-abnormal-bet/event-abnormal-bet.model';
import { ReducedOverBetType } from './event-reduced-over/models/bet-type-reduced-over-json.model';
import { CheckTicket14Query } from './event-ticket14/models/check-ticket14.query';
import { CheckTickets14Result } from './event-ticket14/models/check-tickets14-result.model';
import { GetChildMatchQuery } from './models/get-child-match.query';

@Injectable({
  providedIn: 'root'
})
export class AddRequestApiService {
  constructor(
    private readonly httpService: HttpService
  ) { }

  /* istanbul ignore next */
  async addRequest(query: AddRequestQuery): Promise<Result<AddRequestResultModel>> {
    return this.httpService.postJson<AddRequestQuery, Result<AddRequestResultModel>>(query, 'api/AddRequest/AddRequest');
  }

  /* istanbul ignore next */
  async editRequest(query: AddRequestQuery): Promise<Result<AddRequestResultModel>> {
    return this.httpService.postJson<AddRequestQuery, Result<AddRequestResultModel>>(query, 'api/ManageRequest/UpdateRequest');
  }

  /* istanbul ignore next */
  async getWrongScores(matchId: number): Promise<WrongScoreModel[]> {
    return this.httpService.postJson<{ matchId: number }, WrongScoreModel[]>({ matchId: matchId }, 'api/AddRequest/GetWrongScoreInfo');
  }

  /* istanbul ignore next */
  async getLastTimeScore(query: LastTimeScoreQuery): Promise<LastTimeScore> {
    return this.httpService.postJson<LastTimeScoreQuery, LastTimeScore>(query, 'api/AddRequest/GetLastTimeScore');
  }

  /* istanbul ignore next */
  async getChildMatches(query: GetChildMatchQuery): Promise<ChildMatchModel[]> {
    return this.httpService.postJson<GetChildMatchQuery, ChildMatchModel[]>(query, 'api/AddRequest/GetChildMatches');
  }

  /* istanbul ignore next */
  async getSubIssueTypeLinkMatch(query: SubIssueTypeLinkMatchQuery): Promise<SubIssueTypeLinkMatch[]> {
    return this.httpService.postJson<SubIssueTypeLinkMatchQuery, SubIssueTypeLinkMatch[]>(query, 'api/AddRequest/GetSubIssueTypeLinkMatch');
  }

  /* istanbul ignore next */
  async checkTickets14(query: CheckTicket14Query): Promise<CheckTickets14Result> {
    return this.httpService.postJson<CheckTicket14Query, CheckTickets14Result>(query, 'api/AddRequest/CheckTickets14');
  }

  /* istanbul ignore next */
  async checkValidTransIdsForAbnormalBet(query: CheckTransIdsQuery): Promise<CheckTransIdsViewModel> {
    return this.httpService.postJson<CheckTransIdsQuery, CheckTransIdsViewModel>(query, 'api/AddRequest/CheckValidTransIdsRequest');
  }

  /* istanbul ignore next */
  async checkValidUsernames(query: CheckValidUsernamesQuery): Promise<CheckUsernamesViewModel> {
    return this.httpService.postJson<CheckValidUsernamesQuery, CheckUsernamesViewModel>(query, 'api/AddRequest/CheckValidUsernames');
  }

  /* istanbul ignore next */
  async getPoolHouseTickets(query: GetPoolHouseTicketQuery): Promise<PoolHouseTicketViewModel> {
    return this.httpService.postJson<GetPoolHouseTicketQuery, PoolHouseTicketViewModel>(query, 'api/AddRequest/GetPoolHouseTickets');
  }

  /* istanbul ignore next */
  async getLinkedLogs(query: GetLinkedLogQuery): Promise<LinkedLogsViewModel> {
    return this.httpService.postJson<GetLinkedLogQuery, LinkedLogsViewModel>(query, 'api/AddRequest/GetLinkedLog');
  }

  /* istanbul ignore next */
  async getReducedOverBetTypes(matchId: number): Promise<ReducedOverBetType[]> {
    return this.httpService.postJson<{ matchId: number }, ReducedOverBetType[]>({ matchId: matchId }, 'api/AddRequest/GetReducedOverBetTypes');
  }
}