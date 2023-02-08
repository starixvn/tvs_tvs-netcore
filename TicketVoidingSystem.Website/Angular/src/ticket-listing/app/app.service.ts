import { Injectable } from '@angular/core';
import { GetBetTypesQuery } from '../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { BlockUiService } from '../../utility/components/block-ui/block-ui.service';
import { Result } from '../../utility/models/result';
import { HttpService } from '../../utility/services/http.service';
import { GetMatchQuery, MatchModel } from './../../utility/models/match.model';
import { Licensee, SelectionTypeModel } from './filter/filter.model';
import {
  AmendmentReponse, ExportExcelQuery, GetSummaryQuery,
  GetTicketsDetailModel, GetTicketsDetailQuery, SendFileQuery
} from './models/query.model';
import { SummaryItemViewModel } from './summary/summary.model';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService, private readonly blockUIService: BlockUiService) { }

  async getLicensees(): Promise<Array<Licensee>> {
    const url = 'api/TicketListing/GetLicensees';
    this.blockUIService.start();
    const result = await this.httpService.getJson<Array<Licensee>>(url);
    this.blockUIService.stop();
    return result;
  }

  async getSelectionTypes(query: GetBetTypesQuery): Promise<Array<SelectionTypeModel>> {
    const url = 'api/TicketListing/GetSelectionTypes';
    this.blockUIService.start();
    const result = await this.httpService.postJson<GetBetTypesQuery, Array<SelectionTypeModel>>(query, url);
    this.blockUIService.stop();
    return result;
  }

  async getMatchInfo(id: string, isMatch3rd: boolean): Promise<MatchModel> {
    const query: GetMatchQuery = { matchId: parseInt(id, 10), isMatch3rd: isMatch3rd };
    const url = 'api/MatchInfo/GetInfo';
    this.blockUIService.start();
    const result = await this.httpService.postJson<GetMatchQuery, MatchModel>(query, url);
    this.blockUIService.stop();
    return result;
  }

  async getSummary(query: GetSummaryQuery): Promise<SummaryItemViewModel> {
    const url = 'api/TicketListing/GetSummaryTickets';
    this.blockUIService.start();
    const result = await this.httpService.postJson<GetSummaryQuery, SummaryItemViewModel>(query, url);
    this.blockUIService.stop();
    return result;
  }

  async getTicketsDetail(query: GetTicketsDetailQuery): Promise<GetTicketsDetailModel> {
    const url = 'api/TicketListing/GetTicketsDetail';
    this.blockUIService.start();
    const result = await this.httpService.postJson<GetTicketsDetailQuery, GetTicketsDetailModel>(query, url);
    this.blockUIService.stop();
    return result;
  }

  async exportExcel(query: ExportExcelQuery) {
    const url = 'api/TicketListing/ExportExcel';
    this.blockUIService.start();
    const result = await this.httpService.downloadFile<ExportExcelQuery>(query, url);
    this.blockUIService.stop();
    return result;
  }

  async sendCreditDataToLetstalk(query: ExportExcelQuery) {
    const url = 'api/TicketListing/SendCreditDataToLetstalk';
    this.blockUIService.start();
    const result = await this.httpService.postJson<ExportExcelQuery, Result<null>>(query, url);
    this.blockUIService.stop();
    return result;
  }

  async sendDataToOic(queries: SendFileQuery[]): Promise<AmendmentReponse[]> {
    const url = 'api/TicketListing/SendDataToOic';
    this.blockUIService.start();
    const result = await this.httpService.postJson<{queries: SendFileQuery[]}, AmendmentReponse[]>({queries: queries}, url);
    this.blockUIService.stop();
    return result;
  }
}
