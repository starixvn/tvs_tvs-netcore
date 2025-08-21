import { Component, ElementRef, inject, Input, OnChanges, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isUndefined } from 'lodash';
import { Product } from '../../constants/config';
import { TEXT } from '../../constants/text';
import { TooltipComponent } from '../tooltip/tooltip.component';
import { Tooltip } from '../tooltip/tooltip.model';
import { BetTypesModel } from './bettypes.model';

@Component({
    standalone: true,
    selector: 'bettypes',
    templateUrl: './bettypes.component.html',
    styleUrls: ['./bettypes.component.scss'],
    imports: [FormsModule, TooltipComponent]
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

    element = inject(ElementRef);
    constructor() {
        this.tooltip.element = this.element;
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        this.changeIsShow();
        this.display = isUndefined(this.model) ? false :
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