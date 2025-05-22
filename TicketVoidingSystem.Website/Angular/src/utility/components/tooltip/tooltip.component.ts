import { Component, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tooltip } from './tooltip.model';

@Component({
  standalone: true,
  selector: 'tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  imports: [CommonModule]
})
export class TooltipComponent {
  @Input() tooltip: Tooltip;
  @HostListener('document:mousedown')
  onClick() {
    this.tooltip.show = false;
  }
}
