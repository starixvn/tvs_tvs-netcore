import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import includes from 'lodash/includes';
import { ClipboardModule } from 'ngx-clipboard';
import { AutoRefreshMode } from '../../../utility/components/auto-refresh/auto-refresh.model';
import { MatchDetailComponent } from '../../../utility/components/match-detail/match-detail.component';
import { ModalType } from '../../../utility/components/modal/modal.model';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { PagingConstant, PagingModel } from '../../../utility/components/paging/paging.model';
import { ErrorCodeLockMatch } from '../../../utility/constants/config';
import { TEXT} from '../../../utility/constants/text';
import { CheckingPermissionModel } from '../../../utility/models/checking-permission.model';
import { MatchModel } from '../../../utility/models/match.model';
import { CommonService } from '../../../utility/services/common.service';
import { AppService } from '../app.service';
import { AllMarkedTicketQuery, GetTicketsQuery, MarkedTicketQuery, TicketDetailId, TicketDetailQuery } from '../models/query.model';
import { DataPermission, ResultMarkTicketModel } from '../models/result.model';
import { TicketsListComponent } from '../tickets-list/tickets-list.component';
import { TicketsModel } from '../tickets-list/tickets.model';
import { AllMarkedTicketListComponent } from './all-marked-ticket-list/all-marked-ticket-list.component';
import { AllMarkedTicketModel } from './all-marked-ticket-list/all-marked-ticket.model';
import { FilterTicketsComponent } from './filter-tickets/filter-tickets.component';
import { FilterSearchBy } from './filter-tickets/filter.model';
import { NumberItemService } from '../../../utility/components/bet-ids/number-item.service';
import { TicketsListService } from '../tickets-list/tickets-list.service';

@Component({
  standalone: true,
  selector: 'mark-unmark-ticket',
  templateUrl: './mark-unmark-ticket.component.html',
  styleUrls: ['./mark-unmark-ticket.component.scss'],
  imports: [CommonModule, FormsModule, FilterTicketsComponent, AllMarkedTicketListComponent,
    TicketsListComponent, ClipboardModule, MatchDetailComponent],
})
export class MarkUnmarkTicketComponent {
  @ViewChild('filterTickets') filterTickets: FilterTicketsComponent;
  @Input() currentTab: string;
  @Input() isExternalUrl: boolean;
  @Input() dataPermission = new DataPermission();

  private readonly appService = inject(AppService);
  private readonly commonService = inject(CommonService);
  private readonly modalService = inject(ModalService);
  private readonly numberItemService = inject(NumberItemService);
  private readonly ticketsListService = inject(TicketsListService);
  
  getStatus: string;
  paging = new PagingModel();
  pagingOfAllMarked = new PagingModel();
  query = new GetTicketsQuery();
  isBlockTickets: boolean;
  isBlockAllTickets: boolean;
  isShowAffectLicensees = false;
  isShowTickets: boolean;
  isShowMatch: boolean;
  isShowAllTickets: boolean;
  autoRefreshMode: number;
  licenseesName: string;
  showLicensees: boolean;
  isBetIdBorder: boolean;
  uncheckedTransIds: string[] = [];
  match = new MatchModel();
  ticketsModel = new TicketsModel();
  allMarkedTicketsModel = new Array<AllMarkedTicketModel>();
  queryTicket = new TicketDetailQuery();

  async searchEvent(query: GetTicketsQuery) {
    this.getStatus = query.status === '0' ? 'Mark' : 'Unmark';
    this.paging.pageSize = PagingConstant.SIZE_DEFAULT;
    this.query = query;
    this.isShowAffectLicensees = false;
    if (query.searchBy === FilterSearchBy.ALL_MARKED) {
      this.isShowAllTickets = true;
      this.isShowTickets = false;
      this.isShowMatch = false;
      this.pagingOfAllMarked.pageSize = PagingConstant.SIZE_DEFAULT;
      this.pagingOfAllMarked.page = 1;
      await this.getAllMarkedTickets(query);
    } else {
      this.isShowTickets = true;
      this.isShowMatch = true;
      this.isShowAllTickets = false;
      await this.getMatchInfo(parseInt(query.matchId, 10));
      await this.getTickets(query);
    }
  }

  async getAllMarkedTickets(query: GetTicketsQuery) {
    this.autoRefreshMode = AutoRefreshMode.STOP;
    this.licenseesName = '';
    this.isBlockAllTickets = true;
    const data = await this.appService.getAllMakerdTickets(query);
    this.isBlockAllTickets = false;
    this.allMarkedTicketsModel = data.ticketList;
    this.pagingOfAllMarked.total = data.totalItems;
    this.autoRefreshMode = AutoRefreshMode.START_OVER;
  }

