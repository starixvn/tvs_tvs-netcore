import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ViewChild, ContentChild, TemplateRef, inject, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FilterComponent } from '../../../add-request-new/component/filter/filter.component';
import { IssueTypes } from '../../../add-request-new/component/filter/issue-types.model';
import { FilterModel } from '../../../add-request-new/component/filter/filter.model';
import { RequestModel } from '../../../add-request-new/events/models/request.model';
import { MenuBarComponent } from '../../../utility/components/menu-bar/menu-bar.component';
import { BlockUiDirective } from '../../../utility/components/block-ui/block-ui.directive';
import { EditRequestService } from '../../events/services/edit-request/edit-request.service';
import { Subscription } from 'rxjs';
import { AddRequestStore } from '../../../add-request-new/events/services/add-request.store';
import { SignalRService } from '../../../utility/services/signal-r.service.native';
import { LocalStorageCacheConstant } from '../../../utility/constants/local-storage-cache.constant';
import { StaticService } from '../../../utility/services/static.service';
import { CopyRequestInfoService } from '../../../add-request-new/events/services/copy-request-info.service';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { PrimitiveProperty } from '../../events/models/primitive-property.model';
import { EventBaseService } from './event-base.service';
import { Selection } from '../../../utility/models/selection.model';
import { AddRequestApiService } from 'src/add-request-new/events/services/add-request-api.service';
import { CommonService } from '../../../utility/services/common.service';
import { LogAnalysisService } from '../../events/services/log-analysis.service';

@Component({
  standalone: true,
  selector: 'event-base-layout',
  templateUrl: './event-base-layout.component.html',
  styleUrl: './event-base-layout.component.scss',
  imports: [CommonModule, MenuBarComponent, FilterComponent, BlockUiDirective]
})
export class EventBaseLayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() isExternalUrl = false;
  @Input() issueTypeId: string;
  @Input() model: RequestModel;

  @Output() filterChange = new EventEmitter<FilterModel>();
  @Output() saveRequest = new EventEmitter<void>();
  @Output() updateIsEdit = new EventEmitter<boolean>();
  @Output() copyLetsTalkRequestInfo = new EventEmitter<void>();
  @Output() reloadBaseData = new EventEmitter<void>();

  @ViewChild('filter') filterComponent: FilterComponent;
  @ContentChild('eventContent') eventContent: TemplateRef<any>;
  @ContentChild('othersContent') othersContent: TemplateRef<any>;

  title = 'Home / Manage Request / Add Request';
  isEdit = false;
  requestId: number;
  showCopyInfoButtons = false;
  isBlock: boolean;
  isCollapse = false;
  isDisabledSaveButton = false;
  isLoadingData = true;
  issueTypes = new IssueTypes();
  primitiveProperty = new PrimitiveProperty();
  savingRequestSubscription: Subscription;
  abnormalFilterBySubscription = new Subscription();
  checkValidSubIssueTypeInFilterSubscription: Subscription;
  originActions: Selection[] = [];
  accessIssueTypeCount = new Map<string, number>();

  private readonly signalRService = inject(SignalRService);
  private readonly editRequestService = inject(EditRequestService);
  private readonly addRequestStore = inject(AddRequestStore);
  private readonly copyRequestInfoService = inject(CopyRequestInfoService);
  private readonly eventBaseService = inject(EventBaseService);
  private readonly addRequestApiService = inject(AddRequestApiService);
  private readonly commonService = inject(CommonService);
  private readonly logAnalysisService = inject(LogAnalysisService);

  async ngOnInit(): Promise<void> {
    this.isLoadingData = true;
    await this.eventBaseService.checkPermissionIssueType(Number(this.issueTypeId));
    this.issueTypes.issueId = Number(this.issueTypeId);
    this.initBaseData();

    this.savingRequestSubscription = this.addRequestStore.savingRequestStatus.subscribe(status => {
      this.isDisabledSaveButton = status;
    });

    this.checkShowCopyInfoButton();
    this.signalRService.initializeConnection();
    this.logAnalysisService.writeLogAccessFunction(this.isEdit, this.issueTypeId, this.accessIssueTypeCount);
  }

  async initBaseData(): Promise<void> {
    this.InitEdit();
    const promises: Promise<any>[] = [
      this.addRequestApiService.getSubIssueTypes(Number(this.issueTypeId)),
      this.commonService.getVoidActions()
    ];

    if (this.isEdit) {
      promises.push(this.editRequestService.getDataEditRequest(this.requestId, this.model, this.primitiveProperty));
    }

    const [allIssueTypes, originActions] = await Promise.all(promises);
    this.originActions = originActions;
    this.issueTypes = new IssueTypes(allIssueTypes);
    this.isLoadingData = false;
    this.reloadBaseData.emit();
  }

  InitEdit() {
    this.isEdit = this.editRequestService.isActionEditRequest();
    if (this.isEdit) {
      this.requestId = this.editRequestService.getRequestId();
      this.title = `Home / Manage Request / Edit Request - ${this.requestId}`
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
    this.filterChange.emit(filterModel);
  }

  public async onSaveRequest(): Promise<void> { // NOSONAR
    this.isBlock = true;
    this.cachingIssueType();
    this.isDisabledSaveButton = true;
    this.saveRequest.emit();
    this.isBlock = false;
  }

  private cachingIssueType(): void {
    if (!this.isEdit) {
      const userId = document.getElementById('body')?.getAttribute('user-id');
      if (userId) {
        localStorage.setItem(
          LocalStorageCacheConstant.PREVIOUS_SELECTED_ISSUETYPE_ADD_REQUEST + userId,
          this.model.filter.issueTypeId
        );
      }
    }
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
    this.copyRequestInfoService.copyEmailRequestInfo(this.requestId, this.primitiveProperty.matchId, this.model.others.operatorsList);
    this.addRequestStore.changeBlockingUiStatus(false);
    alert(`Request No.${this.requestId} has been copied to clipboard.`);
  }

  public backToManagePage(): void {
    window.location.assign(`TicketVoidingSystem/ManageRequest/Index`);
  }

  public onCopyLetsTalkRequestInfo(): void {
    this.isBlock = true;
    this.copyLetsTalkRequestInfo.emit();
    this.isBlock = false;
  }
} 