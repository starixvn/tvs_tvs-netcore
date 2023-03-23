import { Injectable } from '@angular/core';
import { Result } from '../../utility/models/result';
import { HttpService } from '../../utility/services/http.service';
import { ConfirmAutoUnmarkQuery, GetDataForConfirmAutoUnmarkViewModel, UpdateConfirmAutoUnmark } from './confirm-auto-unmark/confirm-auto-unmark.model';
import { AllMarkedTicketsModel } from './mark-unmark-ticket/all-marked-ticket-list/all-marked-ticket.model';
import { Currency } from './mark-unmark-ticket/filter-tickets/filter.model';
import { GroupLicensee } from './mark-unmark-ticket/filter-tickets/match-id/licensees/licensees.model';
import { AllMarkedTicketQuery, GetLogsQuery, GetTicketsQuery, MarkedTicketQuery, TicketDetailQuery } from './models/query.model';
import { DataPermission, ResultMarkTicketModel } from './models/result.model';
import { TicketsModel } from './tickets-list/tickets.model';
import { LogsModel } from './user-log/logs-list/logs-list.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(private readonly httpService: HttpService) { }

  async getCurrencies(): Promise<Currency[]> {
    return this.httpService.getJson(`api/MarkTickets/GetCurrencies`);
  }

  async getLicensees(): Promise<GroupLicensee[]> {
    return this.httpService.getJson(`api/MarkTickets/GetLicensees`);
  }

  async getTickets(query: GetTicketsQuery): Promise<TicketsModel> {
    return this.httpService.postJson(query, `api/MarkTickets/GetTickets`);
  }

  async getAllMakerdTickets(query: GetTicketsQuery): Promise<AllMarkedTicketsModel> {
    return this.httpService.postJson(query, `api/MarkTickets/GetAllMarkedTickets`);
  }

  async getUserLogs(query: GetLogsQuery): Promise<LogsModel> {
    return this.httpService.postJson(query, `api/MarkTickets/GetUserLogs`);
  }

  async exportExcel(query: GetTicketsQuery) {
    const url = `api/MarkTickets/ExportExcel`;
    return this.httpService.downloadFile(query, url);
  }

  async exportExcelDetailTickets(query: TicketDetailQuery) {
    const url = `api/MarkTickets/ExportExcelDetailTicket`;
    return this.httpService.downloadFile(query, url);
  }

  async updateMarkedTicket(query: MarkedTicketQuery): Promise<ResultMarkTicketModel> {
    const unMarkedStatus = '0';
    const result = new ResultMarkTicketModel();
    const resultApi = await this.httpService.postJson<MarkedTicketQuery, ResultMarkTicketModel>(query, `api/MarkTickets/MarkTickets`);
    if (!resultApi.isSuccessful) {
      result.isSuccessful = false;
      result.errorCode = resultApi.errorCode;
      result.errorMsg = resultApi.errorMsg;
    } else {
      result.isSuccessful = true;
      result.errorCode = 0;
      result.errorMsg = query.status === unMarkedStatus ? 'Mark tickets successfully!' : 'Unmark tickets successfully!';
    }

    return result;
  }

  async getTicketsDetail(query: TicketDetailQuery): Promise<TicketsModel> {
    return this.httpService.postJson(query, `api/MarkTickets/GetDetailTickets`);
  }

  async updateAllMarkedTickets(query: AllMarkedTicketQuery): Promise<ResultMarkTicketModel> {
    const result =
      (await this.httpService.postJson<AllMarkedTicketQuery, ResultMarkTicketModel>(query, `api/MarkTickets/MarkAllTickets`));
    result.errorMsg = result.errorCode === 0 ? 'Unmark tickets successfully!' : result.errorMsg;
    return result;
  }

  async getDataForConfirmAutoUnmark(query: ConfirmAutoUnmarkQuery): Promise<GetDataForConfirmAutoUnmarkViewModel> {
    return this.httpService.postJson(query, `api/MarkTickets/GetDataForConfirmAutoUnmark`);
  }

  async updateConfirmAutoUnmark(data: UpdateConfirmAutoUnmark): Promise<Result<null>> {
    return this.httpService.postJson(data, `api/MarkTickets/UpdateConfirmAutoUnmark`);
  }

  async getDataPermission(): Promise<DataPermission> {
    return this.httpService.getJson(`api/MarkTickets/GetDataPermission`);
  }
}
