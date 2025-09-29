import { Component, inject, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BetIdsComponent } from '../../../../utility/components/bet-ids/bet-ids.component';
import { BlockUiDirective } from '../../../../utility/components/block-ui/block-ui.directive';
import { TVSRequestFilterBy } from '../../../../utility/constants/config';
import { AddRequestApiService } from '../add-request-api.service';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { EventTicket14Model } from '../models/event-ticket-14.model';
import { OthersModel } from '../others/others.model';
import { PrimitiveProperty } from './models/primitive-property.model';
import { SaveRequestArg } from './models/save-request-arg.model';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';

@Component({
    selector: 'event-ticket14',
    templateUrl: './event-ticket14.component.html',
    styleUrls: ['./event-ticket14.component.scss'],
    standalone: true,
    imports: [BetIdsComponent, FormsModule, BlockUiDirective],
    providers: [
      SaveRequestService,
      ValidationService
    ]
  })
export class EventTicket14Component {
  @Input() isEdit: boolean;
  @Input() requestId?: number;
  @Input() filter: FilterModel;
  @Input() others = new OthersModel();
  @Input() eventTicket14Model: EventTicket14Model;
  @ViewChild('betIds') betIdsComponent: BetIdsComponent;

  primitiveProps = new PrimitiveProperty();
  isCancelAfterFocusOutBetIdsEvent = false;
  private readonly addRequestStore = inject(AddRequestStore);
  private readonly saveRequestService = inject(SaveRequestService);
  private readonly validationService = inject(ValidationService);
  private readonly addRequestApiService = inject(AddRequestApiService);

  public async ngOnInit(): Promise<void> {
    this.primitiveProps.permission = await this.addRequestApiService.getPermissionAddRequest();
  }

  async afterFocusOutBetIds(): Promise<void> {
    this.addRequestStore.changeStartTimeFilterAnalysis(new Date());
    if (!this.isCancelAfterFocusOutBetIdsEvent) {
      this.primitiveProps.isBlockBetIds = true;
      await this.validationService.checkBusinessRule(this.betIdsComponent, this.primitiveProps.permission);
      this.primitiveProps.isBlockBetIds = false;
    }
  }

  public async saveRequest(): Promise<void> {
    this.addRequestStore.changeBlockingUiStatus(true);
    if (this.filter.isVoided) {
      await this.executeApiSaveRequest();
      this.addRequestStore.changeBlockingUiStatus(false);

      return;
    }

    await this.saveWhenRequestNotVoided();
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  private async saveWhenRequestNotVoided(): Promise<void> {
    this.isCancelAfterFocusOutBetIdsEvent = true;
    this.betIdsComponent.triggerFocusOutBetIds();
    this.isCancelAfterFocusOutBetIdsEvent = false;

    const result = await this.validationService.checkBusinessRule(this.betIdsComponent, this.primitiveProps.permission);
    this.primitiveProps.transInfoJson = result.transInfoJson;
    if (result.isValid) {
      await this.executeApiSaveRequest();
    } else {
      this.addRequestStore.changeSavingRequestStatus(false);
    }
  }

  private async executeApiSaveRequest(): Promise<void> {
    const args = new SaveRequestArg();
    args.primitiveProps = this.primitiveProps;
    args.requestId = this.requestId;
    args.isEdit = this.isEdit;
    args.transIds = this.betIdsComponent.getAllBetIds();
    args.filter = this.filter;
    args.eventTicket14Model = this.eventTicket14Model;
    args.others = this.others;
    args.addRequestStore = this.addRequestStore;
    args.filterBy = this.filter.isAbnormal ? TVSRequestFilterBy.ABNORMAL : null;

    await this.saveRequestService.executeSave(args);
  }
}