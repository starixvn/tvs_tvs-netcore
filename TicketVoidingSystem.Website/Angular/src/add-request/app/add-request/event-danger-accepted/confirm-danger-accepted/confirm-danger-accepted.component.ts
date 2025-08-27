import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmDangerAcceptedModel } from './confirm-danger-accepted.model';
import { TVSRequestActionType } from '../../../../../utility/constants/config';

@Component({
  standalone: true,
  selector: 'confirm-danger-accepted',
  templateUrl: './confirm-danger-accepted.component.html',
  styleUrls: ['./confirm-danger-accepted.component.scss'],
  imports: [FormsModule]
})
export class ConfirmDangerAcceptedComponent implements OnChanges {
  @Input() isOpen: boolean;
  @Input() model = new ConfirmDangerAcceptedModel();
  @Input() siteDBDownInfoJson: string;
  @Input() action: string;
  @Output() clickCancel = new EventEmitter();
  @Output() clickOk = new EventEmitter();
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      const isShowCheckbox = this.siteDBDownInfoJson?.length > 0 && this.action !== TVSRequestActionType.TAKE_NOTE_ID.toString();
      this.model.isHasAffectedTicketSiteDBDown = isShowCheckbox;
      this.model.isMarkTicketSiteDbDown = isShowCheckbox;    }
  }
  
  onClickCancel() {
    this.model.isOpenDialog = false;
    this.clickCancel.emit();
  }

  onClickOk() {
    this.model.isOpenDialog = false;
    this.clickOk.emit();
  }
}
