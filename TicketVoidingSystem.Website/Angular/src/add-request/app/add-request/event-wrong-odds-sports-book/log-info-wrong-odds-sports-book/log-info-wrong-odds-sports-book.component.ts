import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { BetTypeAddRequest } from '../../../../../utility/components/advanced-mode-add-request/group-bet-types/group-bet-types.model';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { ItemsSelect } from '../../../../../utility/components/multiple-selection/items-select';
import { MultipleSelection } from '../../../../../utility/components/multiple-selection/multiple-selection';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { StaticService } from '../../../../../utility/services/static.service';
import { AddRequestApiService } from '../../add-request-api.service';
import { AddRequestStore } from '../../add-request.store';
import { AffectedTicketsModel, LogInfoTicketsQuery } from '../../models/live-game-early-ticket.model';
import { TicketsModel } from '../../pool-house-ticket/tickets/tickets.model';
import { LogInfoWrongOddsSportsBook } from '../models/log-info-wrong-odds-sports-book.model';
import { PrimitiveProperty } from '../models/primitive-property.model';

@Component({
  selector: 'log-info-wrong-odds-sports-book',
  templateUrl: './log-info-wrong-odds-sports-book.component.html',
  styleUrls: ['./log-info-wrong-odds-sports-book.component.scss']
})
export class LogInfoWrongOddsSportsBookComponent implements OnInit {
  @Input() logInfo: LogInfoWrongOddsSportsBook;
  @Input() requestId: number;
  @Input() isEdit: boolean;
  @Input() primitiveProps: PrimitiveProperty;
  @Input() issueTypeId: string;
  @Output() searchEvent = new EventEmitter<string>();
  affectedTicketsModel = new AffectedTicketsModel();

  constructor(
    private readonly modalService: ModalService,
    private readonly addRequestStore: AddRequestStore,
    private readonly addRequestApiService: AddRequestApiService
  ) { }

  ngOnInit(): void {
    if (this.isEdit) {
      this.primitiveProps.isShowValidation = true;
    }
  }

  public displayFullDateTimeFormat(time: Date): string {
    return moment(time).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
  }

  public clearDataValidation(): void {
    this.logInfo.logInfoDetail = null;
    this.logInfo.messageValidationLogInfo = null;
  }

  public openPopupTransIds(requestId: number, transIds: string): void {
    StaticService.openPopupTransIds(requestId, transIds, this.modalService);
  }

  public countInfoContent(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.countInfoContent(cashOutCount, settleCount, instantlySettleCount);
  }

  public displayTransId(ticketCount: number, transId: string): string {
    return ticketCount === 0 ? '-' : transId;
  }

  public isShowCountInfo(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.isShowCountInfo(cashOutCount, settleCount, instantlySettleCount);
  }

  public async updateAffectedTickets(){
    if (this.logInfo.logInfoDetail.logInfoTicketsJson) {
      const query: LogInfoTicketsQuery = {
        logInfoTicketsJson: this.logInfo.logInfoDetail.logInfoTicketsJson,
        issueTypeId: Number(this.issueTypeId)
      };
      const ticketsLogInfo = await this.addRequestApiService.GetLogInfoTickets(query);
      this.affectedTicketsModel.tickets = new TicketsModel();
      this.affectedTicketsModel.tickets.initData(ticketsLogInfo);
      this.affectedTicketsModel.tickets.checkAllTickets();
      this.affectedTicketsModel.tickets.groups[0].name = null;
    } else {
      this.affectedTicketsModel.tickets = new TicketsModel();
    }
  }

  public updateCheckedBetTypeIds(){
    this.affectedTicketsModel.checkedBetTypes = this.logInfo.checkedBetTypes;
    this.affectedTicketsModel.filterBetTypes = this.initFilterBetTypes(this.logInfo.checkedBetTypes);
  }

  private initFilterBetTypes(betTypes: BetTypeAddRequest[]): MultipleSelection{
    const filterBetTypes = StaticService.initDefaultMultipleSelection('280px', 1);
    filterBetTypes.items = betTypes.map(x => new ItemsSelect(0, x.id.toString(), x.name, true, true, true, []));

    return filterBetTypes;
  }

   public async showAffectedTicketsDetails(){
    this.addRequestStore.changeBlockingUiStatus(true);
    await this.updateAffectedTickets();
    this.updateCheckedBetTypeIds();
    this.addRequestStore.changeBlockingUiStatus(false);
    this.affectedTicketsModel.isOpen = true;
    this.affectedTicketsModel = _.clone(this.affectedTicketsModel);
   }
}
