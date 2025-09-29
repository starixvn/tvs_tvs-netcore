import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChange, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ItemsSelect } from '../../multiple-selection/items-select';
import { MultipleSelection } from '../../multiple-selection/multiple-selection.model';
import { TreeViewComponent } from './tree-view.component';
import { MultipleSelectionService } from '../../multiple-selection/multiple-selection.service';

@Component({
  standalone: true,
  selector: 'multiple-select',
  templateUrl: './multiple-select.component.html',
  styleUrls: ['./multiple-select.component.scss'],
  viewProviders: [TreeViewComponent],
  imports: [CommonModule, FormsModule, TreeViewComponent]
})

export class MultipleSelectComponent implements OnInit, OnChanges {
  @Input() multipleSelect: MultipleSelection;
  @Input() isDisabled: boolean;
  @Output() loseFocus = new EventEmitter();
  @Output() checkedItems = new EventEmitter<string[]>();

  private readonly multipleSelectionService = inject(MultipleSelectionService);
  
  dropdownToggle: boolean;
  expanded: boolean;
  element: Element;
  items: ItemsSelect[];

  constructor(viewContainerRef: ViewContainerRef) {
    this.element = viewContainerRef.element.nativeElement;
  }

  async ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes['isDisabled'] && this.isDisabled) {
      this.multipleSelect.items.forEach(x => x.checked = true);
      this.getSelectedTitle();
    }
  }

  ngOnInit() {
    this.expanded = true;
    this.getSelectedTitle();
    this.clickBody();
  }

  private getSelectedTitle() {
    this.multipleSelect.selectionTitle = this.multipleSelectionService.getDisplayedItems(this.multipleSelect);
    this.multipleSelect.isCheckAll = this.multipleSelect.selectionTitle === this.multipleSelect.allItemsCheckedText;
  }

  private clickBody() {
    const body = document.querySelector('body');
    body.addEventListener('click', e => {
      if (!this.dropdownToggle || !e.target) {
        return;
      }
      if (this.element !== e.target && !this.element.contains((e.target as Node))) {
        this.dropdownToggle = false;
        this.loseFocus.emit(this.multipleSelectionService.getValueItems(this.multipleSelect));
      }
    }, false);
  }

  changeItems() {
    const rootItems = this.multipleSelect.items;
    let count = 0;
    let countChecked = 0;
    rootItems.forEach(item => {
      item.checkFromChilds();
      count += item.countChilds;
      countChecked += item.countChildsChecked();
    });

    this.multipleSelect.isCheckAll = count === countChecked;
    this.multipleSelect.selectionTitle = this.multipleSelectionService.getDisplayedItems(this.multipleSelect);
    this.checkedItems.emit(this.multipleSelectionService.getValueItems(this.multipleSelect).split(','));
  }

  toggle() {
    this.expanded = !this.expanded;
    this.multipleSelect.items.forEach(item => {
      item.expanded = this.expanded;
      if (this.expanded) {
        item.expandedAllItems();
      }
    });
  }

  checkAllItems(){
    this.multipleSelectionService.checkAllItems(this.multipleSelect, this.multipleSelect.isCheckAll);
  }
}
