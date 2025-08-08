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
  sumAffectedSingleCount = 0;
  sumAffectedParlayCount = 0;
  sumAffectedCCOCount = 0;
  sumAffectedUserNames = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['infoSiteDBDownModel']) {
      this.isSiteDBDown = this.affectedTicketOfSiteDBDown();
    }
  }

  private affectedTicketOfSiteDBDown(): boolean {
    if(!this.infoSiteDBDownModel){
      return false;
    }

    this.sumAffectedSingleCount = this.infoSiteDBDownModel.singleCount;
    this.sumAffectedParlayCount = this.infoSiteDBDownModel.parlayCount;
    this.sumAffectedCCOCount = this.infoSiteDBDownModel.cancelCashOutCount;
    this.sumAffectedUserNames = this.infoSiteDBDownModel.usernames;

    return true;
  }

  affectedSiteInfo(): string {
    return this.sumAffectedUserNames?.length > 0 ? this.affectedUserInfo() : this.affectedTicketInfo();
  }

  private affectedTicketInfo(): string {
    const affectedTickets = [];
    if(this.sumAffectedSingleCount > 0){
      affectedTickets.push(`Single Count: <strong>${this.sumAffectedSingleCount}</strong>`);
    }

    if(this.sumAffectedParlayCount > 0){
      affectedTickets.push(`Parlay Count: <strong>${this.sumAffectedParlayCount}</strong>`);
    }

    if(this.sumAffectedCCOCount > 0){
      affectedTickets.push(`Cancel Cash Out Count: <strong>${this.sumAffectedCCOCount}</strong>`);
    }

    return `Affected ${affectedTickets.join(', ')}`;
  }

  private affectedUserInfo(): string {
    return `Username(s): <strong>${this.sumAffectedUserNames}</strong>`;
  }
}
