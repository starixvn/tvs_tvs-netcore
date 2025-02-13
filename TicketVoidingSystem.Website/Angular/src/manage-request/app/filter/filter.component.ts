import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { MultipleSelection } from '../../../utility/components/multiple-selection/multiple-selection';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { DateTimeFormat, ManageRequestStatus } from '../../../utility/constants/config';
import { LABELS } from '../../../utility/constants/labels';
import { LocalStorageCacheConstant } from '../../../utility/constants/local-storage-cache.constant';
import { TEXT } from '../../../utility/constants/text';
import { IssueType, IssueTypesModel, SubIssueType } from '../../../utility/models/issue-type.model';
import { Selection } from '../../../utility/models/selection.model';
import { CommonService } from '../../../utility/services/common.service';
import { PermissionManage } from '../models/permission-manage.model';
import { FilterModel } from './filter.model';
import { FilterService } from './filter.service';
import { _isNumberValue } from '@angular/cdk/coercion';
import { ToolTipModule } from '../../../utility/components/tooltip/tooltip.module';
import { FormsModule } from '@angular/forms';
import { AutoRefreshComponent } from '../../../utility/components/auto-refresh/auto-refresh.component';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { MultipleSelectionModule } from '../../../utility/components/multiple-selection/multiple-selection.module';

@Component({
  standalone: true,
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  imports: [ToolTipModule, FormsModule, AutoRefreshComponent, CommonModule, NgbModule, NgSelectModule, MultipleSelectionModule]
})
export class FilterComponent implements OnInit {
  @Input() model = new FilterModel();
  @Input() minDate: NgbDate;
  @Input() permission = new PermissionManage();
  @Input() autoRefreshMode: number;
  @Output() modelChange = new EventEmitter<FilterModel>();
  @Output() search = new EventEmitter();
  @Output() updateMissingInfo = new EventEmitter<boolean>();

  mode = ['MatchId', 'RequestId'];
  filterByMatch = true;
  tooltip = new Tooltip();
  statusSelectList: Selection[];
  isSelectedAllIssueType = true;
  issueTypeModel: IssueTypesModel;
  issueTypeSelectList: Selection[];
  selectedIssueTypes: string[];
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
  userId: string;
  products: MultipleSelection;
  
  element = inject(ElementRef);
  commonService = inject(CommonService);

  constructor() {
    this.tooltip.element = this.element;
  }

  async ngOnInit() {
    this.isShowAutoRefresh = true;
    this.filterByValue = this.mode[0];
    this.userId = document.getElementById('body').getAttribute('user-id');
    this.createdBySelectList = [{ name: 'All', value: '0' }, { name: '<<<< Me >>>>', value: this.userId }];
    this.statusSelectList = ManageRequestStatus.MULTIPLE_OPTIONS;
    this.products = FilterService.initMultiSelectProduct();
    await this.setIssueTypeSelectList();
    this.initDefaultFilter();
    this.updateSubByIssue();
    const balanceUp = await this.commonService.getBalanceUp();
    this.bUDay = new Date(balanceUp.balanceUpDay);
    this.checkAutoRefresh();
    await this.clickSearch();
    this.updateMissingInfo.emit(this.model.isDisplayMissingInfo);
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
    this.model.issueTypeId = this.selectedIssueTypes.join(',');
    this.model.isExcludeTest = true;
  }

  checkAutoRefresh(): void {
    const momentFrom = moment(this.getDateStringFromNgbDate(this.model.ngbFromDate), DateTimeFormat.SHORT_DATE_FORMAT);
    const momentBU = moment(this.bUDay).format(DateTimeFormat.SHORT_DATE_FORMAT);
    this.isShowAutoRefresh = !momentFrom.isBefore(moment(momentBU, DateTimeFormat.SHORT_DATE_FORMAT)) || this.filterByMatch === false;
  }

  private getDateStringFromNgbDate(date: NgbDate): string {
    return `${date.year}/${date.month}/${date.day}`;
  }

  initDefaultFilter() {
    const date = new Date(moment.utc().tz('America/Caracas').format('YYYY-MM-DD HH:mm:ss.SSS'));
    this.model.ngbFromDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
    this.model.ngbToDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
    this.model.status = '-1';
    this.model.isExcludeTest = true;
    this.model.createdBy = this.createdBySelectList[0].value;
    this.model.isDisplayMissingInfo = localStorage.getItem(LocalStorageCacheConstant.IS_DISPLAY_REQUEST_MISSING_INFO + this.userId) === 'true';
    this.updateIssueTypeIdDefault();
    this.updateProductIdDefault();
    this.updateMissingInfo.emit(this.model.isDisplayMissingInfo);
  }

