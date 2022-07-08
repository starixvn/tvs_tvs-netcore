import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { AppStore } from './app.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AppStore]
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  isBlockingUi = true;
  blockingUiSubscription: Subscription;

  constructor(
    private readonly signalRService: SignalRService,
    private readonly abExceptionListStore: AppStore,
  ) { }

  async ngOnInit() {
    this.blockingUiSubscription = this.abExceptionListStore.blockingUiStatus.subscribe(status => {
      this.isBlockingUi = status;
    });
    this.abExceptionListStore.changeBlockingUiStatus(true);
    await this.signalRService.initializeConnection();
  }

  ngOnDestroy(): void {
    this.blockingUiSubscription?.unsubscribe();
  }

  ngAfterViewInit() {
    this.abExceptionListStore.changeBlockingUiStatus(false);
  }
}
