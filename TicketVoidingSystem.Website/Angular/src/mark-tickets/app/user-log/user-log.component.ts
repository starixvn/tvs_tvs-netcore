import { Component, OnInit } from '@angular/core';
import { PagingModel } from '../../../utility/components/paging/paging/paging.model';
import { AppService } from '../app.service';
import { GetLogsQuery } from '../models/query.model';
import { LogModel } from './logs-list/logs-list.model';

const PAGING_ITEM_50 = 50;
const PAGING_ITEM_100 = 100;
const PAGING_ITEM_200 = 200;
const PAGING_ITEM_500 = 500;

@Component({
  selector: 'user-log',
  templateUrl: './user-log.component.html',
  styleUrls: ['./user-log.component.scss']
})
export class UserLogComponent implements OnInit {
  isBlockLogs: boolean;
  isShowLogs: boolean;

  logsModel = new Array<LogModel>();
  pagingOfLogs = new PagingModel();
  queryLog = new GetLogsQuery();
  pageSizeOfLogs = [PAGING_ITEM_50, PAGING_ITEM_100, PAGING_ITEM_200, PAGING_ITEM_500];

  constructor(private readonly appService: AppService) { }

  ngOnInit() {
  }

  async searchLogs(query: GetLogsQuery) {
    this.pagingOfLogs = new PagingModel();
    this.pagingOfLogs.pageSize = PAGING_ITEM_50;
    this.pagingOfLogs.selection = this.pageSizeOfLogs;

    this.queryLog = query;
    this.queryLog.pageSize = PAGING_ITEM_50;
    await this.getUserLogs(this.queryLog);
  }

  private async getUserLogs(query: GetLogsQuery) {
    this.isShowLogs = true;
    this.isBlockLogs = true;
    const data = await this.appService.getUserLogs(query);
    this.isBlockLogs = false;
    this.logsModel = data.logList;
    this.pagingOfLogs.total = data.totalLogs;
  }

  async pagingEventOfLogs() {
    this.queryLog.pageIndex = this.pagingOfLogs.page - 1;
    this.queryLog.pageSize = this.pagingOfLogs.pageSize;
    await this.getUserLogs(this.queryLog);
  }
}
