
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
  betTypes: BetTypeAddRequest[] = [];
  isChecked: boolean;
  isShow: boolean;
  isDisable: boolean;
}

export class GroupBetTypesAddRequestModel {
  groupBetTypes: GroupBetTypeAddRequest[] = [];
  name: string = '';
  isChecked: boolean = false;
  isDisable: boolean = false;
  isCollapsed: boolean = false;
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