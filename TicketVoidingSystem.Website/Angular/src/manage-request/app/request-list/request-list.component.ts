import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { ClipboardService } from 'ngx-clipboard';
import { ModalType } from '../../../utility/components/modal/modal.model';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { PagingModel } from '../../../utility/components/paging/paging/paging.model';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { DateTimeFormat, TVSRequestFilterBy } from '../../../utility/constants/config';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { LABELS } from '../../../utility/constants/labels';
import { CopyRequestInfoQuery, CopyRequestInfoResponse } from '../../../utility/models/copy-request-info.query';
import { IssueTypesModel } from '../../../utility/models/issue-type.model';
import { Selection } from '../../../utility/models/selection.model';
import { RequestStatus } from '../../../utility/models/signal-r.model';
import { StaticService } from '../../../utility/services/static.service';
import { TicketListModal } from '../ticket-list/ticket-list.modal';
import { CommonService } from './../../../utility/services/common.service';
import { AppService } from './../app.service';
import { PermissionManage } from './../models/permission-manage.model';
import { DetailRequestModel, RequestModel } from './request.model';

@Component({
  selector: 'request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})
export class RequestListComponent implements OnInit, OnChanges {
  @Input() models: RequestModel[] = [];
  @Input() moveBetDay: Date;
  @Input() permission = new PermissionManage();
  @Input() requestStatusChangeEvent: EventEmitter<RequestStatus[]>;
  @Output() exportExcelEvent = new EventEmitter<boolean>();
  @Output() reload = new EventEmitter<boolean>();
  displayedModels: RequestModel[] = [];
  paging = new PagingModel();
  actions: Selection[] = [];
  issueTypesModel = new IssueTypesModel();
  isBlock: boolean;
  ticketListModal = new TicketListModal();

  tooltip = new Tooltip();
  constructor(
    private readonly modalService: ModalService,
    private readonly commonService: CommonService,
    private readonly appService: AppService,
    private readonly element: ElementRef,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly clipboardService: ClipboardService
  ) {
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
      this.paging.total = this.models.length;
      this.filterDisplayRequests();
    }
  }

  isSettlementHT(settlementStatus: string): boolean {
    const isHT = settlementStatus.charAt(0).toUpperCase() === 'H' ? true : false;
    return isHT;
  }

  getIssueTypeName(subIssueTypeId: number): string {
    if (_.isUndefined(subIssueTypeId) || subIssueTypeId === 0) {
      return '';
    }
    const subIssue = this.issueTypesModel.subIssueTypes.find(x => x.subIssueTypeId === subIssueTypeId);
    const issueType = this.issueTypesModel.issueTypes.find(x => x.issueTypeId === subIssue.issueTypeId);
    return _.isUndefined(issueType) ? '' :
      issueType.issueTypeName === subIssue.subIssueTypeName ?
        issueType.issueTypeName : `${issueType.issueTypeName} - ${subIssue.subIssueTypeName}`;
  }

  getActionName(id: number): string {
    const action = this.actions.find(x => x.value === id.toString());
    return _.isUndefined(action) ? '' : action.name;
  }

  checkVoided(details: DetailRequestModel[]): boolean {
    let total = 0;
    details.forEach(item => {
      total = total + item.totalSingleProcessed + item.totalParlayProcessed;
    });

    return total > 0;
  }

  checkCanEdit(eventDate: Date, issueTypeId: number, createdDate: Date): boolean {
    if (issueTypeId.toString() === IssueTypeConstant.ARCHIVED_TICKET
      || issueTypeId.toString() === IssueTypeConstant.ABNORMAL_ACCOUNT
      || issueTypeId.toString() === IssueTypeConstant.RECOVER_TICKET) {
      return this.permission.manageRequestHost && this.isCreatedDateLessThanToday(createdDate);
    } else {
      return this.permission.manageRequestHost && new Date(eventDate) > new Date(this.moveBetDay);
    }
  }

  checkCanVoid(actionId: number, eventDate: Date, issueTypeId: number, createdDate: Date): boolean {
    const isHasPermission = this.permission.voidRead && StaticService.isVoidAction(actionId);

    if (issueTypeId.toString() === IssueTypeConstant.ARCHIVED_TICKET || issueTypeId.toString() === IssueTypeConstant.ABNORMAL_ACCOUNT) {
      return isHasPermission && this.isCreatedDateLessThanToday(createdDate);
    } else {
      return isHasPermission && new Date(eventDate) > new Date(this.moveBetDay);
    }
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
    this.displayedModels = this.models.slice(this.paging.begin - 1, this.paging.end);
  }

  showTickets(requestId: number, matchId: number) {
    if (this.permission.voidRead || this.permission.verifyRead) {
      this.ticketListModal = { open: true, minimize: false, requestId, matchId };
    }
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

  openRequestDetails(requestId: number, eventDate: Date, issueTypeId: number, createdDate: Date) {
    if (this.checkCanEdit(eventDate, issueTypeId, createdDate)) {
      window.open(`${document.body.getAttribute('root-url')}TicketVoidingSystem/EditRequest/Index/${requestId}`, '_blank');
    }
  }

  openVoidRequest(requestId: number) {
    window.open(`${document.body.getAttribute('root-url')}TicketVoidingSystem/VoidRequest/Index/${requestId}`, '_blank');
  }

  isShowOnlyTotalTickets(issueTypeId: number) {
    return (issueTypeId.toString() === IssueTypeConstant.ABNORMAL_BET)
      || (issueTypeId.toString() === IssueTypeConstant.ABNORMAL_ACCOUNT)
      || (issueTypeId.toString() === IssueTypeConstant.ABNORMAL_BET_REAL_MEMBER);
  }

  isVoidAction(actionId: number): boolean {
    return StaticService.isVoidAction(actionId);
  }

  requestListTrackByFn(index: number, item: RequestModel) {
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
          if (this.isIssueTypeHaveMultipleMatches(request.issueTypeId)) {
            const detail = request.details.find(y => y.matchId === x.simpleInfo.matchId);
            request.lastPerformedBy = x.simpleInfo.lastPerformedBy;
            detail.totalSingleProcessed = x.simpleInfo.totalVoidedSingle;
            detail.totalParlayProcessed = x.simpleInfo.totalVoidedParlay;
            detail.totalCancelCashOutProcessed = x.simpleInfo.totalCancelCashOut;
          } else {
            request.lastPerformedBy = x.simpleInfo.lastPerformedBy;
            request.details[0].totalSingleProcessed = x.simpleInfo.totalVoidedSingle;
            request.details[0].totalParlayProcessed = x.simpleInfo.totalVoidedParlay;
            request.details[0].totalCancelCashOutProcessed = x.simpleInfo.totalCancelCashOut;
          }
        }
      }
    });

    this.changeDetectorRef.detectChanges();
  }

  private isIssueTypeHaveMultipleMatches(issueTypeId: number): boolean {
    return StaticService.isDangerAccepted(issueTypeId.toString()) ||
      StaticService.isWrongHDP(issueTypeId.toString()) ||
      StaticService.isWrongOU(issueTypeId.toString()) ||
      StaticService.isWrong1stOU(issueTypeId.toString()) ||
      StaticService.isWrong1stHDP(issueTypeId.toString()) ||
      StaticService.isRedCard(issueTypeId.toString()) ||
      StaticService.isEarlyKickOff(issueTypeId.toString()) ||
      StaticService.isWrongKickOff(issueTypeId.toString());
  }

  public async copyRequestInfo(requestId: number, matchId: number): Promise<void> {
    const query: CopyRequestInfoQuery = {
      requestId: requestId,
      matchId: matchId
    };
    const requestInfo = await this.commonService.copyRequestInfo(query);
    this.clipboardService.copyFromContent(this.createContentCopy(requestInfo));
    alert(`Request No.${requestId} has been copied to clipboard.`);
  }

  private createContentCopy(requestInfo: CopyRequestInfoResponse): string {
    const momentGlobalShowTime = moment(requestInfo.globalShowTime);
    const content = `K.O Time: ${momentGlobalShowTime.format(DateTimeFormat.SHORT_TIME_FORMAT)}\n`
      + `League: ${requestInfo.leagueName}\n`
      + `Match: ${requestInfo.matchEvent}\n`
      + `Match ID: ${requestInfo.matchId}\n`
      + `Request No: ${requestInfo.requestId}\n`
      + `Issue Type: ${requestInfo.issueTypeName} - ${requestInfo.subIssueTypeName}\n`
      + `VAR: ${requestInfo.isCheckedVar ? 'YES' : 'NO'}\n`
      + `Provider: ${requestInfo.provider}\n`
      + `Start Void Time: ${moment(requestInfo.startVoidTime)
        .format(DateTimeFormat.TIME_FORMAT)} (${requestInfo.filterBy === TVSRequestFilterBy.CHECK_TIME ? "Accept time" : "Trans time"})`

    return content;
  }

  public checkCanCopyRequestInfo(issueTypeId: number): boolean {
    return StaticService.isDangerAccepted(issueTypeId.toString())
      || StaticService.isRedCard(issueTypeId.toString())
      || StaticService.isWrongScore(issueTypeId.toString());
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
}