  updateIssueTypeIdDefault(){
    const previousSelectedIssueTypes = localStorage.getItem(LocalStorageCacheConstant.PREVIOUS_SELECTED_ISSUETYPE_MANAGE_REQUEST + this.userId);
    this.selectedIssueTypes = previousSelectedIssueTypes 
        ? previousSelectedIssueTypes.split(',').filter(x => this.issueTypeSelectList.map(y => y.value).includes(x))
        : this.issueTypeSelectList.map(x => x.value);

    this.model.issueTypeId = this.selectedIssueTypes.join(',');
  }

  updateProductIdDefault() {
    const previousSelectedProducts = localStorage.getItem(LocalStorageCacheConstant.PREVIOUS_SELECTED_PRODUCT_MANAGE_REQUEST + this.userId);
    if (previousSelectedProducts) {
      this.products.updateChildItemsChecked(previousSelectedProducts.split(','));
    }
    this.model.productTypeIds = this.products?.getValueItems();
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
      localStorage.setItem(
        LocalStorageCacheConstant.PREVIOUS_SELECTED_ISSUETYPE_MANAGE_REQUEST + this.userId
        ,this.model.issueTypeId);
      localStorage.setItem(
        LocalStorageCacheConstant.PREVIOUS_SELECTED_PRODUCT_MANAGE_REQUEST + this.userId
        ,this.model.productTypeIds);
      this.model.subIssueType = this.multipleSelectSubTypeModel.join(',');
      this.search.emit();
      this.markedTicketsCount = await this.commonService.getMarkedTicketsCount();
    }
  }

  validate(): boolean {
    if (this.filterByMatch && this.model.matchId && !_isNumberValue(this.model.matchId)) {
      this.tooltip.display('input-match-id', LABELS.INVALID_MATCHID);
      return false;
    }

    if (!this.filterByMatch && (_.isUndefined(this.model.requestId) || _.isEmpty(this.model.requestId))) {
      this.tooltip.display('input-request-id', LABELS.EMPTY_REQUEST);
      return false;
    }

    if (!this.filterByMatch && !_isNumberValue(this.model.requestId)) {
      this.tooltip.display('input-request-id', LABELS.INVALID_REQUESTID);
      return false;
    }

    if (!this.model.issueTypeId) {
      this.tooltip.display('issue-type-dropdown', TEXT.REQUIRED_FIELD);
      return false;
    }

    if (!this.model.productTypeIds) {
      this.tooltip.display('product-dropdown', TEXT.REQUIRED_FIELD);
      return false;
    }

    return true;
  }

  private async setIssueTypeSelectList() {
    this.issueTypeModel = await this.commonService.getIssueTypes();
    this.issueTypePermissionList = await this.commonService.getIssueTypePermissionList();
    this.issueTypeSelectList = [];
    if (this.issueTypePermissionList?.length > 0) {
      this.issueTypePermissionList.forEach(x => {
        this.issueTypeSelectList.push(
          {
            group: 'All',
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

  getSubTypeListBySingleIssueType() {
    this.isSelectedAllIssueType = false;
    this.selectedSubIssueTypes =
      this.issueTypeModel.subIssueTypes.filter(x => x.issueTypeId === parseInt(this.model.issueTypeId, 10));
    this.selectedSubIssueTypes.forEach(x => {
      this.addSubTypeSelectItem(x);
    });
  }

  getSubTypeByMultipleIssueType() {
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

  checkMissingInfo(event: Event) {
    const isChecked = event.currentTarget['checked'];
    localStorage.setItem(LocalStorageCacheConstant.IS_DISPLAY_REQUEST_MISSING_INFO + this.userId
      ,isChecked.toString());
    this.updateMissingInfo.emit(isChecked);
  }

  updateSelectedIssueType() {
    this.model.issueTypeId = this.selectedIssueTypes.join(',');
    this.updateSubByIssue();
  }

  updateSubByIssue() {
    this.subTypeSelectList = [];
    if (this.model.issueTypeId === '-1') {
      this.setNoneSubType();
      this.isNoneSubType = true;
    } else {
      this.isNoneSubType = false;
      if (this.model.issueTypeId.split(',').length > 1) {
        this.getSubTypeByMultipleIssueType();
      } else {
        this.getSubTypeListBySingleIssueType();
      }
      this.multipleSelectSubTypeModel = this.subTypeSelectList.map(x => x.value);
    }
  }

  updateSelectedProduct(selectedItems: string[]): void {
    this.model.productTypeIds = selectedItems.join(',');
  }
}
