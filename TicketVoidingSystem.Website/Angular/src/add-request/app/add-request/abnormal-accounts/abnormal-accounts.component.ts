import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UsernamesComponent } from '../../../../utility/components/user-names/user-names.component';
import { TVSRequestActionType } from '../../../../utility/constants/config';
import { AddRequestApiService } from '../add-request-api.service';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { AbnormalAccountModel } from '../models/abnormal-account.model';
import { OthersModel } from '../others/others.model';
import { ConfirmAbnormalAccountModel } from './confirm-abnormal-account/confirm-abnormal-account.model';
import { EventDateFilterComponent } from './event-date-filter/event-date-filter.component';
import { AccountWinlostModel } from './models/account-winlost.model';
import { PrimitiveProperty } from './models/primitive-property.model';
import { SaveRequestArg } from './models/save-request.model';
import { ValidationBusinessRuleArgs } from './models/validation.model';
import { ProductFilterComponent } from './product-filter/product-filter.component';
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

  usernamesList: string;
  primitiveProps = new PrimitiveProperty();
  confirmAbnormalAccount = new ConfirmAbnormalAccountModel();
  validAccountWinlostModels: AccountWinlostModel[] = [];
  constructor(
    private readonly validationService: ValidationService,
    private readonly addRequestStore: AddRequestStore,
    private readonly saveRequestService: SaveRequestService,
    private readonly addRequestApiService: AddRequestApiService
  ) { }

  async ngOnInit(): Promise<void> {
    if (this.isEdit && this.filter.action === TVSRequestActionType.AUTO_VOID_INSTANT_WITH_POLICY_ID.toString()) {
      this.addRequestStore.changeBlockingUiStatus(true);
      this.validAccountWinlostModels = await this.addRequestApiService.getAccountWinLost(this.requestId);
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
    await this.validationService.checkValidUsernames(this.initValidationBusinessRuleArgs());
  }

  public triggerCloseEvent() {
    this.addRequestStore.changeSavingRequestStatus(false);
  }

  public async saveRequest(): Promise<void> {
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
    const validationOutput = await this.validationService.checkValidUsernames(this.initValidationBusinessRuleArgs());
    this.validAccountWinlostModels = validationOutput.accountWinlostModels;
    this.primitiveProps.isShowAccountWinLost = true;
    this.addRequestStore.changeBlockingUiStatus(false);
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
    arg.abnormalAccountModel.accountWinlostModels = this.validAccountWinlostModels
    arg.usernamesComponent = this.usernamesComponent;
    arg.confirmAbnormalAccount = this.confirmAbnormalAccount;
    arg.productFilterComponent = this.productFilterComponent;
    arg.eventDateFilterComponent = this.eventDateFilterComponent;

    return arg;
  }

  private initValidationBusinessRuleArgs(): ValidationBusinessRuleArgs {
    const args = new ValidationBusinessRuleArgs();
    args.actionId = this.filter.action;
    args.requestId = this.requestId;
    args.issueTypeId = this.filter.issueTypeId;
    args.usernamesComponent = this.usernamesComponent;
    args.abnormalAccountModel = this.abnormalAccountModel;
    args.abnormalAccountModel.accountWinlostModels = this.getAccountWinlostModels();
    args.primitiveProps = this.primitiveProps;

    return args;
  }

  public getAccountWinlostModels(): AccountWinlostModel[] {
    const usernames = this.usernamesComponent.groupUsername.getAllValue();
    return usernames?.split(',').map(x => {
      return {
        username: x,
        adjustVoidLimit: this.validAccountWinlostModels?.find(y => y.username === x)?.adjustVoidLimit
      } as AccountWinlostModel
    });
  }

  public changeFilter(): void {
    this.primitiveProps.isShowAccountWinLost = false;
  }
}
