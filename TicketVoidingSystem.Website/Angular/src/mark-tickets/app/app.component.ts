import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../utility/services/common.service';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { AppService } from './app.service';
import { DataPermission } from './models/result.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Mark Ticket';
  currentTab: string;
  isExternalUrl = false;
  dataPermission = new DataPermission();
  accessTabCount = new Map<string, number>();

  constructor(
    private readonly signalRService: SignalRService,
    private readonly appService: AppService,
    private readonly commonService: CommonService
  ) { }

  async ngOnInit() {
    const paramIsExternalUrl = new URLSearchParams(window.location.search).get('isExternalUrl');
    if (paramIsExternalUrl === '1') {
      this.isExternalUrl = true;
    }
    this.dataPermission = await this.appService.getDataPermission();
    await this.signalRService.initializeConnection();
  }

  async changeTab(tab: string): Promise<void> {
    this.currentTab = tab;
    await this.logAccessTab(tab);
  }

  isMarkOrUnmarkTab(): boolean {
    return this.currentTab === '0' || this.currentTab === '1';
  }

  isLogTab(): boolean {
    return this.currentTab === '2';
  }

  isConfirmAutoUnmarkTab(): boolean {
    return this.currentTab === '3';
  }

  async logAccessTab(tab: string): Promise<void> {
    switch (tab) {
      case '0':
        await this.logAccessTabByType(tab, 'MarkTicket');
        break;
      case '1':
        await this.logAccessTabByType(tab, 'UnmarkTicket');
        break;
      case '2':
        await this.logAccessTabByType(tab, 'UserLog');
        break;
      case '3':
        await this.logAccessTabByType(tab, 'ConfirmAutoUnmark');
        break;
      default:
        break;
    }
  }

  async logAccessTabByType(tab: string, tabName: string): Promise<void> {
    let currentAccessCount = this.accessTabCount.get(tab) ?? 0;
    if (currentAccessCount === 0) {
      const isLogged = await this.commonService.logAccessFunction(`MarkTickets/${tabName}`);
      if (isLogged) {
        currentAccessCount++;
        this.accessTabCount.set(tab, currentAccessCount);
      }
    }
  }
}
