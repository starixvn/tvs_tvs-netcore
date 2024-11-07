import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GroupLicenseeModel, Licensee } from './licensees.model';

@Component({
  selector: 'licensees',
  templateUrl: './licensees.component.html',
  styleUrls: ['./licensees.component.scss']
})
export class LicenseesComponent {
  @Input() model = new GroupLicenseeModel([], true);
  @Input() disabled: boolean;
  @Output() groupLicenseesChange = new EventEmitter<Licensee[]>();
  checkAllLicensee = true;
  constructor() { }

  changeLicensees() {
    this.groupLicenseesChange.emit(this.model.getCheckedLicensees());
  }
}
