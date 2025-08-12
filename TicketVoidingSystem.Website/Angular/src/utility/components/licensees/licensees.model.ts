export class GroupLicenseeModel {
  groupLicensees: GroupLicensee[];
  isChecked: boolean;

  constructor(groupLicensees: GroupLicensee[], isChecked: boolean) {
    this.isChecked = isChecked;
    this.groupLicensees = (groupLicensees || []).map(x => new GroupLicensee(x.groupName, x.licensees, isChecked));
  }

  changeCheckAllLicensee() {
    this.groupLicensees.forEach(group => {
      group.isChecked = this.isChecked;
      group.checkedGroup();
    });
  }

  changeCheckGroupToModel() {
    this.isChecked = this.groupLicensees.every(group => group.isChecked);
  }

  getCheckedLicensees(): Licensee[] {
    return this.groupLicensees.flatMap(group => group.licensees.filter(licensee => licensee.isChecked));
  }

  checkLicenseesByName(selectedLicenseeNames: string[]) {
    this.groupLicensees.forEach(x => {
      x.licensees.forEach(y => {
        y.isChecked = selectedLicenseeNames?.includes(y.name);
      });
      x.isChecked = x.licensees.every(y => y.isChecked);
    });
    this.isChecked = this.groupLicensees.every(x => x.isChecked);
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

  checkedGroup() {
    this.licensees.forEach(item => {item.isChecked = this.isChecked});
  }

  checkedLicensee() {
    this.isChecked = this.licensees.every(item => item.isChecked);
  }
}