import { PrimaryBetType } from '../../../utility/modules/advanced-mode/group-bettypes/group-bettypes.model';

export class SummaryItem {
  name: string;
  total: number;
  isChinaView: boolean;
  licenseeName: string;
  betTypeName: string;
  betTypes: string;
  items: SummaryItem[];
  isGroup: boolean;
  isChecked: boolean;
  isShow: boolean;

  constructor(name: string, total: number, isChinaView: boolean, licenseeName: string, betTypes: string, items: SummaryItem[], betTypeName: string) {
    this.name = name;
    this.total = total;
    this.isChinaView = isChinaView;
    this.licenseeName = licenseeName;
    this.betTypeName = licenseeName === name ? betTypeName : name;
    this.betTypes = this.addSecondaryBetType(betTypes);
    this.renderItems(items);
    this.isGroup = items.length > 0;
    this.isChecked = items.length > 0;
    this.isShow = true;
  }

  addSecondaryBetType(betTypes: string): string {
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

  renderItems(items: SummaryItem[]) {
    this.items = [];
    items.forEach(item => {
      this.items.push(new SummaryItem(item.name, item.total, item.isChinaView, item.licenseeName, item.betTypes, [], this.betTypeName));
    });
  }
}

export class SummaryItemViewModel {
  groupByLicensees: Array<SummaryItem>;
  groupByBetTypes: Array<SummaryItem>;
}
