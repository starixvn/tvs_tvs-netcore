import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TooltipComponent } from '../../../../../utility/components/tooltip/tooltip.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { TEXT } from '../../../../../utility/constants/text';
import { AllowanceTime } from '../../../../../utility/models/allowance-time.model';

@Component({
  standalone: true,
  selector: 'allowance-time',
  templateUrl: './allowance-time.component.html',
  styleUrls: ['./allowance-time.component.scss'],
  imports: [FormsModule, CommonModule, TooltipComponent]
})
export class AllowanceTimeComponent {
  @Input() aaTime: number;
  @Input() paTime: number;
  @Input() saTime: number;
  @Input() isDisabled: boolean;
  @Output() changeModel = new EventEmitter<AllowanceTime>();

  tooltip = new Tooltip();
  private readonly element = inject(ElementRef);

  constructor() {
    this.tooltip.element = this.element;
   }

  emitModelChange(): void {
    this.changeModel.emit();
  }

  isValidAllowanceTime(): boolean {
    if ((this.aaTime?.toString() || this.paTime?.toString() || this.saTime?.toString()) &&
    (!this.aaTime?.toString() || !this.paTime?.toString() || !this.saTime?.toString())) {
      this.tooltip.display('allowance-time', TEXT.INVALID_SETTING_TIME);
      return false;
    }

    return true;
  }
}
