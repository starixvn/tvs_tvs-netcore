import { Injectable, inject } from '@angular/core';
import moment from 'moment-timezone';
import { GetLogInfoQuery } from '../../add-request-new/models/add-request.query';
import { GetLogInfoViewModel } from '../../add-request-new/models/get-log-info.model';
import { HdpFilterBetType } from '../../add-request-new/models/hdp-filter-betType.model';
import { RequestDetailViewModel } from '../../add-request-new/models/request-detail.model';
import { PermissionManage } from '../../manage-request/app/models/permission-manage.model';
import { Selection } from '../../utility/models/selection.model';
import { GetOddsInfoQuery, OddsInfo } from '../components/advanced-mode/advanced-mode/advanced-mode.model';
import { GetBetTypesQuery, GroupBetTypesModel } from '../components/advanced-mode/group-bettypes/group-bettypes.model';
import { GroupBetTypeVirtualSport } from '../components/bettypes-virtualsports/bettypes-virtualsports.model';
import { BetTypesModel } from '../components/bettypes/bettypes.model';
import { GroupLicensee } from '../components/licensees/licensees.model';
import { NapUserInfoModel } from '../components/menu-bar/menu-bar.model';
import { Tooltip } from '../components/tooltip/tooltip.model';
import { BalanceUp } from '../models/balance-up.model';
import { CheckingPermissionModel } from '../models/checking-permission.model';
import { CopyRequestInfoQuery, CopyRequestInfoResponse } from '../models/copy-request-info.query';
import { Currency } from '../models/currency.model';
import { MatchInfoViewModel, SportInfo } from '../models/event.model';
import { IssueInfo, IssueType, IssueTypesModel } from '../models/issue-type.model';
import { CheckMatchWithRefNoQuery, FirstTicketTime, MatchModel } from '../models/match.model';
import { VoidedReason } from '../models/reason.model';
import { Result, SqlResult } from '../models/result';
import { HttpService } from './http.service';
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  httpService = inject(HttpService);

  async getNapUserInfo(): Promise<NapUserInfoModel> {
    return this.httpService.getJson('api/SharedApi/GetNapUserInfo');
  }

  async getBalanceUp(): Promise<BalanceUp> {
    return this.httpService.getJson(`api/SharedApi/GetBalanceUp`);
  }

  async getBalanceUpZoneManila(): Promise<BalanceUp> {
    return this.httpService.getJson(`api/SharedApi/GetBalanceUpZoneManila`);
  }

  async getGroupBetTypes(query: GetBetTypesQuery): Promise<GroupBetTypesModel> {
    return this.httpService.postJson(query, `api/BetTypes/GetGroupBetTypesNg`);
  }

  async getGroupBetTypesTvs(query: GetBetTypesQuery): Promise<GroupBetTypesModel> {
    return this.httpService.postJson(query, `api/BetTypes/GetGroupBetTypesTvsNg`);
  }

  async getBetTypesVirtualSports(query: GetBetTypesQuery): Promise<GroupBetTypeVirtualSport> {
    return this.httpService.postJson(query, `api/BetTypes/GetVirtualSport`);
  }

  async getBetTypes(query: GetBetTypesQuery): Promise<BetTypesModel> {
    return this.httpService.postJson(query, `api/BetTypes/GetBetTypes`);
  }

  async getSportsType(): Promise<SportInfo[]> {
    return this.httpService.getJson('api/SharedApi/GetSportsType');
  }

  async getMatch(matchId: number): Promise<MatchModel> {
    return this.httpService.postJson({ matchId, isMatch3rd: false }, 'api/MatchInfo/GetInfo');
  }

  async getVoidActions(): Promise<Selection[]> {
    return this.httpService.getJson('api/ManageRequest/GetVoidActions');
  }

  async getRequestById(id: number): Promise<RequestDetailViewModel> {
    return this.httpService.getJson(`api/ManageRequest/GetRequest/${id}`);
  }

  async getIssueInfo(subId: number): Promise<IssueInfo> {
    return this.httpService.getJson(`api/ManageRequest/GetIssueTypeName/${subId}`);
  }

  async getPermissionManageRequest(): Promise<PermissionManage> {
    return this.httpService.getJson('api/ManageRequest/GetPermissionManage');
  }

  async getFirstTimeAndKickOffTime(id: number): Promise<FirstTicketTime> {
    return this.httpService.getJson(`api/MatchInfo/GetFirstTimeAndKickOffTime/${id}`);
  }


  async getCurrencies(): Promise<Currency[]> {
    return this.httpService.getJson(`api/SharedApi/GetCurrencies`);
  }

  async getGroupLicensees(): Promise<GroupLicensee[]> {
    return this.httpService.getJson(`api/SharedApi/GetGroupLicensees`);
  }

  async getVoidedReason(subId: number, sportTypeId: number): Promise<VoidedReason> {
    return this.httpService.postJson({subId: subId, sportTypeId: sportTypeId}, `api/VoidRequest/GetVoidedReason`);
  }

  async checkMatchIdWithRefNo(query: CheckMatchWithRefNoQuery, tooltip: Tooltip): Promise<boolean> {
    const NUMBER_ONE = 1;
    const NUMBER_TWO = 2;
    const NUMBER_THREE = 3;
    const NUMBER_FOUR = 4;
    const NUMBER_FIVE = 5;
    const NUMBER_SIX = 6;
    const url = 'Match/CheckMatchIdWithRefNo';
    const data = await this.httpService.postJson<CheckMatchWithRefNoQuery, Result<string>>(query, url);

    switch (data.errorCode) {
      case NUMBER_ONE:
      case NUMBER_TWO:
      case NUMBER_THREE:
      case NUMBER_FOUR:
        tooltip.display('match-id', data.errorMsg);
        break;
      case NUMBER_FIVE:
        tooltip.display('from-bet-id', data.errorMsg);
        break;
      case NUMBER_SIX:
        tooltip.display('to-bet-id', data.errorMsg);
        break;
      default:
        break;
    }

    return data.isSuccessful;
  }

  async checkVoidBetPermission(query: CheckingPermissionModel): Promise<SqlResult> {
    return this.httpService.postJson(query, `api/Permission/CheckTicketsStatus`);
  }

  async getIssueTypePermissionList(): Promise<IssueType[]> {
    return this.httpService.getJson('api/SharedApi/GetIssueTypePermissionList');
  }

  async getIssueTypes(): Promise<IssueTypesModel> {
    return this.httpService.getJson('api/SharedApi/GetIssueTypes');
  }

  async getLogInfo(query: GetLogInfoQuery): Promise<GetLogInfoViewModel> {
    return this.httpService.postJson<GetLogInfoQuery, GetLogInfoViewModel>(query, 'api/AddRequest/GetLogInfo');
  }

  async getMarkedTicketsCount(): Promise<number> {
    return this.httpService.getJson('api/ManageRequest/GetMarkedTicketsCount');
  }

  async getResultCache<T>(guid: string): Promise<Result<T>> {
    return this.httpService.postJson<{ guid: string }, Result<T>>({ guid: guid }, `api/SharedApi/GetSimpleResultCache`);
  }

  async getOddsInfoSpecialBetTypes(query: GetOddsInfoQuery): Promise<OddsInfo[]> {
    const url = 'api/BetTypes/GetOddsInfoSpecialBetTypes';
    return this.httpService.postJson(query, url);
  }

  async getHdpFilterBetTypes(sportId: string, issueTypeId: number): Promise<Array<HdpFilterBetType>> {
    return this.httpService.postJson({ sportId, issueTypeId }, 'api/BetTypes/GetHdpFilterBetTypes');
  }

  async copyRequestInfo(query: CopyRequestInfoQuery): Promise<CopyRequestInfoResponse> {
    return this.httpService.postJson(query, `api/ManageRequest/CopyRequestInfo`);
  }

  async getMatchInfoAddRequestTvs(matchId: number, productIds: string = null): Promise<MatchInfoViewModel> {
    return this.httpService.postJson({ matchId, productIds }, 'api/MatchInfo/GetInfoForAddRequest');
  }

  async getMatchInfoAddRequest(matchId: number, sportType: number, ): Promise<MatchInfoViewModel> {
    return this.httpService.postJson({ sportType, matchId }, 'api/MatchInfo/GetInfoForAddRequest');
  }

  async logAccessFunction(functionName: string): Promise<boolean> {
    try {
      return await this.httpService.postJson({ functionName }, 'api/Analytics/LogAccessFunction');
    } catch (error) {
      return false;
    }
  }

  async logChangeContent(functionName: string, logContent?: string): Promise<boolean> {
    try {
      return await this.httpService.postJson({ functionName, logContent }, 'api/Analytics/LogChangeContent');
    } catch (error) {
      return false;
    }
  }
}

export class CommonStaticService {
  static convertToStrictTimeFormat(sourceTime: string, format: string): string {
    return moment(sourceTime.trim(), format, true).format(format);
  }
}