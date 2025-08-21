import { inject, Injectable } from '@angular/core';
import { CheckTransIdsQuery, CheckTransIdsViewModel } from 'src/add-request/app/add-request/event-abnormal-bet/event-abnormal-bet.model';
import { Result } from '../../utility/models/result';
import { HttpService } from '../../utility/services/http.service';
import { GetLinkedLogQuery, LinkedLogsViewModel } from '../component/pool-house-ticket/linked-log/linked-log.model';
import { GetPoolHouseTicketQuery, PoolHouseTicketViewModel } from '../component/pool-house-ticket/pool-house-ticket.model';
import { TicketsModel } from '../component/pool-house-ticket/tickets/tickets.model';
import { AddRequestQuery } from '../models/add-request.query';
import { WrongScoreModel } from '../models/event-wrong-score.model';
import { GetChildMatchQuery } from '../models/get-child-match.query';
import { LastTimeScore, LastTimeScoreQuery } from '../models/last-time-score.model';
import { LogInfoTicketsQuery } from '../models/live-game-early-ticket.model';
import { PermissionAddRequest } from '../models/permission-add-request.model';
import { ChildMatchModel } from '../models/related-event.model';
import { RequestDetailViewModel } from '../models/request-detail.model';
import { AddRequestResultModel } from '../models/request.model';
import { SubIssueTypeLinkMatch, SubIssueTypeLinkMatchQuery } from '../models/sub-type-link-match.model';
import { GetSubIssueTypeNoteQuery, SaveSubIssueTypeNoteQuery, SubIssueTypeNoteModel } from '../models/sub-type-note.model';
import { MaxBetAndSpreadInfo, MaxBetAndSpreadQuery } from '../events/wrong-odds/app/event-wrong-odds/models/filter-wrong-odds.model';

@Injectable({
  providedIn: 'root'
})
export class AddRequestApiService {
  private readonly httpService = inject(HttpService);

  /* istanbul ignore next */
  async addRequest(query: AddRequestQuery): Promise<Result<AddRequestResultModel>> {
    return this.httpService.postJson<AddRequestQuery, Result<AddRequestResultModel>>(query, 'api/AddRequest/AddRequest');
  }

  /* istanbul ignore next */
  async editRequest(query: AddRequestQuery): Promise<Result<AddRequestResultModel>> {
    return this.httpService.postJson<AddRequestQuery, Result<AddRequestResultModel>>(query, 'api/ManageRequest/UpdateRequest');
  }

  /* istanbul ignore next */
  async getPermissionAddRequest(): Promise<PermissionAddRequest> {
    return this.httpService.getJson<PermissionAddRequest>('api/AddRequest/GetPermission');
  }

  /* istanbul ignore next */
  async GetDecidedBy(): Promise<string[]> {
    return this.httpService.getJson('api/AddRequest/GetDecidedBy');
  }

  /* istanbul ignore next */
  async getSubIssueTypeNote(query: GetSubIssueTypeNoteQuery): Promise<SubIssueTypeNoteModel[]> {
    return this.httpService.postJson<GetSubIssueTypeNoteQuery, SubIssueTypeNoteModel[]>(query, 'api/AddRequest/GetSubIssueTypeNote');
  }

  /* istanbul ignore next */
  async saveSubIssueTypeNote(query: SaveSubIssueTypeNoteQuery): Promise<SubIssueTypeNoteModel[]> {
    return this.httpService.postJson<SaveSubIssueTypeNoteQuery, SubIssueTypeNoteModel[]>(query, 'api/AddRequest/SaveSubIssueTypeNote');
  }

