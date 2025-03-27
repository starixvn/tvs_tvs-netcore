import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { TVSRequestActionType } from '../../../../utility/constants/config';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { LocalStorageCacheConstant } from '../../../../utility/constants/local-storage-cache.constant';
import { SubIssueTypeConstant } from '../../../../utility/constants/sub-issue-type.constant';
import { AllowanceTime } from '../../../../utility/models/allowance-time.model';
import { IssueType } from '../../../../utility/models/issue-type.model';
import { Selection } from '../../../../utility/models/selection.model';
import { CommonService } from '../../../../utility/services/common.service';
import { StaticService } from '../../../../utility/services/static.service';
import { AddRequestStore } from '../add-request.store';
import { LogAnalysisService } from '../services/log-analysis.service';
import { FilterModel } from './filter.model';
import { FilterService } from './filter.service';
import { IssueTypes } from './issue-types.model';
import { ActionVoidService } from './services/action-void.service';
import { SubIssueTypeDialogComponent } from './sub-issue-type-dialog/sub-issue-type-dialog.component';
import { SubIssueTypeDialogModel } from './sub-issue-type-dialog/sub-issue-type-dialog.model';
import { Category } from './sub-issue-type-dialog/sub-issue-type-json.model';
import SubIssueTypeDangerAcceptedConfig from './sub-issue-type-dialog/sub-type-danger-accepted.json';

@Component({
    selector: 'filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss'],
    standalone: true,
    imports: [FormsModule, CommonModule, NgSelectComponent, SubIssueTypeDialogComponent]
})
export class FilterComponent implements OnInit, OnChanges {
  @Input() isEdit: boolean;
  @Input() isExternalUrl: boolean;
  @Input() model = new FilterModel();
  @Input() issueTypes = new IssueTypes();
  @Output() issueTypesChange = new EventEmitter<IssueTypes>();
  @Output() modelChange = new EventEmitter<FilterModel>();
  @Output() issueTypeChange = new EventEmitter<string>();

  originActions: Selection[] = [];
  issueTypesPermission: IssueType[] = [];
  actionIds: string[] = [];
  isHighlightSubType: boolean;
  widthSubIssueTypeControl: number;
  widthActionControl: number;
  subIssueTypeDialogModel = new SubIssueTypeDialogModel();
  abnormalFilterBySubscription = new Subscription();
  abnormalFilterBy: number;
  accessIssueTypeCount = new Map<string,number>();

  private initialize: boolean;
  private readonly SELECT_SUB_TYPE_TEXT = 'Select Sub Type';
  private readonly ignoreSubIssueType = [ SubIssueTypeConstant.GAME_CRASHED_VOID_LIVE ];

  constructor(
    private readonly filterService: FilterService,
    private readonly commonService: CommonService,
    private readonly addRequestStore: AddRequestStore,
    private readonly actionVoidService: ActionVoidService,
    private readonly logAnalysisService: LogAnalysisService
  ) {
  }

