import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { DateTimeFormat, TeamFavorite } from '../../../../../utility/constants/config';
import { TEXT } from '../../../../../utility/constants/text';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterWithHdpModel } from '../models/filter-with-hdp.model';
import { ValidationService } from '../services/validation.service';
import { FilterModel } from '../../filter/filter.model';

@Component({
  selector: 'filter-with-hdp',
  templateUrl: './filter-with-hdp.component.html',
  styleUrls: ['./filter-with-hdp.component.scss']
})
export class FilterWithHdpComponent implements OnInit {
  @Input() filterWithHdpModel: FilterWithHdpModel;
  @Input() isEdit: boolean;
  @Input() matchId: number;
  @Input() filter: FilterModel;
  @Input() isMainMatch: boolean;
  @Input() isDisabled: boolean;
  @Input() sportTypeId: number;
  @Output() searchTicketEvent = new EventEmitter();
  @Output() refreshEvent = new EventEmitter();
  @Output() changeFilterEvent = new EventEmitter();

  @ViewChild('fromTimeComponent') fromTimeComponent: DateFullTimeNewComponent;
  @ViewChild('toTimeComponent') toTimeComponent: DateFullTimeNewComponent;

  teamFavorite: number;
  tooltip = new Tooltip();

  constructor(
    private readonly element: ElementRef,
    private readonly validationService: ValidationService
  ) {
      this.tooltip.element = this.element;
  }

  public ngOnInit(): void {
    this.initTeamFavorite();
  }

  public changeFilterBy(): void {
    if (!this.filterWithHdpModel.filterFromTransTime || !this.filterWithHdpModel.filterToTransTime) {
        const currentMoment = moment.utc().tz('America/Caracas');
        this.filterWithHdpModel.filterFromTransTime = moment.utc().tz('America/Caracas').millisecond(0).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
        this.filterWithHdpModel.filterToTransTime = currentMoment.format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
      }
  }

  private initTeamFavorite(): void {
    if (this.isEdit && (this.filterWithHdpModel.homeFavorite || this.filterWithHdpModel.awayFavorite)) {
      this.teamFavorite = this.filterWithHdpModel.homeFavorite ? TeamFavorite.HOME : TeamFavorite.AWAY;
    } else {
      this.teamFavorite = TeamFavorite.HOME;
    }
  }

  public changeFilter(): void {
    this.changeFilterEvent.emit();
  }

  public changeTeamFavorite(id: number): void {
    this.changeFilter();
    this.teamFavorite = id;
    if (id === TeamFavorite.HOME) {
      this.filterWithHdpModel.homeFavorite = this.filterWithHdpModel.awayFavorite;
      this.filterWithHdpModel.awayFavorite = '';
    } else {
      this.filterWithHdpModel.awayFavorite = this.filterWithHdpModel.homeFavorite;
      this.filterWithHdpModel.homeFavorite = '';
    }
  }

  public getDurationTime(): string {
    if (!this.fromTimeComponent?.isTimeValid() || !this.toTimeComponent?.isTimeValid()) {
      return '-';
    }

    const fromTime = moment(this.filterWithHdpModel.filterFromTransTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
    const toTime = moment(this.filterWithHdpModel.filterToTransTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);

    return StaticService.getDurations(fromTime, toTime);
  }

  public isValid(): boolean {
    return this.isValidDateTime() && this.isValidHdp() && this.isValidLiveIndicator();
  }

  private isValidDateTime(): boolean {
    return this.fromTimeComponent.validateWithTooltip()
      && this.toTimeComponent.validateWithTooltip()
      && this.validationService.isFromTimeSameOrBeforeToTime(this.filterWithHdpModel.filterFromTransTime, this.filterWithHdpModel.filterToTransTime, this.tooltip);
  }

  private isValidHdp(): boolean {
    if (this.isSubTypeWrongHdpOrWrong1stHdp()) {
      return this.validationService.isValidHdpWithSubTypeWrongHdpOrWrong1stHdp(this.teamFavorite, this.filterWithHdpModel, this.tooltip);
    } else {
      return this.validationService.isValidHdpWithSubTypeHomeAwayVirtualHedReverse(this.filterWithHdpModel, this.tooltip);
    }
  }

  private isValidLiveIndicator(): boolean {
    if (_.isNull(this.filterWithHdpModel.liveIndicator) || _.isUndefined(this.filterWithHdpModel.liveIndicator)) {
      this.tooltip.display('radio-liveindicator', TEXT.REQUIRED_FIELD);
      return false;
    }

    return true;
  }

  public isCorrectFormatHdp(value: string, elementClass: string): boolean {
    return value ? StaticService.isCorrectFormatMultipleDecimal(value, elementClass, this.tooltip, TEXT.INVALID_HDP) : true;
  }

  public emitSearchEvent(): void {
    this.searchTicketEvent.emit();
  }

  public emitRefreshEvent(): void {
    this.refreshEvent.emit();
  }

  public isSubTypeWrongHdpOrWrong1stHdp(): boolean {
    return this.validationService.isSubTypeWrongHdpOrWrong1stHdp(this.filter.subIssueTypeId);
  }
}
