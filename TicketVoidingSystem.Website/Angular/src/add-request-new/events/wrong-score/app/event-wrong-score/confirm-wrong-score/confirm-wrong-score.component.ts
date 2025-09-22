import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TVSRequestActionType } from '../../../../../../utility/constants/config';
import { ConfirmWrongScoreModel } from './confirm-wrong-score.model';

@Component({
  standalone: true,
  selector: 'confirm-wrong-score',
  templateUrl: './confirm-wrong-score.component.html',
  styleUrls: ['./confirm-wrong-score.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class ConfirmWrongScoreComponent implements OnChanges {
  @Input() isOpen: boolean;
  @Input() model = new ConfirmWrongScoreModel();
  @Input() siteDBDownInfoJson: string;
  @Input() action: string;
  @Output() close = new EventEmitter();
  @Output() save = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.checkMarkTicketSiteDbDown();
    }
  }

  private checkMarkTicketSiteDbDown(): void {
    const isShowCheckbox = this.siteDBDownInfoJson?.length > 0 && this.action !== TVSRequestActionType.TAKE_NOTE_ID.toString();
    this.model.isHasAffectedTicketSiteDBDown = isShowCheckbox;
    this.model.isMarkTicketSiteDbDown = isShowCheckbox;
  }

  closeClick() {
    this.model.isOpenDialog = false;
    this.close.emit();
  }

  saveClick() {
    this.model.isOpenDialog = false;
    this.save.emit();
  }
}
