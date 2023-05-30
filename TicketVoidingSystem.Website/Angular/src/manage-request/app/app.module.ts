import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from '../../utility/components/modal/modal.module';
import { RequestInfoModule } from '../../utility/components/request-info/request-info.module';
import { BlockUiModule } from './../../utility/components/block-ui/block-ui.module';
import { DateTimeModule } from './../../utility/components/date-time/date-time.module';
import { PagingModule } from './../../utility/components/paging/paging.module';
import { ToolTipModule } from './../../utility/components/tooltip/tooltip.module';
import { NgbDateCustomParserFormatter } from './../../utility/config/ngb-datepicker-format';
import { PipeModule } from './../../utility/pipes/pipe.module';
import { UtilityModule } from './../../utility/utility.module';
import { AppComponent } from './app.component';
import { FilterComponent } from './filter/filter.component';
import { RequestListComponent } from './request-list/request-list.component';
import { MatchInfoComponent } from './ticket-list/match-info/match-info.component';
import { TicketListComponent } from './ticket-list/ticket-list.component';
import { TicketsComponent } from './ticket-list/tickets/tickets.component';

@NgModule({
  declarations: [
    AppComponent,
    FilterComponent,
    RequestListComponent,
    TicketListComponent,
    MatchInfoComponent,
    TicketsComponent
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
    PagingModule,
    PipeModule,
    RequestInfoModule,
    ToolTipModule,
    UtilityModule
  ],
  entryComponents: [
    TicketListComponent
  ],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
