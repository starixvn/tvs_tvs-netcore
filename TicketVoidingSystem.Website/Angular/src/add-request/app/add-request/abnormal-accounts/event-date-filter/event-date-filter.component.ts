import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment-timezone';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { LABELS } from '../../../../../utility/constants/labels';
import { StaticService } from '../../../../../utility/services/static.service';
import { AbnormalAccountModel } from '../../models/abnormal-account.model';

@Component({
  selector: 'event-date-filter',
  templateUrl: './event-date-filter.component.html',
  styleUrls: ['./event-date-filter.component.scss']
})
export class EventDateFilterComponent implements OnInit {
  @Input() isDisabled: boolean;
  @Input() abnormalAccountModel: AbnormalAccountModel;
  @Input() isEdit: boolean;
  @Output() changeFilterEvent = new EventEmitter();

  fromDate: NgbDate;
  toDate: NgbDate;
  minDate: NgbDateStruct;
  tooltip = new Tooltip();

  private readonly TO_DATE_CLASS = 'to-date';

  constructor(
    private readonly element: ElementRef
  ) {
    this.tooltip.element = this.element;
   }

  ngOnInit(): void {
    this.initEventDate();
  }

  async initEventDate() {
    const currentMoment = moment.utc().tz('America/Caracas');

    if (this.isEdit) {
      const momentFromDate = moment(this.abnormalAccountModel.fromDate, DateTimeFormat.DATE_FORMAT);
      this.fromDate = new NgbDate(momentFromDate.year(), momentFromDate.month() + 1, momentFromDate.date());
      const momentToDate = moment(this.abnormalAccountModel.toDate, DateTimeFormat.DATE_FORMAT);
      this.toDate = new NgbDate(momentToDate.year(), momentToDate.month() + 1, momentToDate.date());
    } else {
      this.fromDate = new NgbDate(currentMoment.year(), currentMoment.month() + 1, currentMoment.date());
      this.toDate = new NgbDate(currentMoment.year(), currentMoment.month() + 1, currentMoment.date());
    }

    const currentDate = new Date(currentMoment.utc(true).toDate());
    const minDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
    this.minDate = { year: minDate.getFullYear(), month: minDate.getMonth() + 1, day: minDate.getDate()};
  }

  isValidEventDate(): boolean {
    const fromDateMoment = moment(`${StaticService.convertToFullDate(this.fromDate)}`, DateTimeFormat.DATE_FORMAT, true);
    const toDate = !isNaN(this.toDate?.year) ? `${StaticService.convertToFullDate(this.toDate)}` : String(this.toDate);
    const toDateMoment = moment(toDate, DateTimeFormat.DATE_FORMAT, true);

    if (fromDateMoment.isSameOrBefore(toDateMoment) || !this.toDate) {
      this.abnormalAccountModel.fromDate = fromDateMoment.format(DateTimeFormat.DATE_FORMAT);
      this.abnormalAccountModel.toDate = toDateMoment.format(DateTimeFormat.DATE_FORMAT);

      return true;
    }

    this.tooltip.display(this.TO_DATE_CLASS, LABELS.INVALID_TO_DATE);
    return false;
  }

  changeFilter(): void {
    this.changeFilterEvent.emit();
  }
}
