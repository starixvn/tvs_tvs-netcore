export class Licensee {
  id: number;
  name: string;
  isChecked: boolean;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    this.isChecked = false;
  }
}

export class GroupLicensee {
  groupName: string;
  licensees: Licensee[];
  isChecked: boolean;
  isCollapse: boolean;

  constructor(groupName: string, licensees: Licensee[]) {
    this.groupName = groupName;
    this.licensees = licensees;
    this.defaultChecked();
  }

  defaultChecked() {
    this.isChecked = true;
    this.isCollapse = true;
    this.checkedGroup();
  }

  checkedGroup() {
    this.licensees.forEach(item => {
      item.isChecked = this.isChecked;
    });
  }

  checkedLicensee() {
    let temp = true;
    for (let i = 0; i < this.licensees.length && temp; i++) {
      if (!this.licensees[i].isChecked) {
        temp = false;
      }
    }

    this.isChecked = temp;
  }

  getLicenseesName(): string[] {
    const result: string[] = [];
    this.licensees.forEach(item => {
      if (item.isChecked) {
        result.push(item.name);
      }
    });

    return result;
  }
}
