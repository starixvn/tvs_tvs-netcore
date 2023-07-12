import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BlockUiModule } from '../../components/block-ui/block-ui.module';
import { PagingModule } from '../../components/paging/paging.module';
import { ToolTipModule } from '../../components/tooltip/tooltip.module';
import { PipeModule } from '../../pipes/pipe.module';
import { GroupBettypesPoolHouseComponent } from './group-bettypes-pool-house/group-bettypes-pool-house.component';
import { LinkedLogComponent } from './linked-log/linked-log.component';
import { PoolHouseTicketComponent } from './pool-house-ticket.component';
import { TicketsComponent } from './tickets/tickets.component';

@NgModule({
  declarations: [
    PoolHouseTicketComponent,
    GroupBettypesPoolHouseComponent,
    LinkedLogComponent,
    TicketsComponent
  ],
  exports: [
    PoolHouseTicketComponent,
    GroupBettypesPoolHouseComponent
  ],
  imports: [
    FormsModule,
    NgbModule,
    ToolTipModule,
    PagingModule,
    BlockUiModule,
    CommonModule,
    PipeModule,
    NgbAccordionModule
  ]
})
export class PoolHouseTicketModule { }
