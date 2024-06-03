import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LABELS } from '../../../../utility/constants/labels';
import { Tooltip } from '../../tooltip/tooltip.model';
import { BetTypeAddRequest, GroupBetTypesAddRequestModel } from './group-bet-types.model';

@Component({
  selector: 'group-bet-types',
  templateUrl: './group-bet-types.component.html',
  styleUrls: ['./group-bet-types.component.scss']
})
export class GroupBetTypesComponent implements OnInit {
  @Input() model: GroupBetTypesAddRequestModel;
  @Output() betTypesEvent = new EventEmitter<BetTypeAddRequest[]>();
  @Output() checkExistBetTypeEvent = new EventEmitter<boolean>();
  tooltip = new Tooltip();
  isDisabledAllBetTypes: boolean;

  @Input() scroll: boolean;
  collapse = true;

  constructor(private readonly element: ElementRef) {
    this.tooltip.element = this.element;
  }

  ngOnInit() {
    //this.model = new GroupBetTypesAddRequestModel(new Array<GroupBetTypeAddRequest>(), false);
    // const x1 = new BetTypeAddRequest(1, '1', true, false);
    // const x2 = new BetTypeAddRequest(7, 'Map X Total Gold(In Thousands) Handicap', true, false);
    // const x3 = new BetTypeAddRequest(154, 'MPAAAA ', true, false);

    // const x = new GroupBetTypeAddRequest('1H', [x1, x2, x3], true, false);
    // this.model = new GroupBetTypesAddRequestModel([x], false, '', false);
    this.changedBetTypes();
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
    this.betTypesEvent.emit(this.model.getAllBetTypes());
  }

  isValidity() {
    this.checkExistBetTypeEvent.emit(this.model.groupBetTypes.length > 0);
    if (this.model.groupBetTypes.length === 0) {
      return false;
    } else if(this.model.groupBetTypes.every(x => x.betTypes.every(y => !y.isChecked))) {
      this.tooltip.display('group-bettypes-all-checkbox', LABELS.NO_CHECKED_BETTYPE);
      return false;
    }

    return true;
  }
}
