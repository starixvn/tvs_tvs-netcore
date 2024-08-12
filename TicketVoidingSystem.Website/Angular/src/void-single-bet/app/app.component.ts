import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Guid } from 'guid-typescript';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { BlockUiService } from '../../utility/components/block-ui/block-ui.service';
import { AffectedLicensee } from '../../utility/components/licensee-affected-list/licensee-affected-list.model';
import { MessagesResult } from '../../utility/components/messages-result/messages-result';
import { ModalType } from '../../utility/components/modal/modal.model';
import { ModalService } from '../../utility/components/modal/modal.service';
import { Notification } from '../../utility/components/notification/notification';
import { PagingModel } from '../../utility/components/paging/paging/paging.model';
import { Message } from '../../utility/components/template-message/messages/message';
import { TemplateMessageComponent } from '../../utility/components/template-message/template-message/template-message.component';
import { TemplateValue } from '../../utility/components/template-message/template-message/template.model';
import { TemplateService } from '../../utility/components/template-message/template-message/template.service';
import { Tooltip } from '../../utility/components/tooltip/tooltip.model';
import { FunctionConst } from '../../utility/constants/config';
import { TEXT } from '../../utility/constants/text';
import { CheckingPermissionModel } from '../../utility/models/checking-permission.model';
import { MatchModel } from '../../utility/models/match.model';
import { Result } from '../../utility/models/result';
import { PasswordService } from '../../utility/services/password.service';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { StaticService } from '../../utility/services/static.service';
import { AppService } from './app.service';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { Confirmation } from './confirmation/confirmation.model';
import { FilterComponent } from './filter/filter.component';
import { Modal } from './modal/modal.model';
import { FilterParams, GetTicketsQuery, VoidTicketsQuery } from './models/query.model';
import { GroupModel } from './tickets/group.model';
import { TicketsModel } from './tickets/tickets.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: []
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Home / Void Single Bet';

  @ViewChild('filter') filterComponent: FilterComponent;
  @ViewChild('messages') messagesComponent: TemplateMessageComponent;
  @ViewChild('confirmation') confirmationComponent: ConfirmationComponent;

  blockUI: boolean;
  tooltip = new Tooltip();
  modal = new Modal();
  notification = new Notification();
  messagesResult = new MessagesResult();
  matchViewModel: MatchModel;
  getTicketsQuery: GetTicketsQuery;
  filterParamsBeforeSearch: FilterParams;
  filterParamsBeforeVoid: FilterParams;
  ticketsModel = new TicketsModel();
  confirmation: Confirmation;
  isShowMatch: boolean;
  isShowTickets: boolean;
  isShowMessages: boolean;
  isShowConfirm: boolean;
  initialized: boolean;
  templateValue = new TemplateValue();
  isShowLogInfoOnly = false;
  issueTypeId: number;
  subIssueTypeId: number;
  licenseeAffectedList: AffectedLicensee[] = [];
  private fromTransTime: Date = null;
  private toTransTime: Date = null;
  private fromCheckTime: Date = null;
  private toCheckTime: Date = null;
  private readonly TIME_FORMAT = 'hh:mm:ss A';

  constructor(
    private readonly element: ElementRef,
    private readonly blockUIService: BlockUiService,
    private readonly appService: AppService,
    private readonly templateService: TemplateService,
    private readonly modalService: ModalService,
    private readonly signalRService: SignalRService,
    private readonly passwordService: PasswordService
  ) { }

  public async ngOnInit() {
    this.tooltip.element = this.element;
    await this.signalRService.initializeConnection();
  }

  ngAfterViewInit() {
    this.blockUIService.blockUIEvent.subscribe((event: boolean) => this.blockUnBlockUI(event));
  }

  private blockUnBlockUI(event: boolean) {
    this.blockUI = event;
  }

  hideContent() {
    this.isShowMatch = false;
    this.isShowTickets = false;
    this.isShowMessages = false;
    this.isShowConfirm = false;
    this.confirmationComponent.clearData();
  }

  async searchEvent(getTicketsQuery: GetTicketsQuery) {
    this.clearCacheTime();
    this.isShowTickets = false;
    this.isShowLogInfoOnly = false;
    await this.getMatchInfo(getTicketsQuery);
  }

  async viewLogInfoEvent(getTicketsQuery: GetTicketsQuery) {
    this.clearCacheTime();
    this.isShowTickets = false;
    this.isShowLogInfoOnly = false;
    await this.getMatchInfoForViewLogInfo(getTicketsQuery);
  }

  async getMatchInfoForViewLogInfo(query: GetTicketsQuery) {
    if (this.matchViewModel === undefined || this.matchViewModel.matchId !== query.matchId) {
      const match = await this.appService.getMatchInfo(query.matchId);
      this.matchViewModel = match;
      this.isShowMatch = true;
      await this.getLogInfo(query);
    } else {
      await this.getLogInfo(query);
    }
  }

  async getLogInfo(query: GetTicketsQuery) {
    this.getTicketsQuery = query;
    if (query.invalidTransDate) {
      this.handleNoTicketLogInfo();
    } else {
      this.filterParamsBeforeSearch = _.clone(query);
      this.isShowTickets = false;
      const data = await this.appService.GetLogInfo(this.getTicketsQuery);
      this.renderDataLogInfo(data);
      this.isShowMatch = true;
      this.isShowConfirm = false;
      this.isShowMessages = false;
      this.isShowLogInfoOnly = true;
    }
  }

  renderDataLogInfo(data: TicketsModel) {
    this.ticketsModel.singleCount = data.singleCount;
    this.ticketsModel.parlayCount = data.parlayCount;

    if (this.isNullCacheTransTime()) {
      this.fromTransTime = data.fromTransTime;
      this.toTransTime = data.toTransTime;
    }

    if (this.isNullCacheCheckTime()) {
      this.fromCheckTime = data.fromCheckTime;
      this.toCheckTime = data.toCheckTime;
    }

    this.ticketsModel.fromTransTime = this.fromTransTime;
    this.ticketsModel.toTransTime = this.toTransTime;
    this.ticketsModel.fromCheckTime = this.fromCheckTime;
    this.ticketsModel.toCheckTime = this.toCheckTime;
    this.ticketsModel.strFromTime = moment(new Date(this.ticketsModel.fromTransTime)).format(this.TIME_FORMAT);
    this.ticketsModel.strToTime = moment(new Date(this.ticketsModel.toTransTime)).format(this.TIME_FORMAT);
  }

  async getMatchInfo(query: GetTicketsQuery) {
    if (this.matchViewModel === undefined || this.matchViewModel.matchId !== query.matchId) {
      const match = await this.appService.getMatchInfo(query.matchId);
      this.matchViewModel = match;
      this.isShowMatch = true;
      await this.searchTickets(query);
    } else {
      await this.searchTickets(query);
    }
  }

  async searchTickets(query: GetTicketsQuery) {
    this.getTicketsQuery = query;
    if (query.invalidTransDate) {
      this.handleNoTicket();
    } else {
      this.filterParamsBeforeSearch = _.clone(query);
      this.isShowTickets = false;
      await this.getTickets();
    }
  }

  handleNoTicket() {
    const model = new TicketsModel();
    model.groups = [];
    model.totalItems = 0;
    model.id = 'There is no data';
    this.renderTickets(model);
    this.isShowTickets = true;
    this.isShowMatch = true;
    this.isShowConfirm = false;
    this.isShowMessages = false;
  }

  handleNoTicketLogInfo() {
    this.isShowLogInfoOnly = true;
    this.ticketsModel.singleCount = 0;
    this.ticketsModel.parlayCount = 0;
    this.ticketsModel.strFromTime = '12:00:00 AM';
    this.ticketsModel.strToTime = '12:00:00 AM';
    this.isShowConfirm = false;
    this.isShowMessages = false;
  }

  async pagingSearchTicket(pagingEvent: PagingModel) {
    this.getTicketsQuery.pageIndex = pagingEvent.page - 1;
    this.getTicketsQuery.pageSize = pagingEvent.pageSize;
    await this.getTickets();
  }

  async exportExcel() {
    if (this.ticketsModel.pagingModel?.total > 100000) {
      const header = 'Export Excel Result';
      const body = 'Not allow to export large file. Please contact IT for help. Thank you!';
      this.notification.open(header, body);
    } else {
      this.getTicketsQuery.match = this.matchViewModel;
      await this.appService.exportExcel(this.getTicketsQuery);
      this.blockUI = false;
    }
  }

  async getTickets() {
    const data = await this.appService.getTickets(this.getTicketsQuery);
    this.renderTickets(data);
    this.isShowTickets = true;
    this.isShowMatch = true;
    this.isShowConfirm = this.ticketsModel.groups.length > 0;
    this.isShowMessages = this.ticketsModel.groups.length > 0;
    this.updateTemplateValue(data.betTypeNameReplaceMessage);
    this.ticketsChange(this.ticketsModel.getNumberOfCheckedTickets());
  }

  updateTemplateValue(betTypeNameReplaceMessage: Message) {
    this.templateValue = this.templateService.getTemplateValue(this.matchViewModel);
    this.templateValue.fromTransTime = this.ticketsModel.fromTransTime;
    this.templateValue.toTransTime = this.ticketsModel.toTransTime;
    this.templateValue.fromCheckTime = this.ticketsModel.fromCheckTime;
    this.templateValue.toCheckTime = this.ticketsModel.toCheckTime;
    this.templateValue.eventType = this.getTicketsQuery.eventType;
    this.templateValue.isCheckTime = this.getTicketsQuery.timeType === 1;
    this.templateValue.score =
      this.getTicketsQuery.eventType === '1' &&
        !_.isNil(this.getTicketsQuery.liveHomeScore) &&
        this.getTicketsQuery.liveHomeScore.length > 0 &&
        !_.isNil(this.getTicketsQuery.liveAwayScore) &&
        this.getTicketsQuery.liveAwayScore.length > 0
        ? `${this.getTicketsQuery.liveHomeScore}-${this.getTicketsQuery.liveAwayScore}`
        : '';
    this.templateValue.totalTickets = this.ticketsModel.getNumberOfCheckedTickets();
    this.templateValue.betTypeNameReplaceMessage = betTypeNameReplaceMessage;
    this.templateValue.playerName = this.filterComponent.playerNamesSelected;
  }

  renderTickets(data: TicketsModel) {
    this.licenseeAffectedList = data.licenseeAffectedList;
    this.licenseeAffectedList = _.clone(this.licenseeAffectedList);
    this.ticketsModel.pagingModel = new PagingModel();
    this.ticketsModel.pagingModel.total = data.totalItems;
    this.ticketsModel.pagingModel.page = this.getTicketsQuery.pageIndex + 1;
    this.ticketsModel.pagingModel.pageSize = this.getTicketsQuery.pageSize;
    this.ticketsModel.singleCount = data.singleCount;
    this.ticketsModel.parlayCount = data.parlayCount;

    if (this.isNullCacheTransTime()) {
      this.fromTransTime = data.fromTransTime;
      this.toTransTime = data.toTransTime;
    }

    if (this.isNullCacheCheckTime()) {
      this.fromCheckTime = data.fromCheckTime;
      this.toCheckTime = data.toCheckTime;
    }

    this.ticketsModel.fromTransTime = this.fromTransTime;
    this.ticketsModel.toTransTime = this.toTransTime;
    this.ticketsModel.fromCheckTime = this.fromCheckTime;
    this.ticketsModel.toCheckTime = this.toCheckTime;
    this.ticketsModel.strFromTime = moment(new Date(this.ticketsModel.fromTransTime)).format(this.TIME_FORMAT);
    this.ticketsModel.strToTime = moment(new Date(this.ticketsModel.toTransTime)).format(this.TIME_FORMAT);
    this.ticketsModel.groups = [];
    data.groups.forEach(item => {
      const group = new GroupModel(item.name, item.tickets);
      this.ticketsModel.groups.push(group);
    });
    this.ticketsModel.changeIconCheckBox();
  }

  voidBet() {
    if (this.checkValidation()) {
      this.confirmation = this.confirmationComponent.confirmation;
      this.showConfirmBeforeVoid();
    }
  }

  checkValidation(): boolean {
    if (this.ticketsModel.getTicketEnable().length === 0) {
      this.tooltip.display('checkbox-dropdown-list', TEXT.EMPTY_TICKET);
      return false;
    }
    if (!this.messagesComponent.checkValidation()) {
      return false;
    }
    if (!this.confirmationComponent.checkValidation()) {
      return false;
    }
    if (!this.checkFilterBeforeVoid()) {
      return false;
    }

    return true;
  }

  checkFilterBeforeVoid(): boolean {
    this.filterParamsBeforeVoid = this.filterComponent.getParams();
    if (JSON.stringify(this.filterParamsBeforeVoid) !== JSON.stringify(this.filterParamsBeforeSearch)) {
      this.notification.open('WARNING', TEXT.WARNING_FILTER_OPTION_CHANGED);
      if (this.filterComponent.checkFilterParams()) {
        this.filterComponent.blurMatchId();
      }
      return false;
    }

    return true;
  }

  showConfirmBeforeVoid() {
    const isReload = this.ticketsModel.pagingModel.total <= this.getTicketsQuery.pageSize;
    const confirmMessage = isReload ? TEXT.CONFIRM_VOID_TICKET : TEXT.CONFIRM_VOID_TICKET_IN_PAGE;
    this.modal.open('Void Bet Confirm', confirmMessage);
  }

  async confirmEvent() {
    const checkingPermissionModel = new CheckingPermissionModel();
    checkingPermissionModel.setParam(this.ticketsModel.getAllTicket(), this.matchViewModel.matchId,
      'void-single-bet-check-void-bet-permission', true, StaticService.checkHandlingCashOutAsUnSettledTicketByFunction(FunctionConst.SINGLE), false);
    this.modalService.confirmPermission(checkingPermissionModel, {
      title: 'WARNING!',
      type: ModalType.Confirm
    }, async () => {
      this.voidTickets();
    }, async () => {
      this.getTickets();
      this.confirmationComponent.clearData();
    });
  }

  async voidTickets() {
    const query: VoidTicketsQuery = _.assignIn(this.filterParamsBeforeVoid, {
      tickets: this.ticketsModel.getTicketEnable(),
      transIdSolds: this.ticketsModel.getTicketSold(),
      transIdCrickets: this.ticketsModel.getTicketCricket(),
      message: this.messagesComponent.message,
      userName: this.confirmation.userName,
      userPassword: this.passwordService.hash(this.confirmation.userPassword),
      reason: this.confirmation.reason,
      reasonSC: this.confirmation.reasonSC,
      match: this.matchViewModel,
      voidFromTime: this.ticketsModel.strFromTime,
      voidToTime: this.ticketsModel.strToTime,
      guid: `VoidSingleBet-${Guid.create().toString()}`
    });

    this.blockUIService.start();
    const results = await this.appService.voidTickets(query);
    this.blockUIService.stop();
    if (results) {
      await this.handleAfterVoid(results);
    } else {
      this.getVoidResultCache(query.guid);
    }
  }

  private getVoidResultCache(guid: string) {
    let isChecking = false;
    const interval = setInterval(async () => {
      if (!isChecking) {
        isChecking = true;
        const results = await this.appService.getVoidResultCache(guid);
        if (results && results.length > 0) {
          await this.handleAfterVoid(results);
          clearInterval(interval);
        }
        isChecking = false;
      }
    }, 2000);
  }

  async handleAfterVoid(results: Result<null>[]) {
    if (results[0].errorCode <= 0) {
      await this.handleAfterVoidPaging();
    }

    this.showMessages(results);
    this.blockUIService.stop();
  }

  private showMessages(results: Result<null>[]) {
    this.messagesResult.isShow = true;
    this.messagesResult.header = 'Void Bet Result';
    this.messagesResult.results = results;
    this.messagesResult = _.clone(this.messagesResult);
  }

  async handleAfterVoidPaging() {
    if (this.ticketsModel.pagingModel.total <= this.getTicketsQuery.pageSize) {
      this.hideContent();
      this.filterComponent.resetFilter();
    } else {
      if (this.ticketsModel.isAllItemsChecked()) {
        const lastPage = Math.ceil(this.ticketsModel.pagingModel.total / this.getTicketsQuery.pageSize) - 1;
        this.getTicketsQuery.pageIndex =
          this.getTicketsQuery.pageIndex === lastPage ? this.getTicketsQuery.pageIndex - 1 : this.getTicketsQuery.pageIndex;
      }
      await this.getTickets();
    }
  }

  ticketsChange(numberOfTikets: number) {
    this.templateValue = _.clone(this.templateValue);
    this.templateValue.totalTickets = numberOfTikets;
    this.templateValue.checkSettled = this.ticketsModel.checkSettledTickets();
  }

  private clearCacheTime() {
    this.fromTransTime = null;
    this.toTransTime = null;
    this.fromCheckTime = null;
    this.toCheckTime = null;
  }

  private isNullCacheTransTime() {
    return !(this.fromTransTime && this.toTransTime);
  }

  private isNullCacheCheckTime() {
    return !(this.fromCheckTime && this.toCheckTime);
  }

  updateEventType(id: string): void {
    this.templateValue = _.clone(this.templateValue);
    this.templateValue.eventType = id;
  }

  updateIssueType(id: number): void {
    this.issueTypeId = id;
  }

  updateSubIssueType(id: number): void {
    this.subIssueTypeId = id;
  }
}
