import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[time-control]',
    host: {
        '(keydown)': 'onKeyDown($event)'
    }
})

export class TimeDirective {
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
        const hourElement = parentNode.children[0];
        const minuteElement = parentNode.children[2];
        const secondElement = parentNode.children[4];
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
        const minuteElement = parentNode.children[2];
        const secondElement = parentNode.children[4];
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