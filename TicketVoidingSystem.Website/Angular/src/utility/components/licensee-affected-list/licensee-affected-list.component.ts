import { Component, Input, OnChanges, SimpleChange } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { AffectedLicensee } from './licensee-affected-list.model';

@Component({
  selector: 'licensee-affected-list',
  templateUrl: './licensee-affected-list.component.html',
  styleUrls: ['./licensee-affected-list.component.scss']
})
export class LicenseeAffectedListComponent implements OnChanges{
  @Input() licenseeAffectedList: AffectedLicensee[] = [];
  @Input()  isDisplay = true;
  public affectedLicenseeNormal: string = '';

  constructor(private readonly clipboardService: ClipboardService) { }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    if(changes["licenseeAffectedList"] && this.isDisplay){
      this.initFilter();
    }
  } 

  private updateDisplayAffectedLicensee() {
    this.licenseeAffectedList.forEach( x => x.show = x.group !== "normal" && x.licenseesName.length > 0);
  }

  private initFilter(){
    if(this.licenseeAffectedList?.length > 0){
      this.affectedLicenseeNormal = this.licenseeAffectedList[0].licenseesName;
      this.updateDisplayAffectedLicensee();
    }
  }
  
  isShowAffectedLicenseeArea(): boolean {
    return this.licenseeAffectedList?.findIndex( x => x.licenseesName.length > 0) >= 0 && this.isDisplay;
  }

  copyClipboard(text: string): void {
    this.clipboardService.copyFromContent(text);
    alert('The Licensee list has been copied to clipboard.');
  }
}
