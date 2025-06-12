import { Component, inject, Input } from '@angular/core';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { CommonModule } from '@angular/common';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import moment from 'moment';
import { StaticService } from 'src/utility/services/static.service';
import { EventWrongScoreService } from '../services/event-wrong-score.service';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { SanitizeHtmlPipe } from '../../../../../utility/modules/sanitize-html.pipe';
import _ from 'lodash';

@Component({
  standalone: true,
  selector: 'main-log-info',
  templateUrl: './main-log-info.component.html',
  styleUrl: './main-log-info.component.scss',
  imports: [CommonModule, SanitizeHtmlPipe],
})
export class MainLogInfoComponent {
  @Input() logInfo: LogInfoRelatedEvent;
  acceptTypeName = '';

  private readonly eventWrongScoreService = inject(EventWrongScoreService);
  private readonly modalService = inject(ModalService);

  public displayFullDateTimeFormat(time: Date): string {
    return moment(time).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
  }

  isShowCountInfo(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.isShowCountInfo(cashOutCount, settleCount, instantlySettleCount);
  }

  countInfoContent(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.countInfoContent(cashOutCount, settleCount, instantlySettleCount);
  }

  displayMinTime(minTime?: Date): string {
    if (_.isNull(minTime)) {
      return '-';
    }

    return (this.acceptTypeName) ? `${moment(minTime).format(DateTimeFormat.TIME_FORMAT)} - ${this.acceptTypeName}` :
      `${moment(minTime).format(DateTimeFormat.TIME_FORMAT)}`;
  }

  getHighlightMinTimeClass(minTime?: Date): string {
    const highlightTimeClass = this.eventWrongScoreService.getHighlightMinTimeClass(this.logInfo.logInfoDetail?.highlightAcceptType, minTime);
    this.acceptTypeName = highlightTimeClass.acceptTypeName;
    return highlightTimeClass.highlightTimeClass;
  }

  public openPopupTransIds(requestId: number, transIds: string): void {
    StaticService.openPopupTransIds(requestId, transIds, this.modalService);
  }

  isShowLogInfo(): boolean {
    return this.logInfo.logInfoDetail?.matchId > 0 || this.logInfo.messageValidationLogInfo?.length > 0;
  }
}
