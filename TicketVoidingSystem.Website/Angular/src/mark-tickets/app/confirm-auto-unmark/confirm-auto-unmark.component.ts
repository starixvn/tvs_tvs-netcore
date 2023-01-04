import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AutoRefreshMode } from '../../../utility/components/auto-refresh/auto-refresh.model';
import { ModalType } from '../../../utility/components/modal/modal';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { PagingConstant, PagingModel } from '../../../utility/components/paging/paging/paging.model';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { MarkType } from '../../../utility/constants/config';
import { SportType } from '../../../utility/constants/sport.constant';
import { SportInfo } from '../../../utility/models/event.model';
import { Result } from '../../../utility/models/result';
import { Selection } from '../../../utility/models/selection.model';
import { CommonService } from '../../../utility/services/common.service';
import { AppService } from '../app.service';
import { ConfirmAutoUnmarkQuery, ConfirmAutoUnmarkViewModel, UpdateConfirmAutoUnmark } from './confirm-auto-unmark.model';

@Component({
  selector: 'confirm-auto-unmark',
  templateUrl: './confirm-auto-unmark.component.html',
  styleUrls: ['./confirm-auto-unmark.component.scss']
})
export class ConfirmAutoUnmarkComponent implements OnInit {
  query = new ConfirmAutoUnmarkQuery();
  sportOptions: Selection[];
  markedByOptions: Selection[];
  selectedSports: string[];
  isBlock = false;
  tooltip = new Tooltip();
  paging = new PagingModel();
  models: ConfirmAutoUnmarkViewModel[] = [];
  autoRefreshMode: number;

  constructor(
    private readonly commonService: CommonService,
    private readonly appService: AppService,
    private readonly modalService: ModalService
  ) { }

  async ngOnInit() {
    await this.getSportTypes();
    this.initializeFilterSearch();
    await this.resetPagingAndSearchData();
  }

  private initializeFilterSearch() {
    this.selectedSports = this.sportOptions.map(x => x.value);
    const userName = document.getElementById('body').getAttribute('user-id');
    this.markedByOptions = [{name: '<<<< Me >>>>', value: userName}, {name: 'All', value: '0'}];
    this.query.matchId = null;
    this.query.markedBy = this.markedByOptions[0].value;
    this.query.isExcludeTest = true;
    this.query.pageIndex = PagingConstant.INDEX_ZERO;
    this.query.pageSize = PagingConstant.SIZE_ONE;
  }

  async resetPagingAndSearchData() {
    this.paging = new PagingModel();
    this.paging.pageSize = PagingConstant.SIZE_ONE;
    await this.searchData();
  }

  async getSportTypes() {
    let sportTypes = await this.commonService.getSportsType();
    sportTypes = sportTypes.filter(x => x.sportType !== SportType.CRICKET);
    this.sportOptions = [];
    this.mapObject(sportTypes);
  }

  mapObject(item: SportInfo[]) {
    item.forEach(x => {
      this.sportOptions.push({
        name: x.sportName,
        value: x.sportType.toString(),
        group: 'All',
      });
    });
  }

  async searchData() {
    this.autoRefreshMode = AutoRefreshMode.STOP;
    this.query.sporttype =  this.selectedSports.join(',');
    this.query.pageIndex = this.paging.page - 1;
    this.query.pageSize = this.paging.pageSize;
    this.isBlock = true;
    const data = await this.appService.getDataForConfirmAutoUnmark(this.query);
    this.models = data.items;
    this.isBlock = false;
    this.paging.total = data.totalItems;
    this.autoRefreshMode = AutoRefreshMode.START_OVER;
  }

  getTotalItemsOfModels(): number {
    let total = 0;
    this.models.forEach(item => (total += item.totalItems));

    return total;
  }

  isShowConfirm(markType: number): boolean {
    return markType !== MarkType.AUTO;
  }

  onCountdownRefreshEnd() {
    this.modalService.close();
    this.resetPagingAndSearchData();
  }

  convertToGMT8(date: Date): Date {
    const timeOffset = 12;
    return moment(date).add(timeOffset, 'hours').toDate();
  }

  onClickConfirm(item: ConfirmAutoUnmarkViewModel) {
    const header = 'Auto Unmark';
    const body = `<div><div class="confirm-auto-unmark-content">${item.event} (ID: ${item.matchId})</div>
                      <span>Are you sure you want auto unmark for "${item.bettypeName}" bet type of this match?</span>
                  </div>`;
    this.modalService.confirm({ title: header, message: body, type: ModalType.Confirm },
      async () => {
        await this.onYesConfirmModal(item);
      });
  }

  private async onYesConfirmModal(item: ConfirmAutoUnmarkViewModel) {
    let modalMessage: string;
    let modalType: number;
    const data = new UpdateConfirmAutoUnmark();
    data.matchId = item.matchId;
    data.betType = item.bettype;
    data.markedBy = item.userId;
    data.betId = item.betId;

    this.isBlock = true;
    this.autoRefreshMode = AutoRefreshMode.STOP;
    const response = await this.appService.updateConfirmAutoUnmark(data);
    this.isBlock = false;

    if (response.errorCode === 0) {
      modalMessage = 'Confirm Auto Unmark successfully!';
      modalType = ModalType.Alert;
    } else {
      modalMessage = this.replaceErrorMessageLockMatch(response);
      modalType = ModalType.Error;
    }

    this.modalService.open(
      {
        title: 'Auto Unmark',
        message: modalMessage,
        type: modalType
      },
      async () => {
        await this.resetPagingAndSearchData();
      }
    );
  }

  private replaceErrorMessageLockMatch(result: Result<null>): string {
    const ERROR_CODE_LOCK_MATCH = [1000000, 101, 100, 103, 102];
    if (ERROR_CODE_LOCK_MATCH.includes(result.errorCode)) {
      return `Some tickets cannot be processed because: ${result.errorMsg}`;
    }

    return result.errorMsg;
  }
}
