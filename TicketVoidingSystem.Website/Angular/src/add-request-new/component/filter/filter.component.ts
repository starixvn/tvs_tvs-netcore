import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import clone from 'lodash/clone';
import isUndefined from 'lodash/isUndefined';
import { Subscription } from 'rxjs';
import { TVSRequestActionType } from '../../../utility/constants/config';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { SubIssueTypeConstant } from '../../../utility/constants/sub-issue-type.constant';
import { AllowanceTime } from '../../../utility/models/allowance-time.model';
import { IssueType } from '../../../utility/models/issue-type.model';
import { Selection } from '../../../utility/models/selection.model';
import { StaticService } from '../../../utility/services/static.service';
import { AddRequestStore } from '../../events/services/add-request.store';
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
  imports: [FormsModule, CommonModule, NgSelectComponent, SubIssueTypeDialogComponent],
  providers: [FilterService, ActionVoidService]
})
export class FilterComponent implements OnInit, OnChanges {
  @Input() isEdit: boolean;
  @Input() isExternalUrl: boolean;
  @Input() model = new FilterModel();
  @Input() issueTypes = new IssueTypes();
  @Input() issueTypeId: string;
  @Input() originActions: Selection[];
  @Output() issueTypesChange = new EventEmitter<IssueTypes>();
  @Output() modelChange = new EventEmitter<FilterModel>();

  issueTypesPermission: IssueType[] = [];
  actionIds: string[] = [];
  isHighlightSubType: boolean;
  widthSubIssueTypeControl: number;
  widthActionControl: number;
  subIssueTypeDialogModel = new SubIssueTypeDialogModel();
  abnormalFilterBySubscription = new Subscription();
  abnormalFilterBy: number;
  private initialize: boolean;
  private readonly SELECT_SUB_TYPE_TEXT = 'Select Sub Type';
  private readonly ignoreSubIssueType = [SubIssueTypeConstant.GAME_CRASHED_VOID_LIVE];

