import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import clone from 'lodash/clone';
import isNull from 'lodash/isNull';
import moment from 'moment-timezone';
import { BlockUiDirective } from '../../../utility/components/block-ui/block-ui.directive';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { TooltipComponent } from '../../../utility/components/tooltip/tooltip.component';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { AcceptType, DateTimeFormat } from '../../../utility/constants/config';
import { TEXT } from '../../../utility/constants/text';
import { SubIssueType } from '../../../utility/models/issue-type.model';
import { SanitizeHtmlPipe } from '../../../utility/modules/sanitize-html.pipe';
import { StaticService } from '../../../utility/services/static.service';
import { FilterTimeWithAllowanceComponent } from '../../events/red-card/app/event-red-card/filter-time-with-allowance/filter-time-with-allowance.component';
import { FilterTimeWithAllowance } from '../../events/red-card/app/event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { FilterModel } from '../filter/filter.model';
import { SubIssueTypeDialogComponent } from '../filter/sub-issue-type-dialog/sub-issue-type-dialog.component';
import { SubIssueTypeDialogModel } from '../filter/sub-issue-type-dialog/sub-issue-type-dialog.model';
import { LogInfoRelatedEvent } from './log-info-related-event.model';
import { LogInfoRelatedEventService } from './log-info-related-event.service';
import { PrimitiveProperty } from './primitive-property.model';

@Component({
  standalone: true,
  selector: 'log-info-related-event',
  templateUrl: './log-info-related-event.component.html',
  styleUrls: ['./log-info-related-event.component.scss'],
  imports: [CommonModule, FormsModule, TooltipComponent, SubIssueTypeDialogComponent,
    FilterTimeWithAllowanceComponent, BlockUiDirective, SanitizeHtmlPipe],
  providers: [LogInfoRelatedEventService]
})
export class LogInfoRelatedEventComponent {
  @Input() isEdit: boolean;
  @Input() requestId: number;
  @Input() isMainMatch: boolean;
  @Input() isDisabled: boolean;
  @Input() filter: FilterModel;
  @Input() filterBy: number;
  @Input() transInfoAddRequestModel: TransInfoAddRequestModel;
  @Input() subIssueTypes: SubIssueType[] = [];
  @Input() logInfo: LogInfoRelatedEvent;
  @Input() defaultFilterTimeWithAllowance = new FilterTimeWithAllowance();
  @Output() deleteEvent = new EventEmitter<number>();
  @Output() clearInfoSiteDBDownModel = new EventEmitter<void>();
  @ViewChild('filterTimeWithAllowance') filterTimeWithAllowanceComponent: FilterTimeWithAllowanceComponent;

  isBlock = false;
  isCollapse: boolean;
  isShowValidation = true;
  subIssueTypeDialogModel = new SubIssueTypeDialogModel();
  tooltipVarMessage = TEXT.SELECTED_VAR_OPTIONS;
  acceptTypeName = "";
  tooltip = new Tooltip();

  private readonly element = inject(ElementRef);
  private readonly modalService = inject(ModalService);
  private readonly logInfoRelatedEventService = inject(LogInfoRelatedEventService);

  constructor() {
    this.tooltip.element = this.element;
  }

  showTooltipSubType() {
    this.tooltip.display('btn-select-sub-type', TEXT.REQUIRED_SUB_TYPE);
  }

  async refreshLogInfo(): Promise<void> {
    this.hideValidationDetail();
    this.clearDataValidation();
    if (!this.logInfo.subIssueTypeId) {
      this.showTooltipSubType();
      return;
    }

    if (this.filterTimeWithAllowanceComponent.isValid()) {
      this.isBlock = true;
      const primitiveProperty = { filterBy: this.filterBy, transInfoAddRequestModel: this.transInfoAddRequestModel } as PrimitiveProperty;
      await this.logInfoRelatedEventService.refreshLogInfoForRelatedEvent(this.isEdit, this.requestId, this.filter, primitiveProperty, this.logInfo, this.defaultFilterTimeWithAllowance);
      this.filterTimeWithAllowanceComponent.updateData();
      this.showValidationDetail();
    }

    this.isBlock = false;
  }

