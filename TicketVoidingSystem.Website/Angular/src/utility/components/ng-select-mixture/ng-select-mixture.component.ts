import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgSelectMixtureItem } from './ng-select-mixture-item.model';
import { NgSelectMixtureModel } from './ng-select-mixture.model';
import { NgSelectTreeViewComponent } from './ng-select-tree-view/ng-select-tree-view.component';
import { NgSelectMixtureService } from './ng-select-mixture.service';

@Component({
  standalone: true,
  selector: 'ng-select-mixture',
  templateUrl: './ng-select-mixture.component.html',
  styleUrls: ['./ng-select-mixture.component.scss'],
  viewProviders: [NgSelectTreeViewComponent],
  imports: [FormsModule, CommonModule, NgSelectModule, NgSelectTreeViewComponent]
})
export class NgSelectMixtureComponent implements OnInit {
  @Input() selectedItems: string[];
  @Input() isDisabled: boolean;
  @Input() model = new NgSelectMixtureModel();
  @Output() checkedItems = new EventEmitter<string[]>();
  isCollapse: boolean;
  
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly ngSelectMixtureService = inject(NgSelectMixtureService);
  
  ngOnInit(): void {
    this.checkBySelectedItem();
    this.getTitle();
  }

  ngAfterViewInit(): void {
    this.renderer.listen('body', 'click', this.handleBodyClick);
  }

  private checkBySelectedItem(): void {
    this.model.items.forEach(x => this.ngSelectMixtureService.checkBySelectedItem(x, this.selectedItems));
  }

  public clickButton(): void {
    this.isCollapse = !this.isCollapse;
  }

  private getTitle() {
    this.model.title = this.ngSelectMixtureService.getDisplayedText(this.model, this.selectedItems);
  }

  public emitSingleEvent(item: NgSelectMixtureItem): void {
    this.isCollapse = false;
    this.model.items.forEach(x => {
      this.ngSelectMixtureService.unCheckChild(x.items);
      this.ngSelectMixtureService.checkFromChild(x);
    });
    this.model.title = item.name;
    this.model.isShowPlaceHolder = false;
    this.checkedItems.emit([item.value]);
  }

  public emitChildEvent(): void {
    this.model.title = this.ngSelectMixtureService.getDisplayedAllChildItems(this.model);
  }

  private readonly handleBodyClick = (event: MouseEvent): void => {
    if (!this.isCollapse || !event.target) {
      return;
    }

    const clickedElement = event.target as Node;
    if (!this.elementRef.nativeElement.contains(clickedElement)) {
      this.isCollapse = false;
      if (!this.isDisabled) {
        this.checkedItems.emit(this.ngSelectMixtureService.getValueItems(this.model.items));
      }
    }
  };
}
