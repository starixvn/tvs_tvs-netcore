import { Component, inject } from '@angular/core';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { MenuBarComponent } from '../../utility/components/menu-bar/menu-bar.component';
import { SignalRService } from '../../utility/services/signal-r.service.native';

dayjs.extend(utc);
dayjs.extend(timezone);

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [MenuBarComponent]
})
export class AppComponent{
  signalRService = inject(SignalRService);
  async ngOnInit() {
    await this.signalRService.initializeConnection();
  }
}
