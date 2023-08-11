import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LinkedLogsViewModel } from './linked-log.model';

@Component({
  selector: 'linked-log',
  templateUrl: './linked-log.component.html',
  styleUrls: ['./linked-log.component.scss']
})
export class LinkedLogComponent implements OnChanges {
  @Input() linkedLogsViewModel = new LinkedLogsViewModel();
  isCollapse: boolean;
  title = '';

  ngOnChanges(changes: SimpleChanges): void {
     if (changes['linkedLogsViewModel']) {
      if (this.linkedLogsViewModel.poolHouseLinkedLogsData.every(x => !x.isShow)) {
        this.title = this.linkedLogsViewModel.poolHouseLinkedLogsData.map(x => x.groupName).join(' & ');
      } else {
        this.title = this.linkedLogsViewModel.poolHouseLinkedLogsData.filter(x => x.isShow).map(x => x.groupName).join(' & ');
      }
    }
  }

  public isShowTitle(): boolean {
    return this.linkedLogsViewModel.poolHouseLinkedLogsData.some(x => x.isShow);
  }
}
