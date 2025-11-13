import { inject, Injectable } from '@angular/core';
import { HttpService } from 'src/utility/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  httpService = inject(HttpService);
  
}
