import { Component, inject, Input, OnChanges, SimpleChange } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { AffectedLicensee } from './licensee-affected-list.model';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'licensee-affected-list',
  templateUrl: './licensee-affected-list.component.html',
  styleUrls: ['./licensee-affected-list.component.scss'],
  imports: [CommonModule]
})
export class LicenseeAffectedListComponent implements OnChanges {
  @Input() licenseeAffectedList: AffectedLicensee[] = [];
  @Input() isDisplay = true;
  clipboardService = inject(ClipboardService);
  affectedLicenseeNormal = '';

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes["licenseeAffectedList"] && this.isDisplay) {
      this.initFilter();
    }
  }

  private updateDisplayAffectedLicensee() {
    this.licenseeAffectedList.forEach(x => x.show = x.group !== "normal" && x.licenseesName.length > 0);
  }

  private initFilter() {
    if (this.licenseeAffectedList?.length > 0) {
      this.affectedLicenseeNormal = this.licenseeAffectedList[0].licenseesName;
      this.updateDisplayAffectedLicensee();
    }
  }

  isShowAffectedLicenseeArea(): boolean {
    return this.licenseeAffectedList?.findIndex(x => x.licenseesName.length > 0) >= 0 && this.isDisplay;
  }

  copyClipboard(text: string): void {
    this.clipboardService.copyFromContent(text);
    alert('The Licensee list has been copied to clipboard.');
  }
}
