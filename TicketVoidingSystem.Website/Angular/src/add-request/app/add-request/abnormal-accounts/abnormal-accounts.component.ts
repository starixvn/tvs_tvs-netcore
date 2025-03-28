import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment-timezone';
import { BlockUiModule } from '../../../../utility/components/block-ui/block-ui.module';
import { UsernamesComponent } from '../../../../utility/components/user-names/user-names.component';
import { TVSRequestActionType } from '../../../../utility/constants/config';
import { AddRequestApiService } from '../add-request-api.service';
import { AddRequestStore } from '../add-request.store';
import { ConfirmAddRequestComponent } from '../confirm-add-request/confirm-add-request.component';
import { ConfirmAddRequestModel } from '../confirm-add-request/confirm-add-request.model';
import { FilterModel } from '../filter/filter.model';
import { IssueTypes } from '../filter/issue-types.model';
import { AbnormalAccountModel } from '../models/abnormal-account.model';
import { OthersModel } from '../others/others.model';
import { AccountAffectedTicketComponent } from './account-affected-ticket/account-affected-ticket.component';
import { AccountAffectedTicketModel } from './account-affected-ticket/account-affected-ticket.model';
import { AccountTableComponent } from './account-table/account-table.component';
import { EventDateFilterComponent } from './event-date-filter/event-date-filter.component';
import { PrimitiveProperty } from './models/primitive-property.model';
import { SaveRequestArg } from './models/save-request.model';
import { ValidationBusinessRuleArgs } from './models/validation.model';
import { ProductFilterComponent } from './product-filter/product-filter.component';
import { AbnormalAccountService } from './services/abnormal-account.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';

@Component({
  selector: 'abnormal-accounts',
  templateUrl: './abnormal-accounts.component.html',
  styleUrls: ['./abnormal-accounts.component.scss'],
  standalone: true,
  imports: [NgbModule, FormsModule, ConfirmAddRequestComponent, UsernamesComponent, ProductFilterComponent,
    EventDateFilterComponent, AccountTableComponent, AccountAffectedTicketComponent, BlockUiModule],
  providers: [
    SaveRequestService,
    ValidationService,
    AbnormalAccountService
  ]
})
export class AbnormalAccountsComponent implements OnInit {
  @Input() isVoided: boolean;
  @Input() isEdit: boolean;
  @Input() filter: FilterModel;
  @Input() userId: number;
  @Input() requestId?: number;
  @Input() requestedBy: string;
  @Input() actionIdOfFirstTimeAccess: string;
  @Input() others = new OthersModel();
  @Input() issueTypes = new IssueTypes();
  @Input() abnormalAccountModel = new AbnormalAccountModel();
  @ViewChild('usernames') usernamesComponent: UsernamesComponent;
  @ViewChild('products') productFilterComponent: ProductFilterComponent;
  @ViewChild('eventDate') eventDateFilterComponent: EventDateFilterComponent;
  @ViewChild('accountTable') accountTableComponent: AccountTableComponent;

  primitiveProps = new PrimitiveProperty();
  confirmAddRequest = new ConfirmAddRequestModel();
  accountAffectedTicketModel = new AccountAffectedTicketModel();
  private readonly addRequestStore = inject(AddRequestStore);
  private readonly saveRequestService = inject(SaveRequestService);
  private readonly validationService = inject(ValidationService);
  private readonly addRequestApiService = inject(AddRequestApiService);

  async ngOnInit() {
    if (this.isEdit && this.validationService.isAutoVoidWithPolicy(this.filter.action)) {
      this.addRequestStore.changeBlockingUiStatus(true);
      this.primitiveProps.validAccountWinlostModels = await this.addRequestApiService.getAccountWinLost(this.requestId);
      this.primitiveProps.isShowAccountWinLost = true;
      this.addRequestStore.changeBlockingUiStatus(false);
    }
    this.primitiveProps.permission = await this.addRequestApiService.getPermissionAddRequest();
    this.primitiveProps.minDate = this.getMinDateByPermission(this.primitiveProps.permission.isVoidAllArchivedTickets);
  }

  async focusOutUsernames() {
    if (this.primitiveProps.isCancelValidate) {
      this.primitiveProps.isCancelValidate = false;
      return;
    }
    await this.validationService.checkBusinessRule(this.initValidationBusinessRuleArgs());
  }

  async saveRequest() {
    this.primitiveProps.isCheckedShowAdjustAccount = false;
    if (this.accountTableComponent && !this.accountTableComponent.isValid()) {
      this.addRequestStore.changeSavingRequestStatus(false);
      return;
    }
    await this.saveRequestService.saveRequest(this.initSaveRequestInput());
  }

  async onClickConfirmSaveRequest() {
    await this.saveRequestService.onClickConfirmSave(this.initSaveRequestInput());
  }

