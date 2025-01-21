import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { PagingModule } from '../../utility/components/paging/paging.module';
import { PipeModule } from '../../utility/pipes/pipe.module';
import { ModalModule } from '../../utility/components/modal/modal.module';
import { BlockUiModule } from './../../utility/components/block-ui/block-ui.module';
import { DateTimeModule } from './../../utility/components/date-time/date-time.module';
import { ToolTipModule } from './../../utility/components/tooltip/tooltip.module';
import { NgbDateCustomParserFormatter } from './../../utility/config/ngb-datepicker-format';
import { UtilityModule } from './../../utility/utility.module';
import { AppComponent } from './app.component';
import { FilterComponent } from './filter/filter.component';
import { RequestListComponent } from './request-list/request-list.component';
import { RequestInfoModule } from './ticket-list/request-info/request-info.module';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { MultipleSelectionModule } from "../../utility/components/multiple-selection/multiple-selection.module";

@NgModule({
  declarations: [
    AppComponent,
    FilterComponent,
    RequestListComponent,
    TicketListComponent,
  ],
  imports: [
    BlockUiModule,
    BrowserModule,
    DateTimeModule,
    FormsModule,
    HttpClientModule,
    ModalModule,
    NgSelectModule,
    NgbModule,
    RequestInfoModule,
    ToolTipModule,
    PagingModule,
    PipeModule,
    ToastrModule.forRoot(),
    UtilityModule,
    MultipleSelectionModule
],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
