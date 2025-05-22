import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'block-full-ui',
  templateUrl: './block-full-ui.component.html',
  styleUrls: ['./block-full-ui.component.scss'],
  imports: [CommonModule]
})
export class BlockFullUiComponent {
  @Input() isBlock: boolean;
}
