import { Component, inject } from '@angular/core';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { BlockUiDirective } from '../../utility/components/block-ui/block-ui.directive';
import { MenuBarComponent } from '../../utility/components/menu-bar/menu-bar.component';
import { IssueTypeIconConstant } from '../../utility/constants/issue-type-icon.constant';
import { IssueTypeConstant } from '../../utility/constants/issue-type.constant';
import { CommonService } from '../../utility/services/common.service';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { AppService } from './app.service';
import { IssueTypeHomePage } from './models/issue-type-home-page.model';

dayjs.extend(utc);
dayjs.extend(timezone);

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [MenuBarComponent, BlockUiDirective]
})
export class AppComponent{
  signalRService = inject(SignalRService);
  commonService = inject(CommonService);
  appService = inject(AppService);

  isLoading = true;
  currentMonth = dayjs().tz('America/Caracas').format('MMMM');
  issueTypes: IssueTypeHomePage[] = [];

  async ngOnInit() {
    await this.getIssueTypesPermission();
    await this.updateRequestTotalByIssueType();
    await this.signalRService.initializeConnection();
  }

  async getIssueTypesPermission() {
    const result = await this.commonService.getIssueTypePermissionList();
    this.issueTypes = result.map(issueType => (
      {
        issueTypeId: issueType.issueTypeId,
        issueTypeName: issueType.issueTypeName,
        totalRequest: null,
        icon: IssueTypeIconConstant.getIconClassFromHomePage(issueType)
      } as IssueTypeHomePage));
    this.isLoading = false;
  }

  async updateRequestTotalByIssueType() {
    const result = await this.appService.getIssueTypeHomePage(this.issueTypes.map(issueType => issueType.issueTypeId).join(','));
    this.issueTypes.forEach(issueType => {
      const issueTypeResult = result.find(result => result.issueTypeId === issueType.issueTypeId);
      if (issueTypeResult) {
        issueType.totalRequest = issueTypeResult.totalRequest;
      } else {
        issueType.totalRequest = 0;
      }
    });
  }

  openIssueType(issueType: IssueTypeHomePage) {
    const url = IssueTypeConstant.NAVIGATE_ADD_REQUEST.get(issueType.issueTypeId.toString());
    if (url) {
      window.open(`${document.body.getAttribute('root-url')}${url}`, '_blank');
    }
  }

  navigateToIssueType(issueTypeId: number) {
    const url = IssueTypeConstant.NAVIGATE_ADD_REQUEST.get(issueTypeId.toString());
    if (url) {
      window.open(`${document.body.getAttribute('root-url')}${url}`, '_blank');
    }
  }
}
