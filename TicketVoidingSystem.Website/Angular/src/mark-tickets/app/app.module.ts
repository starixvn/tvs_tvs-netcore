import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ClipboardModule } from 'ngx-clipboard';
import { ToastrModule } from 'ngx-toastr';
import { AdvancedModeModule } from '../../utility/components/advanced-mode/advanced-mode.module';
import { BlockUiModule } from '../../utility/components/block-ui/block-ui.module';
import { DateTimeModule } from '../../utility/components/date-time/date-time.module';
import { ModalModule } from '../../utility/components/modal/modal.module';
import { PagingModule } from '../../utility/components/paging/paging.module';
import { ToolTipModule } from '../../utility/components/tooltip/tooltip.module';
import { PipeModule } from '../../utility/pipes/pipe.module';
import { UtilityModule } from '../../utility/utility.module';
import { AppComponent } from './app.component';
import { ConfirmAutoUnmarkComponent } from './confirm-auto-unmark/confirm-auto-unmark.component';
import { AllMarkedTicketListComponent } from './mark-unmark-ticket/all-marked-ticket-list/all-marked-ticket-list.component';
import { FilterTicketsComponent } from './mark-unmark-ticket/filter-tickets/filter-tickets.component';
import { LicenseesComponent } from './mark-unmark-ticket/filter-tickets/match-id/licensees/licensees.component';
import { MatchIdComponent } from './mark-unmark-ticket/filter-tickets/match-id/match-id.component';
import { MarkUnmarkTicketComponent } from './mark-unmark-ticket/mark-unmark-ticket.component';
import { TabMarkTicketComponent } from './tab-mark-ticket/tab-mark-ticket.component';
import { TicketsListComponent } from './tickets-list/tickets-list.component';
import { FilterLogsComponent } from './user-log/filter-logs/filter-logs.component';
import { LogsListComponent } from './user-log/logs-list/logs-list.component';
import { UserLogComponent } from './user-log/user-log.component';

@NgModule({
  declarations: [
    AllMarkedTicketListComponent,
    AppComponent,
    FilterLogsComponent,
    FilterTicketsComponent,
    LicenseesComponent,
    LogsListComponent,
    MatchIdComponent,
    TicketsListComponent,
    ConfirmAutoUnmarkComponent,
    TabMarkTicketComponent,
    MarkUnmarkTicketComponent,
    UserLogComponent
  ],
  imports: [
    AdvancedModeModule,
    BlockUiModule,
    BrowserModule,
    ClipboardModule,
    CommonModule,
    DateTimeModule,
    FormsModule,
    ModalModule,
    NgSelectModule,
    NgbModule,
    PagingModule,
    PipeModule,
    ToolTipModule,
    ToastrModule.forRoot(),
    UtilityModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
