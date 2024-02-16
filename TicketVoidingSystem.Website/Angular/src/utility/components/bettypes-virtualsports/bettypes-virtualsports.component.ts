import { Component, ElementRef, Input, OnChanges, SimpleChange } from '@angular/core';
import { TEXT } from '../../constants/text';
import { Tooltip } from '../tooltip/tooltip.model';
import { GroupBetTypeVirtualSport } from './bettypes-virtualsports.model';

@Component({
    selector: 'bettypes-virtualsport',
    templateUrl: './bettypes-virtualsports.component.html',
    styleUrls: ['./bettypes-virtualsports.component.scss']
})

export class BetTypesVirtualSportComponent implements OnChanges {
    @Input() group: GroupBetTypeVirtualSport;
    @Input() product: number;
    display: boolean;
    tooltip = new Tooltip();
    checkAll = true;

    constructor(private readonly element: ElementRef) {
        this.tooltip.element = this.element;
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (changes['group']) {
            this.display = this.changeDisplay();
        }
    }

    changeDisplay() {
        return this.group?.betTypes.length > 0;
    }

    validate(): boolean {
        const result = this.getCheckedBetTypes().length > 0;
        if (!result) {
            this.tooltip.display('checkbox-all-bettypes', TEXT.NO_CHECKED_BETTYPE);
        }

        return result;
    }

    getCheckedBetTypes(): string[] {
        let value = [];
        this.group.betTypes.forEach(item => {
            if (item.checked) {
                value.push(item.id);
            }
        });

        return value;
    }

    isShowCheckedBetTypes(): boolean {
        return this.product === 2 && this.display;
    }
}