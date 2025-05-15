import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BlockFullUiModule } from 'src/utility/components/block-full-ui/block-full-ui.module';
import { MenuBarComponent } from 'src/utility/components/menu-bar/menu-bar.component';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { AppStore } from './app.store';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [MenuBarComponent, BlockFullUiModule]
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  isBlockingUi = true;
  blockingUiSubscription: Subscription;
  signalRService = inject(SignalRService);
  homePageStore = inject(AppStore);

  async ngOnInit() {
    this.blockingUiSubscription = this.homePageStore.blockingUiStatus.subscribe(status => {
      this.isBlockingUi = status;
    });
    this.homePageStore.changeBlockingUiStatus(true);
    await this.signalRService.initializeConnection();
  }

  ngOnDestroy(): void {
    this.blockingUiSubscription?.unsubscribe();
  }

  ngAfterViewInit() {
    this.homePageStore.changeBlockingUiStatus(false);
  }
}
