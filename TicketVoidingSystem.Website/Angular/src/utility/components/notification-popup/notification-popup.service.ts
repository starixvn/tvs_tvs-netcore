import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from '../../services/http.service';
import { NotificationModel } from './notification-popup.model';

@Injectable({ providedIn: 'root' })
export class NotificationPopupService {
  private readonly _open = new BehaviorSubject<boolean>(false);
  isOpen$ = this._open.asObservable();

  httpService = inject(HttpService);

  toggle() {
    const currentValue = this._open.value;
    this._open.next(!currentValue);
  }

  close() {
    this._open.next(false);
  }

  async get() {
    return this.httpService.getJson<NotificationModel[]>('api/Notification/Get');
  }

  async update(idList: string, isRead: boolean) {
    return this.httpService.postJson({ idList: idList, isRead }, 'api/Notification/Update');
  }
}
