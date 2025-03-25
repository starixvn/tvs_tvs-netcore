import { ComponentRef, Directive, ElementRef, Input, OnChanges, SimpleChange, ViewContainerRef } from '@angular/core';
import { BlockUiComponent } from './block-ui.component';

@Directive({
  selector: '[blockUi]',
  standalone: true
})
export class BlockUiDirective implements OnChanges {
  constructor(
    private readonly viewContainerRef: ViewContainerRef,
    private readonly elRef: ElementRef
  ) { }

  @Input('blockUi') isBlock: boolean;

  private blockUiComponent: ComponentRef<BlockUiComponent>;

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes['isBlock']) {
      this.openBlock();
    }
  }

  openBlock() {
    if (this.isBlock) {
      this.blockUiComponent = this.viewContainerRef.createComponent(BlockUiComponent);
      this.elRef.nativeElement.appendChild(this.blockUiComponent.location.nativeElement);
    } else {
      this.viewContainerRef.clear();
    }
  }
}
