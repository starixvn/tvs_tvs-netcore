import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[only-number]',
    host: {
        '(keydown)': 'keydownOnlyNumber($event)',
        '(keyup)': 'keyupOnlyNumber()'
    }
})

export class OnlyNumberDirective {
    constructor(private element: ElementRef) {
    }

    keydownOnlyNumber(event: KeyboardEvent) {
        let key = event.charCode || event.keyCode || 0;
        let value = this.element.nativeElement.value;
        if (key === 110 || key === 190) { // dot(.)
            if (value === '' || value.indexOf('.') >= 0) {
                return false;
            }
        }
        if (key === 109) { // subtract
            if (value === '') {
                return true;
            }
        }
        // -------------------------------------------
        let isAccept =
            (
                (event.ctrlKey && event.keyCode === 67) || // accept ctrl + c(copy)
                (event.ctrlKey && event.keyCode === 86) || // accept ctrl + v(paste)
                key === 16 || // shift
                key === 17 || // ctrl
                key === 8 || // backspace
                key === 36 || // home
                key === 35 || // end
                key === 9 || // tab
                key === 46 || // delete

                (key >= 37 && key <= 40) || // left , right , up , down (arrow)
                (key >= 48 && key <= 57) || // 0-9
                (key >= 96 && key <= 105)); // numpad 0-9
        return isAccept;
    }

    keyupOnlyNumber() {
        let value = this.element.nativeElement.value;
        if (value !== '-' && isNaN(parseFloat(value))) {
            this.element.nativeElement.value = '';
        }

        this.element.nativeElement.value = value.replace(/(?!^)-/g, '');
    }
}

@Directive({
    selector: 'input[decimalOnly]',
    host: {
        '(keydown)': 'keyDownDecimalOnly($event)',
    }
})
export class DecimalOnlyDirective {
    private readonly regex: RegExp = new RegExp(/^\d+\.?\d{0,2}$/g);
    private readonly specialKeys: Array<string> = ['Backspace', 'End', 'Home'];
  
    constructor(private readonly el: ElementRef) {
    }
    keyDownDecimalOnly(event: KeyboardEvent) {
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }
        const current: string = this.el.nativeElement.value;
        const next: string = current.concat(event.key);
        if (next && !String(next).match(this.regex)) {
            event.preventDefault();
        }
    }
}

@Directive({
    selector: '[decimal]',
    host: {
        '(keydown)': 'keyDownDecimal($event)',
        '(keyup)': 'keyUpDecimal()'
    }
})

export class DecimalDirective {
    constructor(private element: ElementRef) { }

    keyDownDecimal(event: KeyboardEvent) {
        let value = this.element.nativeElement.value;
        let key = event.charCode || event.keyCode || 0;
        if (key === 110 || key === 190) { // dot(.)
            if (value === '' || value.indexOf('.') >= 0) {
                return false;
            }
        }

        if (key === 109) {
            if (value === '') {
                return true;
            }
        }

        let isAccept =
            (
                (event.ctrlKey && event.keyCode === 67) || // accept ctrl + c(copy)
                (event.ctrlKey && event.keyCode === 86) || // accept ctrl + v(paste)
                key === 16 || // shift
                key === 17 || // ctrl
                key === 8 || // backspace
                key === 36 || // home
                key === 35 || // end
                key === 110 || // .
                key === 190 || // .
                key === 9 || // tab
                key === 46 || // delete
                key === 109 || // -
                key === 189 || // -
                (key >= 37 && key <= 40) || // left , right , up , down (arrow)
                (key >= 48 && key <= 57) || // 0-9
                (key >= 96 && key <= 105)); // numpad 0-9
        return isAccept;
    }

    keyUpDecimal() {
        let value = this.element.nativeElement.value;
        if (value !== '-' && isNaN(parseFloat(value))) {
            this.element.nativeElement.value = '';
        }

        this.element.nativeElement.value = value.replace(/(?!^)-/g, '');
    }
}

@Directive({
    selector: '[number-range]',
    host: {
        '(keyup)': 'numberRange()'
    }
})

export class NumberRangeDirective {
    constructor(private element: ElementRef) {
    }
    numberRange() {
        let value = parseInt(this.element.nativeElement.value.replace(/(?!^)-/g, ''), 10);
        let min = parseInt(this.element.nativeElement.min, 10);
        let max = parseInt(this.element.nativeElement.max, 10);
        this.element.nativeElement.value = isNaN(value) ? min :
            value < min ? min :
                value > max ? max : value;
    }
}