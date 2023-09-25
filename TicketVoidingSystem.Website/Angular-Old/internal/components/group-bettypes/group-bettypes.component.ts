import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { OnChanges, SimpleChange } from '@angular/core';

import { Tooltip } from '../../../external/components/tooltip/tooltip';
import { TEXT } from '../../shared/text';
import { Product } from '../../shared/config';
import { GroupBetTypesModel, Result, GroupBetType, BetType } from './group-bettypes.model';

@Component({
    selector: 'group-bettypes',
    templateUrl: './group-bettypes.component.html',
    styleUrls: ['./group-bettypes.component.scss']
})

export class GroupBetTypesComponent implements OnInit, OnChanges {
    @Input() model: GroupBetTypesModel;
    @Input() product: number = Product.SPORTS_BOOK;
    @Output() betTypesEvent = new EventEmitter<BetType[]>();
    tooltip = new Tooltip;

    @Input() scroll: boolean;
    display: boolean;
    collapse = true;

    constructor(private element: ElementRef) {
        this.tooltip.element = this.element;
    }

    ngOnInit() {
        this.model = new GroupBetTypesModel(new Array<GroupBetType>(), false);
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        this.display = this.product === Product.SPORTS_BOOK;
    }

    displayGroup(groups: string[]) {
        this.model.groupBetTypes.forEach(group => {
            group.isShow = groups.indexOf(group.groupName) > -1;
            if (!group.isShow) {
                group.isChecked = false;
                group.changeCheckedGroupToBetType();
            }
        });
        this.changedBetTypes();
        this.model.changeCheckedGroupToModel();
    }

    changedBetTypes() {
        const betTypes = this.model.getAllBetType();
        this.betTypesEvent.emit(betTypes);
    }

    validate(): boolean {
        const result = this.model.getCheckedBetTypes().length > 0;
        if (!result) {
            this.tooltip.display('group-bettypes-all-checkbox', TEXT.NO_CHECKED_BETTYPE);
        }

        return result;
    }
}