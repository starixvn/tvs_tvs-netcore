import { Injectable } from '@angular/core';
import { BetTypeAddRequest, GroupBetTypeAddRequest, GroupBetTypesAddRequestModel } from './group-bet-types.model';

@Injectable({
  providedIn: 'root'
})
export class BetTypeService {
  initGroupBetTypeAddRequest(groupName: string, betTypes: BetTypeAddRequest[], isChecked: boolean, isDisable: boolean) {
    const group = new GroupBetTypeAddRequest();
    group.isShow = true;
    group.isChecked = isChecked;
    group.groupName = groupName;
    group.isDisable = isDisable;
    this.renderBetTypes(group.betTypes, betTypes, isChecked, isDisable);

    return group;
  }

  private renderBetTypes(baseBetTypes: BetTypeAddRequest[], betTypes: BetTypeAddRequest[], isChecked: boolean, isDisable: boolean) {
    baseBetTypes.length = 0;
    betTypes.forEach(x => {
      const betTypeModel = new BetTypeAddRequest(
        parseInt(x.id.toString(), 10),
        x.name,
        isChecked,
        isDisable
      );
      baseBetTypes.push(betTypeModel);
    });
  }

  changeCheckedBetTypeToGroup(group: GroupBetTypeAddRequest) {
    let isChecked = true;
    for (let i = 0; i < group.betTypes?.length && isChecked; i++) {
      isChecked = group.betTypes[i].isChecked;
    }
    group.isChecked = isChecked;
  }

  changeCheckedGroupToBetType(group: GroupBetTypeAddRequest) {
    group.betTypes.forEach(x => {
      x.isChecked = group.isChecked && group.isShow;
    });
  }

  private groupGetCheckedBetTypes(betTypes: BetTypeAddRequest[]): BetTypeAddRequest[] {
    return betTypes.filter(x => x.isChecked);
  }

  initGroupBetTypesAddRequestModel(groups: Array<GroupBetTypeAddRequest>, isChecked: boolean, name: string, isDisable: boolean) {
    const groupModel = new GroupBetTypesAddRequestModel();
    groupModel.isChecked = isChecked;
    groupModel.isDisable = isDisable;
    groupModel.name = name;
    groupModel.groupBetTypes = [];
    groups.forEach(x => {
      const group = this.initGroupBetTypeAddRequest(x.groupName, x.betTypes, isChecked, isDisable);
      groupModel.groupBetTypes.push(group);
    });

    return groupModel;
  }

  changeCheckedModelToGroup(groupModel: GroupBetTypesAddRequestModel) {
    groupModel.groupBetTypes.forEach(x => {
      x.isChecked = groupModel.isChecked && x.isShow;
      this.changeCheckedGroupToBetType(x);
    });
  }

  changeCheckedGroupToModel(groupModel: GroupBetTypesAddRequestModel) {
    let isCheckedAll = true;
    let isHideAll = true;
    for (let i = 0; i < groupModel.groupBetTypes.length && isCheckedAll; i++) {
      if (groupModel.groupBetTypes[i].isShow) {
        isCheckedAll = groupModel.groupBetTypes[i].isChecked;
      }
      if (isHideAll) {
        isHideAll = !groupModel.groupBetTypes[i].isShow;
      }
    }

    groupModel.isChecked = isCheckedAll && !isHideAll;
  }

  getCheckedBetTypes(groupBetTypes: GroupBetTypeAddRequest[]): BetTypeAddRequest[] {
    return groupBetTypes.flatMap(x => this.groupGetCheckedBetTypes(x.betTypes));
  }

  getAllBetTypes(groupBetTypes: GroupBetTypeAddRequest[]): BetTypeAddRequest[] {
    return groupBetTypes.flatMap(x => x.betTypes);
  }
}
