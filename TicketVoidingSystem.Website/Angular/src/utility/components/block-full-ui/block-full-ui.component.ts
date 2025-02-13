
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'block-full-ui',
  templateUrl: './block-full-ui.component.html',
  styleUrls: ['./block-full-ui.component.scss'],
  imports: []
})
export class BlockFullUiComponent {
  @Input() isBlock: boolean;
}
