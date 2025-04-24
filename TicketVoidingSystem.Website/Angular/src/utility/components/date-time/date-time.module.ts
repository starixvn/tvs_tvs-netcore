import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '../../../utility/config/ngb-datepicker-format';
import { ToolTipModule } from './../tooltip/tooltip.module';
import { DateFullTimeComponent } from './date-full-time/date-full-time.component';
import { FullTimeDirective } from './date-full-time/full-time.directive';
import { DateTimeComponent } from './date-time/date-time.component';
import { TimeDirective } from './date-time/time.directive';


@NgModule({
  imports: [CommonModule, FormsModule, NgbModule, ToolTipModule],
  declarations: [DateFullTimeComponent, DateTimeComponent, FullTimeDirective, TimeDirective],
  exports: [DateFullTimeComponent, DateTimeComponent, FullTimeDirective, TimeDirective],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }]
})
export class DateTimeModule {}
