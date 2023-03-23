import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct {
    if (value) {
      const yearPosition = 2;
      const dateParts = value.trim().split('/');
      return { day: parseInt(dateParts[0], 10), month: parseInt(dateParts[1], 10), year: parseInt(dateParts[yearPosition], 10) };
    }
    return null;
  }

  format(date: NgbDateStruct): string {
    return date ? `${date.year}/${date.month}/${date.day}` : '';
  }
}
