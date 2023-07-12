import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { LABELS } from '../../../../../utility/constants/labels';
import { AllowanceTime } from '../../../../../utility/models/allowance-time.model';

@Component({
  selector: 'allowance-time',
  templateUrl: './allowance-time.component.html',
  styleUrls: ['./allowance-time.component.scss']
})
export class AllowanceTimeComponent {
  @Input() allowanceTime = new AllowanceTime();
  @Input() isDisabled: AllowanceTime;

  @Output() changeModel = new EventEmitter<AllowanceTime>();

  tooltip = new Tooltip();

  constructor(
    private readonly element: ElementRef,
  ) {
    this.tooltip.element = this.element;
   }
  
  emitModelChange(): void {
    this.changeModel.emit();
  }

  isValidAllowanceTime(): boolean {
    if ((this.allowanceTime.aaTime?.toString() || this.allowanceTime.paTime?.toString() || this.allowanceTime.saTime?.toString()) &&
    (!this.allowanceTime.aaTime?.toString() || !this.allowanceTime.paTime?.toString() || !this.allowanceTime.saTime?.toString())) {
      this.tooltip.display('allowance-time', LABELS.INVALID_SETTING_TIME);
      return false;
    }

    return true;
  }
}
