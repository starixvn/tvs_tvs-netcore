import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment-timezone';
import { BlockUiDirective } from '../../../../../utility/components/block-ui/block-ui.directive';
import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { TooltipComponent } from '../../../../../utility/components/tooltip/tooltip.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterModel } from '../../filter/filter.model';
import { WrongScoreModel } from '../../models/event-wrong-score.model';
import { PrimitiveProperty } from '../event-wrong-score.model';
import { LogInfoService } from '../services/log-info.service';
import { ValidationService } from '../services/validation.service';
import { WrongScoreService } from '../services/wrong-score.service';
import { SanitizeHtmlPipe } from '../../../../../utility/modules/sanitize-html.pipe';
import { GetLogInfoParams } from '../models/get-log-info-params.model';

@Component({
  standalone: true,
  selector: 'wrong-score-info',
  templateUrl: './wrong-score-info.component.html',
  styleUrls: ['./wrong-score-info.component.scss'],
  imports: [DateFullTimeNewComponent, NgbModule, FormsModule, CommonModule, TooltipComponent, SanitizeHtmlPipe, BlockUiDirective]
})
export class WrongScoreInfoComponent implements OnInit {
  @Input() index: number;
  @Input() matchId: number;
  @Input() filter: FilterModel;
  @Input() isEdit: boolean;
  @Input() requestId: number;
  @Input() isVoided: boolean;
  @Input() isCollapse: boolean;
  @Input() filterBy: number;
  @Input() originWrongScoreModels: WrongScoreModel[];
  @Input() wrongScoreModel = new WrongScoreModel();
  @Input() primitiveProps = new PrimitiveProperty();
  @Input() selectedWrongScores: WrongScoreModel[];

  @Output() checkScoreEvent = new EventEmitter();
  @Output() updateByOriginWrongScoreModelEvent = new EventEmitter<WrongScoreModel[]>();
  @ViewChild('fromTimeComponent') fromTimeComponent: DateFullTimeNewComponent;
  @ViewChild('toTimeComponent') toTimeComponent: DateFullTimeNewComponent;

  maxDate: NgbDate;
  isBlock: boolean;
  tooltip = new Tooltip();
  private readonly element = inject(ElementRef);
  private readonly logInfoService = inject(LogInfoService);
  private readonly validationService = inject(ValidationService);
  private readonly wrongScoreService = inject(WrongScoreService);
  private readonly modalService = inject(ModalService);

  constructor() {
    this.tooltip.element = this.element;
  }

  async ngOnInit(): Promise<void> {
    this.initData();
  }

  public initData(): void {
    const currentMoment = moment.utc().tz('America/Caracas');
    const maxDateMoment = currentMoment.add(1, 'day');
    this.maxDate = new NgbDate(maxDateMoment.year(), maxDateMoment.month() + 1, maxDateMoment.date());
    this.isCollapse = !this.isEdit;
  }

  async onchangeCheckbox(isChecked: boolean): Promise<void> {
    if (isChecked) {
      await this.handleCheckedScore();
    } else {
      await this.handleUnCheckedScore();
    }

    this.isCollapse = !isChecked;
  }

  private async handleCheckedScore(): Promise<void> {
    this.checkScoreEvent.emit();
    if (this.validationService.isLastScore(this.wrongScoreModel, this.originWrongScoreModels)) {
      this.isBlock = true;
      await this.wrongScoreService.handleCheckedLastScore(this.originWrongScoreModels, this.wrongScoreModel,
        this.updateByOriginWrongScoreModelEvent, this.matchId, Number(this.filter.action), this.filterBy);
      this.isBlock = false;
    }
    await this.refreshLogInfo();
  }

