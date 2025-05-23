import { Injectable, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NumbersOnlyService {
  executeDirective(element: ElementRef, event: KeyboardEvent, regex: RegExp, specialKeys: Array<string>) {
    if (specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = element.nativeElement.value;
    const next: string = current.concat(event.key);
    if (next && !String(next).match(regex)) {
      event.preventDefault();
    }
  }
}
