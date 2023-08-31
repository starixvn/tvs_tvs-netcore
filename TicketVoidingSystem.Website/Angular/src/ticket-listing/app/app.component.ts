import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { ClipboardService } from 'ngx-clipboard';
import { BlockUiService } from '../../utility/components/block-ui/block-ui.service';
import { ModalType } from '../../utility/components/modal/modal.model';
import { ModalService } from '../../utility/components/modal/modal.service';
import { Notification } from '../../utility/components/notification/notification';
import { PagingModel } from '../../utility/components/paging/paging/paging.model';
import { Tooltip } from '../../utility/components/tooltip/tooltip.model';
import { Product } from '../../utility/constants/config';
import { SportType } from '../../utility/constants/sport.constant';
import { CONFIG, TEXT } from '../../utility/constants/text';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { MatchModel } from './../../utility/models/match.model';
import { AppService } from './app.service';
import { FilterEvent } from './filter/filter.model';
import { MessagesResponse } from './messages-response/messages-response.model';
import { AmendmentReponse, CommonQuery, ExportExcelQuery, GetTicketsDetailQuery, LicenseeFile, SendFileQuery } from './models/query.model';
import { SummaryComponent } from './summary/summary.component';
import { SummaryItem, SummaryItemViewModel } from './summary/summary.model';
import { TicketsModel } from './tickets/ticket.model';
import { SpecialPlatform } from '../../utility/constants/special-platform.constant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Home / Ticket Listing';
  @ViewChild('summaryComponent') summaryComponent: SummaryComponent;

  blockUI: boolean;
  tooltip = new Tooltip();
  notification = new Notification();
  messagesResponse = new MessagesResponse();

  summaryItems: SummaryItem[];
  summaryItemsGroupByLicensee: SummaryItem[];
  isShowSummary: boolean;
  showSendColumn: boolean;
  betTypesAffected: string;
  isShowListBetTypeAffected: boolean;

  matchViewModel: MatchModel;
  isShowMatch: boolean;

  commonQuery = new CommonQuery();
  currentItem: SummaryItem;
  getTicketsDetailQuery: GetTicketsDetailQuery;
  ticketsModel = new TicketsModel();
  titleTicketsListing: string;
  isShowTickets: boolean;

  exportExcelQuery: ExportExcelQuery;

  sendFileQueries: SendFileQuery[];
  sendFileItems: SummaryItem[];
  licenseeFiles: LicenseeFile[];
  failedItems: SummaryItem[];
  licenseesName: string;

  constructor(
    private readonly element: ElementRef,
    private readonly blockUIService: BlockUiService,
    private readonly modalService: ModalService,
    private readonly appService: AppService,
    private readonly clipboardService: ClipboardService,
    private readonly signalRService: SignalRService
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
    this.isShowSummary = false;
    this.isShowTickets = false;
    this.isShowListBetTypeAffected = false;
  }

  async searchEvent(event: FilterEvent) {
    this.hideContent();
    this.commonQuery = event.query;
    const data = await this.appService.getSummary(event.query);
    this.displayMatch(event.match);
    this.renderSummaryItems(data);
    this.isShowSummary = true;
    this.showSendColumn = event.query.groupBy.toString() === '0' && Product.SHOW_SEND_COLUMN.indexOf(event.query.product) > -1;
    const betTypeNames = data.groupByBetTypes.map(x => x.name);
    if (betTypeNames.length > 0 && event.match.sportType === SportType.SOCCER && event.query.isReSettled) {
      this.betTypesAffected = betTypeNames.join(', ');
      this.isShowListBetTypeAffected = true;
    }
  }

  displayMatch(match: MatchModel) {
    this.matchViewModel = match;
    this.isShowMatch = true;
  }

  renderSummaryItems(summaryItemViewModel: SummaryItemViewModel) {
    this.summaryComponent.checkedAll = true;
    this.summaryComponent.isShowSend = true;
    this.summaryItems = [];
    this.summaryItemsGroupByLicensee = summaryItemViewModel.groupByLicensees;
    const items =
      this.commonQuery.groupBy.toString() === '0' ? summaryItemViewModel.groupByLicensees : summaryItemViewModel.groupByBetTypes;
    items.forEach(item => {
      this.summaryItems.push(new SummaryItem(item.name, item.total, item.isChinaView, item.licenseeName, item.betTypes, item.items, '', item.specialPlatform));
    });
  }

  async getTicketsEvent(item: SummaryItem) {
    if (item.total > CONFIG.TICKET_LISTING_LIMITED) {
      this.notification.open('Ticket Listing Result', TEXT.TICKET_LISTING_LIMITED);
    } else {
      const betTypes = item.betTypes === '29' ? this.commonQuery.betTypes : item.betTypes;
      const singleOrSubParlay = this.getSingleOrSubParlayParam(
        item.betTypes,
        item.isGroup,
        this.commonQuery.groupBy,
        this.commonQuery.singleOrSubParlay
      );
      this.getTicketsDetailQuery = _.assignIn({}, this.commonQuery, {
        licenseeName: item.licenseeName,
        betTypes: betTypes,
        singleOrSubParlay: singleOrSubParlay,
        pageIndex: 0,
        pageSize: 50
      });
      this.isShowTickets = false;
      const subfix =
        this.getTicketsDetailQuery.groupBy.toString() === '0'
          ? 'Licensee: ' + this.getTicketsDetailQuery.licenseeName
          : 'Bet type: ' + item.betTypeName;
      this.titleTicketsListing = `Tickets Listing for - Match ID: ${this.commonQuery.matchId} - ${subfix}`;
      this.currentItem = item;
      await this.getTicketsDetail();
    }
  }

  private getSingleOrSubParlayParam(betTypes: string, isGroup: boolean, groupBy: number, defaultSingleOrSubParlay: string): string {
    if (betTypes === '29') {
      return 'SubParlay';
    }

    if (!isGroup || groupBy.toString() === '1') {
      return 'Single';
    }

    return defaultSingleOrSubParlay;
  }
  async pagingSearchTicket(pagingEvent: PagingModel) {
    this.getTicketsDetailQuery.pageIndex = pagingEvent.page - 1;
    this.getTicketsDetailQuery.pageSize = pagingEvent.pageSize;
    await this.getTicketsDetail();
  }

  async getTicketsDetail() {
    const data = await this.appService.getTicketsDetail(this.getTicketsDetailQuery);

    this.ticketsModel.pagingModel = new PagingModel();
    this.ticketsModel.pagingModel.page = this.getTicketsDetailQuery.pageIndex + 1;
    this.ticketsModel.pagingModel.pageSize = this.getTicketsDetailQuery.pageSize;
    this.ticketsModel.pagingModel.total = data.totalItems;
    this.ticketsModel.tickets = data.tickets;
    this.ticketsModel.item = this.currentItem;
    this.ticketsModel.title = this.titleTicketsListing;
    this.isShowTickets = true;
  }

  exportExcelEvent(item: SummaryItem) {
    if (item.total > CONFIG.EXPORT_EXCEL_LIMITED) {
      this.notification.open('Export Excel Result', TEXT.EXPORT_EXCEL_LIMITED);
    } else {
      this.appService.exportExcel(this.getQueryExportExcel(item));
    }
  }

  private getQueryExportExcel(item: SummaryItem): ExportExcelQuery {
    const betTypes = item.betTypes === '29' ? this.commonQuery.betTypes : item.betTypes;
    const singleOrSubParlay = this.getSingleOrSubParlayParam(
      item.betTypes,
      item.isGroup,
      this.commonQuery.groupBy,
      this.commonQuery.singleOrSubParlay
    );
    const query: ExportExcelQuery = _.assignIn({}, this.commonQuery, {
      isGroup: item.isGroup,
      betTypes: betTypes,
      singleOrSubParlay: singleOrSubParlay,
      betTypeName: item.betTypeName,
      licenseeName: item.licenseeName,
      isChinaView: item.isChinaView,
      matchCode: this.matchViewModel.matchCode,
      matchEvent: this.matchViewModel.matchEvent,
      eventDate: this.matchViewModel.eventDate,
      startTime: this.matchViewModel.startTime,
      endTime: this.matchViewModel.endTime,
      totalCreditTickets: item.total,
      specialPlatform: item.specialPlatform
    });

    return query;
  }

  sendExcelFileEvent(items: SummaryItem[]) {
    this.sendFileItems = items;
    this.licenseesName = items.map(i => i.licenseeName).join(', ');
    this.modalService.confirm(
      { title: 'Send Data', message: TEXT.SEND_FILE + this.licenseesName + '?', type: ModalType.Confirm },
      async () => this.sendFile(),
      () => { }
    );
  }

  public async sendCreditToLetstalk(item: SummaryItem): Promise<void> {
    if (item.total > CONFIG.TICKET_LISTING_LIMITED) {
      this.notification.open('Ticket Listing Result', TEXT.TICKET_LISTING_LIMITED);
    } else {
      const result = await this.appService.sendCreditDataToLetstalk(this.getQueryExportExcel(item));
      const amendmentReponse = new AmendmentReponse();
      amendmentReponse.code = result.errorCode;
      amendmentReponse.message = result.errorMsg;

      this.messagesResponse.open('Send Data Result', [amendmentReponse]);
    }
  }

  async sendFile() {
    const titleAmendmentOic = this.getTitleAmendmentOic();
    this.sendFileQueries = [];
    this.sendFileItems.forEach(async item => {
      const betTypes = item.betTypes === '29' ? this.commonQuery.betTypes : item.betTypes;
      const singleOrSubParlay = this.getSingleOrSubParlayParam(
        item.betTypes,
        item.isGroup,
        this.commonQuery.groupBy,
        this.commonQuery.singleOrSubParlay
      );
      const query: SendFileQuery = _.assignIn({}, this.commonQuery, {
        betTypes: betTypes,
        singleOrSubParlay: singleOrSubParlay,
        betTypeName: item.betTypeName,
        licenseeName: item.licenseeName,
        isChinaView: item.isChinaView,
        eventDate: this.matchViewModel.eventDate,
        title: titleAmendmentOic,
        matchCode: null,
        matchEvent: null,
        startTime: null,
        endTime: null,
        specialPlatform: item.specialPlatform
      });

      this.sendFileQueries.push(query);
    });
    const result = await this.appService.sendDataToOic(this.sendFileQueries);
    this.showResultAmendmentOic(result);
  }

  private getTitleAmendmentOic() {
    const eventDate = moment(this.matchViewModel.eventDate).format('MMM Do, YYYY');
    const title =
      this.commonQuery.product === Product.SPORTS_BOOK
        ? this.matchViewModel.matchEvent + ' - ' + this.matchViewModel.matchCode + ' - ' + eventDate
        : this.matchViewModel.matchEvent + ' - ' + eventDate;

    return title;
  }

  async showResultAmendmentOic(response: AmendmentReponse[]) {
    const results: AmendmentReponse[] = [];
    response.forEach(x => {
      if (x.code === 0) {
        const licenseesName = this.sendFileQueries.filter(y => y.isChinaView === x.isChinaView && y.specialPlatform === x.specialPlatform).map(t => t.licenseeName).join(', ');
        const message = 'Data of ' + licenseesName + ' are sent successfully!';
        results.push({ code: 0, message: message, isSuccessful: true, isChinaView: x.isChinaView, isCanReSend: false, specialPlatform: x.specialPlatform });
      } else {
        const prefix = this.getPrefixLicensees(x);
        const message = x.message === null ? prefix + 'Failed to send data.' : prefix + x.message;
        results.push({ code: 1, message: message, isSuccessful: false, isChinaView: x.isChinaView, isCanReSend: true, specialPlatform: x.specialPlatform });
      }
    });

    this.messagesResponse.open('Send Data Result', results);
  }

  getPrefixLicensees(response: AmendmentReponse): string {
    if (response.isChinaView) {
      return 'China View Licensee: ';
    }
    return response.specialPlatform === SpecialPlatform.Jolly_Sports ? 'Jolly Sports Licensee: ' : 'Normal Licensee: ';
  }

  public async resendData(result: AmendmentReponse): Promise<void> {
    const resultSendDataAgain = await this.appService.sendDataToOic(this.sendFileQueries.filter(x => x.isChinaView === result.isChinaView && x.specialPlatform === result.specialPlatform));
    if (resultSendDataAgain[0].code === 0) {
      const licenseesName = this.sendFileQueries.filter(y => y.isChinaView === result.isChinaView && y.specialPlatform === result.specialPlatform).map(t => t.licenseeName).join(', ');
      const result = this.messagesResponse.results.find(x => x.isChinaView === result.isChinaView && x.specialPlatform === result.specialPlatform);
      result.code = 0;
      result.message = 'Data of ' + licenseesName + ' are sent successfully!';
      result.isSuccessful = true;
    }
  }

  copyClipboard(text: string) {
    this.clipboardService.copyFromContent(text);
    alert('The bet type list has been copied to clipboard.');
  }
}
