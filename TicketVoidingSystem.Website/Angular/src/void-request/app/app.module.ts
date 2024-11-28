import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ClipboardModule } from 'ngx-clipboard';
import { ToastrModule } from 'ngx-toastr';
import { TicketCountOtherSportsModule } from '../../add-request/app/add-request/ticket-count-other-sports/ticket-count-other-sports.module';
import { RequestInfoModule } from '../../manage-request/app/ticket-list/request-info/request-info.module';
import { AdvancedModeModule } from '../../utility/components/advanced-mode/advanced-mode.module';
import { DateTimeModule } from '../../utility/components/date-time/date-time.module';
import { IssueTypeModule } from '../../utility/components/issue-type/issue-type.module';
import { PagingModule } from '../../utility/components/paging/paging.module';
import { TemplateMessageModule } from '../../utility/components/template-message/template-message.module';
import { BlockUiModule } from './../../utility/components/block-ui/block-ui.module';
import { ToolTipModule } from './../../utility/components/tooltip/tooltip.module';
import { PipeModule } from './../../utility/pipes/pipe.module';
import { UtilityModule } from './../../utility/utility.module';
import { AppComponent } from './app.component';
import { EventInfoComponent } from './event-info/event-info.component';
import { FilterComponent } from './filter/filter.component';
import { LogInfoNewComponent } from './log-info-new/log-info-new.component';
import { LogInfoComponent } from './log-info/log-info.component';
import { MessageAreaComponent } from './message-area/message-area.component';
import { PasswordAreaComponent } from './password-area/password-area.component';
import { TicketsListComponent } from './tickets-list/tickets-list.component';
import { VoidAbnormalBetComponent } from './void-abnormal-bet/void-abnormal-bet.component';
import { VoidDangerAcceptedComponent } from './void-danger-accepted/void-danger-accepted.component';
import { VoidDuplicateTicketsComponent } from './void-duplicate-tickets/void-duplicate-tickets.component';
import { VoidEarlyKickOffComponent } from './void-early-kick-off/void-early-kick-off.component';
import { VoidNotParticipateComponent } from './void-not-participate/void-not-participate.component';
import { VoidOtherIssueComponent } from './void-other-issue/void-other-issue.component';
import { VoidWrongMarketOfferedComponent } from './void-wrong-market-offered/void-wrong-market-offered.component';

@NgModule({
  declarations: [
    TicketsListComponent,
    EventInfoComponent,
    AppComponent,
    FilterComponent,
    LogInfoComponent,
    VoidDangerAcceptedComponent,
    VoidOtherIssueComponent,
    LogInfoNewComponent,
    VoidDuplicateTicketsComponent,
    VoidNotParticipateComponent,
    VoidEarlyKickOffComponent,
    VoidAbnormalBetComponent,
    MessageAreaComponent,
    PasswordAreaComponent,
    VoidWrongMarketOfferedComponent
  ],
  imports: [
    AdvancedModeModule,
    BlockUiModule,
    BrowserModule,
    ClipboardModule,
    DateTimeModule,
    FormsModule,
    HttpClientModule,
    NgSelectModule,
    NgbModule,
    PagingModule,
    PipeModule,
    RequestInfoModule,
    TemplateMessageModule,
    ToolTipModule,
    UtilityModule,
    IssueTypeModule,
    ToastrModule.forRoot(),
    TicketCountOtherSportsModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
