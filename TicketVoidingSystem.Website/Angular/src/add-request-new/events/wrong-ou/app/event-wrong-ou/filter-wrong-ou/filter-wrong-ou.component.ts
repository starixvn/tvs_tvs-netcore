
import { Component, ElementRef, EventEmitter, inject, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import moment from 'moment-timezone';
import { DateFullTimeNewComponent } from '../../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { TooltipComponent } from '../../../../../../utility/components/tooltip/tooltip.component';
import { Tooltip } from '../../../../../../utility/components/tooltip/tooltip.model';
import { DateTimeFormat } from '../../../../../../utility/constants/config';
import { TEXT } from '../../../../../../utility/constants/text';
import { StaticService } from '../../../../../../utility/services/static.service';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { HdpFilterBetTypeComponent } from '../../../../../component/hdp-filter-bet-type/hdp-filter-bet-type.component';
import { HdpFilterBetTypeService } from '../../../../../component/hdp-filter-bet-type/hdp-filter-bet-type.service';
import { FilterWrongOuModel } from '../models/filter-wrong-ou.model';
import { ValidationService } from '../services/validation.service';
import { OddsInfo } from '../../../../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { CommonService } from '../../../../../../utility/services/common.service';
import { AdvancedModeConstants } from '../../../../../../utility/components/advanced-mode/advanced-mode.constants';
import { SportType } from '../../../../../../utility/constants/sport.constant';
import { FilterWrongOuService } from './filter-wrong-ou.service';
import { MultipleSelection } from '../../../../../../utility/components/multiple-selection/multiple-selection.model';
import { MultipleSelectionComponent } from '../../../../../../utility/components/multiple-selection/multiple-selection.component';
import { MultipleSelectionService } from '../../../../../../utility/components/multiple-selection/multiple-selection.service';

@Component({
  selector: 'filter-wrong-ou',
  templateUrl: './filter-wrong-ou.component.html',
  styleUrls: ['./filter-wrong-ou.component.scss'],
  standalone: true,
  imports: [DateFullTimeNewComponent, FormsModule, TooltipComponent, HdpFilterBetTypeComponent, MultipleSelectionComponent],
  providers: [HdpFilterBetTypeService]
})
export class FilterWrongOuComponent {
  @Input() filterWrongOuModel: FilterWrongOuModel;
  @Input() isEdit: boolean;
  @Input() matchId: number;
  @Input() isMainMatch: boolean;
  @Input() isDisabled: boolean;
  @Input() filter: FilterModel;
  @Input() sportTypeId: number;
  @Output() searchTicketEvent = new EventEmitter();
  @Output() refreshEvent = new EventEmitter();
  @Output() changeFilterEvent = new EventEmitter();

  @ViewChild('fromTimeComponent') fromTimeComponent: DateFullTimeNewComponent;
  @ViewChild('toTimeComponent') toTimeComponent: DateFullTimeNewComponent;
  tooltip = new Tooltip();
  oddsInfo: OddsInfo[] = [];
  wrongMarketSelections = new MultipleSelection();

  private readonly element = inject(ElementRef);
  private readonly validationService = inject(ValidationService);
  private readonly commonService = inject(CommonService);
  private readonly filterWrongOuService = inject(FilterWrongOuService);
  private readonly multipleSelectionService = inject(MultipleSelectionService);

  constructor() {
    this.tooltip.element = this.element;
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (this.sportTypeId !== SportType.BASKETBALL) {
      return;
    }
    if (changes['matchId']) {
      this.oddsInfo = await this.commonService.getOddsInfoSpecialBetTypes({ matchId: this.matchId.toString(), betTypes: AdvancedModeConstants.BETTYPE_SPECIAL_BASKETBALL });
    }
    if (changes['filterWrongOuModel'] && this.filterWrongOuModel.wrongMarket && this.isBetTypeHasBetChoiceSelection()) {
      this.wrongMarketSelections = this.filterWrongOuService.getBetChoiceSelection(this.oddsInfo, Number(this.filterWrongOuModel.filterBetType.filterBetTypeId), this.filterWrongOuModel.wrongMarket.split('&'));
    }
  }

  public changeFilterBy(): void {
    if (!this.filterWrongOuModel.filterFromTransTime || !this.filterWrongOuModel.filterToTransTime) {
      const currentMoment = moment.utc().tz('America/Caracas');
      this.filterWrongOuModel.filterFromTransTime = moment.utc().tz('America/Caracas').millisecond(0).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
      this.filterWrongOuModel.filterToTransTime = currentMoment.format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    }
  }

  isBetTypeHasBetChoiceSelection() {
    return this.filterWrongOuService.isBetTypeHasBetChoiceSelection(this.filterWrongOuModel.filterBetType.filterBetTypeId);
  }

  updateWrongMarketSelections() {
    if (this.isBetTypeHasBetChoiceSelection()) {
      this.wrongMarketSelections = this.filterWrongOuService.getBetChoiceSelection(this.oddsInfo, Number(this.filterWrongOuModel.filterBetType.filterBetTypeId));
      this.filterWrongOuModel.wrongMarket = this.getSelectedWrongMarketItems().join('&');
    }
  }

  public changeFilter(): void {
    this.changeFilterEvent.emit();
  }

  public getSelectedWrongMarketItems(): string[] {
    return this.multipleSelectionService.getValueCheckedItemsList(this.wrongMarketSelections.items);
  }

  public onWrongMarketSelectionChange(selectedItems: string[]): void {
    this.filterWrongOuModel.wrongMarket = selectedItems.join('&');
    this.changeFilterEvent.emit();
  }

  public getDurationTime(): string {
    if (!this.fromTimeComponent?.isTimeValid() || !this.toTimeComponent?.isTimeValid()) {
      return '-';
    }

    const fromTime = moment(this.filterWrongOuModel.filterFromTransTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
    const toTime = moment(this.filterWrongOuModel.filterToTransTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);

    return StaticService.getDurations(fromTime, toTime);
  }

  public isValid(): boolean {
    return this.isValidDateTime() && this.isValidHdp() && this.isValidLiveIndicator();
  }

  private isValidLiveIndicator(): boolean {
    if (isNull(this.filterWrongOuModel.liveIndicator) || isUndefined(this.filterWrongOuModel.liveIndicator)) {
      this.tooltip.display('radio-liveindicator', TEXT.REQUIRED_FIELD);
      return false;
    }

    return true;
  }

  private isValidDateTime(): boolean {
    return this.fromTimeComponent.validateWithTooltip()
      && this.toTimeComponent.validateWithTooltip()
      && this.validationService.isFromTimeSameOrBeforeToTime(this.filterWrongOuModel.filterFromTransTime, this.filterWrongOuModel.filterToTransTime, this.tooltip);
  }

  private isValidHdp(): boolean {
    return this.validationService.isValidHdp(this.filterWrongOuModel, this.tooltip);
  }

  public isCorrectFormatHdp(value: string, elementClass: string): boolean {
    return value ? StaticService.isCorrectFormatMultipleDecimal(value, elementClass, this.tooltip, TEXT.INVALID_OU) : true;
  }

  public emitSearchEvent(): void {
    this.searchTicketEvent.emit();
  }

  public emitRefreshEvent(): void {
    this.refreshEvent.emit();
  }

  isShowFilterBetType() {
    return StaticService.isWrongOU(this.filter.issueTypeId);
  }
}