  async getRequestById(id: number): Promise<RequestDetailViewModel> {
    return this.httpService.getJson(`api/ManageRequest/GetRequest/${id}`);
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
  async checkValidTransIdsForAbnormalBet(query: CheckTransIdsQuery): Promise<CheckTransIdsViewModel> {
    return this.httpService.postJson<CheckTransIdsQuery, CheckTransIdsViewModel>(query, 'api/AddRequest/CheckValidTransIdsRequest');
  }

  
  /* istanbul ignore next */
  async getLinkedLogs(query: GetLinkedLogQuery): Promise<LinkedLogsViewModel> {
    return this.httpService.postJson<GetLinkedLogQuery, LinkedLogsViewModel>(query, 'api/AddRequest/GetLinkedLog');
  }
  
  /* istanbul ignore next */
  async getPoolHouseTickets(query: GetPoolHouseTicketQuery): Promise<PoolHouseTicketViewModel> {
    return this.httpService.postJson<GetPoolHouseTicketQuery, PoolHouseTicketViewModel>(query, 'api/AddRequest/GetPoolHouseTickets');
  }

  
  /* istanbul ignore next */
  async GetLogInfoTickets(query: LogInfoTicketsQuery): Promise<TicketsModel> {
    return this.httpService.postJson(query, 'api/AddRequest/GetLogInfoTickets');
  }

  
  /* istanbul ignore next */
  async getMaxBetAndSpreadOfEvent(query: MaxBetAndSpreadQuery): Promise<MaxBetAndSpreadInfo[]> {
    return this.httpService.postJson(query, 'api/AddRequest/GetMaxBetAndSpread');
  }

  /* istanbul ignore next */
  // async checkDuplicateTickets(query: CheckDuplicateTicketsQuery): Promise<CheckDuplicateTicketsViewModel> {
  //   return this.httpService.postJson<CheckDuplicateTicketsQuery, CheckDuplicateTicketsViewModel>(query, 'api/AddRequest/CheckDuplicateTickets');
  // }

  /* istanbul ignore next */
  // async checkValidUsernames(query: CheckValidUsernamesQuery): Promise<CheckUsernamesViewModel> {
  //   return this.httpService.postJson<CheckValidUsernamesQuery, CheckUsernamesViewModel>(query, 'api/AddRequest/CheckValidUsernames');
  // }


  /* istanbul ignore next */
  // async getReducedOverBetTypes(matchId: number): Promise<ReducedOverBetType[]> {
  //   return this.httpService.postJson<{ matchId: number }, ReducedOverBetType[]>({ matchId: matchId }, 'api/AddRequest/GetReducedOverBetTypes');
  // }

  // /* istanbul ignore next */
  // async getAccountWinLost(requestId: number): Promise<AccountWinlostModel[]> {
  //   return this.httpService.postJson<{ requestId: number }, AccountWinlostModel[]>({ requestId: requestId }, 'api/AddRequest/GetAccountWinLost');
  // }

  // /* istanbul ignore next */
  // async exportAccount(models: AccountWinlostModel[]): Promise<void> {
  //   return this.httpService.downloadFile({ accounts: models }, 'api/AddRequest/ExportExcelAccount');
  // }

  // /* istanbul ignore next */
  // async exportExcelAbnormalBetTickets(query: CheckTransIdsQuery) {
  //   return this.httpService.downloadFile<CheckTransIdsQuery>(query, 'api/AddRequest/ExportExcelTicketAbnormalBet');
  // }

  // /* istanbul ignore next */
  // async getNotParticipateBetTypes(matchId: number): Promise<NotParticipateBetTypeViewModel> {
  //   return this.httpService.postJson<{ matchId: number }, NotParticipateBetTypeViewModel>({ matchId: matchId }, 'api/AddRequest/GetNotParticipateBetTypes');
  // }

  // /* istanbul ignore next */
  // async checkRecoverTicket(query: CheckRecoverTicketQuery): Promise<CheckRecoverTicketResult> {
  //   return this.httpService.postJson<CheckRecoverTicketQuery, CheckRecoverTicketResult>(query, 'api/AddRequest/CheckRecoverTicket');
  // }

  /* istanbul ignore next */
  // async GetTicketsAbnormalAccount(custId: number, transInfoJson: string): Promise<TicketTableViewModel> {
  //   return this.httpService.postJson({ custId, transInfoJson }, 'api/AddRequest/GetTicketsAbnormalAccount');
  // }
}