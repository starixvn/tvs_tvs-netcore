import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as _ from 'lodash';
import { ClipboardService } from 'ngx-clipboard';
import { SpecialPlatform } from '../../../utility/constants/special-platform.constant';
import { SummaryItem } from './summary.model';

@Component({
  standalone: true,
  selector: 'summary-tickets',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  imports: [CommonModule, FormsModule],
  providers: [ClipboardService]
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
  jollyViewLicensees = '';
  jollySportCvLicensees = '';
  negativeBalanceUsers = '';
  totalBetCountOfCredit = 0;
  totalBetCountOfNormalLicensee = 0;
  totalBetCountOfChinaView = 0;
  totalBetCountOfJollySport = 0;
  totalBetCountOfJollySportCV = 0;
  totalLicenseeCountOfNormal = 0;
  totalLicenseeCountOfChinaView = 0
  totalLicenseeCountOfJollySport = 0;
  totalLicenseeCountOfJollySportCV = 0;

  clipboardService = inject(ClipboardService);

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
    this.checkedAll = this.items.every(item => item.isChecked);
    this.isShowSend = this.items.some(item => item.isChecked);
    this.updateAffectedLicensees();
  }

  updateAffectedLicensees() {
    const model = Number(this.groupBy) === 0 ? this.items : this.itemsGroupByLicensee;
    this.affectedLicensees = model
      .filter(x => x.isChecked && x.name !== 'Credit' && !x.isChinaView && x.specialPlatform !== SpecialPlatform.JOLLY_SPORTS && x.specialPlatform !== SpecialPlatform.JOLLY_SPORTS_CV)
      .map(x => x.licenseeName)
      .join(', ');

    this.chinaViewLicensees = model
      .filter(x => x.isChecked && x.isChinaView)
      .map(x => x.licenseeName)
      .join(', ');

    this.jollyViewLicensees = model
      .filter(x => x.isChecked && x.specialPlatform === SpecialPlatform.JOLLY_SPORTS)
      .map(x => x.licenseeName)
      .join(', ');

      this.jollySportCvLicensees = model
      .filter(x => x.isChecked && x.specialPlatform === SpecialPlatform.JOLLY_SPORTS_CV)
      .map(x => x.licenseeName)
      .join(', ');
  }

  updateTotalBetCount() {
    const creditGroups = _.filter(this.itemsGroupByLicensee, { name: 'Credit' });
    this.totalBetCountOfCredit = _.sumBy(creditGroups, 'total');

    const normalLicenseeGroups = _.reject(this.itemsGroupByLicensee, function (o) {
      return o.name === 'Credit' || o.isChinaView || o.specialPlatform === SpecialPlatform.JOLLY_SPORTS || o.specialPlatform === SpecialPlatform.JOLLY_SPORTS_CV;
    });
    this.totalBetCountOfNormalLicensee = _.sumBy(normalLicenseeGroups, 'total');
    this.totalLicenseeCountOfNormal = normalLicenseeGroups.length;

    const chinaViewGroups = _.filter(this.itemsGroupByLicensee, { isChinaView: true });
    this.totalBetCountOfChinaView = _.sumBy(chinaViewGroups, 'total');
    this.totalLicenseeCountOfChinaView = chinaViewGroups.length;

    const jollySportGroups = _.filter(this.itemsGroupByLicensee, { specialPlatform: 2 });
    this.totalBetCountOfJollySport = _.sumBy(jollySportGroups, 'total');
    this.totalLicenseeCountOfJollySport = jollySportGroups.length;

    const jollySportCVGroups = _.filter(this.itemsGroupByLicensee, { specialPlatform: 3 });
    this.totalBetCountOfJollySportCV = _.sumBy(jollySportCVGroups, 'total');
    this.totalLicenseeCountOfJollySportCV = jollySportCVGroups.length;
  }

  sendExcelFile() {
    const selectedItems = this.items.filter(item => item.isChecked && item.name !== 'Credit');

    if (selectedItems.length > 0) {
      this.sendExcelFileEvent.emit(selectedItems);
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
    return this.isShowSend && (this.affectedLicensees.length > 0
      || this.chinaViewLicensees.length > 0
      || this.jollyViewLicensees.length > 0
      || this.jollySportCvLicensees.length > 0);
  }
}
