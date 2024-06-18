
export class BetTypeAddRequest {
  id: number;
  name: string;
  isChecked: boolean;
  isDisable: boolean;

  constructor(id: number, name: string, isChecked: boolean, isDisable: boolean) {
    this.id = id;
    this.name = name;
    this.isChecked = isChecked;
    this.isDisable = isDisable;
  }
}

export class GroupBetTypeAddRequest {
  groupName: string;
  betTypes: BetTypeAddRequest[];
  isChecked: boolean;
  isShow: boolean;
  isDisable: boolean;

  constructor(groupName: string, betTypes: BetTypeAddRequest[], isChecked: boolean, isDisable: boolean) {
    this.isShow = true;
    this.isChecked = isChecked;
    this.groupName = groupName;
    this.isDisable = isDisable;
    this.renderBetTypes(betTypes, isChecked, isDisable);
  }

  renderBetTypes(betTypes: BetTypeAddRequest[], isChecked: boolean, isDisable: boolean) {
    this.betTypes = [];
    betTypes.forEach(x => {
      const betTypeModel = new BetTypeAddRequest(
        parseInt(x.id.toString(), 10),
        x.name,
        isChecked,
        isDisable
      );
      this.betTypes.push(betTypeModel);
    });
  }

  changeCheckedBetTypeToGroup() {
    let isChecked = true;
    for (let i = 0; i < this.betTypes.length && isChecked; i++) {
      isChecked = this.betTypes[i].isChecked;
    }
    this.isChecked = isChecked;
  }

  changeCheckedGroupToBetType() {
    this.betTypes.forEach(x => {
      x.isChecked = this.isChecked && this.isShow;
    });
  }

  getCheckedBetTypes(): BetTypeAddRequest[] {
    return this.betTypes.filter(x => x.isChecked);
  }
}

export class GroupBetTypesAddRequestModel {
  groupBetTypes: GroupBetTypeAddRequest[];
  name: string;
  isChecked: boolean;
  isDisable: boolean;
  isCollapsed: boolean;

  constructor(groups: Array<GroupBetTypeAddRequest>, isChecked: boolean, name: string, isDisable: boolean) {
    this.isChecked = isChecked;
    this.isDisable = isDisable;
    this.name = name;
    this.groupBetTypes = [];
    groups.forEach(x => {
      const group = new GroupBetTypeAddRequest(x.groupName, x.betTypes, isChecked, isDisable);
      this.groupBetTypes.push(group);
    });
  }

  changeCheckGroupByBetTypes() {
    this.groupBetTypes.forEach(x => {
      x.isChecked = x.betTypes.every(y => y.isChecked);
    });
  }

  changeCheckedModelToGroup() {
    this.groupBetTypes.forEach(x => {
      x.isChecked = this.isChecked && x.isShow;
      x.changeCheckedGroupToBetType();
    });
  }

  changeCheckedGroupToModel() {
    let isCheckedAll = true;
    let isHideAll = true;
    for (let i = 0; i < this.groupBetTypes.length && isCheckedAll; i++) {
      if (this.groupBetTypes[i].isShow) {
        isCheckedAll = this.groupBetTypes[i].isChecked;
      }
      if (isHideAll) {
        isHideAll = !this.groupBetTypes[i].isShow;
      }
    }

    this.isChecked = isCheckedAll && !isHideAll;
  }

  getCheckedBetTypes(): BetTypeAddRequest[] {
    return this.groupBetTypes.flatMap(x => x.getCheckedBetTypes());
  }

  getAllBetTypes(): BetTypeAddRequest[] {
    return this.groupBetTypes.flatMap(x => x.betTypes);
  }

  checkBetType(betTypes: number[]) {
    this.groupBetTypes.forEach(x => {
      x.betTypes.forEach(y => {
        y.isChecked = betTypes.includes(y.id);
      });
    });
    this.changeCheckGroupByBetTypes();
    this.changeCheckedGroupToModel();
  }

  checkAllBetType() {
    this.groupBetTypes.forEach(x => {
      x.betTypes.forEach(y => {
        y.isChecked = true;
      });
    });
    this.changeCheckGroupByBetTypes();
    this.changeCheckedGroupToModel();
  }
}

export class GetBetTypesQuery {
  mode: number;
  matchId: number;
  betTypes?: string;
}

export class Result {
  errorCode: number;
  errorMsg: string;
}