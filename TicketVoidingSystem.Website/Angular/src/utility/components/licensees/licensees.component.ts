import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GroupLicensee, GroupLicenseeModel, Licensee } from './licensees.model';
import { LicenseesService } from './licensees.service';

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

  private readonly licenseesService = inject(LicenseesService);
  
  checkAllLicensee = true;

  changeLicensees() {
    this.groupLicenseesChange.emit(this.licenseesService.getCheckedLicensees(this.model.groupLicensees));
  }

  changeCheckAllLicensee(){
    this.licenseesService.changeCheckAllLicensee(this.model);
  }

  changeCheckGroupToModel(){
    this.licenseesService.changeCheckGroupToModel(this.model);
    this.changeLicensees();
  }

  checkedGroup(group: GroupLicensee){
    this.licenseesService.checkedGroup(group);
  }

  checkedLicensee(group: GroupLicensee){
    this.licenseesService.checkedLicensee(group);
  }
}
