import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LinkedLogsViewModel } from './linked-log.model';

@Component({
  selector: 'linked-log',
  templateUrl: './linked-log.component.html',
  styleUrls: ['./linked-log.component.scss']
})
export class LinkedLogComponent implements OnChanges {
  @Input() linkedLogsViewModel = new LinkedLogsViewModel();

  ngOnChanges(changes: SimpleChanges): void {
  }

}
