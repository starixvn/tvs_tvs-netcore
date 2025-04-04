// notification.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationPopupService {
  private readonly _open = new BehaviorSubject<boolean>(false);
  isOpen$ = this._open.asObservable();

  toggle() {
    const currentValue = this._open.value;
    console.log('Notification service toggle called, current value:', currentValue);
    this._open.next(!currentValue);
  }

  close() {
    console.log('Notification service close called');
    this._open.next(false);
  }
}
