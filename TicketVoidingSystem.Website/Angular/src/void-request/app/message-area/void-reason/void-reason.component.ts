import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { VoidedReason } from '../../../../utility/models/reason.model';

@Component({
  selector: 'void-reason',
  templateUrl: './void-reason.component.html',
  styleUrls: ['./void-reason.component.scss']
})
export class VoidReasonComponent implements OnChanges {
  @Input('voidReason') voidReason: VoidedReason;
  @Input() enableCollapse = false;
  @Input() isCollapse = false;
  @Input() disabled = false;
  initialReason: VoidedReason;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['voidReason']) {
      this.initialReason = this.initialReason ?? _.cloneDeep(this.voidReason);
    }
  }
}