  private readonly addRequestStore = inject(AddRequestStore);
  private readonly actionVoidService = inject(ActionVoidService);

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes['model'] && this.isEditOrExternalUrl()) {
      this.initData();
      this.updateIssueBySub();
      this.updateCurrentAction();
      if (this.isLikelyDangerAccepted()) {
        this.getAllowanceTimeBySubIssueType();
      }
      this.setWidthControlByIssueType();
    }
  }

  ngOnInit() {
    this.subscribeSubScription();
    this.initData();
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
    if (this.issueTypes.subIssueId && this.issueTypes.selectedSubIssueTypes && this.issueTypes.selectedSubIssueTypes.length > 0) {
      const subIssueType = this.issueTypes.selectedSubIssueTypes.find(x => x.subIssueTypeId === this.issueTypes.subIssueId);
      return subIssueType ? subIssueType.subIssueTypeName : this.SELECT_SUB_TYPE_TEXT;
    }

    return this.SELECT_SUB_TYPE_TEXT;
  }

  initData() {
    if (!this.initialize && this.issueTypeId) {
      this.initialize = true;
      this.issueTypes.issueId = Number(this.issueTypeId);
      this.initSelections();
      if (!this.isEdit) {
        this.updateSubByIssue();
        this.updateModel();
      }
    }
  }

  async initSelections() {
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
    this.subIssueTypeDialogModel = clone(this.subIssueTypeDialogModel);
  }

  private setWidthControlByIssueType(): void {
    if (!this.model.issueTypeId) {
      return;
    }
    
    const widthMapping: { [key: number]: { [key: string]: number } } = {
      [IssueTypeConstant.DANGER_ACCEPTED]: { subIssueType: 300, action: 150, sport: 150 },
      [IssueTypeConstant.EARLY_KICK_OFF]: { subIssueType: 150, action: 170, sport: 220 },
      [IssueTypeConstant.WRONG_KICK_OFF]: { subIssueType: 150, action: 170, sport: 220 },
      [IssueTypeConstant.ABNORMAL_ACCOUNT]: { subIssueType: 170, action: 210 },
      [IssueTypeConstant.RED_CARD]: { subIssueType: 285, action: 150, sport: 150 },
      [IssueTypeConstant.WRONG_HDP]: { subIssueType: 220, action: 150, sport: 150 },
      [IssueTypeConstant.WRONG_1ST_HDP]: { subIssueType: 220, action: 150, sport: 150 },
      [IssueTypeConstant.WRONG_OU]: { subIssueType: 220, action: 150, sport: 150 },
      [IssueTypeConstant.WRONG_1ST_OU]: { subIssueType: 220, action: 150, sport: 150 },
      [IssueTypeConstant.ABNORMAL_BET]: { subIssueType: 170, action: 250, sport: 150 },
      [IssueTypeConstant.WRONG_SCORE]: { subIssueType: 380, action: 150, sport: 150 },
      [IssueTypeConstant.WRONG_ODDS]: { subIssueType: 150, action: 150 },
      [IssueTypeConstant.ARCHIVED_TICKET]: { action: 150 },
      [IssueTypeConstant.REDUCED_OVER]: { action: 200, sport: 150 },
      [IssueTypeConstant.ABANDONED]: { action: 200, sport: 150 },
      [IssueTypeConstant.DUPLICATE_TICKETS]: { action: 170, sport: 150 },
      [IssueTypeConstant.NOT_PARTICIPATE]: { action: 200, sport: 150 },
      [IssueTypeConstant.WRONG_MARKET_OFFERED]: { action: 170 },
      [IssueTypeConstant.TECHNICAL_ERROR]: { action: 170 },
      [IssueTypeConstant.WRONG_ODDS_SPORTS_BOOK]: { action: 170 },
      [IssueTypeConstant.WRONG_OFFERED_NAME]: { subIssueType: 175, action: 165 },
      [IssueTypeConstant.OTHER_ISSUES]: { subIssueType: 175, action: 165 },
      [IssueTypeConstant.MATCH_EARLY_COMPLETED]: { action: 170 }
    };

    const widthValues = widthMapping[this.model.issueTypeId] || {};
    this.widthSubIssueTypeControl = widthValues.subIssueType || 0;
    this.widthActionControl = widthValues.action || 0;
  }

  private updateCurrentAction(): void {
    if (!this.originActions || !this.issueTypes.issueId) {
      return;
    }
    
    this.model.actions = this.actionVoidService.getVoidActionsSelectionByIssueType(this.issueTypes.issueId, this.abnormalFilterBy, this.isEdit, this.model.action, this.originActions);
    this.model.action = this.isEdit || (this.isExternalUrl && this.model.action) ? this.model.action : this.model.actions[0].value;
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

  // haveAbnormalBetFromPermission(): boolean {
  //   return _.findIndex(this.issueTypesPermission, function (o) {
  //     return StaticService.isAbnormalBet(o.issueTypeId.toString());
  //   }) > -1;
  // }

  isEditOrExternalUrl(): boolean {
    return this.isEdit || this.isExternalUrl;
  }

  isShowButtonSelectSubType(): boolean {
    const IssueTypeHasSelectSubType = [IssueTypeConstant.DANGER_ACCEPTED, IssueTypeConstant.RED_CARD, IssueTypeConstant.WRONG_SCORE];
    return IssueTypeHasSelectSubType.includes(this.issueTypes.issueId?.toString())
  }

  updateSubByIssue() {
    if (this.isShowButtonSelectSubType()) {
      this.issueTypes.subIssueId = null;
    }
    else if (this.issueTypeId === IssueTypeConstant.TECHNICAL_ERROR) {
      // TODO: temporay hardcode in this phase, will remove after implement new sub issue type in UI
      this.issueTypes.subIssueId = SubIssueTypeConstant.TECHNICAL_ERROR_TECHNICAL_ERROR;
    }
    else {
      if (!this.issueTypes.subIssueTypes || this.issueTypes.subIssueTypes.length === 0) {
        return;
      }
      
      this.issueTypes.selectedSubIssueTypes = this.issueTypes.subIssueTypes
        .filter(x => !this.ignoreSubIssueType.includes(x.subIssueTypeId));
      this.issueTypes.subIssueId = this.issueTypes.selectedSubIssueTypes[0].subIssueTypeId;
    }
  }

  private updateIssueBySub() {
    if (!this.issueTypes.subIssueTypes || this.issueTypes.subIssueTypes.length === 0) {
      return;
    }
    
    const sub = this.issueTypes.subIssueTypes.find(x => x.subIssueTypeId === Number(this.model.subIssueTypeId));
    this.issueTypes.issueId = isUndefined(sub) ? this.issueTypes.issueId : sub.issueTypeId;
    this.issueTypes.subIssueId = isUndefined(sub) ? this.issueTypes.issueId : sub.subIssueTypeId;
    this.issueTypes.selectedSubIssueTypes = this.issueTypes.subIssueTypes.filter(x => !this.ignoreSubIssueType.includes(x.subIssueTypeId));
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
