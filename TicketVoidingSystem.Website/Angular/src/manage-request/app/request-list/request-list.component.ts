import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
import isUndefined from 'lodash/isUndefined';
import moment from 'moment-timezone';
import { ModalType } from '../../../utility/components/modal/modal.model';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { PagingComponent } from '../../../utility/components/paging/paging.component';
import { PagingModel } from '../../../utility/components/paging/paging.model';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { LABELS } from '../../../utility/constants/labels';
import { SubIssueTypeConstant } from '../../../utility/constants/sub-issue-type.constant';
import { IssueTypesModel } from '../../../utility/models/issue-type.model';
import { Selection } from '../../../utility/models/selection.model';
import { RequestStatus } from '../../../utility/models/signal-r.model';
import { SanitizeHtmlPipe } from '../../../utility/modules/sanitize-html.pipe';
import { StaticService } from '../../../utility/services/static.service';
import { TicketListComponent } from '../ticket-list/ticket-list.component';
import { TabInfoRequest, TicketListModal } from '../ticket-list/ticket-list.modal';
import { CommonService } from './../../../utility/services/common.service';
import { AppService } from './../app.service';
import { PermissionManage } from './../models/permission-manage.model';
import { DetailRequestModel, RequestModel } from './request.model';
import { RequestDescriptionService } from './services/request-description.service';

@Component({
  standalone: true,
  selector: 'request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss'],
  imports: [CommonModule, FormsModule, PagingComponent, TicketListComponent, SanitizeHtmlPipe],
  providers: [RequestDescriptionService]
})
export class RequestListComponent implements OnInit, OnChanges {
  @Input() models: RequestModel[] = [];
  @Input() moveBetDay: Date;
  @Input() permission = new PermissionManage();
  @Input() isShowMissingInfo: boolean;
  @Input() requestStatusChangeEvent: EventEmitter<RequestStatus[]>;
  @Output() exportExcelEvent = new EventEmitter<boolean>();
  @Output() reload = new EventEmitter<boolean>();

  displayedModels: RequestModel[] = [];
  paging = new PagingModel();
  actions: Selection[] = [];
  issueTypesModel = new IssueTypesModel();
  ticketListModal = new TicketListModal();
  tooltip = new Tooltip();
  modalService = inject(ModalService);
  commonService = inject(CommonService);
  appService = inject(AppService);
  element = inject(ElementRef);
  changeDetectorRef = inject(ChangeDetectorRef);
  requestDescriptionService = inject(RequestDescriptionService);

  constructor() {
    this.tooltip.element = this.element;
  }

