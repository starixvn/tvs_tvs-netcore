import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmWrongScoreModel } from './confirm-wrong-score.model';

@Component({
  standalone: true,
  selector: 'confirm-wrong-score',
  templateUrl: './confirm-wrong-score.component.html',
  styleUrls: ['./confirm-wrong-score.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class ConfirmWrongScoreComponent {
  @Input() model = new ConfirmWrongScoreModel();
  @Output() close = new EventEmitter();
  @Output() save = new EventEmitter();

  closeClick() {
    this.model.isOpenDialog = false;
    this.close.emit();
  }

  saveClick() {
    this.model.isOpenDialog = false;
    this.save.emit();
  }
}
