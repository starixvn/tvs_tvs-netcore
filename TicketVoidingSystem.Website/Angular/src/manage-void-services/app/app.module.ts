import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { BlockFullUiModule } from '../../utility/components/block-full-ui/block-full-ui.module';
import { ModalModule } from '../../utility/components/modal/modal.module';
import { ToolTipModule } from '../../utility/components/tooltip/tooltip.module';
import { PipeModule } from '../../utility/pipes/pipe.module';
import { HttpService } from '../../utility/services/http.service';
import { UtilityModule } from '../../utility/utility.module';
import { AfterVoidStatusComponent } from './after-void/after-void-status/after-void-status.component';
import { AfterVoidComponent } from './after-void/after-void.component';
import { AppComponent } from './app.component';
import { AppService } from './app.service';

@NgModule({
  declarations: [
    AppComponent,
    AfterVoidStatusComponent,
    AfterVoidComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ModalModule,
    NgbModule,
    PipeModule,
    BlockFullUiModule,
    ToolTipModule,
    UtilityModule,
    ToastrModule.forRoot()
  ],
  providers: [HttpService, AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
