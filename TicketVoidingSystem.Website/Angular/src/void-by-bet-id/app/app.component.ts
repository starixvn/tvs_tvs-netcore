import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import clone from 'lodash/clone';
import { BlockUiDirective } from '../../utility/components/block-ui/block-ui.directive';
import { ConfirmationComponent } from '../../utility/components/confirmation/confirmation.component';
import { MatchDetailComponent } from '../../utility/components/match-detail/match-detail.component';
import { MenuBarComponent } from '../../utility/components/menu-bar/menu-bar.component';
import { MessagesResult } from '../../utility/components/messages-result/messages-result.model';
import { MessagesResultComponent } from '../../utility/components/messages-result/messages-result.component';
import { ModalType } from '../../utility/components/modal/modal.model';
import { ModalService } from '../../utility/components/modal/modal.service';
import { Notification } from '../../utility/components/notification/notification';
import { NotificationComponent } from '../../utility/components/notification/notification.component';
import { Message } from '../../utility/components/template-message/messages/message';
import { TemplateMessageComponent } from '../../utility/components/template-message/template-message/template-message.component';
import { SubIssueType } from '../../utility/components/template-message/template-message/template-setting.model';
import { TemplateValue } from '../../utility/components/template-message/template-message/template.model';
import { TicketsComponent } from '../../utility/components/tickets/tickets.component';
import { TooltipComponent } from '../../utility/components/tooltip/tooltip.component';
import { Tooltip } from '../../utility/components/tooltip/tooltip.model';
import { TEXT } from '../../utility/constants/text';
import { MatchModel } from '../../utility/models/match.model';
import { Result } from '../../utility/models/result';
import { CommonService } from '../../utility/services/common.service';
import { ModalComponent } from '../../void-single-bet/app/modal/modal.component';
import { Modal } from '../../void-single-bet/app/modal/modal.model';
import { AppService } from './app.service';
import { FilterComponent } from './filter/filter.component';
import { GetTicketsQuery, TicketsViewModel } from './model/get-tickets.query';
import { PrimitiveProperty } from './model/void-by-bet-id.model';
import { TemplateMessageService } from './services/template-message.service';
import { ValidationService } from './services/validation.service';
import { VoidTicketsService } from './services/void-tickets.service';
import { TicketsService } from '../../utility/components/tickets/tickets.service';
import { GetTicketsService } from './services/get-tickets.service';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [MenuBarComponent, FilterComponent, TicketsComponent, BlockUiDirective, NgSelectModule,
    TooltipComponent, MatchDetailComponent, TemplateMessageComponent, ConfirmationComponent,
    FormsModule, MessagesResultComponent, NotificationComponent, ModalComponent],
  providers: [TemplateMessageService, ValidationService, VoidTicketsService, GetTicketsService]
})

export class AppComponent implements OnInit {
  @ViewChild('filter') filterComponent: FilterComponent;
  @ViewChild('confirmation') confirmationComponent: ConfirmationComponent;
  @ViewChild('messages') messagesComponent: TemplateMessageComponent;

  private readonly appService = inject(AppService);
  private readonly element = inject(ElementRef);
  private readonly templateMessageService = inject(TemplateMessageService);
  private readonly modalService = inject(ModalService);
  private readonly validationService = inject(ValidationService);
  private readonly commonService = inject(CommonService);
  private readonly voidTicketsService = inject(VoidTicketsService);
  private readonly ticketsService = inject(TicketsService);
  private readonly getTicketsService = inject(GetTicketsService);
  
  ticketsViewModel = new TicketsViewModel();
  primitiveProps = new PrimitiveProperty();
  matchViewModel: MatchModel;
  templateValue = new TemplateValue();
  selectedSubIssueTypeId: number;
  subIssueTypes: SubIssueType[] = [];
  messagesResult = new MessagesResult();
  notification = new Notification();
  tooltip = new Tooltip();
  modal = new Modal();

  ISSUE_TYPE_ID_ABNORMAL_BET = 11;

  async ngOnInit(): Promise<void> {
    this.tooltip.element = this.element;
    this.subIssueTypes = await this.appService.getAbnormalBetSubIssueTypes();
  }

  async getInfoEventSearch(getTicketsQuery: GetTicketsQuery) {
    this.resetData();
    const response = await this.appService.getTickets(getTicketsQuery);
    this.getTicketsService.initData(this.ticketsViewModel, response);
    await this.getMatchInfo();

    if (this.filterComponent.isAbnormalBet && this.ticketsViewModel?.totalItems > 0) {
      this.primitiveProps.isShowReason = true;
      this.selectedSubIssueTypeId = this.subIssueTypes[0]?.subIssueTypeId;
      this.templateValue = this.templateMessageService.generateTemplateValue(getTicketsQuery.abnormalBetType, this.matchViewModel, this.ticketsViewModel);
    }

    this.primitiveProps.isShowMessages = this.ticketsViewModel?.totalItems > 0;
    this.primitiveProps.isShowTickets = true;
    this.primitiveProps.isShowRemoveInvalid = this.ticketsViewModel?.invalidTransIds?.length > 0;
  }

