import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectMixtureItem } from '../ng-select-mixture-item.model';
import { NgSelectMixtureService } from '../ng-select-mixture.service';

@Component({
  standalone: true,
  selector: 'ng-select-tree-view',
  templateUrl: './ng-select-tree-view.component.html',
  styleUrls: ['./ng-select-tree-view.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class NgSelectTreeViewComponent {
  @Input() items: NgSelectMixtureItem[];
  @Input() isDisabled: boolean;
  @Input() paddingLeft = 10;
  @Output() emitSingleEvent = new EventEmitter<NgSelectMixtureItem>();
  @Output() emitChildEvent = new EventEmitter<string>();

  private readonly ngSelectMixtureService = inject(NgSelectMixtureService);
  
  public handleClickSingleItem(item: NgSelectMixtureItem) {
    item.checked = true;
    this.unCheckOtherItem(item);
    this.emitSingleEvent.emit(item);
  }

  private unCheckOtherItem(selectedItem: NgSelectMixtureItem) {
    this.items?.filter(x => x.value !== selectedItem.value).forEach(x => x.checked = false);
  }

  public handleClickChildItem() {
    this.emitChildEvent.emit();
    this.items?.filter(x => this.ngSelectMixtureService.isSingleSelect(x.items, x.parentId)).forEach(x => x.checked = false);
  }

  public checkFromChildEvent(item: NgSelectMixtureItem) {
    this.ngSelectMixtureService.checkFromChild(item);
  }

  public isHaveCheckBox(item: NgSelectMixtureItem) {
    return item.items.length > 0 || item.parentId < 0;
  }

  checkChild(item: NgSelectMixtureItem) {
    this.ngSelectMixtureService.checkChild(item);
  }
}
