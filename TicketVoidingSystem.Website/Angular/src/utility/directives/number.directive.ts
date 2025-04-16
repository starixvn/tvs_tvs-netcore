import { Directive, ElementRef } from '@angular/core';

class CheckKeyboardEvent {
    private static readonly keyNavigation = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'];
    private static readonly keyNumber = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    static isDotKey(key: string, value: string): boolean {
        return ((key === '.') && (value === '' || value.indexOf('.') >= 0));
    }

    static isSubtractKey(key: string, value: string): boolean {
        return ((key === '-') && (value === ''));
    }

    private static isCommonActionKey(key: string) {
        return (key === 'Shift' || // shift
            key === 'Control' || // ctrl
            key === 'Backspace' || // backspace
            key === 'Home' || // home
            key === 'End' || // end
            key === 'Tab' || // tab
            key === 'Delete');  // delete
    }

    static isAcceptKeyForOnlyNumber(isPressCtrl: boolean, key: string) {
        return ((isPressCtrl && key === 'c') || // accept ctrl + c(copy)
            (isPressCtrl && key === 'v') ||     // accept ctrl + v(paste)
            this.keyNavigation.includes(key) || // left , right , up , down (arrow)
            this.keyNumber.includes(key) ||     // 0-9
            this.isCommonActionKey(key));
    }

    static isAcceptKeyForDecimal(isPressCtrl: boolean, key: string) {
        return ((isPressCtrl && key === 'c') || // accept ctrl + c(copy)
            (isPressCtrl && key === 'v') ||     // accept ctrl + v(paste)
            this.keyNavigation.includes(key) || // left , right , up , down (arrow)
            this.keyNumber.includes(key) ||     // 0-9
            key === '.' ||                      // .
            key === '-' ||                      // -
            this.isCommonActionKey(key));
    }

    static handleKeyUpEvent(element: ElementRef): void {
        const value = element.nativeElement.value;
        if (value !== '-' && isNaN(parseFloat(value))) {
            element.nativeElement.value = '';
        }

        element.nativeElement.value = value.replace(/(?!^)-/g, '');
    }
}

@Directive({
    selector: '[only-number]',
    standalone: true,
    host: {
        '(keydown)': 'keydownOnlyNumber($event)',
        '(keyup)': 'keyupOnlyNumber()'
    }
})

export class OnlyNumberDirective {
    constructor(private readonly element: ElementRef) {
    }

    keydownOnlyNumber(event: KeyboardEvent) {
        const key = event.key;
        const value = this.element.nativeElement.value;
        if (CheckKeyboardEvent.isDotKey(key, value)) { // dot(.)
            return false;
        }

        if (CheckKeyboardEvent.isSubtractKey(key, value)) { // subtract
            return true;
        }

        return CheckKeyboardEvent.isAcceptKeyForOnlyNumber(event.ctrlKey, key);
    }

    keyupOnlyNumber() {
        CheckKeyboardEvent.handleKeyUpEvent(this.element);
    }
}

@Directive({
    selector: '[decimal]',
    standalone: true,
    host: {
        '(keydown)': 'keyDownDecimal($event)',
        '(keyup)': 'keyUpDecimal()'
    }
})

export class DecimalDirective {
    constructor(private readonly element: ElementRef) { }

    keyDownDecimal(event: KeyboardEvent) {
        const value = this.element.nativeElement.value;
        const key = event.key;
        if (CheckKeyboardEvent.isDotKey(key, value)) { // dot(.)
            return false;
        }

        if (CheckKeyboardEvent.isSubtractKey(key, value)) { // subtract
            return true;
        }

        return CheckKeyboardEvent.isAcceptKeyForDecimal(event.ctrlKey, key);
    }

    keyUpDecimal() {
        CheckKeyboardEvent.handleKeyUpEvent(this.element);
    }
}

@Directive({
    selector: '[number-range]',
    standalone: true,
    host: {
        '(keydown)': 'keyDownNumberRange($event)',
        '(keyup)': 'keyUpNumberRange()'
    }
})

export class NumberRangeDirective {
    constructor(private readonly element: ElementRef) {
    }

    keyDownNumberRange(event: KeyboardEvent) {
        const value = parseInt(this.element.nativeElement.value.replace(/(?!^)-/g, ''), 10);
        const min = parseInt(this.element.nativeElement.min, 10);
        const max = parseInt(this.element.nativeElement.max, 10);
        this.element.nativeElement.value = isNaN(value) ? min :
            value < min ? min :
                value > max ? max : value;
    }

    keyUpNumberRange() {
        CheckKeyboardEvent.handleKeyUpEvent(this.element);
    }
}