import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { EventBaseLayoutComponent } from '../../../component/event-base-layout/event-base-layout.component';
import { OthersComponent } from '../../../component/others/others.component';
import { RequestModel } from '../../../models/request.model';
import { EventEarlyKickOffComponent } from './event-early-kick-off/event-early-kick-off.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [EventBaseLayoutComponent, CommonModule, EventEarlyKickOffComponent, OthersComponent],
})
export class AppComponent {
  @ViewChild('eventEarlyKickOff') eventEarlyKickOffComponent: EventEarlyKickOffComponent;
  model = new RequestModel();
  issueTypeId: string;

  ngOnInit() {
    this.issueTypeId = window.issueTypeId || IssueTypeConstant.EARLY_KICK_OFF;
  }
  
  public async saveRequest(): Promise<void> {
    this.eventEarlyKickOffComponent.saveRequest();
  }
}