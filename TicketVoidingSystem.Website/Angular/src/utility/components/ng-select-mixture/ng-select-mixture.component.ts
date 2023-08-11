import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { NgSelectMixtureItem } from './ng-select-mixture-item.model';
import { NgSelectMixtureModel } from './ng-select-mixture.model';
import { NgSelectTreeViewComponent } from './ng-select-tree-view/ng-select-tree-view.component';

@Component({
  selector: 'ng-select-mixture',
  templateUrl: './ng-select-mixture.component.html',
  styleUrls: ['./ng-select-mixture.component.scss'],
  viewProviders: [NgSelectTreeViewComponent]
})
export class NgSelectMixtureComponent implements OnInit {
  @Input() selectedItems: string[];
  @Input() isDisabled: boolean;
  @Input() model = new NgSelectMixtureModel();
  @Output() checkedItems = new EventEmitter<string[]>();
  isCollapse: boolean;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.checkBySelectedItem();
    this.getTitle();

  }

  ngAfterViewInit(): void {
    this.renderer.listen('body', 'click', this.handleBodyClick);
  }

  private checkBySelectedItem(): void {
    this.model.items.forEach(x => x.checkBySelectedItem(this.selectedItems));
  }

  public clickButton(): void {
    this.isCollapse = !this.isCollapse;
  }

  private getTitle() {
    this.model.title = this.model.getDisplayedText(this.selectedItems);
  }

  public emitSingleEvent(item: NgSelectMixtureItem): void {
    this.isCollapse = false;
    this.model.items.forEach(x => {
      x.unCheckChilds();
      x.checkFromChilds();
    });
    this.model.title = item.name;
    this.model.isShowPlaceHolder = false;
    this.checkedItems.emit([item.value]);
  }

  public emitchildEvent(): void {
    this.model.title = this.model.getDisplayedAllChildItems();
  }

  private readonly handleBodyClick = (event: MouseEvent): void => {
    if (!this.isCollapse || !event.target) {
      return;
    }

    const clickedElement = event.target as Node;
    if (!this.elementRef.nativeElement.contains(clickedElement)) {
      this.isCollapse = false;
      if (!this.isDisabled) {
        this.checkedItems.emit(this.model.getValueItems());
      }
    }
  };
}
