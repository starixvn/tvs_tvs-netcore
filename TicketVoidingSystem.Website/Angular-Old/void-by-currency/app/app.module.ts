import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { MultipleSelectComponent } from '../../external/components/multiple-selection/multiple-select.component';
import { TreeViewComponent } from '../../external/components/multiple-selection/tree-view.component';
import { TooltipComponent } from '../../external/components/tooltip/tooltip.component';
import { ModalComponent } from '../../external/components/modal/modal.component';
import { NotificationComponent } from '../../external/components/notification/notification.component';
import { MatchDetailComponent } from '../../internal/components/match-detail/match-detail.component';
import { PagingComponent } from '../../internal/components/paging/paging.component';
import { MessagesComponent } from '../../internal/components/messages/messages.component';
import { ConfirmationComponent } from '../../internal/components/confirmation/confirmation.component';
import { MessagesResultComponent } from '../../internal/components/messages-result/messages-result.component';
import { CheckingPermissionComponent } from '../../internal/components/checking-permission/checking-permission.component';

import { AppComponent } from './app.component';
import { FilterComponent } from './filter/filter.component';
import { TicketsResultComponent } from './tickets-result/tickets-result.component';
import { OnlyNumberDirective, NumberRangeDirective, DecimalDirective } from '../../external/directives/number.directive';
import { SanitizeHtml } from '../../internal/pipes/sanitize-html';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        JsonpModule
    ],
    declarations: [
        AppComponent,
        TooltipComponent,
        ModalComponent,
        NotificationComponent,
        MessagesResultComponent,
        FilterComponent,
        MatchDetailComponent,
        TicketsResultComponent,
        PagingComponent,
        MessagesComponent,
        ConfirmationComponent,
        MultipleSelectComponent,
        TreeViewComponent,
        OnlyNumberDirective,
        NumberRangeDirective,
        DecimalDirective,
        CheckingPermissionComponent,
        SanitizeHtml
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}