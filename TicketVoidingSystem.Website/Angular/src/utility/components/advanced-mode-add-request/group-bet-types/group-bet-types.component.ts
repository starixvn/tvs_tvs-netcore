import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import cloneDeep from 'lodash/cloneDeep';
import { LABELS } from '../../../../utility/constants/labels';
import { TooltipComponent } from '../../tooltip/tooltip.component';
import { Tooltip } from '../../tooltip/tooltip.model';
import { BetTypeAddRequest, GroupBetTypeAddRequest, GroupBetTypesAddRequestModel } from './group-bet-types.model';

@Component({
  standalone: true,
  selector: 'group-bet-types',
  templateUrl: './group-bet-types.component.html',
  styleUrls: ['./group-bet-types.component.scss'],
  imports: [CommonModule, FormsModule, TooltipComponent]
})
export class GroupBetTypesComponent {
  @Input() model: GroupBetTypesAddRequestModel;
  @Output() betTypesEvent = new EventEmitter<BetTypeAddRequest[]>();
  @Output() checkExistBetTypeEvent = new EventEmitter<boolean>();
  @Output() changeFilterEvent = new EventEmitter();

  @Input() scroll: boolean;
  collapse = true;
  tooltip = new Tooltip();

  element = inject(ElementRef);

  constructor() {
    this.tooltip.element = this.element;
  }

  changeAllBetTypes() {
    this.changeFilterEvent.emit();
    this.betTypesEvent.emit(this.model.getAllBetTypes());
  }

  changeGroupBetTypes(group: GroupBetTypeAddRequest) {
    this.changeFilterEvent.emit();
    this.betTypesEvent.emit(cloneDeep(group.betTypes));
  }

  changeBetTypeItem(item: BetTypeAddRequest) {
    this.changeFilterEvent.emit();
    this.betTypesEvent.emit([item]);
  }

  changeBetTypes() {
    this.changeFilterEvent.emit();
    this.betTypesEvent.emit(this.model.getAllBetTypes());
  }

  isValidity() {
    this.checkExistBetTypeEvent.emit(this.model.groupBetTypes.length > 0);
    if (this.model.groupBetTypes.length === 0) {
      return false;
    } else if (this.model.groupBetTypes.every(x => x.betTypes.every(y => !y.isChecked))) {
      this.tooltip.display('group-bettypes-all-checkbox', LABELS.NO_CHECKED_BETTYPE);
      return false;
    }

    return true;
  }
}
