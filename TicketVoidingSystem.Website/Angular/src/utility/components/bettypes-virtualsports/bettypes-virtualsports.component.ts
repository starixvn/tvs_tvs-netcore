import { Component, ElementRef, Input, OnChanges, SimpleChange } from '@angular/core';
import * as _ from 'lodash';
import { Product } from '../../constants/config';
import { TEXT } from '../../constants/text';
import { Tooltip } from '../tooltip/tooltip.model';
import { GroupBetTypeVirtualSport } from './bettypes-virtualsports.model';
import { FormsModule } from '@angular/forms';
import { TooltipComponent } from '../tooltip/tooltip.component';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'bettypes-virtualsports',
    templateUrl: './bettypes-virtualsports.component.html',
    styleUrls: ['./bettypes-virtualsports.component.scss'],
    imports: [FormsModule, TooltipComponent, CommonModule]
})
export class BetTypesVirtualSportComponent implements OnChanges {
    @Input() group = new GroupBetTypeVirtualSport([]);
    @Input() product: number;
    @Input() ballSequence: number[];
    @Input() sportType: number;
    display: boolean;
    tooltip = new Tooltip();
    productDisplay: number[] = [
        Product.NUMBER_GAME,
        Product.BET_BUILDER,
        Product.BITCOIN
    ];
    isDisabledAllBetTypes: boolean;

    constructor(private readonly element: ElementRef) {
        this.tooltip.element = this.element;
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        this.changeIsShow();
        this.display = _.isUndefined(this.group) ? false :
            this.group.betTypes.length > 0 && this.productDisplay.indexOf(this.product) > -1;
    }

    changeIsShow() {
        if (this.group !== undefined) {
            this.group.checked = true;
            this.group.betTypes.forEach(item => {
                item.checked = true;
            });
        }
    }

    isShowCheckedBetTypes(): boolean {
        return this.display;
    }

    getCheckedBetTypes(): string[] {
        return this.group.betTypes
            .filter(item => item.checked)
            .map(item => item.id.toString());
    }

    validate(): boolean {
        const result = this.group.betTypes.filter(item => item.checked).length > 0;
        if (!result) {
            this.tooltip.display('checkbox-all-bettypes', TEXT.NO_CHECKED_BETTYPE);
        }
        return result;
    }
}