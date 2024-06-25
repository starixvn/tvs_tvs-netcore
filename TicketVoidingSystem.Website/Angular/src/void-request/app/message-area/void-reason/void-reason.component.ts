import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VoidedReason } from '../../../../utility/models/reason.model';

@Component({
  selector: 'void-reason',
  templateUrl: './void-reason.component.html',
  styleUrls: ['./void-reason.component.scss']
})
export class VoidReasonComponent implements OnInit {
  @Input('voidReason') voidReason: VoidedReason;
  @Output() voidReasonChange = new EventEmitter();

  constructor() { }
  ngOnInit(): void {
  }

  changeReason() {
    this.voidReasonChange.emit(this.voidReason);
  }
}