  async ngOnInit() {
    this.requestStatusChangeEvent.subscribe((requestStatus: RequestStatus[]) => {
      this.updateRequestStatus(requestStatus, this.displayedModels);
    });

    this.actions = await this.commonService.getVoidActions();
    this.issueTypesModel = await this.commonService.getIssueTypes();
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes['models']) {
      this.paging.total = this.models?.length;
      this.filterDisplayRequests();
    }
  }

  isSettlementHT(settlementStatus: string): boolean {
    return settlementStatus.charAt(0).toUpperCase() === 'H' ? true : false;
  }

  getIssueTypeName(subIssueTypeId: number): string {
    if (isUndefined(subIssueTypeId) || subIssueTypeId === 0) {
      return '';
    }
    const subIssue = this.issueTypesModel.subIssueTypes.find(x => x.subIssueTypeId === subIssueTypeId);
    const issueType = this.issueTypesModel.issueTypes.find(x => x.issueTypeId === subIssue.issueTypeId);
    return isUndefined(issueType) ? '' :
      issueType.issueTypeName === subIssue.subIssueTypeName ?
        issueType.issueTypeName : `${issueType.issueTypeName} - ${subIssue.subIssueTypeName}`;
  }

  getActionName(id: number): string {
    const action = this.actions.find(x => x.value === id.toString());
    return isUndefined(action) ? '' : action.name;
  }

  checkVoided(details: DetailRequestModel[]): boolean {
    const total = details.reduce((sum, item) => sum + item.totalSingleProcessed + item.totalParlayProcessed, 0);
    return total > 0;
  }

  private isTechnicalErrorProviderMistake(issueTypeId: number, details?: DetailRequestModel[]): boolean {
    return (
      issueTypeId.toString() === IssueTypeConstant.TECHNICAL_ERROR &&
      details?.some(d => d.subIssueTypeId === SubIssueTypeConstant.TECHNICAL_ERROR_PROVIDER_MISTAKE)
    );
  }

  checkCanEdit(eventDate: Date, issueTypeId: number, createdDate: Date, details?: DetailRequestModel[]): boolean {
    if (this.isTechnicalErrorProviderMistake(issueTypeId, details)) {
      return false;
    }
    
    if (
      issueTypeId.toString() === IssueTypeConstant.ARCHIVED_TICKET ||
      issueTypeId.toString() === IssueTypeConstant.ABNORMAL_ACCOUNT ||
      issueTypeId.toString() === IssueTypeConstant.ABNORMAL_BET ||
      issueTypeId.toString() === IssueTypeConstant.RECOVER_TICKET
    ) {
      return this.permission.manageRequestHost && this.isCreatedDateLessThanToday(createdDate);
    } else {
      return this.permission.manageRequestHost && new Date(eventDate) > new Date(this.moveBetDay);
    }
  }

  checkCanVoid(actionId: number, eventDate: Date, issueTypeId: number, createdDate: Date, details?: DetailRequestModel[]): boolean {
    const isHasPermission = this.permission.voidRead && StaticService.isVoidAction(actionId);

    if (this.isTechnicalErrorProviderMistake(issueTypeId, details)) {
      return false;
    }

    if (
      issueTypeId.toString() === IssueTypeConstant.ARCHIVED_TICKET ||
      issueTypeId.toString() === IssueTypeConstant.ABNORMAL_ACCOUNT ||
      issueTypeId.toString() === IssueTypeConstant.ABNORMAL_BET
    ) {
      return isHasPermission && this.isCreatedDateLessThanToday(createdDate);
    } else {
      return isHasPermission && new Date(eventDate) > new Date(this.moveBetDay);
    }
  }

  isCanClickNoOfTickets(): boolean {
    return this.permission.voidRead || this.permission.verifyRead;
  }

  private isCreatedDateLessThanToday(createdDate: Date): boolean {
    const currentDate = new Date(moment().tz('Etc/GMT-8').format('YYYY-MM-DD HH:mm:ss.SSS'));
    currentDate.setDate(currentDate.getDate() - 1);
    const isCreatedDateLessThanToday = new Date(createdDate) >= currentDate;
    return isCreatedDateLessThanToday;
  }

  pagingEvent() {
    this.filterDisplayRequests();
  }

  exportExcel() {
    this.exportExcelEvent.emit();
  }

  filterDisplayRequests() {
    this.displayedModels = this.models?.slice(this.paging.begin - 1, this.paging.end);
  }

  showTickets(request: RequestModel, matchId: number, requestDetailId: number) {
    if (this.isCanClickNoOfTickets()) {
      this.ticketListModal = {
        open: true,
        minimize: false,
        requestId: request.requestId,
        matchId,
        requestDetailId,
        tabInfoRequest: this.updateTabInfoRequest(request, matchId, requestDetailId)
      };
    }
  }

  private updateTabInfoRequest(request: RequestModel, matchId: number, requestDetailId: number): TabInfoRequest[] {
    return request.details.map((detail, index) => ({
      id: index + 1,
      isActive: this.checkActivedTab(request, detail, matchId, requestDetailId),
      matchId: detail.matchId,
      requestDetailId: detail.requestDetailId,
      name: this.getTabName(request.issueTypeId, detail.matchId, index)
    } as TabInfoRequest));
  }

  private getTabName(issueTypeId: number, matchId: number, index: number): string {
    return matchId && !this.isMatchIdParlay(matchId)
      ? StaticService.isWrongMarketOffered(issueTypeId) ? `${matchId} (${index + 1})` : `${matchId}`
      : 'General Info';
  }

  private isMatchIdParlay(matchId: number) {
    return matchId === 29 || matchId === 11099 || matchId === 2799 || matchId === 10499;
  }

  private checkActivedTab(request: RequestModel, detailRequestModel: DetailRequestModel, matchId: number, requestDetailId: number): boolean {
    if (StaticService.isWrongMarketOffered(request.issueTypeId)) {
      return detailRequestModel.requestDetailId === requestDetailId;
    }

    return detailRequestModel.matchId === matchId;
  }

  confirmCheckBy(item: RequestModel) {
    if (item.isCheckedBy) {
      this.modalService.confirm({
        title: 'Check By Confirm',
        message: `${LABELS.CONFIRM_CHECK_BY}<strong>${item.requestId}</strong>?`
      }, () => this.checkBy(item.requestId, true), () => item.isCheckedBy = !item.isCheckedBy);
    } else {
      this.modalService.confirm({
        title: 'UnCheck By Confirm',
        message: `${LABELS.CONFIRM_UNCHECK_BY}<strong>${item.requestId}</strong>?`
      }, () => this.checkBy(item.requestId, false), () => item.isCheckedBy = !item.isCheckedBy);
    }
  }

  async checkBy(requestId: number, isCheck: boolean) {
    if (this.permission.verifyHost) {
      const result = await this.appService.checkBy(requestId, isCheck);
      if (result.isSuccessful) {
        this.reload.emit(true);
      } else {
        this.modalService
          .open({ title: 'Check By Result', message: result.errorMsg, type: ModalType.Error });
      }
    } else {
      this.modalService.open({ title: 'Warning', message: 'You don\'t have permission!', type: ModalType.Warning });
    }
  }

  openRequestDetails(requestId: number, eventDate: Date, issueTypeId: number, createdDate: Date, details?: DetailRequestModel[]) {
    if (this.checkCanEdit(eventDate, issueTypeId, createdDate, details)) {
      window.open(`${document.body.getAttribute('root-url')}TicketVoidingSystem/EditRequest/Index/${requestId}`, '_blank');
    }
  }

  openVoidRequest(requestId: number) {
    window.open(`${document.body.getAttribute('root-url')}TicketVoidingSystem/VoidRequest/Index/${requestId}`, '_blank');
  }

  isShowOnlyTotalTickets(issueTypeId: number) {
    return (issueTypeId.toString() === IssueTypeConstant.ABNORMAL_BET)
      || (issueTypeId.toString() === IssueTypeConstant.ABNORMAL_ACCOUNT);
  }

  isVoidAction(actionId: number): boolean {
    return StaticService.isVoidAction(actionId);
  }

  requestListTrackByFn(__: number, item: RequestModel) {
    return item.requestId;
  }

  private updateRequestStatus(requestStatus: RequestStatus[], displayedRequests: RequestModel[]) {
    requestStatus.forEach(x => {
      const request = displayedRequests.find(r => {
        return r.requestId === x.requestId;
      });

      if (request) {
        request.status = x.status;
        if (x.simpleInfo) {
          request.lastPerformedBy = x.simpleInfo.lastPerformedBy;
          if (this.isDifferenceByMatchId(request)) {
            const detail = request.details.find(y => y.matchId === x.simpleInfo.matchId);
            this.updateDetail(detail, x);
          } else if (this.isDifferenceByRequestDetailId(request)) {
            const detail = request.details.find(y => y.requestDetailId === x.simpleInfo.matchId);
            this.updateDetail(detail, x);
          } else {
            this.updateDetail(request.details[0], x);
          }
        }
      }
    });
    this.changeDetectorRef.detectChanges();
  }

  private updateDetail(detail: DetailRequestModel, status: RequestStatus) {
    detail.totalSingleProcessed = status.simpleInfo.totalSingleProcessed;
    detail.totalParlayProcessed = status.simpleInfo.totalParlayProcessed;
    detail.totalCancelCashOutProcessed = status.simpleInfo.totalCancelCashOutProcessed;
    detail.totalResettleProcessed = status.simpleInfo.totalResettleProcessed;
  };

  private isDifferenceByRequestDetailId(request: RequestModel): boolean {
    return [IssueTypeConstant.WRONG_MARKET_OFFERED].includes(request.issueTypeId.toString());
  }

  private isDifferenceByMatchId(request: RequestModel): boolean {
    return this.isSimpleMatch(request.issueTypeId) || this.isConditionalMatch(request.issueTypeId, request.filterBy);
  }

  public isSimpleMatch(issueTypeId: number): boolean {
    const simpleIssueChecks = [
      StaticService.isDangerAccepted,
      StaticService.isWrongHDP,
      StaticService.isWrongOU,
      StaticService.isWrong1stOU,
      StaticService.isWrong1stHDP,
      StaticService.isRedCard,
      StaticService.isEarlyKickOff,
      StaticService.isWrongKickOff
    ];
    const issueTypeString = issueTypeId.toString();

    return simpleIssueChecks.some(check => check(issueTypeString));
  }

  public isConditionalMatch(issueTypeId: number, filterBy: number): boolean {
    return filterBy === null && StaticService.isAbnormalBet(issueTypeId.toString());
  }

  public async copyRequestDescriptionSingleMatch(item: RequestModel, matchId: number, requestDetailId: number): Promise<void> {
    item.processingCopyDescriptionClass = 'fas fa-spinner fa-spin copy-request-info disable-icon';
    await this.requestDescriptionService.copyToClipboard(item.requestId, matchId, requestDetailId);
    item.processingCopyDescriptionClass = 'fa fa-paste copy-request-info';
  }


  public async copyRequestDescriptionMultiMatches(item: RequestModel, matchId: number, detail: DetailRequestModel): Promise<void> {
    detail.processingCopyDescriptionClass = 'fas fa-spinner fa-spin copy-request-info disable-icon';
    await this.requestDescriptionService.copyToClipboard(item.requestId, matchId, detail.requestDetailId);
    detail.processingCopyDescriptionClass = 'fa fa-paste copy-request-info';
  }

  public isCanCopyRequestDescription(issueTypeId: number, details?: DetailRequestModel[]): boolean {
    const issueTypeStr = issueTypeId.toString();
    return [
      StaticService.isDangerAccepted,
      StaticService.isRedCard,
      StaticService.isWrongScore,
      StaticService.isReducedOver,
      StaticService.isAbandoned,
      StaticService.isNotParticipate,
      StaticService.isWrongMarketOffered,
      StaticService.isTechnicalError,
      StaticService.isWrongOddsSportsBook,
      StaticService.isWrongHDP,
      StaticService.isWrongOU,
      StaticService.isWrongOdds,
      StaticService.isWrong1stHDP,
      StaticService.isWrong1stOU,
      StaticService.isMatchEarlyCompleted
    ].some(fn => fn(issueTypeStr)) && !this.isTechnicalErrorProviderMistake(issueTypeId, details);
  }

  public getDetailTotalTickets(issueTypeId: number, detail: DetailRequestModel): string {
    const info: string[] = [];
    info.push(`S:${detail.totalSingleProcessed}`);
    info.push(`P:${detail.totalParlayProcessed}`);

    if (StaticService.isHaveCancelCashOutTicket(issueTypeId.toString())) {
      info.push(`<span class="text-green">CC:${detail.totalCancelCashOutProcessed}</span>`);
    }

    if (this.isRecoverTicket(issueTypeId.toString())) {
      info.push(`RS:${detail.totalResettleProcessed}`);
    }

    return `(${info.join(', ')})`;
  }

  isRecoverTicket(issueTypeId: string): boolean {
    return StaticService.isRecoverTicket(issueTypeId);
  }

  public isShowIconMissingInfo(value: string): boolean {
    return this.isShowMissingInfo && !value;
  }

  changeStoreRequest(index: number){
    this.displayedModels[index].isStored = !this.displayedModels[index].isStored;
    this.appService.updateStatusRequest(this.displayedModels[index].requestId, this.displayedModels[index].isStored);
  }
}
