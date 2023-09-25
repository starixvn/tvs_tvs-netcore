import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpRequestService } from '../../../internal/services/http-request.service';
import { SqlResult } from '../../../internal/models/result';

@Injectable()
export class CheckingPermissionService {
    constructor(private httpRequestService: HttpRequestService) { }

    checkVoidBetPermission(query: any): Observable<SqlResult> {
        const url = 'state-api/simple-data/update';
        return this.httpRequestService.postJson(query, url);
    }
}