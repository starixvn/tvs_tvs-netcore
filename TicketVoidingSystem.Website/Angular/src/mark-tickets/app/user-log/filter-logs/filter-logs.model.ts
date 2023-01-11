import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Selection } from '../../../../utility/models/selection.model';

export class FilterAction {
  items: Selection[] = [
    { name: 'Mark(Manual)', value: '90500', group: 'All' },
    { name: 'Mark(Auto)', value: '90508', group: 'All' },
    { name: 'Unmark(Manual)', value: '90501', group: 'All' },
    { name: 'Unmark(Auto)', value: '90511', group: 'All' },
    { name: 'Unmark All', value: '90502', group: 'All' }
  ];
}

export class FilterDate {
  ngbFromDate: NgbDate;
  ngbToDate: NgbDate;
  get fromDate(): string {
    return `${this.ngbFromDate.year}/${this.ngbFromDate.month}/${this.ngbFromDate.day}`;
  }
  get toDate(): string {
    return `${this.ngbToDate.year}/${this.ngbToDate.month}/${this.ngbToDate.day}`;
  }
}
