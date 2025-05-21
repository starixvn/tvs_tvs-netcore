import { Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { Product } from '../../../../utility/constants/config';
import { LABELS } from '../../../../utility/constants/labels';
import { Tooltip } from '../../tooltip/tooltip.model';
import { BetType, GroupBetType, GroupBetTypesModel } from './group-bettypes.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TooltipComponent } from '../../tooltip/tooltip.component';

@Component({
  standalone: true,
  selector: 'group-bettypes',
  templateUrl: './group-bettypes.component.html',
  styleUrls: ['./group-bettypes.component.scss'],
  imports: [CommonModule, FormsModule, TooltipComponent]
})

export class GroupBetTypesComponent implements OnInit, OnChanges { 
  @Input() model: GroupBetTypesModel;
  @Input() product: number = Product.SPORTS_BOOK;
  @Input() scroll: boolean;
  @Output() betTypesEvent = new EventEmitter<BetType[]>();
  tooltip = new Tooltip();
  isDisabledAllBetTypes: boolean;
  display: boolean;
  collapse = true;

  element = inject(ElementRef);

  ngOnInit() {
    this.tooltip.element = this.element;
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
      this.tooltip.display('group-bettypes-all-checkbox', LABELS.NO_CHECKED_BETTYPE);
    }

    return result;
  }
}
