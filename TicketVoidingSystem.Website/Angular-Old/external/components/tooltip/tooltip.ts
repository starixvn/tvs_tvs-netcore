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
        this.top = box.top + box.height + window.pageYOffset - document.documentElement.clientTop + 'px';
        this.left = box.left + window.pageXOffset - document.documentElement.clientLeft + 'px';
    }
}