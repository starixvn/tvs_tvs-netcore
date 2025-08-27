import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ConfirmEarlyKickOffModel } from './confirm-eko.model';
import { FormsModule } from '@angular/forms';
import { TVSRequestActionType } from '../../../../../utility/constants/config';

@Component({
  selector: 'confirm-eko',
  templateUrl: './confirm-eko.component.html',
  styleUrls: ['./confirm-eko.component.scss'],
  standalone: true,
  imports: [FormsModule]
})
export class ConfirmEkoComponent implements OnChanges {
  @Input() isOpen: boolean;
  @Input() model = new ConfirmEarlyKickOffModel();
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
