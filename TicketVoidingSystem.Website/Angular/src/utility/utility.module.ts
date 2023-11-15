import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
// import { AutoRefreshComponent } from './components/auto-refresh/auto-refresh.component';
// import { BaseTicketsListComponent } from './components/base-tickets-list/base-tickets-list.component';
// import { BetIdsComponent } from './components/bet-ids/bet-ids.component';
// import { BetTypesVirtualSportComponent } from './components/bettypes-virtualsports/bettypes-virtualsports.component';
// import { BetTypesComponent } from './components/bettypes/bettypes.component';
 import { ConfirmationComponent } from './components/confirmation/confirmation.component';
// import { MatchDetailComponent } from './components/match-detail/match-detail.component';
// import { MessagesResultComponent } from './components/messages-result/messages-result.component';
// import { NotificationComponent } from './components/notification/notification.component';
import { UsernamesComponent } from './components/user-names/user-names.component';
// import { OnlyNumberDirective } from './directives/number.directive';
// import { NumbersOnlyDirective } from './directives/numbers-only.directive';
// import { AdvancedModeModule } from './components/advanced-mode/advanced-mode.module';
// import { DateTimeModule } from './components/date-time/date-time.module';
import { AdvancedModeModule } from './components/advanced-mode/advanced-mode.module';
import { AutoRefreshComponent } from './components/auto-refresh/auto-refresh.component';
import { BaseTicketsListComponent } from './components/base-tickets-list/base-tickets-list.component';
import { BetIdsComponent } from './components/bet-ids/bet-ids.component';
import { BetTypesVirtualSportComponent } from './components/bettypes-virtualsports/bettypes-virtualsports.component';
import { BetTypesComponent } from './components/bettypes/bettypes.component';
import { BlockFullUiModule } from './components/block-full-ui/block-full-ui.module';
import { BlockUiModule } from './components/block-ui/block-ui.module';
import { DateTimeModule } from './components/date-time/date-time.module';
import { DetailNotParticipateComponent } from './components/log-info-detail/detail-not-participate/detail-not-participate.component';
import { MatchDetailComponent } from './components/match-detail/match-detail.component';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { MessagesResultComponent } from './components/messages-result/messages-result.component';
import { ModalModule } from './components/modal/modal.module';
import { NotificationComponent } from './components/notification/notification.component';
import { PagingModule } from './components/paging/paging.module';
import { RequestInfoModule } from './components/request-info/request-info.module';
import { ToolTipModule } from './components/tooltip/tooltip.module';
import { OnlyNumberDirective } from './directives/number.directive';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { PipeModule } from './pipes/pipe.module';
import { CommonService } from './services/common.service';
import { HttpService } from './services/http.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ModalModule,
    NgbModule,
    PagingModule,
    ToolTipModule,
    NgSelectModule,
    PipeModule,
    // TemplateMessageModule,
    AdvancedModeModule,
    DateTimeModule,
    BlockUiModule,
    BlockFullUiModule,
    RequestInfoModule
  ],
  declarations: [
    UsernamesComponent,
    MenuBarComponent,
    AutoRefreshComponent,
    BaseTicketsListComponent,
    BetTypesComponent,
    BetTypesVirtualSportComponent,
    ConfirmationComponent,
    MatchDetailComponent,
    MessagesResultComponent,
    NotificationComponent,
    NumbersOnlyDirective,
    OnlyNumberDirective,
    BetIdsComponent,
    AutoRefreshComponent,
    DetailNotParticipateComponent
  ],
  exports: [
    BaseTicketsListComponent,
    BetTypesComponent,
    BetTypesVirtualSportComponent,
    ConfirmationComponent,
    MatchDetailComponent,
    MessagesResultComponent,
    NotificationComponent,
    NumbersOnlyDirective,
    OnlyNumberDirective,
    BetIdsComponent,
    AutoRefreshComponent,
    UsernamesComponent,
    MenuBarComponent,
    BlockFullUiModule,
    DetailNotParticipateComponent
  ],
  providers: [HttpService, CommonService]
})
export class UtilityModule {}
