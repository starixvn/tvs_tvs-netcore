import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbCollapseModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AutosizeModule } from 'ngx-autosize';
import { AddChildMatchComponent } from '../../../utility/components/add-child-match/add-child-match.component';
import { BlockFullUiModule } from '../../../utility/components/block-full-ui/block-full-ui.module';
import { BlockUiModule } from '../../../utility/components/block-ui/block-ui.module';
import { DateTimeModule } from '../../../utility/components/date-time/date-time.module';
import { ModalModule } from '../../../utility/components/modal/modal.module';
import { MultipleSelectionModule } from '../../../utility/components/multiple-selection/multiple-selection.module';
import { NgSelectMixtureModule } from '../../../utility/components/ng-select-mixture/ng-select-mixture.module';
import { PagingModule } from '../../../utility/components/paging/paging.module';
import { PipeModule } from '../../../utility/pipes/pipe.module';
import { UtilityModule } from '../../../utility/utility.module';
import { PoolHouseTicketModule } from './../../../utility/components/pool-house-ticket/pool-house-ticket.module';
import { ToolTipModule } from './../../../utility/components/tooltip/tooltip.module';
import { AbnormalAccountOtherComponent } from './abnormal-accounts/abnormal-accounts-other/abnormal-accounts-other.component';
import { AbnormalAccountsComponent } from './abnormal-accounts/abnormal-accounts.component';
import { AccountTableComponent } from './abnormal-accounts/account-table/account-table.component';
import { ConfirmAbnormalAccountComponent } from './abnormal-accounts/confirm-abnormal-account/confirm-abnormal-account.component';
import { EventDateFilterComponent } from './abnormal-accounts/event-date-filter/event-date-filter.component';
import { ProductFilterComponent } from './abnormal-accounts/product-filter/product-filter.component';
import { AddRequestComponent } from './add-request.component';
import { ConfirmAbnormalBetComponent } from './event-abnormal-bet/confirm-abnormal-bet/confirm-abnormal-bet.component';
import { EventAbnormalBetComponent } from './event-abnormal-bet/event-abnormal-bet.component';
import { LeagueEventAbnormalComponent } from './event-abnormal-bet/league-event-abnormal/league-event-abnormal.component';
import { OthersAbnormalBetComponent } from './event-abnormal-bet/others-abnormal-bet/others-abnormal-bet.component';
import { ConfirmDangerAcceptedComponent } from './event-danger-accepted/confirm-danger-accepted/confirm-danger-accepted.component';
import { EventDangerAcceptedComponent } from './event-danger-accepted/event-danger-accepted.component';
import { EventDuplicateTicketsComponent } from './event-duplicate-tickets/event-duplicate-tickets.component';
import { ConfirmEkoComponent } from './event-early-kick-off/confirm-eko/confirm-eko.component';
import { EventEarlyKickOffComponent } from './event-early-kick-off/event-early-kick-off.component';
import { LogInfoEkoComponent } from './event-early-kick-off/log-info-eko/log-info-eko.component';
import { TicketsListComponent } from './event-early-kick-off/tickets-list/tickets-list.component';
import { EventNotParticipateComponent } from './event-not-participate/event-not-participate.component';
import { FilterNotParticipateItemComponent } from './event-not-participate/filter-not-participate/filter-not-participate-item/filter-not-participate-item.component';
import { FilterNotParticipateComponent } from './event-not-participate/filter-not-participate/filter-not-participate.component';
import { LogInfoNotParticipateComponent } from './event-not-participate/log-info-not-participate/log-info-not-participate.component';
import { EventRecoverTicketComponent } from './event-recover-ticket/event-recover-ticket.component';
import { ConfirmRedCardComponent } from './event-red-card/confirm-red-card/confirm-red-card.component';
import { EventRedCardComponent } from './event-red-card/event-red-card.component';
import { FilterTimeAreaComponent } from './event-red-card/filter-time-area/filter-time-area.component';
import { FilterTimeWithAllowanceComponent } from './event-red-card/filter-time-with-allowance/filter-time-with-allowance.component';
import { LeagueEventRedCardComponent } from './event-red-card/league-event-red-card/league-event-red-card.component';
import { LogInfoRedCardComponent } from './event-red-card/log-info-red-card/log-info-red-card.component';
import { EventReducedOverComponent } from './event-reduced-over/event-reduced-over.component';
import { FilterReducedOverItemComponent } from './event-reduced-over/filter-reduced-over-item/filter-reduced-over-item.component';
import { FilterReducedOverComponent } from './event-reduced-over/filter-reduced-over/filter-reduced-over.component';
import { LogInfoReducedOverComponent } from './event-reduced-over/log-info-reduced-over/log-info-reduced-over.component';
import { EventTicket14Component } from './event-ticket14/event-ticket14.component';
import { EventWrongHdpComponent } from './event-wrong-hdp/event-wrong-hdp.component';
import { FilterWithHdpComponent } from './event-wrong-hdp/filter-with-hdp/filter-with-hdp.component';
import { LogInfoWrongHdpComponent } from './event-wrong-hdp/log-info-wrong-hdp/log-info-wrong-hdp.component';
import { OthersWrongHdpComponent } from './event-wrong-hdp/others-wrong-hdp/others-wrong-hdp.component';
import { EventWrongOddsComponent } from './event-wrong-odds/event-wrong-odds.component';
import { FilterWrongOddsComponent } from './event-wrong-odds/filter-wrong-odds/filter-wrong-odds.component';
import { LogInfoWrongOddsComponent } from './event-wrong-odds/log-info-wrong-odds/log-info-wrong-odds.component';
import { EventWrongOuComponent } from './event-wrong-ou/event-wrong-ou.component';
import { FilterWrongOuComponent } from './event-wrong-ou/filter-wrong-ou/filter-wrong-ou.component';
import { LogInfoWrongOuComponent } from './event-wrong-ou/log-info-wrong-ou/log-info-wrong-ou.component';
import { AllowanceTimeComponent } from './event-wrong-score/allowance-time/allowance-time.component';
import { ConfirmWrongScoreComponent } from './event-wrong-score/confirm-wrong-score/confirm-wrong-score.component';
import { EventWrongScoreComponent } from './event-wrong-score/event-wrong-score.component';
import { FilterWrongScoreComponent } from './event-wrong-score/filter-wrong-score/filter-wrong-score.component';
import { WrongScoreInfoComponent } from './event-wrong-score/wrong-score-info/wrong-score-info.component';
import { FilterComponent } from './filter/filter.component';
import { FilterService } from './filter/filter.service';
import { SubIssueTypeDialogComponent } from './filter/sub-issue-type-dialog/sub-issue-type-dialog.component';
import { LeagueEventComponent } from './league-event/league-event.component';
import { OthersComponent } from './others/others.component';
import { OthersService } from './others/others.service';
import { TemplateMessageModule } from "../../../utility/components/template-message/template-message.module";

