import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import moment from 'moment-timezone';
import { TooltipComponent } from 'src/utility/components/tooltip/tooltip.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { DateTimeFormat, TvDetectionType } from '../../../../../utility/constants/config';
import { TvDetectionModel } from './tv-detection.model';
import { TvDetectionService } from './tv-detection.service';

@Component({
  selector: 'tv-detection',
  templateUrl: './tv-detection.component.html',
  styleUrls: ['./tv-detection.component.scss'],
  standalone: true,
  imports: [FormsModule, TooltipComponent, CommonModule]
})
export class TvDetectionComponent implements OnInit {
  @Input() disabled: boolean;
  @Input() isEdit: boolean;
  @Input() model = new TvDetectionModel();
  @Output() actualTimeChange = new EventEmitter<string>();
  tooltip = new Tooltip();
  isCheckedTvDetection: boolean;
  private readonly element = inject(ElementRef);
  private readonly tvDetectionService = inject(TvDetectionService);

  constructor() {
    this.tooltip.element = this.element;
  }

  ngOnInit(): void {
    this.isCheckedTvDetection = this.model.tvDetectionValue === TvDetectionType.SLOW || this.model.tvDetectionValue === TvDetectionType.FAST;
    if (this.model.tvDetectionValue !== TvDetectionType.SLOW && this.model.tvDetectionValue !== TvDetectionType.FAST) {
      this.initDefaultValues();
    }
  }

  changeTvDetection(isChecked: boolean) {
    this.model.tvDetectionValue = isChecked ? TvDetectionType.SLOW : TvDetectionType.NONE;
  }

  initDefaultValues() {
    const currentMoment = moment.utc().tz('America/Caracas');
    this.model.serviceAcceptTime = currentMoment.format(DateTimeFormat.SIMPLE_TIME_FORMAT);
    this.model.actualTime = currentMoment.format(DateTimeFormat.SIMPLE_TIME_FORMAT);
    this.model.tvDetectionValue = TvDetectionType.NONE;
    this.model.minuteOffset = '0';
    this.model.secondOffset = '0';
    this.isCheckedTvDetection = false;
  }

  changeMinuteInput() {
    if (this.tvDetectionService.isValidityMinute(this.model.minuteOffset, this.tooltip)) {
      this.updateActualTime();
    }
  }

  changeSecondInput() {
    if (this.tvDetectionService.isValiditySecond(this.model.secondOffset, this.tooltip)) {
      this.updateActualTime();
    }
  }

  changeTimeInput(time: string, className: string) {
    if (this.tvDetectionService.isValidityTime(time, className, this.tooltip)) {
      this.updateActualTime();
    }
  }

  isValidality(): boolean {
    return this.tvDetectionService.isValidality(this.model, this.tooltip);
  }

  updateActualTime() {
    const actualTime = this.tvDetectionService.getActualTime(this.model, this.tooltip);
    if (moment(actualTime, DateTimeFormat.SIMPLE_TIME_FORMAT).isValid()) {
      this.actualTimeChange.emit(actualTime);
    }
  }
}
