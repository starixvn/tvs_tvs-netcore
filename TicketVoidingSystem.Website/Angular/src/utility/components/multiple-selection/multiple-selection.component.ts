import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, ViewContainerRef } from '@angular/core';
import { ItemsSelect } from './items-select';
import { MultipleSelection } from './multiple-selection';
import { TreeViewComponent } from './tree-view/tree-view.component';

@Component({
  selector: 'multiple-selection',
  templateUrl: './multiple-selection.component.html',
  styleUrls: ['./multiple-selection.component.scss'],
  viewProviders: [TreeViewComponent]
})

export class MultipleSelectionComponent implements OnInit, OnChanges {
  @Input() selectedItems: string[];
  @Input() multipleSelect = new MultipleSelection();
  @Input() isDisabled: boolean;
  @Output() loseFocus = new EventEmitter();
  @Output() checkedItems = new EventEmitter<string[]>();

  isCollapse: boolean;
  isExpanded: boolean;
  elementDocument: Element;
  itemsSelect: ItemsSelect[];

  constructor(viewContainerRef: ViewContainerRef) {
    this.elementDocument = viewContainerRef.element.nativeElement;
  }

  async ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes['isDisabled'] && this.isDisabled) {
      this.multipleSelect.items.forEach(x => x.checked = true);
      this.getTitle();
    }
    if (changes['multipleSelect']) {
      this.getTitle();
    }
  }

  ngOnInit() {
    this.isExpanded = true;
    this.checkBySelectedItem();
    this.getTitle();
    this.clickToBody();
  }

  private checkBySelectedItem(): void {
    this.multipleSelect.items.forEach(x => {
      x.checkBySelectedItem(this.selectedItems);
      x.checkFromChilds();
    });
  }

  getTitle() {
    this.multipleSelect.selectionTitle = this.multipleSelect.getDisplayedItems();
    this.multipleSelect.isCheckAll = this.multipleSelect.selectionTitle === this.multipleSelect.allItemsCheckedText;
  }

  private clickToBody() {
    const body = document.querySelector('body');
    body.addEventListener('click', e => {
      if (!this.isCollapse || !e.target) {
        return;
      }
      if (this.elementDocument !== e.target && !this.elementDocument.contains((e.target as Node))) {
        this.isCollapse = false;
        this.loseFocus.emit(this.multipleSelect.getValueItems());
      }
    }, false);
  }

  changeItems() {
    const rootItems = this.multipleSelect.items;
    let countChecked = 0;
    let count = 0;
    rootItems.forEach(item => {
      item.checkFromChilds();
      countChecked += item.countChildsChecked();
      count += item.countChilds;
    });

    this.multipleSelect.selectionTitle = this.multipleSelect.getDisplayedItems();
    this.multipleSelect.isCheckAll = count === countChecked;
    this.checkedItems.emit(this.multipleSelect.getValueItems().split(',').filter(x => x !== ''));
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
    this.multipleSelect.items.forEach(item => {
      item.expanded = this.isExpanded;
      if (this.isExpanded) {
        item.expandedAllItems();
      }
    });
  }
}
