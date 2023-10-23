import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DateTimeModule } from '../../../utility/components/date-time/date-time.module';
import { DateFullTimeNewComponent } from '../date-time/date-full-time-new/date-full-time-new.component';
import { RequestInfoComponent } from './request-info.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DateTimeModule,
    NgbModule
  ],
  declarations: [
    RequestInfoComponent
  ],
  exports: [
    RequestInfoComponent
  ]
})
export class RequestInfoModule { }
