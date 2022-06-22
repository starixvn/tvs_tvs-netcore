import { ElementRef } from '@angular/core';

export class Tooltip {
  className: string;
  message: string;
  show: boolean;
  top: string;
  left: string;
  element: ElementRef;

  display(className: string, message: string) {
    this.className = className;
    this.message = message;
    this.show = true;
    const element = this.element.nativeElement;
    const targetElement = element.getElementsByClassName(this.className)[0];
    targetElement.scrollIntoView();
    const box = targetElement.getBoundingClientRect();
    const wrapperClass = 'wrapper-tooltip';
    let wrapperTop = 0;
    let wrapperLeft = 0;
    const wrapperElement = element.closest('.' + wrapperClass);
    if (wrapperElement !== null) {
      wrapperTop = Number(wrapperElement.getBoundingClientRect().top) + window.scrollY;
      wrapperLeft = Number(wrapperElement.getBoundingClientRect().left) + window.scrollX;
      this.top = `${Number(box.top) - wrapperTop + Number(box.height) + window.scrollY - document.documentElement.clientTop}px`;
      this.left = `${Number(box.left) - wrapperLeft + Number(box.height) + window.scrollX - document.documentElement.clientLeft}px`;
    } else {
      this.top = `${Number(box.top) + Number(box.height) + window.scrollY - document.documentElement.clientTop}px`;
      this.left = `${Number(box.left) + window.scrollX - document.documentElement.clientLeft}px`;
    }
  }

  hide() {
    this.show = false;
  }
}