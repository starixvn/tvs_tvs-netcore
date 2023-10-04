import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { ModalComponent } from '../../external/components/modal/modal.component';
import { NotificationComponent } from '../../external/components/notification/notification.component';
import { TooltipComponent } from '../../external/components/tooltip/tooltip.component';

import { BetTypesComponent } from '../../internal/components/bettypes/bettypes.component';
import { ConfirmationComponent } from '../../internal/components/confirmation/confirmation.component';
import { InputBetIdsComponent } from '../../internal/components/input-betids/input-betids.component';
import { MatchDetailComponent } from '../../internal/components/match-detail/match-detail.component';
import { MessagesResultComponent } from '../../internal/components/messages-result/messages-result.component';
import { MessagesComponent } from '../../internal/components/messages/messages.component';
import { PagingComponent } from '../../internal/components/paging/paging.component';

import { DatePickerModule } from 'angular-io-datepicker';
import { DecimalDirective, NumberRangeDirective, OnlyNumberDirective } from '../../external/directives/number.directive';
import { DateFullTimeComponent } from '../../internal/components/date-full-time/date-full-time.component';
import { SanitizeHtml } from '../../internal/pipes/sanitize-html';
import { AppComponent } from './app.component';
import { FilterComponent } from './filter/filter.component';
import { TicketsComponent } from './tickets/tickets.component';

@NgModule({
    declarations: [
        AppComponent,
        FilterComponent,
        TicketsComponent,
        TooltipComponent,
        ModalComponent,
        NotificationComponent,
        MatchDetailComponent,
        PagingComponent,
        MessagesComponent,
        ConfirmationComponent,
        MessagesResultComponent,
        InputBetIdsComponent,
        BetTypesComponent,
        DateFullTimeComponent,
        OnlyNumberDirective,
        NumberRangeDirective,
        DecimalDirective,
        SanitizeHtml
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        DatePickerModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }