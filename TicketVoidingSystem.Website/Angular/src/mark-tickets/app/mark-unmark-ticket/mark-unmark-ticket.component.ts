import { Component, Input, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { AutoRefreshMode } from '../../../utility/components/auto-refresh/auto-refresh.model';
import { ModalType } from '../../../utility/components/modal/modal';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { PagingConstant, PagingModel } from '../../../utility/components/paging/paging/paging.model';
import { LABELS } from '../../../utility/constants/labels';
import { CheckingPermissionModel } from '../../../utility/models/checking-permission.model';
import { MatchModel } from '../../../utility/models/match.model';
import { CommonService } from '../../../utility/services/common.service';
import { AppService } from '../app.service';
import { AllMarkedTicketQuery, GetTicketsQuery, MarkedTicketQuery, TicketDetailId, TicketDetailQuery } from '../models/query.model';
import { DataPermission, ResultMarkTicketModel } from '../models/result.model';
import { TicketsModel } from '../tickets-list/tickets.model';
import { AllMarkedTicketModel } from './all-marked-ticket-list/all-marked-ticket.model';
import { FilterTicketsComponent } from './filter-tickets/filter-tickets.component';
import { FilterSearchBy } from './filter-tickets/filter.model';

@Component({
  selector: 'mark-unmark-ticket',
  templateUrl: './mark-unmark-ticket.component.html',
  styleUrls: ['./mark-unmark-ticket.component.scss']
})
export class MarkUnmarkTicketComponent {
  @ViewChild('filterTickets') filterTickets: FilterTicketsComponent;
  @Input() currentTab: string;
  @Input() isExternalUrl: boolean;
  @Input() dataPermission = new DataPermission();

  getStatus: string;
  paging = new PagingModel();
  pagingOfAllMarked = new PagingModel();
  query = new GetTicketsQuery();
  isBlockTickets: boolean;
  isBlockAllTickets: boolean;
  isShowAffectLicenseees = false;
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

  constructor(
    private readonly appService: AppService,
    private readonly commonService: CommonService,
    private readonly modalService: ModalService
  ) { }

  async searchEvent(query: GetTicketsQuery) {
    this.getStatus = query.status === '0' ? 'Mark' : 'Unmark';
    this.paging.pageSize = PagingConstant.SIZE_DEFAULT;
    this.query = query;
    this.isShowAffectLicenseees = false;
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
      this.ticketsModel.initData(data);
      this.paging.total = data.totalItems;
      if (this.query.searchBy === FilterSearchBy.BETIDS) {
        if (data.invalidTransIds) {
          this.filterTickets.betIdsComponent.groupNumber.updateInvalidItems(data.invalidTransIds);
        }

        if (data.markedTransIds) {
          this.filterTickets.betIdsComponent.groupNumber.updateInvalidItems(data.markedTransIds);
        }

        if (data.movedTransIds) {
          this.filterTickets.betIdsComponent.groupNumber.updateMoved(data.movedTransIds);
        }
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

  copiedAffectLicenseees() {
    alert('The Licensee list has been copied to clipboard.');
  }

  async getDetailTickets(ticketDetailId: TicketDetailId) {
    if (ticketDetailId) {
      this.queryTicket.matchId = ticketDetailId.matchId;
      this.queryTicket.userId = ticketDetailId.userId;
      this.queryTicket.createdDate = ticketDetailId.createdDate;
    }

    this.queryTicket.pageIndex = this.paging.page - 1;
    this.queryTicket.pageSize = this.paging.pageSize;
    this.isShowTickets = true;
    this.isShowMatch = false;
    this.isBetIdBorder = true;
    this.isBlockTickets = true;
    this.match = await this.commonService.getMatch(parseInt(this.queryTicket.matchId, 10));
    const data = await this.appService.getTicketsDetail(this.queryTicket);
    this.isBlockTickets = false;
    this.ticketsModel.initData(data);
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
    this.isShowAffectLicenseees = false;
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
      const body = LABELS.EXPORT_LARGE_FILE;
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
      if (this.query.searchBy === FilterSearchBy.BETIDS && isClearBetId) {
        this.filterTickets.clearBetId();
      }
    }
  }

  async updateMarkedTickets(query: MarkedTicketQuery) {
    const header = 'Mark/Unmark Tickets';
    let isMarked = true;
    let body: string;
    if (this.query.status === '0') {
      body = LABELS.CONFIRM_MARK_TICKET;
      isMarked = true;
    } else {
      body = LABELS.CONFIRM_UNMARK_TICKET;
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
    const ERROR_CODE_LOCK_MATCH = [1000000, 101, 100, 103, 102];
    if (ERROR_CODE_LOCK_MATCH.includes(result.errorCode)) {
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
    const body = LABELS.CONFIRM_UNMARK_TICKET;
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
    const query = new AllMarkedTicketQuery();
    query.matches = matches;
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
          _.includes(matches, {
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
}
