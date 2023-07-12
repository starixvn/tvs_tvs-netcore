import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgSelectMixtureItem } from '../ng-select-mixture-item.model';

@Component({
  selector: 'ng-select-tree-view',
  templateUrl: './ng-select-tree-view.component.html',
  styleUrls: ['./ng-select-tree-view.component.scss']
})
export class NgSelectTreeViewComponent {
  @Input() items: NgSelectMixtureItem[];
  @Input() isDisabled: boolean;
  @Input() paddingLeft = 10;
  @Output() emitSingleEvent = new EventEmitter<NgSelectMixtureItem>();
  @Output() emitchildEvent = new EventEmitter<string>();

  public handleClickSingleItem(item: NgSelectMixtureItem) {
    item.checked = true;
    this.unCheckOtherItem(item);
    this.emitSingleEvent.emit(item);
  }

  private unCheckOtherItem(selectedItem: NgSelectMixtureItem) {
    this.items.filter(x => x.value !== selectedItem.value).forEach(x => x.checked = false);
  }

  public handleClickChildItem() {
    this.emitchildEvent.emit();
    this.items.filter(x => x.isSingleSelect()).forEach(x => x.checked = false);
  }

  public checkFromChildEvent(item: NgSelectMixtureItem) {
    item.checkFromChilds();
  }

  public isHaveCheckBox(item: NgSelectMixtureItem) {
    return item.items.length > 0 || item.parentId < 0;
  }
}
