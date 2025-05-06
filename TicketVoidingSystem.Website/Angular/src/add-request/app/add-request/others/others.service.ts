import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../../../utility/services/http.service';
import { OperatorInfo, Provider } from './others.model';

@Injectable({
  providedIn: 'root'
})
export class OthersService {
  private readonly httpService = inject(HttpService);

  async getOperators(matchIds: string): Promise<OperatorInfo[]> {
    return this.httpService.postJson({ matchIds }, 'api/AddRequest/GetOperators');
  }

  async getProvider(matchId: number): Promise<Provider> {
    return this.httpService.postJson({ matchId }, 'api/AddRequest/GetProvider');
  }
}
