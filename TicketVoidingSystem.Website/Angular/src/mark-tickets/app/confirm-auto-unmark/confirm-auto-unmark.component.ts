import { Component, ElementRef, inject, OnInit } from '@angular/core';
import moment from 'moment-timezone';
import { AutoRefreshMode } from '../../../utility/components/auto-refresh/auto-refresh.model';
import { ModalType } from '../../../utility/components/modal/modal.model';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { PagingConstant, PagingModel } from '../../../utility/components/paging/paging/paging.model';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { ErrorCodeLockMatch, MarkType } from '../../../utility/constants/config';
import { LABELS } from '../../../utility/constants/labels';
import { SportInfo } from '../../../utility/models/event.model';
import { Result } from '../../../utility/models/result';
import { Selection } from '../../../utility/models/selection.model';
import { CommonService } from '../../../utility/services/common.service';
import { AppService } from '../app.service';
import { CheckValidateService } from '../services/check-validate.service';
import { ConfirmAutoUnmarkQuery, ConfirmAutoUnmarkViewModel, UpdateConfirmAutoUnmark } from './confirm-auto-unmark.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AutoRefreshComponent } from '../../../utility/components/auto-refresh/auto-refresh.component';
import { PagingComponent } from '../../../utility/components/paging/paging/paging.component';
import { TooltipComponent } from '../../../utility/components/tooltip/tooltip.component';
import { BlockUiDirective } from '../../../utility/components/block-ui/block-ui.directive';
import { NumbersOnlyDirective } from '../../../utility/directives/numbers-only.directive';

@Component({
  standalone: true,
  selector: 'confirm-auto-unmark',
  templateUrl: './confirm-auto-unmark.component.html',
  styleUrls: ['./confirm-auto-unmark.component.scss'],
  imports: [CommonModule, FormsModule, NgSelectModule, AutoRefreshComponent, PagingComponent, TooltipComponent, BlockUiDirective],
  providers: [CheckValidateService, NumbersOnlyDirective]
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

  private readonly commonService = inject(CommonService);
  private readonly appService = inject(AppService);
  private readonly modalService = inject(ModalService);
  private readonly element = inject(ElementRef);
  private readonly checkValidateService = inject(CheckValidateService);

  constructor() {
    this.tooltip.element = this.element;
  }

  async ngOnInit() {
    await this.getSportTypes();
    this.initializeFilterSearch();
    await this.resetPagingAndSearchData();
  }

  private initializeFilterSearch() {
    this.selectedSports = this.sportOptions.map(x => x.value);
    const userName = document.getElementById('body').getAttribute('user-id');
    this.markedByOptions = [{ name: '<<<< Me >>>>', value: userName }, { name: 'All', value: '0' }];
    this.query.matchId = null;
    this.query.markedBy = this.markedByOptions[0].value;
    this.query.isExcludeTest = true;
    this.query.pageIndex = PagingConstant.INDEX_ZERO;
    this.query.pageSize = PagingConstant.SIZE_ONE;
  }

  async resetPagingAndSearchData() {
    const isSuccessMatch = await this.checkValidateService.checkValidMatch(this.query.matchId, this.tooltip);
    if (isSuccessMatch) {
      this.paging = new PagingModel();
      this.paging.pageSize = PagingConstant.SIZE_ONE;
      await this.searchData();
    } else {
      this.tooltip.display('match-id', LABELS.INVALID_MATCHID);
    }

  }

  async getSportTypes() {
    const sportTypes = await this.commonService.getSportsType();
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
    this.query.sporttype = this.selectedSports.join(',');
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
    data.childMatchId = item.childMatchId;

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
    if (ErrorCodeLockMatch.ALL_ITEMS.includes(result.errorCode)) {
      return `Some tickets cannot be processed because: ${result.errorMsg}`;
    }

    return result.errorMsg;
  }

  getMatchId(matchId: string, childMatchId :string){
    return childMatchId ? `${matchId}\n(${childMatchId})` : `${matchId}`;
  }
}
