import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Tooltip } from '../../../external/components/tooltip/tooltip';
import { TEXT } from '../../../internal/shared/text';
import { GroupNumber, NumberItem } from './input-betids.model';

@Component({
    selector: 'input-betids',
    templateUrl: './input-betids.component.html',
    styleUrls: ['./input-betids.component.scss']
})

export class InputBetIdsComponent implements OnInit {
    @Input() maxItems = 1000;
    @Input() hideWarningMove = false;
    @ViewChild('input') input;

    groupNumber: GroupNumber;
    transId: string;
    lastItem: NumberItem;
    shiftKey: boolean;
    tooltip = new Tooltip();

    private readonly errorTooltipClassName = 'invalid-data';

    constructor(private readonly element: ElementRef) {
        this.tooltip.element = this.element;
    }

    ngOnInit() {
        this.groupNumber = new GroupNumber;
    }

    focusTransId() {
        this.input.nativeElement.focus();
    }

    isHasBetId(): boolean {
        if (this.groupNumber.getAllNumberItemsAsString() === '') {
            this.tooltip.display(this.errorTooltipClassName, TEXT.REQUIRED_BETIDS);
            return false;
        }

        return true;
    }

    addItem(value: string) {
        if (value !== undefined && value !== '' && this.groupNumber.items.length < this.maxItems) {
            value = value.length > 75 ? value.substring(0, 75) + '...' : value;
            const item = new NumberItem(value);
            this.groupNumber.items.push(item);
        }
        this.transId = '';
    }

    pasteItem(event: ClipboardEvent) {
        const data = event.clipboardData.getData('text');
        const items = data.replace(/ /g, ',').replace(/\r\n/g, ',').replace(/\n/g, ',').split(',');
        items.forEach(item => {
            this.addItem(item);
        });

        setTimeout(() => {
            this.transId = '';
        }, 0);
    }

    clickEvent(item: NumberItem) {
        if (this.shiftKey && this.lastItem !== undefined) {
            this.selectItems(item);
        }

        this.lastItem = item;
    }

    selectItems(item: NumberItem) {
        const isSelected = item.isSelected;
        const last = this.groupNumber.items.indexOf(this.lastItem);
        const current = this.groupNumber.items.indexOf(item);
        const start = Math.min(last, current);
        const end = Math.max(last, current);
        for (let i = start; i < end; i++) {
            this.groupNumber.items[i].changeSelectedAll(isSelected);
        }
    }

    onKey(event: KeyboardEvent) {
        const count = this.groupNumber.items.length;
        const value = this.transId;
        const keyAddItem = [188, 13, 32];
        const keyBackspace = 8;
        const keyDelete = 46;
        const code = event.keyCode;

        if (code === keyBackspace && value === '') {
            this.groupNumber.removeLasted();
            return;
        }

        else if (event.shiftKey && (code >= 48 && code <= 57)) {
            event.preventDefault();
        }

        else if (event.ctrlKey && code === 65) {
            this.groupNumber.changeSelected();
        }

        else if (code === keyDelete) {
            this.groupNumber.removeSelected();
        }

        else if (keyAddItem.indexOf(code) > -1) {
            if (value === '') {
                event.preventDefault();
                return;
            }

            this.addItem(value);
            event.preventDefault();
        }

        else if (count >= this.maxItems) {
            return false;
        }

        else {
            return event.ctrlKey && (code === 86 || code === 67) ||
                code >= 35 && code <= 40 ||
                code >= 48 && code <= 57 ||
                code >= 96 && code <= 105;
        }
    }
}