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
  initialReason: VoidedReason;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['voidReason']) {
      this.initialReason = this.initialReason ?? _.cloneDeep(this.voidReason);
    }
  }
}
