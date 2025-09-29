import { Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';
import { Product } from '../../../../utility/constants/config';
import { TEXT} from '../../../../utility/constants/text';
import { Tooltip } from '../../tooltip/tooltip.model';
import { BetType, GroupBetType, GroupBetTypesModel } from './group-bettypes.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TooltipComponent } from '../../tooltip/tooltip.component';
import { GroupBetTypesService } from './group-bettypes.service';

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
  groupBetTypesService = inject(GroupBetTypesService);
  
  ngOnInit() {
    this.tooltip.element = this.element;
    this.model = new GroupBetTypesModel();
  }

  ngOnChanges(_: { [propKey: string]: SimpleChange }) {
    this.display = this.product === Product.SPORTS_BOOK;
  }

  changeCheckedGroupToBetType(group: GroupBetType){
    this.groupBetTypesService.changeCheckedGroupToBetType(group);
  }

  changeCheckedBetTypeToGroup(group: GroupBetType){
    this.groupBetTypesService.changeCheckedBetTypeToGroup(group);
  }

  changeCheckedModelToGroup(){
    this.groupBetTypesService.changeCheckedModelToGroup(this.model);
  }

  changeCheckedGroupToModel(){
    this.groupBetTypesService.changeCheckedGroupToModel(this.model);
  }

  displayGroup(groups: string[]) {
    this.model.groupBetTypes.forEach(group => {
      group.isShow = groups.indexOf(group.groupName) > -1;
      if (!group.isShow) {
        group.isChecked = false;
        this.groupBetTypesService.changeCheckedGroupToBetType(group);
      }
    });
    this.changedBetTypes();
    this.groupBetTypesService.changeCheckedGroupToModel(this.model);
  }

  changedBetTypes() {
    const betTypes = this.groupBetTypesService.getAllBetType(this.model.groupBetTypes);
    this.betTypesEvent.emit(betTypes);
  }

  validate(): boolean {
    const result = this.groupBetTypesService.getCheckedBetTypes(this.model.groupBetTypes).length > 0;
    if (!result) {
      this.tooltip.display('group-bettypes-all-checkbox', TEXT.NO_CHECKED_BETTYPE);
    }

    return result;
  }
}
