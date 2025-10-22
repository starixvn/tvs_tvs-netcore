import { Injectable } from '@angular/core';
import { BetType, GroupBetType, GroupBetTypesModel } from './group-bettypes.model';

@Injectable({
  providedIn: 'root'
})
export class GroupBetTypesService {
  initGroupBetType(groupName: string, betTypes: BetType[], isChecked: boolean) {
    const group = new GroupBetType();
    group.isShow = true;
    group.groupName = groupName;
    group.isChecked = isChecked;
    this.renderBetTypes(group.betTypes, betTypes, isChecked);

    return group;
  }

  private renderBetTypes(baseBetTypes: BetType[], betTypes: BetType[], isChecked: boolean) {
    baseBetTypes.length = 0; // Clear the array instead of reassigning
    betTypes.forEach(item => {
      const betType = new BetType(
        parseInt(item.id.toString(), 10),
        item.name,
        item.liveIndicator,
        item.type,
        isChecked
      );
      baseBetTypes.push(betType);
    });
  }

  changeCheckedGroupToBetType(group: GroupBetType) {
    group.betTypes.forEach(betType => {
      betType.isChecked = group.isChecked && group.isShow;
    });
  }

  changeCheckedBetTypeToGroup(group: GroupBetType) {
    let temp = true;
    for (let i = 0; i < group.betTypes.length && temp; i++) {
      temp = group.betTypes[i].isChecked;
    }
    group.isChecked = temp;
  }

  private groupGetCheckedBetTypes(betTypes: BetType[]): number[] {
    const value: Array<number> = [];
    betTypes.forEach(betType => {
      if (betType.isChecked) {
        value.push(betType.id);
      }
    });

    return value;
  }

  private groupGetValueCheckedBetTypes(betTypes: BetType[]): string[] {
    const value: Array<string> = [];
    betTypes.forEach(betType => {
      if (betType.isChecked) {
        value.push(betType.value);
      }
    });

    return value;
  }

  private groupHasBetType(betTypes: BetType[], id: number): boolean {
    const index = betTypes.findIndex(x => x.id.toString() === id.toString());
    return index > -1;
  }

  initGroupBetTypesModel(groups: Array<GroupBetType>, isChecked: boolean) {
    const groupModel = new GroupBetTypesModel();
    groupModel.isChecked = isChecked;
    groupModel.groupBetTypes = [];
    groups.forEach(item => {
      const group = this.initGroupBetType(item.groupName, item.betTypes, isChecked);
      groupModel.groupBetTypes.push(group);
    });

    return groupModel;
  }

  changeCheckGroupByBetTypes(groupBetTypes: GroupBetType[]) {
    groupBetTypes.forEach(group => {
      if (!group.betTypes.some(x => !x.isChecked)) {
        group.isChecked = true;
      } else {
        group.isChecked = false;
      }
    });
  }

  changeCheckedModelToGroup(groupModel: GroupBetTypesModel) {
    groupModel.groupBetTypes.forEach(group => {
      group.isChecked = groupModel.isChecked && group.isShow;
      this.changeCheckedGroupToBetType(group);
    });
  }

  changeCheckedGroupToModel(groupModel: GroupBetTypesModel) {
    let checkedAll = true;
    let hideAll = true;
    for (let i = 0; i < groupModel.groupBetTypes.length && checkedAll; i++) {
      if (groupModel.groupBetTypes[i].isShow) {
        checkedAll = groupModel.groupBetTypes[i].isChecked;
      }
      if (hideAll) {
        hideAll = !groupModel.groupBetTypes[i].isShow;
      }
    }

    groupModel.isChecked = checkedAll && !hideAll;
  }

  getCheckedBetTypes(groupBetTypes: GroupBetType[]): number[] {
    let value: Array<number> = [];
    groupBetTypes.forEach(group => {
      value = value.concat(this.groupGetCheckedBetTypes(group.betTypes));
    });

    return value;
  }

  getValueCheckedBetTypes(groupBetTypes: GroupBetType[]): string {
    let value: Array<string> = [];
    groupBetTypes.forEach(group => {
      value = value.concat(this.groupGetValueCheckedBetTypes(group.betTypes));
    });

    return value.join(',');
  }

  getAllBetType(groupBetTypes: GroupBetType[]): BetType[] {
    let value = [];
    groupBetTypes.forEach(group => {
      value = value.concat(group.betTypes);
    });

    return value;
  }

  hasBetType(groupBetTypes: GroupBetType[], id: number): boolean {
    let result = false;
    groupBetTypes.forEach(group => {
      if (this.groupHasBetType(group.betTypes, id)) {
        result = true;
      }
    });

    return result;
  }
}
