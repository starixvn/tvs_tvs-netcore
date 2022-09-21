import { Component, ElementRef, OnInit } from '@angular/core';
import { Tooltip } from 'src/utility/components/tooltip/tooltip.model';
import { TEXT } from 'src/utility/constants/text';
import { AppApiService } from '../app-api.service';

@Component({
  selector: 'scanning-auto-void',
  templateUrl: './scanning-auto-void.component.html',
  styleUrls: ['./scanning-auto-void.component.scss']
})
export class ScanningAutoVoidComponent implements OnInit {
  tooltip = new Tooltip();
  isBlock: boolean;
  broadcastSessionId: string;
  constructor(private readonly element: ElementRef,
    private readonly appApiService: AppApiService) {
    this.tooltip.element = this.element;
  }

  ngOnInit(): void {
  }

  searchAutoVoidRequestQueue(): void {
    this.resetData();
    if (!this.isValidSearchQuery()) {
      return;
    }
    this.isBlock = true;
    // this.model = await this.appService.getVoidBetAutomationInfo(this.initQuerySelect());
     this.isBlock = false;
    // if (!this.model || !this.model.requestId) {
    //   this.isNoData = true;
    // }
    // this.orgStatusId = this.tmpStatusId = this.model?.statusId.toString();
  }

  private resetData(): void {

  }

  private isValidSearchQuery(): boolean {
    if (!this.broadcastSessionId || this.broadcastSessionId.trim() === '') {
      this.tooltip.display('broadcast-session-id', TEXT.REQUIRED_INPUT);
      return false;
    }

    return true;
  }
}
