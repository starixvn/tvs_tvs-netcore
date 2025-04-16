import { Directive, ElementRef, HostListener } from '@angular/core';
import { NumbersOnlyService } from './numbers-only.service';

@Directive({
  selector: 'input[numbersOnly]'
})
export class NumbersOnlyDirective {
  constructor(private readonly _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: KeyboardEvent) {
    const initalValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
    if (initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}

@Directive({
  standalone: true,
  selector: 'input[decimalOnly]'
})
export class DecimalOnlyDirective {
  private readonly regex: RegExp = new RegExp(/^\d+\.?\d{0,2}$/g);
  private readonly specialKeys: Array<string> = ['Backspace', 'End', 'Home'];

  constructor(private readonly el: ElementRef, private readonly numberOnlyService: NumbersOnlyService) {
  }
  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    this.numberOnlyService.executeDirective(this.el, event, this.regex, this.specialKeys);
  }
}

@Directive({
  standalone: true,
  selector: 'input[multipleDecimal]'
})
export class MultipleDecimalDirective {
  private readonly regex: RegExp = new RegExp(/^['0-9&.']*$/g);
  private readonly specialKeys: Array<string> = ['Backspace', 'End', 'Home', 'ArrowLeft', 'ArrowRight'];

  constructor(private readonly el: ElementRef, private readonly numberOnlyService: NumbersOnlyService) {
  }
  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    this.numberOnlyService.executeDirective(this.el, event, this.regex, this.specialKeys);
  }
}