@NgModule({
    declarations: [
        AddRequestComponent,
        FilterComponent,
        OthersComponent,
        TicketsListComponent,
        LeagueEventComponent,
        EventEarlyKickOffComponent,
        EventAbnormalBetComponent,
        EventDangerAcceptedComponent,
        AddChildMatchComponent,
        AbnormalAccountsComponent,
        ProductFilterComponent,
        EventDateFilterComponent,
        AbnormalAccountOtherComponent,
        ConfirmAbnormalBetComponent,
        EventWrongScoreComponent,
        EventRedCardComponent,
        WrongScoreInfoComponent,
        LeagueEventAbnormalComponent,
        FilterTimeWithAllowanceComponent,
        SubIssueTypeDialogComponent,
        AllowanceTimeComponent,
        FilterTimeAreaComponent,
        ConfirmWrongScoreComponent,
        LeagueEventRedCardComponent,
        LogInfoRedCardComponent,
        ConfirmRedCardComponent,
        ConfirmDangerAcceptedComponent,
        OthersAbnormalBetComponent,
        EventTicket14Component,
        FilterWrongScoreComponent,
        EventWrongHdpComponent,
        FilterWithHdpComponent,
        LogInfoWrongHdpComponent,
        OthersWrongHdpComponent,
        EventWrongOuComponent,
        FilterWrongOuComponent,
        LogInfoWrongOuComponent,
        ConfirmAbnormalAccountComponent,
        EventWrongOddsComponent,
        FilterWrongOddsComponent,
        LogInfoWrongOddsComponent,
        EventReducedOverComponent,
        FilterReducedOverComponent,
        FilterReducedOverItemComponent,
        LogInfoReducedOverComponent,
        EventDuplicateTicketsComponent,
        EventNotParticipateComponent,
        LogInfoEkoComponent,
        FilterNotParticipateComponent,
        FilterNotParticipateItemComponent,
        LogInfoNotParticipateComponent,
        ConfirmEkoComponent,
        AccountTableComponent,
        EventRecoverTicketComponent
    ],
    exports: [
        AddRequestComponent
    ],
    providers: [
        FilterService,
        OthersService,
        DatePipe
    ],
    imports: [
        BlockUiModule,
        BrowserModule,
        CommonModule,
        DateTimeModule,
        FormsModule,
        HttpClientModule,
        ModalModule,
        NgSelectModule,
        NgbModule,
        ToolTipModule,
        UtilityModule,
        PagingModule,
        PipeModule,
        FormsModule,
        BlockFullUiModule,
        PoolHouseTicketModule,
        NgbCollapseModule,
        NgSelectMixtureModule,
        MultipleSelectionModule,
        AutosizeModule,
        TemplateMessageModule
    ]
})
export class AddRequestModule { }
