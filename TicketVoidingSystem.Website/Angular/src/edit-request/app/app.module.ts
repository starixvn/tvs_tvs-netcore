import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { AddRequestModule } from '../../add-request/app/add-request/add-request.module';
import { DateTimeModule } from '../../utility/components/date-time/date-time.module';
import { BlockFullUiModule } from './../../utility/components/block-full-ui/block-full-ui.module';
import { BlockUiModule } from './../../utility/components/block-ui/block-ui.module';
import { ModalModule } from './../../utility/components/modal/modal.module';
import { ToolTipModule } from './../../utility/components/tooltip/tooltip.module';
import { UtilityModule } from './../../utility/utility.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AddRequestModule,
    BlockUiModule,
    BrowserModule,
    DateTimeModule,
    FormsModule,
    HttpClientModule,
    ModalModule,
    NgSelectModule,
    NgbModule,
    ToolTipModule,
    UtilityModule,
    BlockFullUiModule,
    ToastrModule.forRoot()
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
