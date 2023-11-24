import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UsernamesComponent } from '../../../../utility/components/user-names/user-names.component';
import { TVSRequestActionType } from '../../../../utility/constants/config';
import { AddRequestApiService } from '../add-request-api.service';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { AbnormalAccountModel } from '../models/abnormal-account.model';
import { OthersModel } from '../others/others.model';
import { AccountTableComponent } from './account-table/account-table.component';
import { ConfirmAbnormalAccountModel } from './confirm-abnormal-account/confirm-abnormal-account.model';
import { EventDateFilterComponent } from './event-date-filter/event-date-filter.component';
import { PrimitiveProperty } from './models/primitive-property.model';
import { SaveRequestArg } from './models/save-request.model';
import { ValidationBusinessRuleArgs } from './models/validation.model';
import { ProductFilterComponent } from './product-filter/product-filter.component';
import { EventAbnormalAccountService } from './services/event-abnormal.account.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';

@Component({
  selector: 'abnormal-accounts',
  templateUrl: './abnormal-accounts.component.html',
  styleUrls: ['./abnormal-accounts.component.scss']
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
  @Input() abnormalAccountModel = new AbnormalAccountModel();
  @ViewChild('usernames') usernamesComponent: UsernamesComponent;
  @ViewChild('products') productFilterComponent: ProductFilterComponent;
  @ViewChild('eventDate') eventDateFilterComponent: EventDateFilterComponent;
  @ViewChild('accountTable') accountTableComponent: AccountTableComponent;

  usernamesList: string;
  primitiveProps = new PrimitiveProperty();
  confirmAbnormalAccount = new ConfirmAbnormalAccountModel();
  constructor(
    private readonly validationService: ValidationService,
    private readonly addRequestStore: AddRequestStore,
    private readonly saveRequestService: SaveRequestService,
    private readonly addRequestApiService: AddRequestApiService,
    private readonly eventAbnormalAccountService: EventAbnormalAccountService
  ) { }

  async ngOnInit(): Promise<void> {
    if (this.isEdit && this.filter.action === TVSRequestActionType.AUTO_VOID_INSTANT_WITH_POLICY_ID.toString()) {
      this.addRequestStore.changeBlockingUiStatus(true);
      this.primitiveProps.validAccountWinlostModels = await this.addRequestApiService.getAccountWinLost(this.requestId);
      this.primitiveProps.isShowAccountWinLost = true;
      this.addRequestStore.changeBlockingUiStatus(false);
    }

    if (this.isEdit) {
      this.usernamesList = this.abnormalAccountModel.accountWinlostModels.map(x => x.username).join(',')
    };
  }

  public async focusOutUsernames(): Promise<void> {
    if (this.primitiveProps.isCancelValidate) {
      this.primitiveProps.isCancelValidate = false;
      return;
    }
    await this.validationService.checkBusinessRule(this.initValidationBusinessRuleArgs());
  }

  public triggerCloseEvent() {
    this.addRequestStore.changeSavingRequestStatus(false);
  }

  public async saveRequest(): Promise<void> {
    if (this.accountTableComponent && !this.accountTableComponent.isValid()) {
      this.addRequestStore.changeSavingRequestStatus(false);
      return;
    }
    await this.saveRequestService.saveRequest(this.initSaveRequestInput());
  }

  public async onYesConfirmWarningModal(): Promise<void> {
    await this.saveRequestService.onYesConfirmWarningModal(this.initSaveRequestInput());
  }

  public isShowUserInfo(): boolean {
    return this.filter.action === TVSRequestActionType.AUTO_VOID_INSTANT_WITH_POLICY_ID.toString();
  }

  public async handleSearchEvent(): Promise<void> {
    this.addRequestStore.changeBlockingUiStatus(true);
    if (this.accountTableComponent && !this.accountTableComponent.isValid()) {
      this.addRequestStore.changeBlockingUiStatus(false);
      return;
    }
    const validationOutput = await this.validationService.checkBusinessRule(this.initValidationBusinessRuleArgs());
    this.primitiveProps.validAccountWinlostModels = validationOutput.accountWinlostModels;
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  private initSaveRequestInput() {
    const usernames = this.usernamesComponent.groupUsername.getAllValue();
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
    arg.abnormalAccountModel.accountWinlostModels
      = this.eventAbnormalAccountService.getAccountWinlostModels(usernames, this.primitiveProps.validAccountWinlostModels);
    arg.usernamesComponent = this.usernamesComponent;
    arg.confirmAbnormalAccount = this.confirmAbnormalAccount;
    arg.productFilterComponent = this.productFilterComponent;
    arg.eventDateFilterComponent = this.eventDateFilterComponent;
    arg.accountTableComponent = this.accountTableComponent;

    return arg;
  }

  private initValidationBusinessRuleArgs(): ValidationBusinessRuleArgs {
    const usernames = this.usernamesComponent.groupUsername.getAllValue();
    const arg = new ValidationBusinessRuleArgs();
    arg.actionId = this.filter.action;
    arg.requestId = this.requestId;
    arg.issueTypeId = this.filter.issueTypeId;
    arg.usernamesComponent = this.usernamesComponent;
    arg.abnormalAccountModel = this.abnormalAccountModel;
    arg.abnormalAccountModel.accountWinlostModels
      = this.eventAbnormalAccountService.getAccountWinlostModels(usernames, this.primitiveProps.validAccountWinlostModels);
    arg.productFilterComponent = this.productFilterComponent;
    arg.eventDateFilterComponent = this.eventDateFilterComponent;
    arg.accountTableComponent = this.accountTableComponent;
    arg.primitiveProps = this.primitiveProps;

    return arg;
  }

  public hideValidationMessage(): void {
    this.primitiveProps.isShowError = false;
  }

  public changeFilter(): void {
    this.primitiveProps.isShowAccountWinLost = false;
    this.primitiveProps.isShowError = false;
  }
}
