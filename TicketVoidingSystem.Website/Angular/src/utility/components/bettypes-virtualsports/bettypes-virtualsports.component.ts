import { Component, ElementRef, inject, Input, OnChanges, SimpleChange } from '@angular/core';
import { TEXT } from '../../constants/text';
import { Tooltip } from '../tooltip/tooltip.model';
import { GroupBetTypeVirtualSport } from './bettypes-virtualsports.model';
import { FormsModule } from '@angular/forms';
import { TooltipComponent } from '../tooltip/tooltip.component';
import { Product } from '../../constants/config';

@Component({
    standalone: true,
    selector: 'bettypes-virtualsports',
    templateUrl: './bettypes-virtualsports.component.html',
    styleUrls: ['./bettypes-virtualsports.component.scss'],
    imports: [FormsModule, TooltipComponent]
})

export class BetTypesVirtualSportComponent implements OnChanges {
    @Input() group: GroupBetTypeVirtualSport;
    @Input() product: number;
    display: boolean;
    tooltip = new Tooltip();
    checkAll = true;
    element = inject(ElementRef);

    constructor() {
        this.tooltip.element = this.element;
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (changes['group']) {
            this.display = this.group?.betTypes.length > 0;
        }
    }

    validate(): boolean {
        const result = this.getCheckedBetTypes().length > 0;
        if (!result) {
            this.tooltip.display('checkbox-all-bettypes', TEXT.NO_CHECKED_BETTYPE);
        }

        return result;
    }

    getCheckedBetTypes(): string[] {
        return this.group.betTypes
            .filter(item => item.checked)
            .map(item => item.id.toString());
    }

    isShowCheckedBetTypes(): boolean {
        return this.product === Product.VIRTUAL_SPORTS && this.display;
    }

    changeAll() {
        this.group.betTypes.forEach(item => item.checked = this.group.checked);
    }
}