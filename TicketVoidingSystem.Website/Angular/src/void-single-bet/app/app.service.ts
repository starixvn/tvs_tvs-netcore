import { Injectable } from '@angular/core';
import { CheckingPermissionModel } from 'src/utility/models/checking-permission.model';
import { GetBetTypesQuery, GroupBetTypesModel } from '../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { BlockUiService } from '../../utility/components/block-ui/block-ui.service';
import { MatchModel } from '../../utility/models/match.model';
import { Result, SqlResult } from '../../utility/models/result';
import { CommonService } from '../../utility/services/common.service';
import { HttpService } from '../../utility/services/http.service';
import { CheckVoidBetPermissionQuery, GetTicketsQuery, VoidTicketsQuery } from './models/query.model';
import { TicketsModel } from './tickets/tickets.model';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService,
    private readonly commonService: CommonService,
    private readonly blockUIService: BlockUiService) { }

  async getRemark(): Promise<string[]> {
    const url = 'api/VoidSingleBet/GetRemark';
    this.blockUIService.start();
    const result = await this.httpService.getJson<string[]>(url);
    this.blockUIService.stop();
    return result;
  }

  async getGroupBetTypes(query: GetBetTypesQuery): Promise<GroupBetTypesModel> {
    this.blockUIService.start();
    const result = await this.commonService.getGroupBetTypes(query);
    this.blockUIService.stop();
    return result;
  }

  async getMatchInfo(id: number): Promise<MatchModel> {
    this.blockUIService.start();
    const result = await this.commonService.getMatch(id);
    this.blockUIService.stop();
    return result;
  }

  async getTickets(query: GetTicketsQuery): Promise<TicketsModel> {
    const url = 'api/VoidSingleBet/GetTickets';
    this.blockUIService.start();
    const result = await this.httpService.postJson<GetTicketsQuery, TicketsModel>(query, url);
    this.blockUIService.stop();
    return result;
  }

  async GetLogInfo(query: GetTicketsQuery): Promise<TicketsModel> {
    const url = 'api/VoidSingleBet/GetLogInfo';
    this.blockUIService.start();
    const result = await this.httpService.postJson<GetTicketsQuery, TicketsModel>(query, url);
    this.blockUIService.stop();
    return result;
  }

  async exportExcel(query: GetTicketsQuery) {
    const url = 'api/VoidSingleBet/ExportExcel';
    this.blockUIService.start();
    const result = await this.httpService.downloadFile(query, url);
    this.blockUIService.stop();
    return result;
  }

  async voidTickets(query: VoidTicketsQuery): Promise<Result<null>[]> {
    const url = 'api/VoidSingleBet/VoidTickets';
    return this.httpService.postJson<VoidTicketsQuery, Result<null>[]>(query, url);
  }

  async checkVoidBetPermission(query: CheckVoidBetPermissionQuery): Promise<SqlResult> {

    const checkingPermissionModel = new CheckingPermissionModel();
    checkingPermissionModel.setParam(query.tickets, null, 'void-single-bet-check-void-bet-permission', false , null, false);
    this.blockUIService.start();   
   
    const result = await   this.commonService.checkVoidBetPermission(checkingPermissionModel);
    this.blockUIService.stop();
    return result;
  }

  async getVoidResultCache(guid: string): Promise<Result<null>[]> {
    return this.httpService.postJson<{ guid: string }, Result<null>[]>({ guid: guid }, `Utility/GetVoidResultCache`);
  }
}
