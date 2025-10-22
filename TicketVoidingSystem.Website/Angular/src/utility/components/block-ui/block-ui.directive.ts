import { ComponentRef, Directive, ElementRef, inject, Input, OnChanges, SimpleChange, ViewContainerRef } from '@angular/core';
import { BlockUiComponent } from './block-ui.component';

@Directive({
  selector: '[blockUi]',
  standalone: true
})
export class BlockUiDirective implements OnChanges {
  @Input('blockUi') isBlock: boolean;
  
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly elRef = inject(ElementRef);
  private blockUiComponent: ComponentRef<BlockUiComponent>;

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes['isBlock']) {
      this.openBlock();
    }
  }

  private openBlock() {
    if (this.isBlock) {
      this.blockUiComponent = this.viewContainerRef.createComponent(BlockUiComponent);
      this.elRef.nativeElement.appendChild(this.blockUiComponent.location.nativeElement);
    } else {
      this.viewContainerRef.clear();
    }
  }
}
