import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { TooltipComponent } from '../../external/components/tooltip/tooltip.component';
import { ModalComponent } from '../../external/components/modal/modal.component';
import { NotificationComponent } from '../../external/components/notification/notification.component';

import { MatchDetailComponent } from '../../internal/components/match-detail/match-detail.component';
import { PagingComponent } from '../../internal/components/paging/paging.component';
import { MessagesComponent } from '../../internal/components/messages/messages.component';
import { ConfirmationComponent } from '../../internal/components/confirmation/confirmation.component';
import { MessagesResultComponent } from '../../internal/components/messages-result/messages-result.component';
import { InputBetIdsComponent } from '../../internal/components/input-betids/input-betids.component';
import { BetTypesVirtualSportComponent } from '../../internal/components/bettypes-virtualsports/bettypes-virtualsports.component';

import { AppComponent } from './app.component';
import { FilterComponent } from './filter/filter.component';
import { TicketsComponent } from './tickets/tickets.component';
import { OnlyNumberDirective, NumberRangeDirective, DecimalDirective } from '../../external/directives/number.directive';
import { SanitizeHtml } from '../../internal/pipes/sanitize-html';

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
        BetTypesVirtualSportComponent,
        OnlyNumberDirective,
        NumberRangeDirective,
        DecimalDirective,
        SanitizeHtml
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        JsonpModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }