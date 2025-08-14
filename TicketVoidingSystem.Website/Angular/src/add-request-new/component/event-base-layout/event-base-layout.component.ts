import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FilterComponent } from '../../../add-request-new/component/filter/filter.component';
import { FilterModel } from '../../../add-request-new/component/filter/filter.model';
import { IssueTypes } from '../../../add-request-new/component/filter/issue-types.model';
import { BlockFullUiComponent } from '../../../utility/components/block-full-ui/block-full-ui.component';
import { MenuBarComponent } from '../../../utility/components/menu-bar/menu-bar.component';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { MatchModel } from '../../../utility/models/match.model';
import { Selection } from '../../../utility/models/selection.model';
import { CommonService } from '../../../utility/services/common.service';
import { SignalRService } from '../../../utility/services/signal-r.service.native';
import { StaticService } from '../../../utility/services/static.service';
import { RequestModel } from '../../models/request.model';
import { AddRequestStore } from '../../services/add-request.store';
import { CopyRequestInfoService } from '../../services/copy-request-info.service';
import { EditRequestService } from '../../services/edit-request/edit-request.service';
import { LogAnalysisService } from '../../services/log-analysis.service';
import { AddRequestSkeletonComponent } from '../add-request-skeleton/add-request-skeleton.component';
import { OthersModel } from '../others/others.model';
import { EventBaseService } from './event-base.service';
import { PrimitiveProperty } from '../../models/primitive-property.model';

// Type definitions for template contexts
interface EventContentContext {
  eventModel: unknown; // Can be EventTicket14Model, WrongScoreModel, etc.
  otherModel: OthersModel;
  isEdit: boolean;
  requestId: number;
  filterModel: FilterModel;
  primitiveProperty: PrimitiveProperty;
}

interface OthersContentContext {
  otherModel: OthersModel;
  isEdit: boolean;
  matchId: number;
  parentMatchId: number;
}

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
  @Input() eventHeight: string;
  @Input() eventContent: TemplateRef<EventContentContext>;
  @Input() othersContent: TemplateRef<OthersContentContext>;
  @Output() saveRequest = new EventEmitter<void>();
  @Output() copyLetsTalkRequestInfo = new EventEmitter<void>();
  @ViewChild('filter') filterComponent: FilterComponent;

  title: string;
  isEdit = false;
  requestId: number;
  showCopyInfoButtons = false;
  isCollapse = false;
  isDisabledSaveButton = false;
  isLoadingData = true;
  issueTypes = new IssueTypes();
  savingRequestSubscription: Subscription;
  blockingUiSubscription: Subscription;
  abnormalFilterBySubscription = new Subscription();
  checkValidSubIssueTypeInFilterSubscription: Subscription;
  originActions: Selection[] = [];
  accessIssueTypeCount = new Map<string, number>();
  matchId: number = null;
  parentMatchId: number = null;
  primitiveProperty: PrimitiveProperty;

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
      eventModel: this.model.eventTicket14Model,
      otherModel: this.model.others,
      isEdit: this.isEdit,
      requestId: this.requestId,
      filterModel: this.model.filter,
      primitiveProperty: this.primitiveProperty
    };
  }

  get othersContextData(): OthersContentContext {
    return {
      otherModel: this.model.others,
      isEdit: this.isEdit,
      matchId: this.matchId,
      parentMatchId: this.parentMatchId
    };
  }

  async ngOnInit(): Promise<void> {
    this.isLoadingData = true;
    await this.initBaseData();
    this.savingRequestSubscription = this.addRequestStore.savingRequestStatus.subscribe(status => {
      this.isDisabledSaveButton = status;
    });

    this.checkShowCopyInfoButton();
    this.signalRService.initializeConnection();
    this.logAnalysisService.writeLogAccessFunction(this.isEdit, this.issueTypeId, this.accessIssueTypeCount);
  }

  async initBaseData(): Promise<void> {
    this.initStaticData();
    await this.runAsyncData();
    this.isLoadingData = false;
  }

  async runAsyncData(): Promise<void> {
    const promises: Promise<any>[] = [ // NOSONAR
      this.eventBaseService.getSubIssueTypes(Number(this.issueTypeId)),
      this.commonService.getVoidActions()
    ];

    if (this.isEdit) {
      promises.push(this.editRequestService.getDataEditRequest(this.requestId, this.model, this.primitiveProperty));
    }

    const [allIssueTypes, originActions] = await Promise.all(promises);
    this.originActions = originActions;
    this.issueTypes = new IssueTypes(allIssueTypes);
  }

  initStaticData() {
    this.isEdit = this.editRequestService.isActionEditRequest();
    if (this.isEdit) {
      this.requestId = this.editRequestService.getRequestId();
      this.title = `Home / Manage Request / Edit Request - ${this.requestId}`;
    } else {
      this.title = 'Home / Manage Request / Add Request';
    }
  }

  public checkShowCopyInfoButton(): void {
    const issueTypesShowCopyInfo = [
      IssueTypeConstant.DANGER_ACCEPTED,
      IssueTypeConstant.RED_CARD,
      IssueTypeConstant.WRONG_SCORE
    ]

    this.showCopyInfoButtons = this.model.filter.isVoided && issueTypesShowCopyInfo.includes(this.issueTypeId);
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
    this.matchId = matchModel.matchId;
    this.parentMatchId = matchModel.parentId;
  }

  public async onSaveRequest(): Promise<void> {
    this.addRequestStore.changeBlockingUiStatus(true);
    this.isDisabledSaveButton = true;
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
    this.copyRequestInfoService.copyEmailRequestInfo(this.requestId, this.model.eventDetail.matchId, this.model.others.operatorsList);
    this.addRequestStore.changeBlockingUiStatus(false);
    alert(`Request No.${this.requestId} has been copied to clipboard.`);
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