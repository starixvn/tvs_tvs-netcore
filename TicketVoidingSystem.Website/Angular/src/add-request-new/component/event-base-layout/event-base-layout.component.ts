import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { BlockFullUiComponent } from '../../../utility/components/block-full-ui/block-full-ui.component';
import { MenuBarComponent } from '../../../utility/components/menu-bar/menu-bar.component';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { MatchModel } from '../../../utility/models/match.model';
import { Selection } from '../../../utility/models/selection.model';
import { CommonService } from '../../../utility/services/common.service';
import { SignalRService } from '../../../utility/services/signal-r.service.native';
import { StaticService } from '../../../utility/services/static.service';
import { FilterComponent } from '../../component/filter/filter.component';
import { FilterModel } from '../../component/filter/filter.model';
import { IssueTypes } from '../../component/filter/issue-types.model';
import { PrimitiveProperty } from '../../models/primitive-property.model';
import { RequestModel } from '../../models/request.model';
import { AddRequestStore } from '../../services/add-request.store';
import { CopyRequestInfoService } from '../../services/copy-request-info.service';
import { EditRequestService } from '../../services/edit-request/edit-request.service';
import { LogAnalysisService } from '../../services/log-analysis.service';
import { AddRequestSkeletonComponent } from '../add-request-skeleton/add-request-skeleton.component';
import { EventContentContext, OthersContentContext } from './event-base.model';
import { EventBaseService } from './event-base.service';

