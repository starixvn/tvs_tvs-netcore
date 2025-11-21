import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, Output, EventEmitter, SimpleChange } from '@angular/core';
import { PagingModel } from '../../../utility/components/paging/paging.model';
import { PagingComponent } from '../../../utility/components/paging/paging.component';
import { SanitizeHtmlPipe } from '../../../utility/modules/sanitize-html.pipe';
import { RemarkModel } from '../models/remark.model';

@Component({
  standalone: true,
  selector: 'remark-list',
  templateUrl: './remark-list.component.html',
  styleUrl: './remark-list.component.scss',
  imports: [CommonModule, PagingComponent, SanitizeHtmlPipe]
})
export class RemarkListComponent implements OnChanges {
  @Input() remarks: RemarkModel[] = [];
  @Output() exportExcelEvent = new EventEmitter<boolean>();
  @Output() editRemark = new EventEmitter<number>();
  @Output() deleteRemarkEvent = new EventEmitter<number>();

  displayedModels: RemarkModel[] = [];
  paging = new PagingModel();

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes['remarks']) {
      this.paging.total = this.remarks?.length;
      this.filterDisplayRemarks();
    }
  }

  exportExcel() {
    this.exportExcelEvent.emit();
  }

  pagingEvent() {
    this.filterDisplayRemarks();
  }

  filterDisplayRemarks() {
    this.displayedModels = this.remarks?.slice(this.paging.begin - 1, this.paging.end);
  }

  remarkListTrackByFn(__: number, item: RemarkModel) {
    return item.remarkId;
  }

  isSettlementHT(settlementStatus: string): boolean {
    return settlementStatus.charAt(0).toUpperCase() === 'H' ? true : false;
  }

  deleteRemark(remarkId: number) {
    this.deleteRemarkEvent.emit(remarkId);
  }

  openEditRemark(remarkId: number) {
    this.editRemark.emit(remarkId);
  }
}
