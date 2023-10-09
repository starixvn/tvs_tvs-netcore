import { Input, Directive, Renderer, ElementRef } from '@angular/core';

@Directive({
    selector: '[full-time-control]',
    host: {
        '(keydown)': 'onKeyDown($event)'
    }
})

export class FullTimeDirective {
    constructor(private element: ElementRef) {
    }

    onKeyDown(event: any) {
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
        const minuteElement = parentNode.children[2];
        const secondElement = parentNode.children[4];
        const millisecondElement = parentNode.children[6];
        const meridiemElement = parentNode.children[7];
        if (this.element.nativeElement.classList.contains('hour')) {
            minuteElement.focus();
        }
        else if (this.element.nativeElement.classList.contains('minute')) {
            secondElement.focus();
        }
        else if (this.element.nativeElement.classList.contains('second')) {
            millisecondElement.focus();
        }
        else if (this.element.nativeElement.classList.contains('millisecond')) {
            meridiemElement.focus();
        }
    }

    arrowLeft() {
        const parentNode = this.element.nativeElement.parentNode;
        const hourElement = parentNode.children[0];
        const minuteElement = parentNode.children[2];
        const secondElement = parentNode.children[4];
        const millisecondElement = parentNode.children[6];
        const meridiemElement = parentNode.children[7];
        if (this.element.nativeElement.classList.contains('meridiem')) {
            millisecondElement.focus();
        }
        else if (this.element.nativeElement.classList.contains('millisecond')) {
            secondElement.focus();
        }
        else if (this.element.nativeElement.classList.contains('second')) {
            minuteElement.focus();
        }
        else if (this.element.nativeElement.classList.contains('minute')) {
            hourElement.focus();
        }
    }
}