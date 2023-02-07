import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange } from '@angular/core';
import * as _ from 'lodash';
import { ClipboardService } from 'ngx-clipboard';
import { SummaryItem } from './summary.model';
@Component({
  selector: 'summary-tickets',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnChanges {
  @Input() items: SummaryItem[] = [];
  @Input() itemsGroupByLicensee: SummaryItem[] = [];
  @Input() display: boolean;
  @Input() showSendColumn: boolean;
  @Input() groupBy: number;
  @Output() getTicketsEvent = new EventEmitter<SummaryItem>();
  @Output() exportExcelEvent = new EventEmitter<SummaryItem>();
  @Output() sendExcelFileEvent = new EventEmitter<SummaryItem[]>();
  @Output() sendCreditToLetstalk = new EventEmitter<SummaryItem>();
  checkedAll = true;
  isShowSend = true;
  affectedLicensees = '';
  chinaViewLicensees = '';
  negativeBalanceUsers = '';
  totalLicensee = 0;
  totalBetCountOfCredit = 0;
  totalBetCountOfChinaView = 0;
  totalBetCountOfLicensee = 0;

  constructor(private readonly clipboardService: ClipboardService) { }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (this.display && changes['items'] && changes['itemsGroupByLicensee']) {
      this.updateAffectedLicensees();
      this.updateTotalBetCount();
    }
  }

  getWidth() {
    return this.showSendColumn ? '746px' : '607px';
  }

  getTicketsDetail(item: SummaryItem) {
    this.getTicketsEvent.emit(item);
  }

  exportExcel(item: SummaryItem) {
    this.exportExcelEvent.emit(item);
  }

  changedCheckAll() {
    this.items.forEach(item => {
      item.isChecked = this.checkedAll;
    });
    this.isShowSend = this.checkedAll;
    this.updateAffectedLicensees();
  }

  changedCheckItem() {
    this.checkedAll = true;
    this.isShowSend = false;
    for (const item of this.items) {
      if (item.isChecked) {
        this.isShowSend = true;
      } else {
        this.checkedAll = false;
      }
    }

    this.updateAffectedLicensees();
  }

  updateAffectedLicensees() {
    const model = Number(this.groupBy) === 0 ? this.items : this.itemsGroupByLicensee;
    this.affectedLicensees = model
      .filter(x => x.isChecked && x.name !== 'Credit' && !x.isChinaView)
      .map(x => x.licenseeName)
      .join(', ');

    this.chinaViewLicensees = model
      .filter(x => x.isChecked && x.isChinaView)
      .map(x => x.licenseeName)
      .join(', ');
  }

  updateTotalBetCount() {
    const creditGroups = _.filter(this.itemsGroupByLicensee, { name: 'Credit' });
    this.totalBetCountOfCredit = _.sumBy(creditGroups, 'total');

    const chinaViewGroups = _.filter(this.itemsGroupByLicensee, { isChinaView: true });
    this.totalBetCountOfChinaView = _.sumBy(chinaViewGroups, 'total');

    const licenseeGroups = _.reject(this.itemsGroupByLicensee, function (o) {
      return o.name === 'Credit' || o.isChinaView;
    });
    this.totalBetCountOfLicensee = _.sumBy(licenseeGroups, 'total');
    this.totalLicensee = this.itemsGroupByLicensee.filter(x => x.name !== 'Credit').length;
  }

  sendExcelFile() {
    const temp = [];
    this.items.forEach(item => {
      if (item.isChecked && item.name !== 'Credit') {
        temp.push(item);
      }
    });

    if (temp.length > 0) {
      this.sendExcelFileEvent.emit(temp);
    }
  }

  sendCreditDataToLetstalk(item: SummaryItem) {
    this.sendCreditToLetstalk.emit(item);
  }

  copyClipboard(text: string) {
    this.clipboardService.copyFromContent(text);
    alert('The Licensee list has been copied to clipboard.');
  }

  isShowAffectedLicensees(): boolean {
    return this.isShowSend && (this.affectedLicensees.length > 0 || this.chinaViewLicensees.length > 0);
  }
}