  async getTickets(query: GetTicketsQuery) {
    try {
      this.isBlockTickets = true;
      const data = await this.appService.getTickets(query);
      this.isBlockTickets = false;
      this.isBetIdBorder = this.query.status !== '0';
      this.licenseesName = data.licenseesName;
      this.showLicensees = true;
      this.ticketsListService.initData(this.ticketsModel, data);
      this.paging.total = data.totalItems;
      if (this.query.searchBy === FilterSearchBy.BET_IDS) {
        this.numberItemService.updateInvalidItems(this.filterTickets.betIdsComponent.groupNumber.items, data.invalidTransIds, TEXT.INVALID_TICKETS);
        this.numberItemService.updateInvalidItems(this.filterTickets.betIdsComponent.groupNumber.items, data.invalidTransIds);
        this.numberItemService.updateInvalidItems(this.filterTickets.betIdsComponent.groupNumber.items, data.markedTransIds);
        this.numberItemService.updateMoved(this.filterTickets.betIdsComponent.groupNumber.items, data.movedTransIds);
      }
    } catch {
      this.isShowTickets = false;
    }
  }

  async getMatchInfo(matchId: number) {
    if (this.query.searchBy === FilterSearchBy.MATCH_ID && (this.match === undefined || this.match.matchId !== matchId)) {
      this.match = await this.commonService.getMatch(matchId);
    }
  }

  copiedAffectLicensees() {
    alert('The Licensee list has been copied to clipboard.');
  }

  async getDetailTickets(ticketDetailId: TicketDetailId) {
    if (ticketDetailId) {
      this.queryTicket.matchId = ticketDetailId.childMatchId ? ticketDetailId.childMatchId : ticketDetailId.matchId;
      this.queryTicket.userId = ticketDetailId.userId;
      this.queryTicket.createdDate = ticketDetailId.createdDate;
    }

    this.queryTicket.pageIndex = this.paging.page - 1;
    this.queryTicket.pageSize = this.paging.pageSize;
    this.isShowTickets = true;
    this.isShowMatch = false;
    this.isBetIdBorder = true;
    this.isBlockTickets = true;
    this.match = await this.commonService.getMatch(parseInt(ticketDetailId.matchId, 10));
    const data = await this.appService.getTicketsDetail(this.queryTicket);
    this.isBlockTickets = false;
    this.ticketsListService.initData(this.ticketsModel, data);
    this.licenseesName = data.licenseesName;
    this.showLicensees = true;
    this.paging.total = data.totalItems;
  }

  async pagingEvent() {
    this.showLicensees = false;
    this.query.pageIndex = this.paging.page - 1;
    this.query.pageSize = this.paging.pageSize;
    if (this.query.searchBy === FilterSearchBy.ALL_MARKED) {
      this.queryTicket.pageIndex = this.paging.page - 1;
      this.queryTicket.pageSize = this.paging.pageSize;
      await this.getDetailTickets(null);
    } else {
      await this.getTickets(this.query);
      this.ticketsModel.updateTicketsByUncheckTransIds(this.uncheckedTransIds);
    }
  }

  async pagingEventOfAllMarked() {
    this.query.pageIndex = this.pagingOfAllMarked.page - 1;
    this.query.pageSize = this.pagingOfAllMarked.pageSize;
    await this.getAllMarkedTickets(this.query);
  }

  async refreshAllMarkedTickets() {
    this.isShowAffectLicensees = false;
    this.isShowAllTickets = true;
    this.isShowTickets = false;
    this.isShowMatch = false;
    this.pagingOfAllMarked.pageSize = PagingConstant.SIZE_DEFAULT;
    this.pagingOfAllMarked.page = 1;
    this.modalService.close();
    await this.getAllMarkedTickets(this.query);
  }

  async exportExcel() {
    const maxPagingItems = 100000;
    if (this.paging.total > maxPagingItems) {
      const header = 'Export Excel Result';
      const body = TEXT.EXPORT_LARGE_FILE;
      this.modalService.open({ title: header, message: body, type: ModalType.Warning });
    } else {
      this.isBlockTickets = true;
      if (this.query.searchBy === FilterSearchBy.ALL_MARKED) {
        this.queryTicket.match = this.match;
        await this.appService.exportExcelDetailTickets(this.queryTicket);
      } else {
        this.query.match = this.match;
        await this.appService.exportExcel(this.query);
      }
      this.isBlockTickets = false;
    }
  }

