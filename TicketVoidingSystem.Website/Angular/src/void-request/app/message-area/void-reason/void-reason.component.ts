import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import cloneDeep from 'lodash/cloneDeep';
import { VoidedReason } from '../../../../utility/models/reason.model';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'void-reason',
  templateUrl: './void-reason.component.html',
  styleUrls: ['./void-reason.component.scss'],
  imports: [FormsModule]
})
export class VoidReasonComponent implements OnChanges {
  @Input('voidReason') voidReason: VoidedReason;
  @Input() enableCollapse = false;
  @Input() isCollapse = false;
  @Input() disabled = false;
  initialReason: VoidedReason;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['voidReason']) {
      this.initialReason = this.initialReason ?? cloneDeep(this.voidReason);
    }
  }
}
