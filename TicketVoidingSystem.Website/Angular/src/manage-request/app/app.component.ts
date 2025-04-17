import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { AutoRefreshMode } from '../../utility/components/auto-refresh/auto-refresh.model';
import { ModalType } from '../../utility/components/modal/modal.model';
import { ModalService } from '../../utility/components/modal/modal.service';
import { DateTimeFormat } from '../../utility/constants/config';
import { LABELS } from '../../utility/constants/labels';
import { Selection } from '../../utility/models/selection.model';
import { RequestStatus } from '../../utility/models/signal-r.model';
import { CommonService } from '../../utility/services/common.service';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { AppService } from './app.service';
import { FilterComponent } from './filter/filter.component';
import { FilterModel } from './filter/filter.model';
import { GetRequestsQuery } from './models/get-requests.query';
import { PermissionManage } from './models/permission-manage.model';
import { RequestModel } from './request-list/request.model';
import { MenuBarComponent } from '../../utility/components/menu-bar/menu-bar.component';
import { BlockUiModule } from '../../utility/components/block-ui/block-ui.module';
import { RequestListComponent } from './request-list/request-list.component';

const DATETIME_FORMAT = 'YYYY/M/D hh:mm:ss.SSS A';
@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [MenuBarComponent, FilterComponent, BlockUiModule, RequestListComponent]
})
export class AppComponent implements OnInit {
  @ViewChild('filterComponent') filterComponent: FilterComponent;
  filter = new FilterModel();
  requests: RequestModel[] = [];
  minNgbDate: NgbDate;
  moveBetDay: Date;
  bUDay = new Date();
  permission = new PermissionManage();
  isReloading = false;
  autoRefreshMode: number;
  requestStatus: RequestStatus[] = [];
  isBlock: boolean;
  isShowMissingInfo: boolean;
  cacheSubTypeSelectList: Selection[];
  cacheFilter = new FilterModel();
  cacheMultipleSelectSubTypeModel: string[];
  cacheFilterByMatch: boolean;
  cacheFilterByValue: string;

  appService = inject(AppService);
  commonService = inject(CommonService);
  modalService = inject(ModalService);
  signalRService = inject(SignalRService);
  
  async ngOnInit() {
    this.initDate();
    this.permission = await this.commonService.getPermissionManageRequest();
    await this.signalRService.initializeConnection();
  }

  private initDate() {
    const SIX_MONTHS = 6;
    const minDate = moment(new Date()).subtract(SIX_MONTHS, 'months').toDate();
    this.minNgbDate = new NgbDate(minDate.getFullYear(), minDate.getMonth() + 1, 1);
  }

  async initBalanceUp() {
    this.isBlock = true;
    const balanceUp = await this.commonService.getBalanceUp();
    this.isBlock = false;
    this.bUDay = new Date(balanceUp.balanceUpDay);
    this.moveBetDay = new Date(balanceUp.moveBetsDay);
  }

  async search(isReloading: boolean) {
    this.autoRefreshMode = AutoRefreshMode.STOP;
    this.isReloading = isReloading;
    await this.initBalanceUp();
    if (!this.isReloading && !this.filter.requestId && !this.filter.matchId && this.isDateBeforeBUDay(this.filter.ngbFromDate)) {
      this.modalService.confirm({
        title: 'Message from webpage',
        message: LABELS.EXPORT_FROMDATE_BEFORE_BALANCEDAY
      }, () => this.exportExcel(), async () => window.location.reload());
    } else {
      await this.getRequest();
    }

    this.cacheFilterData();
    this.autoRefreshMode = AutoRefreshMode.START_OVER;
  }

  async getRequest() {
    const query = await this.getQuery();
    this.isBlock = true;
    const data = await this.appService.getRequests(query);
    this.isBlock = false;
    this.requests = _.clone(data);
  }

  private async getQuery(): Promise<GetRequestsQuery> {
    if (this.isReloading) {
      this.restoreFilterData();
    }
    return {
      requestId: this.filter.requestId?.toString(),
      matchId: this.filter.matchId ? this.filter.matchId : null,
      fromDate: this.isFilterById() ? null : this.getDateStringFromNgbDate(this.filter.ngbFromDate),
      toDate: this.isFilterById() ? null : this.getDateStringFromNgbDate(this.filter.ngbToDate),
      issueTypeId: this.filter.issueTypeId,
      subIssueType: this.filter.subIssueType,
      statusIds: this.filter.statusIds,
      isExcludeTest: this.filter.isExcludeTest,
      isFromDateBeforeBUDay: this.isFilterById() ? null : this.isDateBeforeBUDay(this.filter.ngbFromDate),
      isToDateBeforeBUDay: this.isFilterById() ? null : this.isDateBeforeBUDay(this.filter.ngbToDate),
      bUDay: moment(this.bUDay).format(DATETIME_FORMAT),
      createdBy: this.filter.createdBy,
      productTypeIds: this.filter.productTypeIds
    };
  }

  isFilterById(): boolean {
    if (this.filter.matchId || this.filter.requestId) {
      return true;
    }

    return false;
  }

  async exportExcel() {
    const query = await this.getQuery();
    this.isBlock = true;
    await this.appService.exportRequest(query, () => this.timeoutEvent());
    this.isBlock = false;
  }

  isDateBeforeBUDay(date: NgbDate): boolean {
    const momentFrom = moment(this.getDateStringFromNgbDate(date), DateTimeFormat.SHORT_DATE_FORMAT);
    const momentBU = moment(this.bUDay).format(DateTimeFormat.SHORT_DATE_FORMAT);
    return momentFrom.isBefore(moment(momentBU, DateTimeFormat.SHORT_DATE_FORMAT));
  }

  cacheFilterData(): void {
    this.cacheFilter = {
      requestId: this.filter.requestId,
      matchId: this.filter.matchId,
      ngbFromDate: this.filter.ngbFromDate,
      ngbToDate: this.filter.ngbToDate,
      issueTypeId: this.filter.issueTypeId,
      subIssueType: this.filter.subIssueType,
      statusIds: this.filter.statusIds,
      isExcludeTest: this.filter.isExcludeTest,
      createdBy: this.filter.createdBy,
      isDisplayMissingInfo: this.filter.isDisplayMissingInfo,
      productTypeIds: this.filter.productTypeIds
    };
    this.cacheSubTypeSelectList = this.filterComponent.subTypeSelectList;
    this.cacheMultipleSelectSubTypeModel = this.filterComponent.multipleSelectSubTypeModel;
    this.cacheFilterByMatch = this.filterComponent.filterByMatch;
    this.cacheFilterByValue = this.filterComponent.filterByValue;
  }

  restoreFilterData(): void {
    this.filter = this.cacheFilter;
    this.filterComponent.subTypeSelectList = this.cacheSubTypeSelectList;
    this.filterComponent.multipleSelectSubTypeModel = this.cacheMultipleSelectSubTypeModel;
    this.filterComponent.isSelectedAllIssueType = this.filter.issueTypeId.split(',').length > 1;
    this.filterComponent.filterByMatch = this.cacheFilterByMatch;
    this.filterComponent.filterByValue = this.cacheFilterByValue;
  }

  getDateStringFromNgbDate(date: NgbDate): string {
    return `${date.year}/${date.month}/${date.day}`;
  }

  private timeoutEvent(): void {
    this.modalService.open(
      {
        title: 'Warning!',
        message: 'Export Excel timeout. Please try again!!',
        type: ModalType.Warning
      });
  }

  updateMissingInfo(isChecked: boolean) {
    this.isShowMissingInfo = isChecked;
  }
}
