import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment-timezone';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterModel } from '../../filter/filter.model';
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
  @Input() filter: FilterModel;
  @Output() searchEvent = new EventEmitter<string>();

  constructor(private readonly modalService: ModalService
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
}
