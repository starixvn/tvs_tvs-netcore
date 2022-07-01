import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ToastrModule } from 'ngx-toastr';
import { HeaderWebsiteModule } from '../../shared/header-website/header-website.module';
import { BlockFullUiModule } from '../../utility/components/block-full-ui/block-full-ui.module';
import { MultipleSelectionModule } from '../../utility/components/multiple-selection/multiple-selection.module';
import { PagingModule } from '../../utility/components/paging/paging.module';
import { ToolTipModule } from '../../utility/components/tooltip/tooltip.module';
import { PipeModule } from '../../utility/pipes/pipe.module';
import { HttpService } from '../../utility/services/http.service';
import { UtilityModule } from '../../utility/utility.module';
import { ModalModule } from './../../utility/components/modal/modal.module';
import { AddUserComponent } from './add-user/add-user.component';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { FilterComponent } from './filter/filter.component';
import { UserListComponent } from './user-list/user-list.component';

@NgModule({
  declarations: [
    AppComponent,
    FilterComponent,
    UserListComponent,
    AddUserComponent
  ],
  imports: [
    HeaderWebsiteModule,
    NgSelectModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ModalModule,
    NgbModule,
    PipeModule,
    ToolTipModule,
    PagingModule,
    BlockFullUiModule,
    MultipleSelectionModule,
    UtilityModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [HttpService, AppService],
  bootstrap: [AppComponent]
})
export class AppModule {}
