import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChange, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ItemsSelect } from './items-select';
import { MultipleSelection } from './multiple-selection.model';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { MultipleSelectionService } from './multiple-selection.service';
import { ItemsSelectService } from './items-select.service';

@Component({
  standalone: true,
  selector: 'multiple-selection',
  templateUrl: './multiple-selection.component.html',
  styleUrls: ['./multiple-selection.component.scss'],
  imports: [CommonModule, FormsModule, TreeViewComponent]
})

export class MultipleSelectionComponent implements OnInit, OnChanges {
  @Input() selectedItems: string[] = [];
  @Input() multipleSelect = new MultipleSelection();
  @Input() isDisabled: boolean;
  @Output() loseFocus = new EventEmitter();
  @Output() checkedItems = new EventEmitter<string[]>();

  private readonly multipleSelectionService = inject(MultipleSelectionService);
  private readonly itemsSelectService = inject(ItemsSelectService);

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
    if (changes['selectedItems']) {
      this.checkBySelectedItem(this.selectedItems);
    }
  }

  ngOnInit() {
    this.isExpanded = true;
    this.getTitle();
    this.clickToBody();
  }

  public checkBySelectedItem(selectedItems: string[]): void {
    this.multipleSelect.items.forEach(x => {
      this.itemsSelectService.checkBySelectedItem(x, selectedItems);
      this.itemsSelectService.checkFromChilds(x);
    });
    this.updateMultipleSelect();
  }

  getTitle() {
    this.multipleSelect.selectionTitle = this.multipleSelectionService.getDisplayedItems(this.multipleSelect);
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
        this.loseFocus.emit(this.multipleSelectionService.getValueItems(this.multipleSelect));
      }
    }, false);
  }

  changeItems() {
    this.updateMultipleSelect();
    this.checkedItems.emit(this.multipleSelectionService.getValueItems(this.multipleSelect).split(',').filter(x => x !== ''));
  }

  updateMultipleSelect() {
    const rootItems = this.multipleSelect.items;
    let countChecked = 0;
    let count = 0;
    rootItems.forEach(item => {
      this.itemsSelectService.checkFromChilds(item);
      countChecked += this.itemsSelectService.countChildsChecked(item);
      count += item.countChilds;
    });

    this.multipleSelect.selectionTitle = this.multipleSelectionService.getDisplayedItems(this.multipleSelect);
    this.multipleSelect.isCheckAll = count === countChecked;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
    this.multipleSelect.items.forEach(item => {
      item.expanded = this.isExpanded;
      if (this.isExpanded) {
        this.itemsSelectService.expandedAllItems(item);
      }
    });
  }

  checkAllItems(){
    this.multipleSelectionService.checkAllItems(this.multipleSelect, this.multipleSelect.isCheckAll);
  }
}
