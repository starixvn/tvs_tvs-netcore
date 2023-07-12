import { Injectable } from '@angular/core';
import { HttpService } from '../../../../utility/services/http.service';
import { OperatorInfo, Provider } from './others.model';

@Injectable({
  providedIn: 'root'
})
export class OthersService {
  constructor(
    private readonly httpService: HttpService
  ) { }

  async getOperators(matchIds: string): Promise<OperatorInfo[]> {
    return this.httpService.postJson({ matchIds }, 'TicketVoiding/GetOperators');
  }

  async getProvider(matchId: string): Promise<Provider> {
    return this.httpService.postJson({ matchId }, 'TicketVoiding/GetProvider');
  }
}
