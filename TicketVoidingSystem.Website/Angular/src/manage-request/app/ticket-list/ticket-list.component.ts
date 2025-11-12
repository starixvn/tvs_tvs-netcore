import { Component, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';
import { RequestDetailViewModel } from '../../../add-request-new/models/request-detail.model';
import { BlockUiDirective } from '../../../utility/components/block-ui/block-ui.directive';
import { CommonService } from '../../../utility/services/common.service';
import { RequestInfoComponent } from './request-info/request-info.component';
import { TicketListModal } from './ticket-list.modal';

@Component({
  standalone: true,
  selector: 'ticket-list',
  templateUrl: './ticket-list.component.html',
  imports: [RequestInfoComponent, BlockUiDirective]
})
export class TicketListComponent implements OnChanges {
  @Input() modal: TicketListModal;
  @Output() modalChange = new EventEmitter<TicketListModal>();
  requestDetail = new RequestDetailViewModel();
  isBlock: boolean;
  isShowRequestInfo: boolean;
  
  commonService = inject(CommonService);

  async ngOnChanges() {
    if (this.modal.open) {
      this.isBlock = true;
      this.requestDetail = await this.commonService.getRequestById(this.modal.requestId);
      this.isBlock = false;
      this.isShowRequestInfo = true;
    }
  }
}
