import { Directive, ElementRef, HostListener } from '@angular/core';

const MINUTE_INDEX = 2;
const SECOND_INDEX = 4;
@Directive({
  selector: '[time-control]'
})
export class TimeDirective {
  constructor(private readonly element: ElementRef) {
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    switch (true) {
      case event.key === 'ArrowLeft':
        this.arrowLeft();
        break;
      case event.key === 'ArrowRight':
        this.arrowRight();
        break;
      default:
        break;
    }
  }

  arrowRight() {
    const parentNode = this.element.nativeElement.parentNode;
    const hourElement = parentNode.children[0];
    const minuteElement = parentNode.children[MINUTE_INDEX];
    const secondElement = parentNode.children[SECOND_INDEX];
    if (this.element.nativeElement.classList.contains('hour')) {
      minuteElement.focus();
    }
    if (this.element.nativeElement.classList.contains('minute')) {
      secondElement.focus();
    }
    if (this.element.nativeElement.classList.contains('second')) {
      hourElement.focus();
    }
  }

  arrowLeft() {
    const parentNode = this.element.nativeElement.parentNode;
    const hourElement = parentNode.children[0];
    const minuteElement = parentNode.children[MINUTE_INDEX];
    const secondElement = parentNode.children[SECOND_INDEX];
    if (this.element.nativeElement.classList.contains('second')) {
      minuteElement.focus();
    }
    if (this.element.nativeElement.classList.contains('minute')) {
      hourElement.focus();
    }
    if (this.element.nativeElement.classList.contains('hour')) {
      secondElement.focus();
    }
  }

}
