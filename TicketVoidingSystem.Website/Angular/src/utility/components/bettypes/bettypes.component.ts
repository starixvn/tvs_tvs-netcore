import { Component, ElementRef, inject, Input, OnChanges, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
import isUndefined from 'lodash/isUndefined';
import { Product } from '../../constants/config';
import { TEXT } from '../../constants/text';
import { TooltipComponent } from '../tooltip/tooltip.component';
import { Tooltip } from '../tooltip/tooltip.model';
import { BetTypesModel } from './bettypes.model';
import { BetTypesService } from './bettypes.service';

@Component({
    standalone: true,
    selector: 'bettypes',
    templateUrl: './bettypes.component.html',
    styleUrls: ['./bettypes.component.scss'],
    imports: [FormsModule, TooltipComponent]
})

export class BetTypesComponent implements OnChanges {
    @Input() model = new BetTypesModel();
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
    betTypesService = inject(BetTypesService);
    constructor() {
        this.tooltip.element = this.element;
    }

    ngOnChanges(_: { [propKey: string]: SimpleChange }) {
        this.changeIsShow();
        this.display = isUndefined(this.model) ? false :
            this.betTypesService.checkDisplay(this.model.betTypes) && this.productDisplay.indexOf(this.product) > -1;
    }

    changeAll(){
        this.betTypesService.changeAll(this.model.betTypes, this.model.isChecked);
    }

    changeItem(){
        this.betTypesService.changeItem(this.model);
    }

    changeIsShow() {
        if (this.model !== undefined) {
            this.model.isChecked = true;
            this.model.betTypes.forEach(item => {
                item.isShow = item.type === this.product;
                this.betTypesService.displayNumberGame(item, this.product, this.sportType, this.ballSequence);
                item.isChecked = item.isShow;
            });
        }
    }

    validate(): boolean {
        const result = this.betTypesService.getCheckedBetTypes(this.model.betTypes).length > 0;
        if (!result) {
            this.tooltip.display('checkbox-all-bettypes', TEXT.NO_CHECKED_BETTYPE);
        }

        return result;
    }
}