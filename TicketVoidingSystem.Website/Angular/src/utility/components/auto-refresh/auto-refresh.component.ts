import { Component, OnInit, EventEmitter, Output, Input, OnChanges, SimpleChange, OnDestroy } from '@angular/core';
import { RefreshTime, AutoRefreshMode } from './auto-refresh.model';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'auto-refresh',
  templateUrl: './auto-refresh.component.html',
  styleUrls: ['./auto-refresh.component.scss']
})
export class AutoRefreshComponent implements OnInit, OnChanges, OnDestroy {
  @Input() mode: number;
  @Output() countdownEnd = new EventEmitter();

  isBlock = false;
  refreshTime = new RefreshTime();
  intervalTimeText: string;
  private intervalTimeSubscription: Subscription;
  private readonly observableTimmer = timer(0, 1000);

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes['mode']) {
      if (this.mode === AutoRefreshMode.START_OVER) {
        this.startOverCountdown();
      } else if (this.mode === AutoRefreshMode.STOP) {
        this.stopCountdown();
      }
    }
  }

  ngOnDestroy() {
    this.stopCountdown();
  }

  refreshImmediately() {
    this.countdownEnd.emit();
    this.startOverCountdown();
  }

  startOverCountdown() {
    this.stopCountdown();
    const selectedIntervalTime = parseInt(this.refreshTime.value, 10);

    if (selectedIntervalTime !== 0) {
      this.intervalTimeText = this.refreshTime.value;
      this.intervalTimeSubscription = this.observableTimmer.subscribe(t => {
        this.intervalTimeText = `${selectedIntervalTime - t}`;
        if (selectedIntervalTime === t) {
          this.countdownEnd.emit();
          this.startOverCountdown();
        }
      });
    } else {
      this.intervalTimeText = '';
    }
  }

  private stopCountdown() {
    if (this.intervalTimeSubscription) {
      this.intervalTimeSubscription.unsubscribe();
    }
  }
}
