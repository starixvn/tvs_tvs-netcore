import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DataPermission } from '../models/result.model';

@Component({
  selector: 'tab-mark-ticket',
  templateUrl: './tab-mark-ticket.component.html',
  styleUrls: ['./tab-mark-ticket.component.scss']
})
export class TabMarkTicketComponent implements OnChanges {
  @Input() isExternalUrl: boolean;
  @Input() dataPermission = new DataPermission();
  @Output() changeTab = new EventEmitter<string>();
  
  currentTab = '0';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataPermission']) {
      this.initializeCurrentTab(this.dataPermission);
    }
  }

  private initializeCurrentTab(permission: DataPermission): void {
    if (this.isExternalUrl) {
      this.setTabPage('1');
    } else {
      if (permission.isReadMarkTickets) {
        this.setTabPage('0');
      } else {
        this.setTabPage(null);
      }
    }
  }

  setTabPage(value: string) {
    this.changeTab.emit(value);
    this.currentTab = value;
  }
}
