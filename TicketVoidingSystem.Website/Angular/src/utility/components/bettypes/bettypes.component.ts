import { Component, ElementRef, Input, OnChanges, SimpleChange } from '@angular/core';
import * as _ from 'lodash';
import { Product } from '../../constants/config';
import { TEXT } from '../../constants/text';
import { Tooltip } from '../tooltip/tooltip.model';
import { BetTypesModel } from './bettypes.model';
import { FormsModule } from '@angular/forms';
import { TooltipComponent } from '../tooltip/tooltip.component';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'bettypes',
    templateUrl: './bettypes.component.html',
    styleUrls: ['./bettypes.component.scss'],
    imports: [FormsModule, TooltipComponent, CommonModule]
})

export class BetTypesComponent implements OnChanges {
    @Input() model = new BetTypesModel([], false);
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
        this.display = _.isUndefined(this.model) ? false :
            this.model.checkDisplay() && this.productDisplay.indexOf(this.product) > -1;
    }

    changeIsShow() {
        if (this.model !== undefined) {
            this.model.isChecked = true;
            this.model.betTypes.forEach(item => {
                item.isShow = item.type === this.product;
                item.displayNumberGame(this.product, this.sportType, this.ballSequence);
                item.isChecked = item.isShow;
            });
        }
    }

    validate(): boolean {
        const result = this.model.getCheckedBetTypes().length > 0;
        if (!result) {
            this.tooltip.display('checkbox-all-bettypes', TEXT.NO_CHECKED_BETTYPE);
        }

        return result;
    }
}