  async search(getTicketsQuery: GetTicketsQuery) {
    this.primitiveProps.isBlockUI = true;
    await this.getInfoEventSearch(getTicketsQuery);
    this.primitiveProps.isBlockUI = false;
  }

  async getMatchInfo() {
    if (this.ticketsViewModel.matchId && this.filterComponent.isAbnormalBet) {
      this.matchViewModel = await this.commonService.getMatch(this.ticketsViewModel.matchId);
      this.primitiveProps.isShowMatch = true;
    }
  }

  removeInvalidTransIds(): void {
    this.ticketsViewModel.invalidTransIds = '';
    this.primitiveProps.isShowRemoveInvalid = false;
  }

  resetData() {
    this.primitiveProps.isShowReason = false;
    this.selectedSubIssueTypeId = null;
    this.primitiveProps.isShowMessages = false;
    this.primitiveProps.isShowMatch = false;
    this.matchViewModel = null;
    this.primitiveProps.isShowTickets = false;
    this.ticketsViewModel = new TicketsViewModel();
    this.templateValue = new TemplateValue();
    if (this.messagesComponent) {
      this.messagesComponent.message = new Message();
      this.messagesComponent.initialMessage = new Message();
    }
    this.filterComponent.resetAllItemsToValid();
    this.confirmationComponent.clearData();
  }

  async showConfirmBeforeVoid() {
    const usersNegativeCredit = await this.checkNegativeBetCredit();
    let message = TEXT.CONFIRM_VOID_TICKET;
    if(usersNegativeCredit) {
      message = `${TEXT.CONFIRM_NEGATIVE_CUSTOMER.replace('{0}', usersNegativeCredit)}<br>${message}`;
    }

    this.modal.open('Void Bet Confirm', message);
  }

  async voidBet() {
    if(!this.validationService.checkValidation(this.messagesComponent, this.confirmationComponent)) {
      return;
    }
    this.showConfirmBeforeVoid();
  }

  async checkNegativeBetCredit(): Promise<string> {
    const request = await this.appService.checkNegativeBalance(this.ticketsService.getCheckedBetIds(this.ticketsViewModel.groups));

    return request?.map(item => item.userName).join(', ');
  }

  async voidTickets() {
    this.primitiveProps.isBlockUI = true;
    const request = this.voidTicketsService.createVoidBetRequest({
      ticketsViewModel: this.ticketsViewModel,
      matchViewModel: this.matchViewModel,
      filterComponent: this.filterComponent,
      confirmationComponent: this.confirmationComponent,
      messagesComponent: this.messagesComponent,
      selectedSubIssueTypeId: this.selectedSubIssueTypeId,
      subIssueTypes: this.subIssueTypes
    });
    const results = await this.appService.voidBet(request);
    if (results) {
      await this.handleAfterVoid(results);
    } else {
      this.getVoidResultCache(request.guid);
    }
  }

  async confirmEvent() {
    const checkingPermissionModel = this.voidTicketsService.createCheckingPermissionModel(this.ticketsViewModel, this.matchViewModel);
    this.modalService.confirmPermission(checkingPermissionModel, {
      title: 'WARNING!',
      type: ModalType.Confirm
    }, async () => {
      this.voidTickets();
    }, async () => {
      this.confirmationComponent.clearData();
    });
  }

  async handleAfterVoid(results: Result<null>[]) {
    if (results[0].errorCode <= 0) {
      this.resetData();
      this.filterComponent.resetFilter();
    }
    this.messagesResult = this.templateMessageService.updateMessagesResult(this.messagesResult, results);
    this.primitiveProps.isBlockUI = false;
  }

  private getVoidResultCache(guid: string) {
    let isChecking = false;
    const interval = setInterval(async () => {
      if (!isChecking) {
        isChecking = true;
        const results = await this.appService.getVoidResultCache(guid);
        if (results && results.length > 0) {
          await this.handleAfterVoid(results);
          clearInterval(interval);
        }
        isChecking = false;
      }
    }, 2000);
  }

  async exportExcel() {
    this.primitiveProps.isBlockUI = true;
    await this.appService.exportExcel(this.filterComponent.createTicketsQuery());
    this.primitiveProps.isBlockUI = false;
  }

  ticketsChange(numberOfTickets: number) {
    this.templateValue = clone(this.templateValue);
    this.templateValue.totalTickets = numberOfTickets;
    this.templateValue.checkSettled = this.ticketsService.checkSettledTickets(this.ticketsViewModel.groups);
  }
}
