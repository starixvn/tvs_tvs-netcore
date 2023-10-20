import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AllowanceTime } from '../../../utility/models/allowance-time.model';

@Injectable()
export class AddRequestStore {
  private readonly savingRequestStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private readonly checkValidSubIssueTypeInFilterSubject: Subject<null> = new Subject();
  private readonly allowanceTimeSubject: Subject<AllowanceTime> = new Subject();
  private readonly blockingUiStatusSubject: BehaviorSubject<boolean[]> = new BehaviorSubject([]);
  private readonly changeActionWaitingToManualEditPageSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private readonly abnormalFilterBySubject: Subject<number> = new Subject();

  constructor() {
  }

  get savingRequestStatus(): Observable<boolean> {
    return this.savingRequestStatusSubject.asObservable();
  }

  changeSavingRequestStatus(newValue: boolean): void {
    this.savingRequestStatusSubject.next(newValue);
  }

  get getCheckValidSubIssueTypeInFilterSubject(): Observable<void> {
    return this.checkValidSubIssueTypeInFilterSubject.asObservable();
  }

  checkValidSubIssueTypeInFilter(): void {
    this.checkValidSubIssueTypeInFilterSubject.next();
  }

  get getAllowanceTimeSubject(): Observable<AllowanceTime> {
    return this.allowanceTimeSubject.asObservable();
  }

  changeAllowanceTime(model: AllowanceTime): void {
    this.allowanceTimeSubject.next(model);
  }

  get blockingUiStatus(): Observable<boolean[]> {
    return this.blockingUiStatusSubject.asObservable();
  }

  changeBlockingUiStatus(newValue: boolean): void {
    let value: boolean[] = [];
    this.blockingUiStatus.subscribe(x => { value = x });
    newValue ? value.push(newValue) : value.pop();
    this.blockingUiStatusSubject.next(value);
  }
  
  get getChangeActionWaitingToManualEditPageSubject(): Observable<boolean> {
    return this.changeActionWaitingToManualEditPageSubject.asObservable();
  }

  changeActionWaitingToManualEditPage(newValue: boolean): void {
    this.changeActionWaitingToManualEditPageSubject.next(newValue);
  }

  get getAbnormalFilterBySubject(): Observable<number> {
    return this.abnormalFilterBySubject.asObservable();
  }

  changeAbnormalFilterBy(filterBy: number): void {
    this.abnormalFilterBySubject.next(filterBy);
  }
}