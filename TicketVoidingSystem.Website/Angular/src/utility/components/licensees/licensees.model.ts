export class GroupLicenseeModel {
  groupLicensees: GroupLicensee[];
  isChecked: boolean;

  constructor(groupLicensees: GroupLicensee[], isChecked: boolean) {
    this.isChecked = isChecked;
    this.groupLicensees = (groupLicensees || []).map(x => new GroupLicensee(x.groupName, x.licensees, isChecked));
  }
}

export class Licensee {
  id: number;
  name: string;
  isChecked: boolean;

  constructor(id: number, name: string, isChecked: boolean) {
    this.id = id;
    this.name = name;
    this.isChecked = isChecked;
  }
}

export class GroupLicensee {
  groupName: string;
  licensees: Licensee[];
  isChecked: boolean;
  isCollapse: boolean;

  constructor(groupName: string, licensees: Licensee[], isChecked: boolean) {
    this.isCollapse = true;
    this.isChecked = isChecked;
    this.groupName = groupName;
    this.licensees = licensees.map(x => new Licensee(x.id, x.name, isChecked));
  }
}