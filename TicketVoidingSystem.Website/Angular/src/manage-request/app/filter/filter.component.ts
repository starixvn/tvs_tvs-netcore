import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { isNumeric } from 'rxjs/internal/util/isNumeric';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { ManageRequestStatus } from '../../../utility/constants/config';
import { LABELS } from '../../../utility/constants/labels';
import { IssueType, IssueTypesModel, SubIssueType } from '../../../utility/models/issue-type.model';
import { Selection } from '../../../utility/models/selection.model';
import { CommonService } from '../../../utility/services/common.service';
import { PermissionManage } from '../models/permission-manage.model';
import { FilterModel } from './filter.model';

const SHORT_DATETIME_FORMAT = 'YYYY/M/D';
@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Input() model = new FilterModel();
  @Input() minDate: NgbDate;
  @Input() permission = new PermissionManage();
  @Input() autoRefreshMode: number;
  @Output() modelChange = new EventEmitter<FilterModel>();
  @Output() search = new EventEmitter();

  mode = ['MatchId', 'RequestId'];
  filterByMatch = true;
  tooltip = new Tooltip();
  statusSelectList: Selection[];
  isSelectedAllIssueType = true;
  issueTypeModel: IssueTypesModel;
  issueTypeSelectList: Selection[];
  subTypeSelectList: Selection[];
  selectedSubIssueTypes: SubIssueType[];
  multipleSelectSubTypeModel: string[];
  issueTypePermissionList: IssueType[];
  createdBySelectList: Selection[];
  isNoneSubType = false;
  filterByValue = '';
  isShowAutoRefresh: boolean;
  bUDay = new Date();
  markedTicketsCount = 0;
  
  constructor(
    private readonly element: ElementRef,
    private readonly commonService: CommonService
  ) {
    this.tooltip.element = this.element;
    this.statusSelectList = ManageRequestStatus.MULTIPLE_OPTIONS;
  }

  async ngOnInit() {
    this.isShowAutoRefresh = true;
    this.filterByValue = this.mode[0];
    const userId = document.getElementById('body').getAttribute('user-id');
    this.createdBySelectList = [{name: 'All', value: '0'}, {name: '<<<< Me >>>>', value: userId}];
    await this.setIssueTypeSelectList();
    this.initDefaultFilter();
    this.updateSubByIssue();
    const balanceUp = await this.commonService.getBalanceUp();
    this.bUDay = new Date(balanceUp.balanceUpDay);
    this.checkAutoRefresh();
    await this.clickSearch();
  }

  controlFilter(value: string) {
    this.filterByMatch = value === this.mode[0];
    this.initDefaultFilter();
    if (this.filterByMatch) {
      this.model.requestId = null;
      this.updateSubByIssue();
    } else {
      this.model.matchId = null;
      this.model.ngbFromDate = this.minDate;
    }
    this.model.status = ManageRequestStatus.ALL_ID.toString();
    this.model.issueTypeId = this.issueTypeSelectList[0].value;
    this.model.isExcludeTest = true;
  }

  checkAutoRefresh(): void {
    const momentFrom = moment(this.getDateStringFromNgbDate(this.model.ngbFromDate), 'YYYY/M/D');
    const momentBU = moment(this.bUDay).format('YYYY/M/D');
    this.isShowAutoRefresh = !momentFrom.isBefore(moment(momentBU, SHORT_DATETIME_FORMAT)) || this.filterByMatch === false;
  }

  private getDateStringFromNgbDate(date: NgbDate): string {
    return `${date.year}/${date.month}/${date.day}`;
  }

  initDefaultFilter() {
    const date = new Date(moment.utc().tz('America/Caracas').format('YYYY-MM-DD HH:mm:ss.SSS'));
    this.model.ngbFromDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
    this.model.ngbToDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
    this.model.status = '-1';
    this.model.issueTypeId = this.issueTypeSelectList[0].value;
    this.model.isExcludeTest = true;
    this.model.createdBy = this.createdBySelectList[0].value;
  }

  newRequest() {
    window.open(`${document.body.getAttribute('root-url')}TicketVoidingSystem/AddRequest/Index`, '_blank');
  }

  openMarkTickets() {
    window.open(`${document.body.getAttribute('root-url')}SportBook/MarkTickets/Index?isExternalUrl=1`, '_blank');
  }

  updateModel() {
    this.modelChange.emit(this.model);
  }

  async clickSearch() {
    if (this.validate()) {
      this.model.subIssueType = this.multipleSelectSubTypeModel.join(',');
      this.search.emit();
      this.markedTicketsCount = await this.commonService.getMarkedTicketsCount();
    }
  }

  validate(): boolean {
    if (this.filterByMatch && this.model.matchId && !isNumeric(this.model.matchId)) {
      this.tooltip.display('input-match-id', LABELS.INVALID_MATCHID);
      return false;
    }

    if (!this.filterByMatch && (_.isUndefined(this.model.requestId) || _.isEmpty(this.model.requestId))) {
      this.tooltip.display('input-request-id', LABELS.EMPTY_REQUEST);
      return false;
    }

    if (!this.filterByMatch && !isNumeric(this.model.requestId)) {
      this.tooltip.display('input-request-id', LABELS.INVALID_REQUESTID);
      return false;
    }

    return true;
  }

  private async setIssueTypeSelectList() {
      this.issueTypeModel = await this.commonService.getIssueTypes();
      this.issueTypePermissionList = await this.commonService.getIssueTypePermissionList();
      this.issueTypeSelectList = [];
      if (this.issueTypePermissionList.length > 0) {
        if (this.issueTypePermissionList.length > 1) {
          this.issueTypeSelectList.push(
            {
              name: 'All',
              value: this.issueTypePermissionList.map(x => x.issueTypeId.toString()).join(',')
            }
          );
        }
        this.issueTypePermissionList.forEach(x => {
          this.issueTypeSelectList.push(
            {
              name: x.issueTypeName,
              value: x.issueTypeId.toString()
            }
          );
         });
        this.model.issueTypeId = this.issueTypeSelectList[0].value;
      } else {
        this.issueTypeSelectList.push({ name: 'N/A', value: '-1' });
        this.model.issueTypeId = '-1';
      }
    }
  
  updateSubByIssue() {
    this.subTypeSelectList = [];
    if (this.model.issueTypeId === '-1') {
      this.setNoneSubType();
      this.isNoneSubType = true;
    } else {
      this.isNoneSubType = false;
      if (this.model.issueTypeId.split(',').length > 1) {
        this.getAllSubType();
      } else {
        this.getSubTypeList();
      }
      this.multipleSelectSubTypeModel = this.subTypeSelectList.map(x => x.value);
    }
  }

  getSubTypeList() {
    this.isSelectedAllIssueType = false;
    this.selectedSubIssueTypes =
        this.issueTypeModel.subIssueTypes.filter(x => x.issueTypeId === parseInt(this.model.issueTypeId, 10));
    this.selectedSubIssueTypes.forEach(x => {
      this.addSubTypeSelectItem(x);
    });
  }

  getAllSubType() {
    this.isSelectedAllIssueType = true;
    this.issueTypePermissionList.forEach(issueType => {
        this.issueTypeModel.subIssueTypes.filter(x => x.issueTypeId === issueType.issueTypeId).forEach(x => {
          this.addSubTypeSelectItem(x);
        });
    });
  }

  addSubTypeSelectItem(item: SubIssueType) {
    this.subTypeSelectList.push(
      {
        name: item.subIssueTypeName,
        value: item.subIssueTypeId.toString(),
        group: 'All'
      }
    );
  }

  setNoneSubType() {
    this.isSelectedAllIssueType = true;
    this.multipleSelectSubTypeModel = ['-1'];
  }
}