  researchMarkedTickets(isClearBetId: boolean) {
    this.showLicensees = false;
    if (this.query.searchBy === FilterSearchBy.ALL_MARKED) {
      this.getAllMarkedTickets(this.query);
      this.getDetailTickets(null);
    } else {
      this.getTickets(this.query);
      if (this.query.searchBy === FilterSearchBy.BET_IDS && isClearBetId) {
        this.filterTickets.clearBetId();
      }
    }
  }

  async updateMarkedTickets(query: MarkedTicketQuery) {
    const header = 'Mark/Unmark Tickets';
    let isMarked = true;
    let body: string;
    if (this.query.status === '0') {
      body = TEXT.CONFIRM_MARK_TICKET;
      isMarked = true;
    } else {
      body = TEXT.CONFIRM_UNMARK_TICKET;
      isMarked = false;
    }
    this.modalService.confirm({ title: header, message: body, type: ModalType.Confirm }, async () => {
      const checkingPermissionModel = new CheckingPermissionModel();
      checkingPermissionModel.setParam(query.checkPermissionTickets, null, 'mark-tickets-check-permission', isMarked, null, false);
      this.modalService.confirmPermission(checkingPermissionModel, {
        title: 'WARNING!',
        type: ModalType.Confirm
      }, async () => {
        await this.updateMarkedTicket(query);
      }, async () => {
        this.researchMarkedTickets(false);
      });
    });
  }

  private replaceErrorMessageLockMatch(result: ResultMarkTicketModel): string {
    if (ErrorCodeLockMatch.ALL_ITEMS.includes(result.errorCode)) {
      return `Some tickets cannot be processed because: ${result.errorMsg}`;
    }

    return result.errorMsg;
  }

  async getTicketsDetail(query: TicketDetailQuery) {
    this.isBlockTickets = true;
    await this.appService.getTicketsDetail(query);
    this.isBlockTickets = false;
  }

  async confirmUpdateAllMarkedTickets(matches: AllMarkedTicketModel[]) {
    const header = 'Mark/Unmark All Tickets';
    const body = TEXT.CONFIRM_UNMARK_TICKET;
    this.modalService.confirm(
      {
        title: header,
        message: body,
        type: ModalType.Confirm
      }, async () => {
        await this.updateAllMarkedTickets(matches);
    });
  }

  changeSearchBy() {
    this.isShowTickets = false;
    this.isShowAllTickets = false;
    this.isShowMatch = false;
    this.showLicensees = false;
  }

  hideComponent(): void {
    this.isShowMatch = false;
    this.isShowTickets = false;
  }

  private async updateMarkedTicket(query: MarkedTicketQuery) {
    query.status = this.query.status;
    this.isBlockTickets = true;
    const result = await this.appService.updateMarkedTicket(query);
    this.isBlockTickets = false;
    this.modalService.open(
      {
        title: 'Mark tickets result',
        message: this.replaceErrorMessageLockMatch(result),
        type: result.isSuccessful ? ModalType.Alert : ModalType.Error
      },
      async () => {
        this.researchMarkedTickets(true);
      }
    );
  }

  private async updateAllMarkedTickets(matches: AllMarkedTicketModel[]) {
    const query = this.getAllMarkedTicketQuery(matches);
    this.isBlockTickets = true;
    const result = await this.appService.updateAllMarkedTickets(query);
    this.isBlockTickets = false;
    this.modalService.open(
      {
        title: 'Mark ticket with Match',
        message: this.replaceErrorMessageLockMatch(result),
        type: result.isSuccessful ? ModalType.Alert : ModalType.Error
      },
      async () => {
        await this.refreshAllMarkedTickets();
        if (
          includes(matches, {
            matchId: this.queryTicket.matchId,
            userId: this.queryTicket.userId,
            createdDate: this.queryTicket.createdDate
          })
        ) {
          this.getDetailTickets(null);
        }
      }
    );
  }

  private getAllMarkedTicketQuery(matches: AllMarkedTicketModel[]) : AllMarkedTicketQuery{
    const query = new AllMarkedTicketQuery();
    query.matches = matches.map(match => {
      return {
        ...match,
        matchId: match.childMatchId ? match.childMatchId : match.matchId,
      } as AllMarkedTicketModel;
    });
    return query;
  }
}
