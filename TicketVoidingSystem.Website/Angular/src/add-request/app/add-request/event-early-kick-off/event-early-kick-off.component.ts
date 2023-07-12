import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as moment from 'moment-timezone';
import { DateTimeFormat } from '../../../../utility/constants/config';
import { MatchInfo } from '../../../../utility/models/event.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { TimeModel } from '../../../../utility/modules/date-time/date-time/time.model';
import { PagingConstant, PagingModel } from '../../../../utility/modules/paging/paging/paging.model';
import { HttpService } from '../../../../utility/services/http.service';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { LeagueEventComponent } from '../league-event/league-event.component';
import { GetLogInfoQuery } from '../models/add-request.query';
import { EventDetailModel } from '../models/event-detail.model';
import { GetLogInfoViewModel } from '../models/get-log-info.model';
import { GetTicketsQuery } from '../models/get-tickets.query';
import { TransInfoAddRequestModel } from '../models/trans-info-add-request.model';
import { TableTicketsModel } from './tickets-list/table-tickets.model';

@Component({
  selector: 'event-early-kick-off',
  templateUrl: './event-early-kick-off.component.html',
  styleUrls: ['./event-early-kick-off.component.scss']
})
export class EventEarlyKickOffComponent implements OnInit {
  @Input() filter: FilterModel;
  @Input() eventDetailModel = new EventDetailModel();
  @Input() isVoided: boolean;
  @Input() isEdit: boolean;
  @Input() requestId: number;
  @Input() matchId: number;

  @Output() matchIdChange = new EventEmitter<number>();
  @ViewChild('leagueEvent') leagueEventComponent: LeagueEventComponent;

  selectedMatch: MatchModel;
  kickOffTime = new TimeModel(new Date(moment().tz('Etc/GMT-8').format('YYYY-MM-DD HH:mm:ss.SSS')));
  paging = new PagingModel();
  query = new GetTicketsQuery();
  tableTicketsModel = new TableTicketsModel();
  isBlockBetList: boolean;
  isBlockKickOffTime: boolean;
  isShowTicket = false;
  warningMessageList: string[] = [];
  transInfoAddRequestModel: TransInfoAddRequestModel;
  constructor(
    private readonly httpService: HttpService,
    private readonly addRequestStore: AddRequestStore,
    ) { }

  async ngOnInit(): Promise<void> {
    await this.updateData();
  }

  async getKickOffTime() {
    if (this.eventDetailModel.matchId && !this.isEdit) {
      this.isBlockKickOffTime = true;
      this.isBlockKickOffTime = false;
      const time = new Date(this.selectedMatch.kickOffTime);
      this.kickOffTime = new TimeModel(time);
      this.updateEventDetailModel();
    } else {
      if (this.eventDetailModel.matchId) {
        const time = new Date(this.eventDetailModel.kickOffTime);
        this.kickOffTime = new TimeModel(time);
      } else {
        this.kickOffTime = new TimeModel(new Date(moment().tz('Etc/GMT-8').format('YYYY-MM-DD HH:mm:ss.SSS')));
      }
    }
  }

  updateEventDetailModel() {
    this.eventDetailModel.kickOffTime = new Date(this.kickOffTime.getValue());
  }

  async updateData() {
    this.isShowTicket = false;
    this.warningMessageList = [];
    if (this.eventDetailModel.matchId) {
      this.selectedMatch = await this.httpService.postJson({ matchId: this.eventDetailModel.matchId, isMatch3rd: false }, 'Match/GetInfo');
    }
    await this.getKickOffTime();
  }

  private initQuery() {
    this.paging.pageSize = PagingConstant.SIZE_ONE;
    this.query.pageIndex = PagingConstant.INDEX_ZERO;
    this.query.pageSize = PagingConstant.SIZE_ONE;
    this.query.match = this.selectedMatch;
    this.query.kickOffDate = this.kickOffTime.getValue();
    this.query.issueTypeId = Number(this.filter.issueTypeId);
    this.query.requestId = null;
    this.query.actionId = Number(this.filter.action);
    this.query.transInfoJson = this.transInfoAddRequestModel?.transInfoJson;
  }

  async getTickets() {
    this.isShowTicket = true;
    this.isBlockBetList = true;
    const data = await this.httpService.postJson<GetTicketsQuery, TableTicketsModel>(this.query, 'TicketVoidingSystem/VoidRequest/GetTickets');
    this.isBlockBetList = false;
    this.tableTicketsModel.initData(data);
    this.paging.total = data.total;
  }

  async isValid(): Promise<boolean> {
    const result = this.leagueEventComponent.isMatchIdValid();
    if (result) {
      await this.getWarningMessage();
    }
    return result;
  }

  async search() {
    if (await this.isValid()) {
      this.initQuery();
      await this.getTickets();
    }
  }

  async pagingEvent() {
    this.query.pageIndex = this.paging.page - 1;
    this.query.pageSize = this.paging.pageSize;
    await this.getTickets();
  }

  async getWarningMessage(): Promise<void> {
    const getLogInfoQuery: GetLogInfoQuery = {
        matchId: this.eventDetailModel.matchId,
        issueTypeId: Number(this.filter.issueTypeId),
        actionId: Number(this.filter.action),
        requestId: this.isEdit ? this.requestId : null,
        kickOffTime: moment(this.eventDetailModel.kickOffTime).format(DateTimeFormat.FULL_DATE_TIME_FORMAT),
    };
    this.addRequestStore.changeBlockingUiStatus(true);
    const viewModel = await this.httpService.postJson<GetLogInfoQuery, GetLogInfoViewModel>(getLogInfoQuery, 'TicketVoiding/GetLogInfo');
    const logInfo = viewModel.getLogInfoModels[0];
    this.transInfoAddRequestModel = viewModel.transInfoAddRequestModel;
    this.warningMessageList = [];
    if (logInfo.validation && logInfo.validation.isExistedInOtherRequest) {
      logInfo.ticketRequest.forEach(item => {
        this.warningMessageList.push(`Tickets ${item.transIds} is existed in Request ${item.requestId}.`);
      });
    }
    this.addRequestStore.changeBlockingUiStatus(false);
  }
  
  changeMatchInfo(matchInfo: MatchInfo) {
    this.matchIdChange.emit(matchInfo.matchId);
  }
}