  async ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes['model'] && this.isEditOrExternalUrl()) {
      await this.initData();
      this.updateIssueBySub();
      this.updateCurrentAction();
      if (!this.haveIssueTypeFromPermission(this.issueTypes.issueId?.toString())) {
        this.backToAccessDeniedPage();
        return;
      }
      if (this.isLikelyDangerAccepted()) {
        this.getAllowanceTimeBySubIssueType();
      }
      this.setWidthControlByIssueType();

      if (this.isEdit && this.issueTypes.issueId) {
        await this.logAnalysisService.writeLogAccessFunction(true, this.issueTypes.issueId.toString(), this.accessIssueTypeCount);
      }
    }
  }

  async ngOnInit() {
    this.subscribeSubScription();
    await this.initData();
    if (!this.isEditOrExternalUrl()) {
      this.updateModel();
    }
    this.setWidthControlByIssueType();
  }

  subscribeSubScription(): void {
    this.abnormalFilterBySubscription = this.addRequestStore.getAbnormalFilterBySubject.subscribe(type => {
      this.abnormalFilterBy = type;
      this.updateCurrentAction();
    });
  }

  ngOnDestroy(): void {
    this.abnormalFilterBySubscription?.unsubscribe();
  }

  private getAllowanceTimeBySubIssueType() {
    let subIssueTypeConfig: Category[] = [];
    subIssueTypeConfig = SubIssueTypeDangerAcceptedConfig;
    for (const category of subIssueTypeConfig) {
      const groupSubIssueType = category.groups.find(group =>
        group.buttonSelectHomeAway?.some(button => button.subIssueTypeId === Number(this.model.subIssueTypeId)) ||
        group.buttonSelectAll?.some(button => button.subIssueTypeId === Number(this.model.subIssueTypeId)));
      if (groupSubIssueType) {
        const allowanceTime = new AllowanceTime();
        allowanceTime.aaTime = Number(groupSubIssueType.aa);
        allowanceTime.paTime = Number(groupSubIssueType.pa);
        allowanceTime.saTime = Number(groupSubIssueType.sa);
        this.addRequestStore.changeAllowanceTime(allowanceTime);
        break;
      }
    }
  }

  getSubIssueTypeName(): string {
    if (this.issueTypes.subIssueId) {
      const subIssueType = this.issueTypes.selectedSubIssueTypes.find(x => x.subIssueTypeId === this.issueTypes.subIssueId);
      return subIssueType ? subIssueType.subIssueTypeName : this.SELECT_SUB_TYPE_TEXT;
    }

    return this.SELECT_SUB_TYPE_TEXT;
  }

  async initData() {
    if (!this.initialize) {
      this.initialize = true;
      await this.initSelections();
      await this.getIssueTypes();
      if (!this.isEdit) {
        this.issueTypes.issueId = this.getIssueTypeIdDefault();
        this.updateSubByIssue();
        this.updateCurrentAction();
        this.updateModel();
        await this.logAnalysisService.writeLogAccessFunction(false, this.issueTypes.issueId.toString(), this.accessIssueTypeCount);
      }
    }
  }

  getIssueTypeIdDefault(): number {
    let issueTypeDefault: number;
    if (this.isExternalUrl) {
      issueTypeDefault = Number(this.model.issueTypeId);
    } else {
      const previousSelectedIssueType = localStorage.getItem(LocalStorageCacheConstant.PREVIOUS_SELECTED_ISSUETYPE_ADD_REQUEST + document.getElementById('body').getAttribute('user-id'));
      issueTypeDefault = previousSelectedIssueType && this.haveIssueTypeFromPermission(previousSelectedIssueType)
        ? Number(previousSelectedIssueType)
        : this.issueTypes.issueId;
    }
    this.issueTypeChange.emit(issueTypeDefault.toString());

    return issueTypeDefault;
  }

  async initSelections() {
    this.originActions = await this.commonService.getVoidActions();
    this.updateCurrentAction();

    if (this.isEdit) {
      this.actionIds[0] = this.model.action;
    }
  }

  updateDataAfterClosed(subIssueTypeId: number): void {
    if (this.isWrongScore()) {
      this.addRequestStore.changeSavingRequestStatus(true);
    }
    this.addRequestStore.changeAllowanceTime(this.subIssueTypeDialogModel.allowanceTime);
    this.issueTypes.subIssueId = subIssueTypeId;
    this.isHighlightSubType = false;
    this.updateModel(true);
  }

  openDialog(): void {
    this.subIssueTypeDialogModel.isOpen = true;
    this.subIssueTypeDialogModel.issueTypeId = this.model.issueTypeId;
    this.subIssueTypeDialogModel = _.clone(this.subIssueTypeDialogModel);
  }

  async onChangeIssueType(): Promise<void> {
    this.addRequestStore.changeSavingRequestStatus(false);
    this.updateSubByIssue();
    this.updateCurrentAction();
    this.updateModel();
    this.setWidthControlByIssueType();
    this.issueTypeChange.emit(this.model.issueTypeId);
    await this.logAnalysisService.writeLogAccessFunction(this.isEdit, this.issueTypes.issueId.toString(), this.accessIssueTypeCount);
  }

  private setWidthControlByIssueType(): void {
    const widthMapping: { [key: number]: { [key: string]: number } } = {
      [IssueTypeConstant.DANGER_ACCEPTED]: {subIssueType: 300, action: 150, sport: 150 },
      [IssueTypeConstant.EARLY_KICK_OFF]: {subIssueType: 150, action: 170, sport: 220 },
      [IssueTypeConstant.WRONG_KICK_OFF]: {subIssueType: 150, action: 170, sport: 220 },
      [IssueTypeConstant.ABNORMAL_ACCOUNT]: {subIssueType: 170, action: 210 },
      [IssueTypeConstant.RED_CARD]: {subIssueType: 285, action: 150, sport: 150 },
      [IssueTypeConstant.WRONG_HDP]: {subIssueType: 220, action: 150, sport: 150 },
      [IssueTypeConstant.WRONG_1ST_HDP]: {subIssueType: 220, action: 150, sport: 150 },
      [IssueTypeConstant.WRONG_OU]: {subIssueType: 220, action: 150, sport: 150 },
      [IssueTypeConstant.WRONG_1ST_OU]: {subIssueType: 220, action: 150, sport: 150 },
      [IssueTypeConstant.ABNORMAL_BET]: {subIssueType: 170, action: 250, sport: 150 },
      [IssueTypeConstant.WRONG_SCORE]: {subIssueType: 380, action: 150, sport: 150 },
      [IssueTypeConstant.WRONG_ODDS]: {subIssueType: 150, action: 150 },
      [IssueTypeConstant.ARCHIVED_TICKET]: {action: 150 },
      [IssueTypeConstant.REDUCED_OVER]: {action: 200, sport: 150 },
      [IssueTypeConstant.ABANDONED]: {action: 200, sport: 150 },
      [IssueTypeConstant.DUPLICATE_TICKETS]: {action: 170, sport: 150 },
      [IssueTypeConstant.NOT_PARTICIPATE]: {action: 200, sport: 150 },
      [IssueTypeConstant.WRONG_MARKET_OFFERED]: {action: 170 },
      [IssueTypeConstant.TECHNICAL_ERROR]: {action: 170 },
      [IssueTypeConstant.WRONG_ODDS_SPORTS_BOOK]: {action: 170 },
      [IssueTypeConstant.WRONG_OFFERED_NAME]: {subIssueType: 175, action: 165 },
      [IssueTypeConstant.OTHER_ISSUES]: {subIssueType: 175, action: 165 }
    };

    const widthValues = widthMapping[this.model.issueTypeId] || {};
    this.widthSubIssueTypeControl = widthValues.subIssueType || 0;
    this.widthActionControl = widthValues.action || 0;
  }

  private updateCurrentAction(): void {
    this.model.actions = this.actionVoidService.getVoidActionsSelectionByIssueType(this.issueTypes.issueId, this.abnormalFilterBy, this.isEdit, this.model.action, this.originActions);
    this.model.action = this.isEdit || (this.isExternalUrl && this.model.action) ? this.model.action : this.model.actions[0].value;
  }

  async getIssueTypes() {
    this.addRequestStore.changeBlockingUiStatus(true);
    this.issueTypesPermission = await this.commonService.getIssueTypePermissionList();
    if (_.isNil(this.issueTypesPermission) || this.issueTypesPermission.length === 0) {
      this.backToAccessDeniedPage();
      return;
    }

    const data = await this.filterService.getIssueTypes();
    this.filterIssueTypePermission(data);
    this.issueTypes = new IssueTypes(data);
    this.issueTypesChange.emit(this.issueTypes);

    if (!this.isEdit) {
      if (this.haveAbnormalBetFromPermission()) {
        this.issueTypes.issueId = Number(IssueTypeConstant.ABNORMAL_BET);
      } else {
        this.issueTypes.issueId = data.issueTypes[0].issueTypeId;
      }

      this.updateSubByIssue();
    }
    this.addRequestStore.changeBlockingUiStatus(false);
  }

  filterIssueTypePermission(issues: IssueTypes) {
    issues.issueTypes = issues.issueTypes
      .filter(x => this.issueTypesPermission.findIndex(y => y.issueTypeId === x.issueTypeId) > -1);
  }

  updateModel(isChangeSubTypeManual = false) {
    this.model.isChangeSubTypeManual = isChangeSubTypeManual;
    this.model.issueTypeId = this.issueTypes.issueId?.toString();
    this.model.subIssueTypeId = this.issueTypes.subIssueId?.toString();
    this.model.subIssueTypes = this.issueTypes.selectedSubIssueTypes;
    this.modelChange.emit(this.model);
  }

  isWrongScore(): boolean {
    return StaticService.isWrongScore(this.issueTypes.issueId?.toString());
  }

  isLikelyDangerAccepted(): boolean {
    return StaticService.isDangerAccepted(this.issueTypes.issueId?.toString())
      || StaticService.isRedCard(this.issueTypes.issueId?.toString());
  }

  isArchivedTicket(): boolean {
    return StaticService.isArchivedTicket(this.issueTypes.issueId?.toString());
  }

  haveAbnormalBetFromPermission(): boolean {
    return _.findIndex(this.issueTypesPermission, function (o) {
      return StaticService.isAbnormalBet(o.issueTypeId.toString());
    }) > -1;
  }

  haveIssueTypeFromPermission(issueTypeId: string): boolean {
    if (_.isNil(issueTypeId)) {
      return true;
    }
    return _.findIndex(this.issueTypesPermission, function (o) {
      return o.issueTypeId.toString() === issueTypeId;
    }) > -1;
  }

  backToAccessDeniedPage() {
    window.location.assign(`Home/AccessDenied`);
  }

  isEditOrExternalUrl(): boolean {
    return this.isEdit || this.isExternalUrl;
  }

  isShowButtonSelectSubType(): boolean {
    const IssueTypeHasSelectSubType = [IssueTypeConstant.DANGER_ACCEPTED, IssueTypeConstant.RED_CARD, IssueTypeConstant.WRONG_SCORE];
    return IssueTypeHasSelectSubType.includes(this.issueTypes.issueId?.toString())
  }

  updateSubByIssue() {
    this.issueTypes.selectedSubIssueTypes = this.issueTypes.subIssueTypes
      .filter(x => x.issueTypeId === this.issueTypes.issueId && !this.ignoreSubIssueType.includes(x.subIssueTypeId));
    this.issueTypes.subIssueId = this.isShowButtonSelectSubType() ? null : this.issueTypes.selectedSubIssueTypes[0].subIssueTypeId;
  }

  private updateIssueBySub() {
    const sub = this.issueTypes.subIssueTypes.find(x => x.subIssueTypeId === Number(this.model.subIssueTypeId));
    this.issueTypes.issueId = _.isUndefined(sub) ? this.issueTypes.issueId : sub.issueTypeId;
    this.issueTypes.subIssueId = _.isUndefined(sub) ? this.issueTypes.issueId : sub.subIssueTypeId;
    this.issueTypes.selectedSubIssueTypes = this.issueTypes.subIssueTypes.filter(x => x.issueTypeId === this.issueTypes.issueId
      && !this.ignoreSubIssueType.includes(x.subIssueTypeId));
  }

  changeActionWaitingToManualVoid(): void {
    this.actionIds[1] = this.model.action;

    if (this.isEdit
      && this.actionIds[0] === TVSRequestActionType.WAITING_ID.toString()
      && this.actionIds[1] === TVSRequestActionType.MANUAL_VOID_ID.toString()) {
      this.addRequestStore.changeActionWaitingToManualEditPage(true);
    }
  }

  checkValidSubIssueType(): boolean {
    if (this.issueTypes.subIssueId) {
      return true;
    }

    this.isHighlightSubType = true;
    return false;
  }

  public isShowSubType(): boolean {
    const issueTypeNotShowSubType = [
      IssueTypeConstant.WRONG_OU,
      IssueTypeConstant.WRONG_1ST_OU,
      IssueTypeConstant.EARLY_KICK_OFF,
      IssueTypeConstant.WRONG_KICK_OFF,
      IssueTypeConstant.WRONG_MARKET_OFFERED,
      IssueTypeConstant.TECHNICAL_ERROR
    ]
    return this.issueTypes.selectedSubIssueTypes.length > 1
      && !issueTypeNotShowSubType.includes(this.issueTypes.issueId?.toString());
  }

  public isDisableActionVoid(): boolean {
    if (this.model.issueTypeId === IssueTypeConstant.DUPLICATE_TICKETS && this.model.action === TVSRequestActionType.AUTO_VOID_INSTANT_ID.toString()) {
      return true;
    }

    if (this.model.issueTypeId === IssueTypeConstant.RECOVER_TICKET) {
      return true;
    }

    return this.model.isVoided;
  }
}
