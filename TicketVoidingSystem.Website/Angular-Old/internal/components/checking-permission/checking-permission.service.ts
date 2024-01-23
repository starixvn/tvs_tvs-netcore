import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { SqlResult } from '../../../internal/models/result';
import { HttpRequestService } from '../../../internal/services/http-request.service';

@Injectable()
export class CheckingPermissionService {
    constructor(private httpRequestService: HttpRequestService) { }

    checkVoidBetPermission(query: any): Observable<SqlResult> {
        const url = 'api/Permission/CheckTicketsStatus';
        return this.httpRequestService.postJson(query, url);
    }
}