  private clearDataValidation(): void {
    this.logInfo.logInfoDetail = null;
    this.logInfo.messageValidationLogInfo = null;
  }

  hideValidationDetail() {
    if (this.logInfo?.logInfoDetail) {
      this.logInfo.logInfoDetail.isHasWarningRangeTime = false;
    }

    this.isShowValidation = false;
    this.clearInfoSiteDBDownModel.emit();
  }

  showValidationDetail() {
    this.isShowValidation = true;
  }

  updateDataAfterClosed(subIssueTypeId: number): void {
    this.logInfo.subIssueTypeId = subIssueTypeId;
    this.logInfo.isCheckedVar = null;
    this.logInfo.isHighLightVarCheck = null;
    this.logInfo.voidTimeArea.aaTime = this.subIssueTypeDialogModel.allowanceTime.aaTime;
    this.logInfo.voidTimeArea.paTime = this.subIssueTypeDialogModel.allowanceTime.paTime;
    this.logInfo.voidTimeArea.saTime = this.subIssueTypeDialogModel.allowanceTime.saTime;
    this.hideValidationDetail();
  }

  openDialog(): void {
    this.subIssueTypeDialogModel.isOpen = true;
    this.subIssueTypeDialogModel.issueTypeId = this.filter.issueTypeId;
    this.subIssueTypeDialogModel = clone(this.subIssueTypeDialogModel);
  }

  handleDeleteEvent(matchId: number) {
    this.deleteEvent.emit(matchId);
  }

  getSubIssueTypeName(): string {
    const defaultText = 'Select Sub Type';
    if (this.logInfo.subIssueTypeId) {
      return this.subIssueTypes.find(x => x.subIssueTypeId === this.logInfo.subIssueTypeId).subIssueTypeName;
    }

    return defaultText;
  }

  getHighlightMinTimeClass(minTime?: Date): string {
    if (minTime && this.logInfo.logInfoDetail.highlightAcceptType) {
      switch (this.logInfo.logInfoDetail.highlightAcceptType) {
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

  openPopupTransIds(requestId: number, transIds: string): void {
    StaticService.openPopupTransIds(requestId, transIds, this.modalService);
  }

  isShowCountInfo(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.isShowCountInfo(cashOutCount, settleCount, instantlySettleCount);
  }

  countInfoContent(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.countInfoContent(cashOutCount, settleCount, instantlySettleCount);
  }

  displayMinTime(minTime?: Date): string {
    if (isNull(minTime)) {
      return '-';
    }
    return (this.acceptTypeName) ? `${moment(minTime).format(DateTimeFormat.TIME_FORMAT)} - ${this.acceptTypeName}` :
      `${moment(minTime).format(DateTimeFormat.TIME_FORMAT)}`;
  }

  isShowVarCheck() {
    return this.logInfo.subIssueTypeId && StaticService.isShowVarCheck(this.logInfo.subIssueTypeId) && !this.logInfo.isMainMatch;
  }

  changeVarCheckValue(isVarChecked: boolean): void {
    this.logInfo.isCheckedVar = isVarChecked;
    this.logInfo.isHighLightVarCheck = false;
  }

  public getDurationTime(): string {
    const fromTimeFilter = moment(this.defaultFilterTimeWithAllowance.fromDateTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
    const toTimeLogInfo = moment(this.logInfo.logInfoDetail.transVoidToTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);

    return StaticService.getDurations(fromTimeFilter, toTimeLogInfo);
  }

  isShowMessageRangeVoidTime() {
    return this.logInfo.logInfoDetail?.isHasWarningRangeTime && this.isDangerAccepted();
  }

  isDangerAccepted(): boolean {
    return StaticService.isDangerAccepted(this.filter.issueTypeId);
  }
}
