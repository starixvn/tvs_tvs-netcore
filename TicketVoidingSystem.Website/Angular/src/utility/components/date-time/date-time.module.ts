import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '../../../utility/config/ngb-datepicker-format';
import { ToolTipModule } from './../tooltip/tooltip.module';
import { DateFullTimeNewComponent } from './date-full-time-new/date-full-time-new.component';
import { DateFullTimeComponent } from './date-full-time/date-full-time.component';
import { FullTimeDirective } from './date-full-time/full-time.directive';
import { DateTimeComponent } from './date-time/date-time.component';
import { TimeDirective } from './date-time/time.directive';


@NgModule({
  imports: [BrowserModule, CommonModule, FormsModule, HttpClientModule, NgbModule, ToolTipModule],
  declarations: [DateFullTimeComponent, DateTimeComponent, FullTimeDirective, TimeDirective, DateFullTimeNewComponent, DateFullTimeNewComponent],
  exports: [DateFullTimeComponent, DateTimeComponent, FullTimeDirective, TimeDirective, DateFullTimeNewComponent],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }]
})
export class DateTimeModule {}
