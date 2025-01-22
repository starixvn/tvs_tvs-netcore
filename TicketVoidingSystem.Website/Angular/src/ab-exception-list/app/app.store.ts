import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class AppStore {
  private readonly blockingUiStatusSubject = new BehaviorSubject<boolean>(false);

  constructor() {
  }

  get blockingUiStatus(): Observable<boolean> {
    return this.blockingUiStatusSubject.asObservable();
  }

  /* istanbul ignore next */
  changeBlockingUiStatus(newValue: boolean): void {
    this.blockingUiStatusSubject.next(newValue);
  }
}