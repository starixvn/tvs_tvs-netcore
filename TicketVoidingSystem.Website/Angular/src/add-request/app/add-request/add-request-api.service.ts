import { Injectable } from '@angular/core';
import { BetTeamAddRequest } from '../../../utility/components/advanced-mode-add-request/advanced-mode/advanced-mode.model';
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
import { AccountWinlostModel } from './abnormal-accounts/models/account-winlost.model';
import { CheckUsernamesViewModel, CheckValidUsernamesQuery } from './abnormal-accounts/models/check-username.model';
import { CheckTransIdsQuery, CheckTransIdsViewModel } from './event-abnormal-bet/event-abnormal-bet.model';
import { CheckDuplicateTicketsQuery, CheckDuplicateTicketsViewModel } from './event-duplicate-tickets/models/check-duplicate-tickets.model';
import { NotParticipateBetTypeViewModel } from './event-not-participate/models/not-participate-bet-type.model';
import { CheckRecoverTicketResult } from './event-recover-ticket/models/check-recover-ticket-result.model';
import { CheckRecoverTicketQuery } from './event-recover-ticket/models/check-recover-ticket.query';
import { ReducedOverBetType } from './event-reduced-over/models/bet-type-reduced-over-json.model';
import { CheckTicket14Query } from './event-ticket14/models/check-ticket14.query';
import { CheckTickets14Result } from './event-ticket14/models/check-tickets14-result.model';
import { GetChildMatchQuery } from './models/get-child-match.query';
import { PermissionAddRequest } from './models/permission-add-request.model';
import { GetSubIssueTypeNoteQuery, SaveSubIssueTypeNoteQuery, SubIssueTypeNoteModel } from './models/sub-type-note.model';
import { MaxBetAndSpreadQuery, MaxBetAndSpreadInfo } from './event-wrong-odds/models/filter-wrong-odds.model';

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

  async getChildMatchesInfo(query: GetChildMatchQuery): Promise<ChildMatchModel[]> {
    return this.httpService.postJson<GetChildMatchQuery, ChildMatchModel[]>(query, 'api/AddRequest/GetChildMatchesEKO');
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
  async checkDuplicateTickets(query: CheckDuplicateTicketsQuery): Promise<CheckDuplicateTicketsViewModel> {
    return this.httpService.postJson<CheckDuplicateTicketsQuery, CheckDuplicateTicketsViewModel>(query, 'api/AddRequest/CheckDuplicateTickets');
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
  async getSubIssueTypeNote(query: GetSubIssueTypeNoteQuery): Promise<SubIssueTypeNoteModel[]> {
    return this.httpService.postJson<GetSubIssueTypeNoteQuery, SubIssueTypeNoteModel[]>(query, 'api/AddRequest/GetSubIssueTypeNote');
  }

  /* istanbul ignore next */
  async saveSubIssueTypeNote(query: SaveSubIssueTypeNoteQuery): Promise<SubIssueTypeNoteModel[]> {
    return this.httpService.postJson<SaveSubIssueTypeNoteQuery, SubIssueTypeNoteModel[]>(query, 'api/AddRequest/SaveSubIssueTypeNote');
  }

  /* istanbul ignore next */
  async getReducedOverBetTypes(matchId: number): Promise<ReducedOverBetType[]> {
    return this.httpService.postJson<{ matchId: number }, ReducedOverBetType[]>({ matchId: matchId }, 'api/AddRequest/GetReducedOverBetTypes');
  }

  /* istanbul ignore next */
  async getAccountWinLost(requestId: number): Promise<AccountWinlostModel[]> {
    return this.httpService.postJson<{ requestId: number }, AccountWinlostModel[]>({ requestId: requestId }, 'api/AddRequest/GetAccountWinLost');
  }

  /* istanbul ignore next */
  async exportAccount(models: AccountWinlostModel[]): Promise<void> {
    return this.httpService.downloadFile({ accounts: models }, 'api/AddRequest/ExportExcelAccount');
  }

  /* istanbul ignore next */
  async exportExcelAbnormalBetTickets(query: CheckTransIdsQuery) {
    return this.httpService.downloadFile<CheckTransIdsQuery>(query, 'api/AddRequest/ExportExcelTicketAbnormalBet');
  }

  /* istanbul ignore next */
  async getNotParticipateBetTypes(matchId: number): Promise<NotParticipateBetTypeViewModel> {
    return this.httpService.postJson<{ matchId: number }, NotParticipateBetTypeViewModel>({ matchId: matchId }, 'api/AddRequest/GetNotParticipateBetTypes');
  }

   /* istanbul ignore next */
   async checkRecoverTicket(query: CheckRecoverTicketQuery): Promise<CheckRecoverTicketResult> {
    return this.httpService.postJson<CheckRecoverTicketQuery, CheckRecoverTicketResult>(query, 'api/AddRequest/CheckRecoverTicket');
  }

 /* istanbul ignore next */
  async getPermissionAddRequest(): Promise<PermissionAddRequest> {
    return this.httpService.getJson<PermissionAddRequest>('api/AddRequest/GetPermission');
  }

  /* istanbul ignore next */
  async getBetTeams(): Promise<BetTeamAddRequest[]> {
    return this.httpService.getJson<BetTeamAddRequest[]>('api/AddRequest/GetBetTeams');
  }

  /* istanbul ignore next */
  async getMaxBetAndSpreadOfEvent(query: MaxBetAndSpreadQuery): Promise<MaxBetAndSpreadInfo[]> {
    return this.httpService.postJson(query, 'api/AddRequest/GetMaxBetAndSpread');
  }
}