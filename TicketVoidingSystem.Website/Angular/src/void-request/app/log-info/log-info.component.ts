import { Component, Input } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { AcceptType, DateTimeFormat, TVSRequestFilterBy } from '../../../utility/constants/config';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { LogInfoDetail } from '../../../utility/models/log-info-detail.model';
import { StaticService } from '../../../utility/services/static.service';
import { SportType } from '../../../utility/constants/sport.constant';
import { CommonModule } from '@angular/common';
import { SanitizeHtmlPipe } from '../../../utility/modules/sanitize-html.pipe';
import { TicketCountOtherSportsComponent } from '../../../add-request/app/add-request/ticket-count-other-sports/ticket-count-other-sports.component';

@Component({
  standalone: true,
  selector: 'log-info',
  templateUrl: './log-info.component.html',
  styleUrls: ['./log-info.component.scss'],
  imports: [CommonModule, SanitizeHtmlPipe, TicketCountOtherSportsComponent]
})
export class LogInfoComponent {
  @Input() logInfoDetails: LogInfoDetail[];
  @Input() issueTypeId: number;
  @Input() actualScore: string;
  @Input() filterBy: number;
  @Input() correctOddsHomeOver: string;
  @Input() correctOddsAwayUnder: string;
  @Input() isPoolHouseAffected: boolean;
  @Input() sportType: number;

  acceptTypeName = "";

  displayScoreLabel(filterBy: number): string {
    return (this.isWrongScore() && (filterBy === TVSRequestFilterBy.TRANS_TIME || filterBy === TVSRequestFilterBy.TRANS_TIME_AND_CHECK_TIME)) ?
      'Wrong Score: ' : 'Live Score: ';
  }

  displayVoidTimeLabel(filterBy: number): string {
    if (this.isWrongScore()) {
      if (filterBy === TVSRequestFilterBy.TRANS_TIME || filterBy === TVSRequestFilterBy.TRANS_TIME_AND_CHECK_TIME) {
        return 'Void Trans Time (GMT-4): ';
      } else if (filterBy === TVSRequestFilterBy.CHECK_TIME) {
        return 'Void Accept Time (GMT-4): ';
      }
    }

    return 'Void time (GMT-4): ';
  }

  displayFullDateTimeFormat(time: Date): string {
    return moment(time).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
  }

  isShowCountInfo(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.isShowCountInfo(cashOutCount, settleCount, instantlySettleCount);
  }

  countInfoContent(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.countInfoContent(cashOutCount, settleCount, instantlySettleCount);
  }

  getHighlightMinTimeClass(logInfoDetail: LogInfoDetail): string {
    if (logInfoDetail.highlightMinTime && logInfoDetail.highlightAcceptType) {
      switch (logInfoDetail.highlightAcceptType) {
        case AcceptType.AUTO_ACCEPT: {
          this.acceptTypeName = "AA";
          return 'highlight-min-aa';
        }
        case AcceptType.SECOND_ACCEPT: {
          this.acceptTypeName = "SA";
          return 'highlight-min-sa';
        }
        case AcceptType.PENDING_ACCEPT: {
          this.acceptTypeName = "PA";
          return 'highlight-min-pa';
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

  isWrongScore(): boolean {
    return this.issueTypeId === Number(IssueTypeConstant.WRONG_SCORE);
  }

  isWrongOdds(): boolean {
    return this.issueTypeId === Number(IssueTypeConstant.WRONG_ODDS);
  }

  isReducedOver(): boolean {
    return this.issueTypeId === Number(IssueTypeConstant.REDUCED_OVER) || this.issueTypeId === Number(IssueTypeConstant.ABANDONED);
  }

  public isSportTypeSoccer(): boolean {
    return this.sportType === SportType.SOCCER;
  }
}
