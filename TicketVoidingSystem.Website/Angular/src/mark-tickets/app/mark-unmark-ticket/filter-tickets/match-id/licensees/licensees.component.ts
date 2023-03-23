import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GroupLicensee } from './licensees.model';

@Component({
  selector: 'licensees',
  templateUrl: './licensees.component.html',
  styleUrls: ['./licensees.component.scss']
})
export class LicenseesComponent implements OnInit {
  @Input() groupLicensees: GroupLicensee[];
  @Output() groupLicenseesChange = new EventEmitter<GroupLicensee[]>();
  checkAllLicensee = true;
  constructor() { }

  ngOnInit() {
  }

  changeCheckAllLicensee() {
    this.groupLicensees.forEach(group => {
      group.isChecked = this.checkAllLicensee;
      group.checkedGroup();
    });
  }

  checkAllCheckBox() {
    let isChecked = true;
    this.groupLicensees.forEach(group => {
      if (!group.isChecked) {
        isChecked = false;
      }
    });

    this.checkAllLicensee = isChecked;
  }

  changeLicensees() {
    this.groupLicenseesChange.emit(this.groupLicensees);
  }
}
