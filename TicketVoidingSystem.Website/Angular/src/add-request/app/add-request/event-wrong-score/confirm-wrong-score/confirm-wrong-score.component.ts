import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmWrongScoreModel } from './confirm-wrong-score.model';

@Component({
  selector: 'confirm-wrong-score',
  templateUrl: './confirm-wrong-score.component.html',
  styleUrls: ['./confirm-wrong-score.component.scss']
})
export class ConfirmWrongScoreComponent {
  @Input() model = new ConfirmWrongScoreModel();
  @Output() close = new EventEmitter();
  @Output() save = new EventEmitter();

  constructor() { }

  closeClick() {
    this.model.isOpenDialog = false;
    this.close.emit();
  }

  saveClick() {
    this.model.isOpenDialog = false;
    this.save.emit();
  }
}
