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
    return this.httpService.postJson({ matchIds }, 'api/AddRequest/GetOperators');
  }

  async getProvider(matchIds: string): Promise<Provider> {
    return this.httpService.postJson({ matchIds }, 'api/AddRequest/GetProvider');
  }
}
