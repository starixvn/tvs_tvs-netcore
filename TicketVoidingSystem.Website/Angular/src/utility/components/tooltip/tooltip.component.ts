import { Component, HostListener, Input } from '@angular/core';
import { Tooltip } from './tooltip.model';

@Component({
  selector: 'tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent {
  @Input() tooltip: Tooltip;
  @HostListener('document:mousedown')
  onClick() {
    this.tooltip.show = false;
  }
}
