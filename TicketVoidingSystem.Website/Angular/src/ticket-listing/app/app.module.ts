import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { AdvancedModeModule } from '../../utility/components/advanced-mode/advanced-mode.module';
import { BlockUiService } from '../../utility/components/block-ui/block-ui.service';
import { DateTimeModule } from '../../utility/components/date-time/date-time.module';
import { ModalModule } from '../../utility/components/modal/modal.module';
import { PagingModule } from '../../utility/components/paging/paging.module';
import { ToolTipModule } from '../../utility/components/tooltip/tooltip.module';
import { PipeModule } from '../../utility/pipes/pipe.module';
import { HttpService } from '../../utility/services/http.service';
import { UtilityModule } from './../../utility/utility.module';
import { AdvancedModeBasketballComponent } from './advanced-mode-basketball/advanced-mode-basketball.component';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { FilterComponent } from './filter/filter.component';
import { MessagesResponseComponent } from './messages-response/messages-response.component';
import { SummaryComponent } from './summary/summary.component';
import { TicketsComponent } from './tickets/tickets.component';

@NgModule({
  declarations: [
    AdvancedModeBasketballComponent,
    AppComponent,
    FilterComponent,
    SummaryComponent,
    TicketsComponent,
    MessagesResponseComponent
  ],
  imports: [
    AdvancedModeModule,
    BrowserModule,
    DateTimeModule,
    FormsModule,
    HttpClientModule,
    ModalModule,
    NgbModule,
    PagingModule,
    PipeModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    ToolTipModule,
    UtilityModule
  ],
  providers: [BlockUiService, HttpService, AppService],
  bootstrap: [AppComponent]
})
export class AppModule {}