@Component({
  standalone: true,
  selector: 'event-base-layout',
  templateUrl: './event-base-layout.component.html',
  styleUrl: './event-base-layout.component.scss',
  imports: [CommonModule, MenuBarComponent, FilterComponent, BlockFullUiComponent, AddRequestSkeletonComponent]
})
export class EventBaseLayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() isExternalUrl = false;
  @Input() issueTypeId: string;
  @Input() model: RequestModel;
  @Input() eventHeight = 'calc(100vh - 145px)';
  @Input() eventContent: TemplateRef<EventContentContext>;
  @Input() othersContent: TemplateRef<OthersContentContext>;
  @Output() saveRequest = new EventEmitter<void>();
  @Output() copyLetsTalkRequestInfo = new EventEmitter<void>();
  @ViewChild('filter') filterComponent: FilterComponent;

  issueTypes = new IssueTypes();
  savingRequestSubscription: Subscription;
  blockingUiSubscription: Subscription;
  abnormalFilterBySubscription = new Subscription();
  checkValidSubIssueTypeInFilterSubscription: Subscription;
  originActions: Selection[] = [];
  accessIssueTypeCount = new Map<string, number>();
  primitiveProperty = new PrimitiveProperty();
  isRequestLoaded = false;

  private readonly signalRService = inject(SignalRService);
  private readonly editRequestService = inject(EditRequestService);
  private readonly addRequestStore = inject(AddRequestStore);
  private readonly copyRequestInfoService = inject(CopyRequestInfoService);
  private readonly eventBaseService = inject(EventBaseService);
  private readonly commonService = inject(CommonService);
  private readonly logAnalysisService = inject(LogAnalysisService);

  isBlock$: Observable<boolean> = this.addRequestStore.isBlocking;

  get eventContextData(): EventContentContext {
    return {
      eventModel: this.eventBaseService.getEventModelByIssueType(this.issueTypeId, this.model),
      otherModel: this.model.others,
      filterModel: this.model.filter,
      issueTypes: this.issueTypes,
      primitiveProperty: this.primitiveProperty
    };
  }

  get othersContextData(): OthersContentContext {
    return {
      otherModel: this.model.others,
      primitiveProperty: this.primitiveProperty
    };
  }

  get shouldShowInvalid(): boolean {
    return this.isRequestLoaded && this.primitiveProperty.isEdit && this.model?.filter?.issueTypeId !== this.issueTypeId;
  }

  async ngOnInit(): Promise<void> {
    this.primitiveProperty.isLoadingData = true;
    await this.initBaseData();
    this.savingRequestSubscription = this.addRequestStore.savingRequestStatus.subscribe(status => {
      this.primitiveProperty.isDisabledSaveButton = status;
    });

    this.checkShowCopyInfoButton();
    this.signalRService.initializeConnection();
    this.logAnalysisService.writeLogAccessFunction(this.primitiveProperty.isEdit, this.issueTypeId, this.accessIssueTypeCount);
  }

  async initBaseData(): Promise<void> {
    this.initStaticData();
    await this.runAsyncData();
    this.primitiveProperty.isLoadingData = false;
  }

  async runAsyncData(): Promise<void> {
    const promises: Promise<any>[] = [ // NOSONAR
      this.eventBaseService.getSubIssueTypes(Number(this.issueTypeId)),
      this.commonService.getVoidActions()
    ];

    if (this.primitiveProperty.isEdit) {
      promises.push(this.editRequestService.getDataEditRequest(this.primitiveProperty.requestId, this.model, this.primitiveProperty));
    }

    const [allIssueTypes, originActions] = await Promise.all(promises);
    this.originActions = originActions;
    this.issueTypes = new IssueTypes(allIssueTypes);
    this.isRequestLoaded = true;
  }

  initStaticData() {
    this.primitiveProperty.isEdit = this.editRequestService.isActionEditRequest();
    if (this.primitiveProperty.isEdit) {
      this.primitiveProperty.requestId = this.editRequestService.getRequestId();
      this.primitiveProperty.title = `Edit Request - ${this.primitiveProperty.requestId}`;
    } else {
      this.primitiveProperty.title = 'Add Request';
    }
  }

  public checkShowCopyInfoButton(): void {
    const issueTypesShowCopyInfo = [
      IssueTypeConstant.DANGER_ACCEPTED,
      IssueTypeConstant.RED_CARD,
      IssueTypeConstant.WRONG_SCORE
    ]

    this.primitiveProperty.showCopyInfoButtons = this.model.filter.isVoided && issueTypesShowCopyInfo.includes(this.issueTypeId);
  }

  ngAfterViewInit(): void {
    this.checkValidSubIssueTypeInFilterSubscription = this.addRequestStore.getCheckValidSubIssueTypeInFilterSubject.subscribe(() => {
      this.filterComponent.checkValidSubIssueType();
    });
  }

  ngOnDestroy(): void {
    this.savingRequestSubscription?.unsubscribe();
    this.checkValidSubIssueTypeInFilterSubscription?.unsubscribe();
    this.abnormalFilterBySubscription?.unsubscribe();
  }

  public updateModel(filterModel: FilterModel): void {
    this.model.filter = filterModel;
  }

  public updateMatchInfo(matchModel: MatchModel): void {
    this.primitiveProperty.matchId = matchModel?.matchId;
    this.primitiveProperty.parentMatchId = matchModel?.parentId;
  }

  public async onSaveRequest(): Promise<void> {
    this.addRequestStore.changeBlockingUiStatus(true);
    this.primitiveProperty.isDisabledSaveButton = true;
    this.saveRequest.emit();
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  public getEventLabel(): string {
    if (StaticService.isAbnormalAccount(this.model.filter.issueTypeId)) {
      return 'Username';
    }

    return StaticService.isArchivedTicket(this.model.filter.issueTypeId) || StaticService.isRecoverTicket(this.model.filter.issueTypeId)
      ? 'Ticket Info' : 'Event';
  }

  async onCopyEmailRequestInfo(): Promise<void> {
    this.addRequestStore.changeBlockingUiStatus(true);
    this.copyRequestInfoService.copyEmailRequestInfo(this.primitiveProperty.requestId, this.model.eventDetail.matchId, this.model.others.operatorsList);
    this.addRequestStore.changeBlockingUiStatus(false);
    alert(`Request No.${this.primitiveProperty.requestId} has been copied to clipboard.`);
  }

  public backToManagePage(): void {
    this.eventBaseService.backToManagePage();
  }

  public onCopyLetsTalkRequestInfo(): void {
    this.addRequestStore.changeBlockingUiStatus(true);
    this.copyLetsTalkRequestInfo.emit();
    this.addRequestStore.changeBlockingUiStatus(false);
  }
}