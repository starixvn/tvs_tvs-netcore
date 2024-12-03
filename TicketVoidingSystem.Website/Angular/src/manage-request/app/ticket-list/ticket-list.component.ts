import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { RequestDetailViewModel } from '../../../edit-request/app/request.model';
import { IssueInfo } from '../../../utility/models/issue-type.model';
import { CommonService } from '../../../utility/services/common.service';
import { StaticService } from '../../../utility/services/static.service';
import { TicketListModal } from './ticket-list.modal';

@Component({
  selector: 'ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnChanges {
  @Input() modal: TicketListModal;
  @Output() modalChange = new EventEmitter<TicketListModal>();
  requestDetail = new RequestDetailViewModel();
  issue = new IssueInfo();
  isBlock: boolean;
  isShowRequestInfo: boolean;

  constructor(
    private readonly commonService: CommonService
  ) { }

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