  private async handleUnCheckedScore(): Promise<void> {
    this.checkScoreEvent.emit();
    this.wrongScoreService.setNullAllowanceTime(this.wrongScoreModel);
    this.logInfoService.clearDataValidation([this.wrongScoreModel], [], null);
    const originWrongScoreModel = this.originWrongScoreModels.find(x => x.scoreId === this.wrongScoreModel.scoreId);
    if (this.validationService.isLastScore(this.wrongScoreModel, this.originWrongScoreModels)) {
      this.wrongScoreModel.filterFromTransTime = originWrongScoreModel.filterFromTransTime;
      this.wrongScoreModel.filterToTransTime = null;
    } else {
      this.wrongScoreModel.filterFromTransTime = originWrongScoreModel.filterFromTransTime;
      this.wrongScoreModel.filterToTransTime = originWrongScoreModel.filterToTransTime;
    }
  }

  async refreshLogInfo(): Promise<void> {
    this.logInfoService.clearDataValidation([this.wrongScoreModel], [], null);
    if (!this.isValidDateTime()) {
      return;
    }
    if (!this.selectedWrongScores.find(x => x.scoreId === this.wrongScoreModel.scoreId)) {
      this.selectedWrongScores.push(this.wrongScoreModel);
    }
    this.isBlock = true;
    await this.logInfoService.getLogInfo(this.createGetLogInfoParams());
    this.isBlock = false;
    this.isCollapse = false;
  }

  createGetLogInfoParams(): GetLogInfoParams {
    return {
      isEdit: this.isEdit,
      requestId: this.requestId,
      filter: this.filter,
      primitiveProps: this.primitiveProps,
      wrongScoreModels: this.selectedWrongScores
    };
  }

  public isValidDateTime(): boolean {
    return this.fromTimeComponent.validateWithTooltip()
      && this.validationService.isValidToDateTime(this.toTimeComponent, this.wrongScoreModel)
      && this.validationService.isFromTimeSameOrBeforeToTime(this.wrongScoreModel.filterFromTransTime, this.wrongScoreModel.filterToTransTime, this.tooltip)
      && this.validationService.isFromTimeSameOrAfterDefaultValue(this.wrongScoreModel, this.originWrongScoreModels, this.tooltip)
      && this.validationService.isToTimeSmallerThanFromTimeNextScore(this.index, this.wrongScoreModel, this.originWrongScoreModels, this.tooltip);
  }

  public getDurationTime(): string {
    if (!this.fromTimeComponent?.isTimeValid() || !this.toTimeComponent?.isTimeValid()) {
      return '-';
    }

    return this.wrongScoreService.getDurationTime(this.wrongScoreModel.filterFromTransTime, this.wrongScoreModel.filterToTransTime);
  }

  /* istanbul ignore next */
  public openPopupTransIds(requestId: number, transIds: string): void {
    StaticService.openPopupTransIds(requestId, transIds, this.modalService);
  }

  /* istanbul ignore next */
  public displayFullDateTimeFormat(time: Date): string {
    return moment(time).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
  }

  /* istanbul ignore next */
  public clearDataValidation(): void {
    this.logInfoService.clearDataValidation([this.wrongScoreModel], [], null);
  }

  /* istanbul ignore next */
  public setNullAllowanceTime(): void {
    this.wrongScoreService.setNullAllowanceTime(this.wrongScoreModel);
  }

  /* istanbul ignore next */
  public isShowLogInfo(): boolean {
    return this.wrongScoreModel.logInfoDetail !== null || this.wrongScoreModel.messageValidationLogInfo?.length > 0;
  }

  /* istanbul ignore next */
  public isShowLabel(): boolean {
    return this.index === 0;
  }

  public isShowWarningSpecialBetType(): boolean {
    const momentVoidFromTime = moment(this.wrongScoreModel.logInfoDetail.voidFromTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
    const momentFilterFromTransTime = moment(this.wrongScoreModel.filterFromTransTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
    if (momentVoidFromTime.isBefore(momentFilterFromTransTime)) {
      return true;
    }

    return false;
  }

  isShowCountInfo(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.isShowCountInfo(cashOutCount, settleCount, instantlySettleCount);
  }

  countInfoContent(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.countInfoContent(cashOutCount, settleCount, instantlySettleCount);
  }
}
