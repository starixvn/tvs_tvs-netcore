import { Injectable } from '@angular/core';
import { PrimaryBetType } from "../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model";
import { SummaryItem } from './summary.model';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  initSummaryItem(name: string, total: number, isChinaView: boolean, licenseeName: string, betTypes: string, items: SummaryItem[], betTypeName: string, specialPlatform: number) { // NOSONAR
    const summaryItem = new SummaryItem();
    summaryItem.name = name;
    summaryItem.total = total;
    summaryItem.isChinaView = isChinaView;
    summaryItem.licenseeName = licenseeName;
    summaryItem.betTypeName = licenseeName === name ? betTypeName : name;
    summaryItem.betTypes = this.addSecondaryBetType(betTypes);
    this.renderItems(summaryItem, items);
    summaryItem.isGroup = items.length > 0;
    summaryItem.isChecked = items.length > 0;
    summaryItem.isShow = true;
    summaryItem.specialPlatform = specialPlatform;

    return summaryItem;
  }

  private addSecondaryBetType(betTypes: string): string {
    if (betTypes === undefined || betTypes === null) {
      return '';
    }
    const ids = betTypes.split(',');
    const result = [];
    ids.forEach(id => {
      const value = PrimaryBetType.ROOT[id] === undefined ? id.toString() : PrimaryBetType.ROOT[id];
      result.push(value);
    });

    return result.length > 0 ? result.join(',') : '';
  }

  private renderItems(baseSummaryItem: SummaryItem, items: SummaryItem[]) {
    baseSummaryItem.items.length = 0;
    items.forEach(item => {
      baseSummaryItem.items.push(this.initSummaryItem(item.name, item.total, item.isChinaView, item.licenseeName, item.betTypes, [], baseSummaryItem.betTypeName, item.specialPlatform));
    });
  }
}
