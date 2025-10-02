export class SummaryItem {
  name: string;
  total: number;
  isChinaView: boolean;
  licenseeName: string;
  betTypeName: string;
  betTypes: string;
  items: SummaryItem[] = [];
  isGroup: boolean;
  isChecked: boolean;
  isShow: boolean;
  specialPlatform: number;
}

export class SummaryItemViewModel {
  groupByLicensees: Array<SummaryItem>;
  groupByBetTypes: Array<SummaryItem>;
}
