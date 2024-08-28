import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AutosizeModule } from 'ngx-autosize';
import { BlockUiModule } from 'src/utility/components/block-ui/block-ui.module';
import { IssueTypeModule } from 'src/utility/components/issue-type/issue-type.module';
import { PagingModule } from 'src/utility/components/paging/paging.module';
import { PipeModule } from 'src/utility/pipes/pipe.module';
import { MatchInfoComponent } from '../match-info/match-info.component';
import { TicketsComponent } from '../tickets/tickets.component';
import { RequestInfoComponent } from './request-info.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    IssueTypeModule,
    PagingModule,
    PipeModule,
    BlockUiModule,
    AutosizeModule
  ],
  declarations: [
    RequestInfoComponent,
    MatchInfoComponent,
    TicketsComponent
  ],
  exports: [
    RequestInfoComponent
  ]
})
export class RequestInfoModule { }
