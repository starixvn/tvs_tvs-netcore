import { Component, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';
import { RequestDetailViewModel } from '../../../edit-request/app/request.model';
import { IssueInfo } from '../../../utility/models/issue-type.model';
import { CommonService } from '../../../utility/services/common.service';
import { StaticService } from '../../../utility/services/static.service';
import { TicketListModal } from './ticket-list.modal';
import { RequestInfoComponent } from './request-info/request-info.component';
import { BlockUiModule } from '../../../utility/components/block-ui/block-ui.module';

@Component({
  standalone: true,
  selector: 'ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss'],
  imports: [RequestInfoComponent, BlockUiModule]
})
export class TicketListComponent implements OnChanges {
  @Input() modal: TicketListModal;
  @Output() modalChange = new EventEmitter<TicketListModal>();
  requestDetail = new RequestDetailViewModel();
  issue = new IssueInfo();
  isBlock: boolean;
  isShowRequestInfo: boolean;

  commonService = inject(CommonService);

  async ngOnChanges() {
    if (this.modal.open) {
      this.isBlock = true;
      this.requestDetail = await this.commonService.getRequestById(this.modal.requestId);
      this.isBlock = false;
      this.issue = await this.commonService.getIssueInfo(StaticService.getSubIssueTypeId(this.requestDetail));
      this.isShowRequestInfo = true;
    }
  }
}
