import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
import clone from 'lodash/clone';
import { ChildMatchModel } from '../../../add-request-new/models/related-event.model';
import { BlockUiDirective } from '../block-ui/block-ui.directive';
import { AddChildMatchModel } from './add-child-match.model';

@Component({
  standalone: true,
  selector: 'add-child-match',
  templateUrl: './add-child-match.component.html',
  styleUrls: ['./add-child-match.component.scss'],
  imports: [FormsModule, BlockUiDirective]
})
export class AddChildMatchComponent implements OnChanges {
  @Input() relatedEvents: ChildMatchModel[] = [];
  @Input() model = new AddChildMatchModel();
  @Output() selectedEventsChange = new EventEmitter<ChildMatchModel[]>();
  @Output() changeEvent = new EventEmitter();
  @Output() isOpenChange = new EventEmitter<boolean>();

  isBlock = false;
  tempRelatedEvents: ChildMatchModel[] = [];
  isCheckedAll: boolean;

  async ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes['model']) {
      this.tempRelatedEvents = clone(this.relatedEvents);
      this.tempRelatedEvents = this.tempRelatedEvents.filter(x => x.matchType === this.model.matchType);
      this.tempRelatedEvents.forEach(x => {
        x.isChecked = this.model.selectedMatchIds.some(y => y === x.matchId);
      });
      this.handleCheckBox();
    }
  }

  handleCheckBox(): void {
    if (!this.tempRelatedEvents.some(x => !x.isChecked)) {
      this.isCheckedAll = true;
    }
    if (this.tempRelatedEvents.some(x => !x.isChecked)) {
      this.isCheckedAll = false;
    }
  }

  isMatchExisted(matches: ChildMatchModel[], matchId: number): boolean {
    const childMatch = matches.find(x => x.matchId === matchId);

    if (childMatch) {
      return true;
    }
    return false;
  }

  saveSelectedRelatedEvents(): void {
    this.selectedEventsChange.emit(this.tempRelatedEvents.filter(x => x.isChecked));
    this.closeChildMatchModal();
  }

  closeChildMatchModal(): void {
    this.tempRelatedEvents = [];
    this.model.isOpen = false;
    this.isOpenChange.emit(false);
  }

  clickButtonSave() {
    this.changeEvent.emit();
  }

  handleCheckAllMatches(event) {
    this.tempRelatedEvents.forEach(x => {
      if (x.matchType === this.model.matchType) {
        x.isChecked = event.target.checked;
      }
    });
  }
}