import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { InfoSiteDBDownModel } from './info-site-db-down.model';

@Component({
  selector: 'info-site-db-down',
  templateUrl: './info-site-db-down.component.html',
  styleUrl: './info-site-db-down.component.scss',
  standalone: true,
  imports: []
})
export class InfoSiteDBDownComponent implements OnChanges {
  @Input() infoSiteDBDownModel: InfoSiteDBDownModel;
  isSiteDBDown = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['infoSiteDBDownModel']) {
      this.isSiteDBDown = this.isHasAffectedTicket();
    }
  }

  isHasAffectedTicket(): boolean {
    if(!this.infoSiteDBDownModel) {
      return false;
    }
    
    return this.infoSiteDBDownModel.singleCount > 0 
    || this.infoSiteDBDownModel.parlayCount > 0 
    || this.infoSiteDBDownModel.cancelCashOutCount > 0
    || this.infoSiteDBDownModel.usernames?.length > 0;
  }
  
  affectedSiteInfo(): string {
    return this.infoSiteDBDownModel.usernames?.length > 0 ? this.affectedUserInfo() : this.affectedTicketInfo();
  }

  private affectedTicketInfo(): string {
    const affectedTickets = [];
    if (this.infoSiteDBDownModel.singleCount > 0) {
      affectedTickets.push(`Single Count: <strong>${this.infoSiteDBDownModel.singleCount}</strong>`);
    }

    if (this.infoSiteDBDownModel.parlayCount > 0) {
      affectedTickets.push(`Parlay Count: <strong>${this.infoSiteDBDownModel.parlayCount}</strong>`);
    }

    if (this.infoSiteDBDownModel.cancelCashOutCount > 0) {
      affectedTickets.push(`Cancel Cash Out Count: <strong>${this.infoSiteDBDownModel.cancelCashOutCount}</strong>`);
    }

    return `Affected ${affectedTickets.join(', ')}`;
  }

  private affectedUserInfo(): string {
    const contentShowUsernames = this.infoSiteDBDownModel.usernames.replaceAll(',', ', ');
    return `Username(s): <strong>${contentShowUsernames}</strong>`;
  }
}
