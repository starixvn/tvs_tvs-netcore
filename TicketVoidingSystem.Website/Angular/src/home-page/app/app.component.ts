import { Component, inject } from '@angular/core';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { MenuBarComponent } from '../../utility/components/menu-bar/menu-bar.component';
import { CommonService } from '../../utility/services/common.service';
import { IssueType } from '../../utility/models/issue-type.model';
import { IssueTypeConstant } from '../../utility/constants/issue-type.constant';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [MenuBarComponent]
})
export class AppComponent{
  signalRService = inject(SignalRService);
  commonService = inject(CommonService);

  issueTypePermissionList: IssueType[];

  async ngOnInit() {
    this.issueTypePermissionList = await this.commonService.getIssueTypePermissionList();

    await this.signalRService.initializeConnection();
  }
  
  navigateToIssueType(issueTypeId: number) {
    const url = IssueTypeConstant.NAVIGATE_ADD_REQUEST.get(issueTypeId.toString());
    if (url) {
      window.open(`${document.body.getAttribute('root-url')}${url}`, '_blank');
    }
  }
}
