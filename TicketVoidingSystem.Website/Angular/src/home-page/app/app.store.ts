import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppStore {
  private readonly blockingUiStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  get blockingUiStatus(): Observable<boolean> {
    return this.blockingUiStatusSubject.asObservable();
  }

  /* istanbul ignore next */
  changeBlockingUiStatus(newValue: boolean): void {
    this.blockingUiStatusSubject.next(newValue);
  }
}