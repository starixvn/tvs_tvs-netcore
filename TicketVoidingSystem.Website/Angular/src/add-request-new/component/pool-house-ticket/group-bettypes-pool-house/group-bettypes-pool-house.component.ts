
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import { TooltipComponent } from '../../../../utility/components/tooltip/tooltip.component';
import { Tooltip } from '../../../../utility/components/tooltip/tooltip.model';
import { GroupBetTypesModel } from './group-bettypes-pool-house.model';

@Component({
  selector: 'group-bettypes-pool-house',
  templateUrl: './group-bettypes-pool-house.component.html',
  styleUrls: ['./group-bettypes-pool-house.component.scss'],
  standalone: true,
  imports: [FormsModule, NgbModule, TooltipComponent]
})
export class GroupBettypesPoolHouseComponent implements OnInit {
  @Input() affectedGroupBetTypesModel: GroupBetTypesModel;
  @Input() othersGroupBetTypesModel: GroupBetTypesModel;
  @Output() changedBetTypesEvent = new EventEmitter<number[]>();

  tooltip = new Tooltip;
  displayGroupBetTypesModel: GroupBetTypesModel[] = [];

  public ngOnInit(): void {
    this.renderDisplayGroupBetTypes();
  }

  public isShowGroupBetTypes(group: GroupBetTypesModel): boolean {
    return !isNull(group) && !isUndefined(group) && group.groupBetTypes?.length > 0;
  }

  public changedBetTypes() {
    this.changedBetTypesEvent.emit(this.affectedGroupBetTypesModel.getCheckedBetTypes());
  }

  private renderDisplayGroupBetTypes() {
    this.displayGroupBetTypesModel = [this.affectedGroupBetTypesModel, this.othersGroupBetTypesModel];
  }
}
