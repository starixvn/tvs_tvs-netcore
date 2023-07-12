import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { Tooltip } from '../../tooltip/tooltip.model';
import { GroupBetTypesModel } from './group-bettypes-pool-house.model';

@Component({
  selector: 'group-bettypes-pool-house',
  templateUrl: './group-bettypes-pool-house.component.html',
  styleUrls: ['./group-bettypes-pool-house.component.scss']
})
export class GroupBettypesPoolHouseComponent implements OnInit {
  @Input() affectedGroupBetTypesModel: GroupBetTypesModel;
  @Input() othersGroupBetTypesModel: GroupBetTypesModel;
  @Input() checkedBetTypes: string;
  @Output() changedBetTypesEvent = new EventEmitter<number[]>();

  tooltip = new Tooltip;
  displayGroupBetTypesModel: GroupBetTypesModel[] = [];

  constructor() { }

  public ngOnInit(): void {
    this.renderDisplayGroupBetTypes();
    if (this.checkedBetTypes?.length > 0) {
      const betTypes = this.checkedBetTypes.split(',').map(i => Number(i));
      this.affectedGroupBetTypesModel.checkBetType(betTypes);
      this.changedBetTypesEvent.emit(betTypes);
    }
  }

  public isShowGroupBetTypes(group: GroupBetTypesModel): boolean {
    return !_.isNull(group) && !_.isUndefined(group) && group.groupBetTypes?.length > 0;
  }

  public changedBetTypes() {
    this.changedBetTypesEvent.emit(this.affectedGroupBetTypesModel.getCheckedBetTypes());
  }

  private renderDisplayGroupBetTypes() {
    this.displayGroupBetTypesModel = [this.affectedGroupBetTypesModel, this.othersGroupBetTypesModel];
  }
}
