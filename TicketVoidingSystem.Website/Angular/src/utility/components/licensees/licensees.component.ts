import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GroupLicenseeModel, Licensee } from './licensees.model';

@Component({
  standalone: true,
  selector: 'licensees',
  templateUrl: './licensees.component.html',
  styleUrls: ['./licensees.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class LicenseesComponent {
  @Input() model = new GroupLicenseeModel([], true);
  @Input() disabled: boolean;
  @Output() groupLicenseesChange = new EventEmitter<Licensee[]>();
  checkAllLicensee = true;

  changeLicensees() {
    this.groupLicenseesChange.emit(this.model.getCheckedLicensees());
  }
}
