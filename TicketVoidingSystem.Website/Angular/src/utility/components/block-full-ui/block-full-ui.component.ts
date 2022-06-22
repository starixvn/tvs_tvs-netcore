import { Component, Input } from '@angular/core';

@Component({
  selector: 'block-full-ui',
  templateUrl: './block-full-ui.component.html',
  styleUrls: ['./block-full-ui.component.scss']
})
export class BlockFullUiComponent {
  @Input() isBlock: boolean;
}
