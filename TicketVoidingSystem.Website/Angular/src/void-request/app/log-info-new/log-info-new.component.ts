import { Component, Input } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment-timezone';
import { AcceptType, DateTimeFormat } from '../../../utility/constants/config';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { LogInfoDetail } from '../../../utility/models/log-info-detail.model';
import { StaticService } from '../../../utility/services/static.service';

@Component({
  selector: 'log-info-new',
  templateUrl: './log-info-new.component.html',
  styleUrls: ['./log-info-new.component.scss']
})
export class LogInfoNewComponent {
  @Input() issueTypeId: number;
  @Input() isMainMatch: boolean;
  @Input() isPoolHouseAffected: boolean;
  @Input() logInfoDetail: LogInfoDetail;
  acceptTypeName = "";

  displayFullDateTimeFormat(time: Date): string {
    return moment(time).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
  }

  isShowPoolHouseTickets() {
    const issueTypesHavePoolHouse = [
      Number(IssueTypeConstant.WRONG_HDP),
      Number(IssueTypeConstant.WRONG_1ST_HDP),
      Number(IssueTypeConstant.WRONG_OU),
      Number(IssueTypeConstant.WRONG_1ST_OU)
    ];

    return issueTypesHavePoolHouse.includes(this.issueTypeId);
  }

  isShowCountInfo(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.isShowCountInfo(cashOutCount, settleCount, instantlySettleCount);
  }

  displayTransId(ticketCount: number, transId: string): string {
    return ticketCount === 0 ? '-' : transId;
  }

  countInfoContent(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.countInfoContent(cashOutCount, settleCount, instantlySettleCount);
  }

  getHighlightMinTimeClass(minTime?: Date): string {
    if (minTime && this.logInfoDetail.highlightAcceptType) {
      switch (this.logInfoDetail.highlightAcceptType) {
        case AcceptType.AUTO_ACCEPT: {
          this.acceptTypeName = "AA";
          return 'highlight-min-aa';
        }
        case AcceptType.PENDING_ACCEPT: {
          this.acceptTypeName = "PA";
          return 'highlight-min-pa';
        }
        case AcceptType.SECOND_ACCEPT: {
          this.acceptTypeName = "SA";
          return 'highlight-min-sa';
        }
      }
    }

    return '';
  }

  displayMinTime(minTime?: Date): string {
    if (_.isNull(minTime)) {
      return '-';
    }
    return (this.acceptTypeName) ? `${moment(minTime).format(DateTimeFormat.TIME_FORMAT)} - ${this.acceptTypeName}` :
      `${moment(minTime).format(DateTimeFormat.TIME_FORMAT)}`;
  }

  isHaveCancelCashOut(): boolean {
    return StaticService.isHaveCancelCashOutTicket(this.issueTypeId?.toString());
  }
}
