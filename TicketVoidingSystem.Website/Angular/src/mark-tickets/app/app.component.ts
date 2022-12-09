import { Component, OnInit } from '@angular/core';
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

  constructor(
    private readonly signalRService: SignalRService,
    private readonly appService: AppService
  ) {}

  async ngOnInit() {
    this.signalRService.initializeConnection();
    const paramIsExternalUrl = new URLSearchParams(window.location.search).get('isExternalUrl');
    if (paramIsExternalUrl === '1') {
      this.isExternalUrl = true;
    }
    this.dataPermission = await this.appService.getDataPermission(); 
  }

  changeTab(tab: string) {
    this.currentTab = tab;
  }

  isMarkOrUnmarkTab() {
    return this.currentTab === '0' || this.currentTab === '1';
  }

  isLogTab() {
    return this.currentTab === '2';
  }

  isConfirmAutoUnmarkTab() {
    return this.currentTab === '3';
  }
}
