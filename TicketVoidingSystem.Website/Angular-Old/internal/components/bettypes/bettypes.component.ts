import { Component, ElementRef, Input, OnChanges, SimpleChange } from '@angular/core';

import { Tooltip } from '../../../external/components/tooltip/tooltip';
import { Product } from '../../shared/config';
import { TEXT } from '../../shared/text';
import { BetTypesModel } from './bettypes.model';

import * as _ from 'lodash';

@Component({
    selector: 'bettypes',
    templateUrl: './bettypes.component.html',
    styleUrls: ['./bettypes.component.scss']
})

export class BetTypesComponent implements OnChanges {
    @Input() model = new BetTypesModel([], false);
    @Input() product: number;
    @Input() ballSequence: number[];
    @Input() sportType: number;
    display: boolean;
    tooltip = new Tooltip;
    productDisplay: number[] = [
        Product.NUMBER_GAME,
        Product.VIRTUAL_SPORTS,
        Product.METRIC_GAMING,
        Product.BET_BUILDER
    ];

    constructor(private element: ElementRef) {
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