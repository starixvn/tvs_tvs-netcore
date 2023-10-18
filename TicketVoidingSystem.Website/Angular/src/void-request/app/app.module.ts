import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ClipboardModule } from 'ngx-clipboard';
import { ToastrModule } from 'ngx-toastr';
import { AdvancedModeModule } from '../../utility/components/advanced-mode/advanced-mode.module';
import { DateTimeModule } from '../../utility/components/date-time/date-time.module';
import { PagingModule } from '../../utility/components/paging/paging.module';
import { RequestInfoModule } from '../../utility/components/request-info/request-info.module';
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
import { TicketsListComponent } from './tickets-list/tickets-list.component';
import { VoidDangerAcceptedComponent } from './void-danger-accepted/void-danger-accepted.component';
import { VoidDuplicateTicketsComponent } from './void-duplicate-tickets/void-duplicate-tickets.component';
import { VoidNotParticipateComponent } from './void-not-participate/void-not-participate.component';
import { VoidOtherIssueComponent } from './void-other-issue/void-other-issue.component';
import { VoidRedCardComponent } from './void-red-card/void-red-card.component';
import { VoidEarlyKickOffComponent } from './void-early-kick-off/void-early-kick-off.component';

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
    VoidRedCardComponent,
    VoidNotParticipateComponent,
    VoidEarlyKickOffComponent
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
    ToastrModule.forRoot(),
    UtilityModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
