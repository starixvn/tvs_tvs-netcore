import { Component, Input, OnInit } from '@angular/core';
import { VoidedReason } from '../../../../utility/models/reason.model';

@Component({
  selector: 'void-reason',
  templateUrl: './void-reason.component.html',
  styleUrls: ['./void-reason.component.scss']
})
export class VoidReasonComponent implements OnInit {
  @Input('voidReason') voidReason: VoidedReason;

  constructor() { }
  ngOnInit(): void {
  }
}
