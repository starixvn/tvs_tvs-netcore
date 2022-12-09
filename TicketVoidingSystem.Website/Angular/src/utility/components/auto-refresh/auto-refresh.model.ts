import { Selection } from '../../../utility/models/selection.model';

export class RefreshTime {
  value = '60';
  items: Selection[] = [
    { name: 'Not refresh', value: '0' },
    { name: '60s', value: '60' },
    { name: '90s', value: '90' },
    { name: '120s', value: '120' },
    { name: '180s', value: '180' }
  ];
}

export class AutoRefreshMode {
  static readonly START_OVER = 1;
  static readonly STOP = 2;
}