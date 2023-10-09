import { Component, Input, Output, OnChanges, SimpleChange, EventEmitter, ElementRef } from '@angular/core';
import { PagingText, PagingCssClass } from './setting';
import { PagingModel, ItemPageList, PagingEvent } from './paging.model';

@Component({
    selector: 'paging',
    templateUrl: './paging.component.html',
    styleUrls: ['paging.component.scss']
})

export class PagingComponent implements OnChanges {
    @Input() pagingModel: PagingModel;
    @Output() changePagingEvent = new EventEmitter<PagingEvent>();
    pagingEvent = new PagingEvent();

    @Input() pageSizeOption: Array<number> = [PagingText.SIZE_ONE, PagingText.SIZE_TWO, PagingText.SIZE_THREE, PagingText.SIZE_FOUR];
    @Input() pageSizeSelected: number = PagingText.SIZE_DEFAULT >= PagingText.SIZE_FOUR ? PagingText.SIZE_FOUR : PagingText.SIZE_ONE;
    pageSizeList: Array<ItemPageList>;
    start: number;
    end: number;
    maxNumber: number;
    isShowGoToPage: boolean;
    leftPositionGotoPage: string;
    pageNumber: number;

    constructor(private element: ElementRef) {
    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        this.updateData();
    }

    updateData() {
        this.pageSizeList = [];
        this.updatePageSizeList();
        this.maxNumber = Math.ceil(this.pagingModel.totalItems / this.pagingModel.pageSize);
        this.start = this.pagingModel.pageSize * this.pagingModel.pageIndex + 1;
        this.end = this.pagingModel.pageSize * (this.pagingModel.pageIndex + 1);
        this.end = this.end < this.pagingModel.totalItems ? this.end : this.pagingModel.totalItems;
    }

    updatePageSizeList() {
        this.pushItemPageList(PagingText.PREVIOUS);
        this.renderPageSizeList();
        this.pushItemPageList(PagingText.NEXT);
    }

    renderPageSizeList() {
        const maxPage = Math.ceil(this.pagingModel.totalItems / this.pagingModel.pageSize);
        const current = this.pagingModel.pageIndex;
        const start = current > 2 ? Math.max(Math.min(current - 2, maxPage - 5), 0) : 0;
        const end = current > 2 ? Math.min(current + 3, maxPage) : Math.min(5, maxPage);
        if (start > 0) {
            const last = Math.min(3, start);
            for (let i = 0; i < last; i++) {
                this.pushItemPageList((i + 1).toString());
            }
            if (start > 3) {
                this.pushItemPageList(PagingText.GO_TO_PAGE);
            }
        }
        for (let i = start; i < end; i++) {
            this.pushItemPageList((i + 1).toString());
        }
        if (end < maxPage) {
            if (maxPage - 3 > end) {
                this.pushItemPageList(PagingText.GO_TO_PAGE);
            }
            const first = Math.max(maxPage - 3, end);
            for (let i = first; i < maxPage; i++) {
                this.pushItemPageList((i + 1).toString());
            }
        }
    }

    pushItemPageList(value: string) {
        const cssClass = value === (this.pagingModel.pageIndex + 1).toString() ? PagingCssClass.CURRENT :
            value === PagingText.GO_TO_PAGE ? PagingCssClass.GO_TO_PAGE :
                value === PagingText.NEXT ? PagingCssClass.NEXT :
                    value === PagingText.PREVIOUS ? PagingCssClass.PREVIOUS : PagingCssClass.NORMAL;
        const item = new ItemPageList(value, cssClass);
        this.pageSizeList.push(item);
    }

    clickSelect() {
        const maxPages = Math.ceil(this.pagingModel.totalItems / this.pageSizeSelected);
        this.pagingModel.pageIndex = this.pagingModel.pageIndex >= maxPages ?
            maxPages - 1 : this.pagingModel.pageIndex;
        this.pagingEvent.pageIndex = this.pagingModel.pageIndex;
        this.pagingEvent.pageSize = this.pageSizeSelected;
        this.actionPagingEvent();
    }

    handleWithPrevious() {
        if (this.pagingModel.pageIndex !== 0) {
            this.pagingEvent.pageIndex = this.pagingModel.pageIndex - 1;
            this.pagingEvent.pageSize = this.pagingModel.pageSize;
            this.actionPagingEvent();
        }
    }

    handleWithNext() {
        const maxPages = Math.ceil(this.pagingModel.totalItems / this.pagingModel.pageSize);
        if (this.pagingModel.pageIndex + 1 < maxPages) {
            this.pagingEvent.pageIndex = this.pagingModel.pageIndex + 1;
            this.pagingEvent.pageSize = this.pagingModel.pageSize;
            this.actionPagingEvent();
        }
    }

    handleWithNormal(item: ItemPageList) {
        this.pagingEvent.pageIndex = parseInt(item.value, 10) - 1;
        this.pagingEvent.pageSize = this.pagingModel.pageSize;
        this.actionPagingEvent();
    }

    handleWithGoToPage() {
        this.isShowGoToPage = !this.isShowGoToPage;
        this.pageNumber = null;
        const element = this.element.nativeElement;
        const numberListElement = element.getElementsByClassName('number-list');
        const left = numberListElement[0].offsetLeft + numberListElement[0].offsetWidth / 2 - 76;
        this.leftPositionGotoPage = left + 'px';
    }

    goToPage() {
        if (this.pageNumber > 0 && (this.pageNumber - 1) !== this.pagingModel.pageIndex) {
            this.pageNumber = this.pageNumber > this.maxNumber ? this.maxNumber : this.pageNumber;
            this.pagingEvent.pageIndex = this.pageNumber - 1;
            this.pagingEvent.pageSize = this.pagingModel.pageSize;
            this.actionPagingEvent();
        }
    }

    actionPagingEvent() {
        this.isShowGoToPage = false;
        this.changePagingEvent.emit(this.pagingEvent);
        this.pagingModel.pageIndex = this.pagingEvent.pageIndex;
        this.pagingModel.pageSize = this.pagingEvent.pageSize;
        this.updateData();
    }
}