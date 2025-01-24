import { Component, EventEmitter, Output, Input, SimpleChange, OnDestroy } from '@angular/core';
import { RefreshTime, AutoRefreshMode } from './auto-refresh.model';
import { Subscription, timer } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  standalone: true,
  selector: 'auto-refresh',
  templateUrl: './auto-refresh.component.html',
  styleUrls: ['./auto-refresh.component.scss'],
  imports: [CommonModule, FormsModule, NgSelectModule]
})
export class AutoRefreshComponent implements OnDestroy {
  @Input() mode: number;
  @Output() countdownEnd = new EventEmitter();

  isBlock = false;
  refreshTime = new RefreshTime();
  intervalTimeText: string;
  private intervalTimeSubscription: Subscription;
  private readonly observableTimmer = timer(0, 1000);

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
