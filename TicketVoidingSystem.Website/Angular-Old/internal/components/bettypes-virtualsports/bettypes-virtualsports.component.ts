import { Component, ElementRef, Input } from '@angular/core';
import { OnChanges, SimpleChange } from '@angular/core';
import { Tooltip } from '../../../external/components/tooltip/tooltip';
import { TEXT } from '../../shared/text';
import { Product } from '../../../internal/shared/config';
import { GroupBetTypeVirtualSport } from './bettypes-virtualsports.model';

@Component({
    selector: 'bettypes-virtualsport',
    templateUrl: './bettypes-virtualsports.component.html',
    styleUrls: ['./bettypes-virtualsports.component.scss']
})

export class BetTypesVirtualSportComponent implements OnChanges {
    @Input() groups: Array<GroupBetTypeVirtualSport>;
    @Input() sportType: number;
    @Input() product: number = Product.VIRTUAL_SPORTS_2;
    display: boolean;
    tooltip = new Tooltip;

    constructor(private element: ElementRef) {
        this.tooltip.element = this.element;
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (changes['sportType']) {
            this.changeDisplay();
        }
    }

    changeDisplay() {
        this.display = false;
        if (this.groups !== undefined && this.sportType !== undefined) {
            this.groups.forEach(group => {
                if (group.sportTypes.indexOf(this.sportType) > -1) {
                    this.display = true;
                }
                group.changeDisplay(this.sportType);
            });
        }
    }

    validate(): boolean {
        const result = this.getCheckedBetTypes().length > 0;
        if (!result) {
            this.tooltip.display('checkbox-all-bettypes', TEXT.NO_CHECKED_BETTYPE);
        }

        return result;
    }

    getCheckedBetTypes(): string {
        let value = '';
        this.groups.forEach(group => {
            if (group.display) {
                value = group.getCheckedBetTypes().join(',');
            }
        });

        return value;
    }
}
