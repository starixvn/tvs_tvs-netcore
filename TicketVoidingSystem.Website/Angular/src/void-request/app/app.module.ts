import { AppComponent } from './app.component';
import { BlockUiModule } from './../../utility/modules/block-ui/block-ui.module';
import { BrowserModule } from '@angular/platform-browser';
import { ClipboardModule } from 'ngx-clipboard';
import { DateTimeModule } from '../../utility/modules/date-time/date-time.module';
import { EventInfoComponent } from './event-info/event-info.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { PagingModule } from '../../utility/modules/paging/paging.module';
import { PipeModule } from './../../utility/modules/pipes/pipe.module';
import { RequestInfoModule } from '../../utility/modules/request-info/request-info.module';
import { TemplateMessageModule } from '../../utility/modules/template-message/template-message.module';
import { TicketsListComponent } from './tickets-list/tickets-list.component';
import { ToolTipModule } from './../../utility/modules/tooltip/tooltip.module';
import { UtilityModule } from './../../utility/utility.module';
import { AdvancedModeModule } from '../../utility/modules/advanced-mode/advanced-mode.module';
import { FilterComponent } from './filter/filter.component';
import { LogInfoComponent } from './log-info/log-info.component';
import { VoidDangerAcceptedComponent } from './void-danger-accepted/void-danger-accepted.component';
import { VoidOtherIssueComponent } from './void-other-issue/void-other-issue.component';
import { LogInfoNewComponent } from './log-info-new/log-info-new.component';

@NgModule({
  declarations: [
    TicketsListComponent,
    EventInfoComponent,
    AppComponent,
    FilterComponent,
    LogInfoComponent,
    VoidDangerAcceptedComponent,
    VoidOtherIssueComponent,
    LogInfoNewComponent
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
    UtilityModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
