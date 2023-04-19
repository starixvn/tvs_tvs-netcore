import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { ToastrModule } from 'ngx-toastr';
import { AdvancedModeModule } from '../../utility/components/advanced-mode/advanced-mode.module';
import { AdvancedModeService } from '../../utility/components/advanced-mode/advanced-mode/advanced-mode.service';
import { BlockUiService } from '../../utility/components/block-ui/block-ui.service';
import { DateTimeModule } from '../../utility/components/date-time/date-time.module';
import { PagingModule } from '../../utility/components/paging/paging.module';
import { TemplateMessageModule } from '../../utility/components/template-message/template-message.module';
import { TemplateService } from '../../utility/components/template-message/template-message/template.service';
import { ToolTipModule } from '../../utility/components/tooltip/tooltip.module';
import { DecimalDirective, NumberRangeDirective } from '../../utility/directives/number.directive';
import { PipeModule } from '../../utility/pipes/pipe.module';
import { HttpService } from '../../utility/services/http.service';
import { UtilityModule } from './../../utility/utility.module';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { FilterComponent } from './filter/filter.component';
import { ModalComponent } from './modal/modal.component';
import { TicketsComponent } from './tickets/tickets.component';
@NgModule({
    declarations: [
        AppComponent,
        FilterComponent,
        TicketsComponent,
        ModalComponent,
        ConfirmationComponent,
        NumberRangeDirective,
        DecimalDirective
    ],
    imports: [
        BrowserModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        HttpClientModule,
        PagingModule,
        DateTimeModule,
        ToolTipModule,
        UtilityModule,
        AdvancedModeModule,
        TemplateMessageModule,
        ToastrModule.forRoot(),
        PipeModule,
        ClipboardModule
    ],
    providers: [
        BlockUiService,
        AdvancedModeService,
        AppService,
        HttpService,
        TemplateService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
