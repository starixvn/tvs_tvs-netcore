import { Directive, ElementRef, HostListener } from '@angular/core';

const MINUTE_INDEX = 2;
const SECOND_INDEX = 4;
const MILLISECOND_INDEX = 6;
const MERIDIEM_INDEX = 7;

@Directive({
  selector: '[full-time-control]'
})
export class FullTimeDirective {
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
    const minuteElement = parentNode.children[MINUTE_INDEX];
    const secondElement = parentNode.children[SECOND_INDEX];
    const millisecondElement = parentNode.children[MILLISECOND_INDEX];
    const meridiemElement = parentNode.children[MERIDIEM_INDEX];
    if (this.element.nativeElement.classList.contains('hour')) {
      minuteElement.focus();
    } else if (this.element.nativeElement.classList.contains('minute')) {
      secondElement.focus();
    } else if (this.element.nativeElement.classList.contains('second')) {
      millisecondElement.focus();
    } else if (this.element.nativeElement.classList.contains('millisecond')) {
      meridiemElement.focus();
    }
  }

  arrowLeft() {
    const parentNode = this.element.nativeElement.parentNode;
    const hourElement = parentNode.children[0];
    const minuteElement = parentNode.children[MINUTE_INDEX];
    const secondElement = parentNode.children[SECOND_INDEX];
    const millisecondElement = parentNode.children[MILLISECOND_INDEX];

    if (this.element.nativeElement.classList.contains('meridiem')) {
      millisecondElement.focus();
    } else if (this.element.nativeElement.classList.contains('millisecond')) {
      secondElement.focus();
    } else if (this.element.nativeElement.classList.contains('second')) {
      minuteElement.focus();
    } else if (this.element.nativeElement.classList.contains('minute')) {
      hourElement.focus();
    }
  }
}