  async handleSearchEvent() {
    this.addRequestStore.changeBlockingUiStatus(true);
    if (this.accountTableComponent) {
      this.accountTableComponent.isCancelRecalculateAmount = true;
      if (!this.accountTableComponent.isValid()) {
        this.addRequestStore.changeBlockingUiStatus(false);
        return;
      }
    }
    this.primitiveProps.isCheckedShowAdjustAccount = false;
    const validationOutput = await this.validationService.checkBusinessRule(this.initValidationBusinessRuleArgs());
    this.primitiveProps.validAccountWinlostModels = validationOutput.accountWinlostModels;
    this.primitiveProps.transInfoAddRequestModel = validationOutput.transInfoAddRequestModel;
    if (this.isShowUserInfo()) {
      this.accountAffectedTicketModel.adjustedAccounts = [];
      this.primitiveProps.validAccountWinlostModels?.forEach(x => x.isEditedTicket = false);
    }
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  changeShowAdjustAccount() {
    this.primitiveProps.validAccountWinlostModels?.forEach(
      x => x.isShowOnTable = (!this.primitiveProps.isCheckedShowAdjustAccount && !x.isCanEditTicket) || x.isCanEditTicket
    );
  }

  onClickCancelSaveRequest() {
    this.addRequestStore.changeSavingRequestStatus(false);
  }

  isShowUserInfo(): boolean {
    return this.filter.action === TVSRequestActionType.AUTO_VOID_INSTANT_WITH_POLICY_ID.toString();
  }

  openPopupAdjustTicket(custId: number) {
    const transInfoJson = this.primitiveProps.validAccountWinlostModels.find(x => x.custId === custId)?.transInfoAccountJson;
    this.accountAffectedTicketModel.accountWinlostModels = this.primitiveProps.validAccountWinlostModels;
    this.accountAffectedTicketModel.selectedCustId = custId;
    this.accountAffectedTicketModel.transInfoJson = transInfoJson ?? this.primitiveProps.transInfoAddRequestModel.transInfoJson;
    this.accountAffectedTicketModel.isOpen = true;
  }

  reCalculateByAccount(custId: number) {
    this.accountAffectedTicketModel.adjustedAccounts = this.accountAffectedTicketModel.adjustedAccounts?.filter(x => x.custId !== custId);
    this.abnormalAccountModel.adjustedTickets = this.abnormalAccountModel.adjustedTickets?.filter(x => x.custId !== custId);
    this.primitiveProps.isShowError = false;
  }

  changeFilter() {
    this.primitiveProps.isShowAccountWinLost = false;
    this.primitiveProps.isShowError = false;
    this.primitiveProps.validAccountWinlostModels = [];
    this.addRequestStore.changeStartTimeFilterAnalysis(new Date());
  }

  private getMinDateByPermission(isVoidAllArchivedTickets: boolean): NgbDate {
    if (isVoidAllArchivedTickets) {
      return null;
    }

    const currentMoment = moment.utc().tz('America/Caracas');
    const momentMinDate = currentMoment.subtract(7, "days");

    return new NgbDate(momentMinDate.year(), momentMinDate.month() + 1, momentMinDate.date());
  }

  private initSaveRequestInput() {
    const arg = new SaveRequestArg();
    arg.requestId = this.requestId;
    arg.isEdit = this.isEdit;
    arg.userId = this.userId;
    arg.requestedBy = this.requestedBy;
    arg.actionIdOfFirstTimeAccess = this.actionIdOfFirstTimeAccess;
    arg.filter = this.filter;
    arg.others = this.others;
    arg.primitiveProps = this.primitiveProps;
    arg.addRequestStore = this.addRequestStore;
    arg.abnormalAccountModel = this.abnormalAccountModel;
    arg.abnormalAccountModel.accountWinlostModels =
      this.validationService.isAutoVoidWithPolicy(this.filter.action) ? this.primitiveProps.validAccountWinlostModels : null;
    arg.usernamesComponent = this.usernamesComponent;
    arg.productFilterComponent = this.productFilterComponent;
    arg.eventDateFilterComponent = this.eventDateFilterComponent;
    arg.accountTableComponent = this.accountTableComponent;
    arg.confirmAddRequest = this.confirmAddRequest;

    return arg;
  }

  private initValidationBusinessRuleArgs(): ValidationBusinessRuleArgs {
    const arg = new ValidationBusinessRuleArgs();
    arg.actionId = this.filter.action;
    arg.requestId = this.requestId;
    arg.issueTypeId = this.filter.issueTypeId;
    arg.usernamesComponent = this.usernamesComponent;
    arg.abnormalAccountModel = this.abnormalAccountModel;
    arg.abnormalAccountModel.accountWinlostModels =
      this.validationService.isAutoVoidWithPolicy(this.filter.action) ? this.primitiveProps.validAccountWinlostModels : null;
    arg.productFilterComponent = this.productFilterComponent;
    arg.eventDateFilterComponent = this.eventDateFilterComponent;
    arg.accountTableComponent = this.accountTableComponent;
    arg.primitiveProps = this.primitiveProps;

    return arg;
  }
}
