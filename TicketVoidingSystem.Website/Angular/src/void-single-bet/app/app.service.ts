import { Injectable } from '@angular/core';
import { GetBetTypesQuery, GroupBetTypesModel } from '../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { BlockUiService } from '../../utility/components/block-ui/block-ui.service';
import { GetMatchQuery, MatchModel } from '../../utility/models/match.model';
import { Result, SqlResult } from '../../utility/models/result';
import { HttpService } from '../../utility/services/http.service';
import { CheckVoidBetPermissionQuery, GetTicketsQuery, VoidTicketsQuery } from './models/query.model';
import { TicketsModel } from './tickets/tickets.model';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService,
    private readonly blockUIService: BlockUiService) { }

  async getRemark(): Promise<string[]> {
    const url = 'SportBook/VoidSingleBet/GetRemark';
    this.blockUIService.start();
    const result = await this.httpService.getJson<string[]>(url);
    this.blockUIService.stop();
    return result;
  }

  async getGroupBetTypes(query: GetBetTypesQuery): Promise<GroupBetTypesModel> {
    const url = 'BetTypes/GetGroupBetTypesNg';
    this.blockUIService.start();
    const result = await this.httpService.postJson<GetBetTypesQuery, GroupBetTypesModel>(query, url);

    this.blockUIService.stop();
    return result;
  }

  async getMatchInfo(id: number): Promise<MatchModel> {
    const query: GetMatchQuery = { matchId: id, isMatch3rd: false };
    const url = 'Match/GetInfo';
    this.blockUIService.start();
    const result = await this.httpService.postJson<GetMatchQuery, MatchModel>(query, url);
    this.blockUIService.stop();
    return result;
  }

  async getTickets(query: GetTicketsQuery): Promise<TicketsModel> {
    const url = 'SportBook/VoidSingleBet/GetTickets';
    this.blockUIService.start();
    const result = await this.httpService.postJson<GetTicketsQuery, TicketsModel>(query, url);
    this.blockUIService.stop();
    return result;
  }

  async GetLogInfo(query: GetTicketsQuery): Promise<TicketsModel> {
    const url = 'SportBook/VoidSingleBet/GetLogInfo';
    this.blockUIService.start();
    const result = await this.httpService.postJson<GetTicketsQuery, TicketsModel>(query, url);
    this.blockUIService.stop();
    return result;
  }

  async exportExcel(query: GetTicketsQuery) {
    const url = 'SportBook/VoidSingleBet/ExportExcel';
    this.blockUIService.start();
    const result = await this.httpService.downloadFile(query, url);
    this.blockUIService.stop();
    return result;
  }

  async voidTickets(query: VoidTicketsQuery): Promise<Result<null>[]> {
    const url = 'SportBook/VoidSingleBet/VoidTickets';
    return this.httpService.postJson<VoidTicketsQuery, Result<null>[]>(query, url);
  }

  async checkVoidBetPermission(query: CheckVoidBetPermissionQuery): Promise<SqlResult> {
    const url = 'state-api/simple-data/update';
    query.apikey = 'void-single-bet-check-void-bet-permission';
    this.blockUIService.start();
    const result = await this.httpService.postJson<CheckVoidBetPermissionQuery, SqlResult>(query, url);
    this.blockUIService.stop();
    return result;
  }

  async getVoidResultCache(guid: string): Promise<Result<null>[]> {
    return this.httpService.postJson<{ guid: string }, Result<null>[]>({ guid: guid }, `Utility/GetVoidResultCache`);
  }
}
