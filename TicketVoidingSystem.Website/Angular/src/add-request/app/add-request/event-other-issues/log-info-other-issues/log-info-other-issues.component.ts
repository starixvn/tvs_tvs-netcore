import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { StaticService } from '../../../../../utility/services/static.service';
import { AffectedTicketsModel } from '../../models/live-game-early-ticket.model';
import { LogInfoOtherIssues } from '../models/log-info-other-issues.model';
import { PrimitiveProperty } from '../models/primitive-property.model';

@Component({
  selector: 'log-info-other-issues',
  templateUrl: './log-info-other-issues.component.html',
  styleUrls: ['./log-info-other-issues.component.scss']
})
export class LogInfoOtherIssuesComponent implements OnInit {
  @Input() logInfo: LogInfoOtherIssues;
  @Input() requestId: number;
  @Input() isEdit: boolean;
  @Input() primitiveProps: PrimitiveProperty;
  @Input() issueTypeId: string;
  @Output() searchEvent = new EventEmitter<string>();
  affectedTicketsModel = new AffectedTicketsModel();

  constructor(
    private readonly modalService: ModalService
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

  public showAffectedTicketsDetails() {
    this.affectedTicketsModel.logInfoTicketsJson = this.logInfo.logInfoDetail.logInfoTicketsJson;
    this.affectedTicketsModel.issueTypeId = Number(this.issueTypeId);
    this.affectedTicketsModel.isOpen = true;
    this.affectedTicketsModel = _.clone(this.affectedTicketsModel);
  }
}
