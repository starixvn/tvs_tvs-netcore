import { Injectable } from '@angular/core';
import { GroupLicensee, GroupLicenseeModel } from './licensees.model';

@Injectable({
  providedIn: 'root'
})
export class LicenseesService {
  changeCheckAllLicensee(groupLicensee: GroupLicenseeModel) {
    groupLicensee.groupLicensees.forEach(group => {
      group.isChecked = groupLicensee.isChecked;
      this.checkedGroup(group);
    });
  }

  changeCheckGroupToModel(groupLicensee: GroupLicenseeModel) {
    groupLicensee.isChecked = groupLicensee.groupLicensees.every(group => group.isChecked);
  }

  getCheckedLicensees(groupLicensees: GroupLicensee[]) {
    return groupLicensees.flatMap(group => group.licensees.filter(licensee => licensee.isChecked));
  }

  checkLicenseesByName(groupLicensee: GroupLicenseeModel, selectedLicenseeNames: string[]) {
    groupLicensee.groupLicensees.forEach(x => {
      x.licensees.forEach(y => {
        y.isChecked = selectedLicenseeNames?.includes(y.name);
      });
      x.isChecked = x.licensees.every(y => y.isChecked);
    });
    groupLicensee.isChecked = groupLicensee.groupLicensees.every(x => x.isChecked);
  }

  checkedGroup(group: GroupLicensee) {
    group.licensees.forEach(item => {item.isChecked = group.isChecked});
  }

  checkedLicensee(group: GroupLicensee) {
    group.isChecked = group.licensees.every(item => item.isChecked);
  }
}
