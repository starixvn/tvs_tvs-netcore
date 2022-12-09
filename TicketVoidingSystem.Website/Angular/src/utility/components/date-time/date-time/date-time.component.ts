import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TimeModel } from './time.model';

import * as _ from 'lodash';

@Component({
  selector: 'date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss']
})
export class DateTimeComponent implements OnInit {
  @Input() model = new TimeModel(new Date());
  @Input() disabled: boolean;
  @Output() modelChange = new EventEmitter<TimeModel>();

  ngOnInit() {
    if (_.isNaN(this.model.hour)) {
      this.model = new TimeModel(new Date());
    }
  }

  updateModel() {
    this.modelChange.emit(this.model);
  }
}
