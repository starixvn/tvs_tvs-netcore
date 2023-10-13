import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CheckNegativeBalanceQuery, NegativeBalance } from '../../internal/models/negative-balance';
import { Result } from '../../internal/models/result';
import { HttpRequestService } from '../../internal/services/http-request.service';
import { GetTicketQueryModel, VoidTicketQueryModel } from './models/query.model';
import { GroupTicketsViewModel } from './tickets-result/tickets.viewmodel';



@Injectable()

export class AppService {
    constructor(private httpRequestService: HttpRequestService) { }

    getTicket(queryModel: GetTicketQueryModel): Observable<GroupTicketsViewModel> {
        const url = 'api/VoidByCurrency/GetTickets';
        return this.httpRequestService.postJson<GroupTicketsViewModel>(queryModel, url);
    }

    exportExcel(queryModel: GetTicketQueryModel) {
        const url = 'api/VoidByCurrency/ExportExcel';
        return this.httpRequestService.downloadFile(queryModel, url);
    }

    checkNegativeBalance(queryModel: CheckNegativeBalanceQuery): Observable<Array<NegativeBalance>> {
        const url = 'api/SharedApi/CheckNegativeBalance';
        return this.httpRequestService.postJson(queryModel, url);
    }

    voidTicket(queryModel: VoidTicketQueryModel): Observable<Array<Result>> {
        const url = 'api/VoidByCurrency/VoidTickets';
        return this.httpRequestService.postJson(queryModel, url);
    }
}