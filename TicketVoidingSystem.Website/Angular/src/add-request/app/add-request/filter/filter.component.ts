import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { Subscription } from 'rxjs';
import { TVSRequestActionType } from '../../../../utility/constants/config';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { SportType } from '../../../../utility/constants/sport.constant';
import { AllowanceTime } from '../../../../utility/models/allowance-time.model';
import { SportInfo } from '../../../../utility/models/event.model';
import { IssueType } from '../../../../utility/models/issue-type.model';
import { Selection } from '../../../../utility/models/selection.model';
import { CommonService } from '../../../../utility/services/common.service';
import { StaticService } from '../../../../utility/services/static.service';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from './filter.model';
import { FilterService } from './filter.service';
import { IssueTypes } from './issue-types.model';
import { ActionVoidService } from './services/action-void.service';
import { SubIssueTypeDialogModel } from './sub-issue-type-dialog/sub-issue-type-dialog.model';
import { Category } from './sub-issue-type-dialog/sub-issue-type-json.model';
import SubIssueTypeDangerAcceptedConfig from './sub-issue-type-dialog/sub-type-danger-accepted.json';

@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnChanges {
  @Input() isEdit: boolean;
  @Input() isExternalUrl: boolean;
  @Input() model = new FilterModel();
  @Input() issueTypes = new IssueTypes();
  @Output() issueTypesChange = new EventEmitter<IssueTypes>();
  @Output() modelChange = new EventEmitter<FilterModel>();

  sports: SportInfo[] = [];
  actions: Selection[] = [];
  originActions: Selection[] = [];
  date: NgbDate;
  maxDate: NgbDate;
  minDate: NgbDate;
  issueTypesPermission: IssueType[] = [];
  actionIds: string[] = [];
  isHighlightSubType: boolean;

  widthIssueTypeControl: number;
  widthSubIssueTypeControl: number;
  widthActionControl: number;
  widthSportControl: number;
  widthDateControl: number;
  subIssueTypeDialogModel = new SubIssueTypeDialogModel();

  abnormalFilterBySubscription = new Subscription();
  abnormalFilterBy: number;

  private initialize: boolean;
  private readonly SELECT_SUB_TYPE_TEXT = 'Select Sub Type';

  constructor(
    private readonly filterService: FilterService,
    private readonly commonService: CommonService,
    private readonly addRequestStore: AddRequestStore,
    private readonly actionVoidService: ActionVoidService,
  ) {
  }

  async ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes['model'] && this.isEditOrExternalUrl()) {
      this.initDate();
      await this.initData();
      this.updateIssueBySub();
      this.updateCurrentAction();
      if (!this.haveIssueTypeFromPermission(this.issueTypes.issueId?.toString())) {
        this.backToNotAuthorizedPage();
        return;
      }
      if (this.isLikelyDangerAccepted()) {
        this.getAllowanceTimeBySubIssueType();
      }
      this.setWidthControlByIssueType();
    }
  }

  async ngOnInit() {
    this.subscribeSubScription();
    this.initDate();
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
        group.buttonSelectHomeAway?.some(button =>button.subIssueTypeId === Number(this.model.subIssueTypeId)) ||
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

  private setLimitDate() {
    const lastNDays = 7;
    const minDate = new Date();
    minDate.setDate(minDate.getDate() - lastNDays);
    this.minDate = new NgbDate(minDate.getFullYear(), minDate.getMonth() + 1, minDate.getDate());
  }

  async initData() {
    const PREVIOUS_SELECTED_ISSUETYPE = 'PreviousSelectedIssueType';
    if (!this.initialize) {
      this.initialize = true;
      await this.initSelections();
      await this.getIssueTypes();
      if (!this.isEdit) {
        const previousSelectedIssueType = localStorage.getItem(PREVIOUS_SELECTED_ISSUETYPE + document.getElementById('body').getAttribute('user-id'));
        this.issueTypes.issueId = previousSelectedIssueType && this.haveIssueTypeFromPermission(previousSelectedIssueType)
          ? Number(previousSelectedIssueType) : this.issueTypes.issueId;
        this.updateSubByIssue();
        this.updateCurrentAction();
        this.updateModel();
      }
    }
  }

  initDate() {
    const date = this.isEdit ? new Date(this.model.eventDate) :
      new Date(moment.utc().tz('America/Caracas').format('YYYY/M/D'));
    this.date = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
    this.setLimitDate();
  }

  async initSelections() {
    this.sports = await this.filterService.getSportsType();
    this.model.sportType = this.isEdit ? this.model.sportType : SportType.SOCCER;
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
    this.model.isChangeSubTypeManual = true;
    this.isHighlightSubType = false;
    this.updateModel();
  }

  openDialog(): void {
    this.subIssueTypeDialogModel.isOpen = true;
    this.subIssueTypeDialogModel.issueTypeId = this.model.issueTypeId;
    this.subIssueTypeDialogModel = _.clone(this.subIssueTypeDialogModel);
  }

  onChangeIssueType(): void {
    this.addRequestStore.changeSavingRequestStatus(false);
    if (this.isReducedOver()) {
      this.model.sportType = SportType.CRICKET;
    } else {
      this.model.sportType = SportType.SOCCER;
    }
    this.updateSubByIssue();
    this.updateCurrentAction();
    this.updateModel();
    this.setWidthControlByIssueType();
  }

  onChangeSubIssueType(): void {
    this.model.isChangeSubTypeManual = true;
    this.updateModel();
  }

  private setWidthControlByIssueType(): void {
    const widthMapping: { [key: number]: { [key: string]: number } } = {
      [IssueTypeConstant.DANGER_ACCEPTED]: { issueType: 180, subIssueType: 300, action: 150, sport: 150 },
      [IssueTypeConstant.EARLY_KICK_OFF]: { issueType: 180, subIssueType: 150, action: 150, sport: 220 },
      [IssueTypeConstant.WRONG_KICK_OFF]: { issueType: 180, subIssueType: 150, action: 150, sport: 220 },
      [IssueTypeConstant.ABNORMAL_ACCOUNT]: { issueType: 180, subIssueType: 170, action: 170 },
      [IssueTypeConstant.RED_CARD]: { issueType: 180, subIssueType: 285, action: 150, sport: 150 },
      [IssueTypeConstant.WRONG_HDP]: { issueType: 180, subIssueType: 220, action: 150, sport: 150 },
      [IssueTypeConstant.WRONG_1ST_HDP]: { issueType: 180, subIssueType: 220, action: 150, sport: 150 },
      [IssueTypeConstant.WRONG_OU]: { issueType: 180, subIssueType: 220, action: 150, sport: 150 },
      [IssueTypeConstant.WRONG_1ST_OU]: { issueType: 180, subIssueType: 220, action: 150, sport: 150 },
      [IssueTypeConstant.ABNORMAL_BET]: { issueType: 180, subIssueType: 170, action: 250, sport: 150 },
      [IssueTypeConstant.ABNORMAL_BET_REAL_MEMBER]: { issueType: 180, subIssueType: 170, action: 250, sport: 150 },
      [IssueTypeConstant.WRONG_SCORE]: { issueType: 180, subIssueType: 380, action: 150, sport: 150 },
      [IssueTypeConstant.WRONG_ODDS]: { issueType: 180, subIssueType: 150, action: 150 },
      [IssueTypeConstant.ARCHIVED_TICKET]: { issueType: 180, action: 150 },
      [IssueTypeConstant.REDUCED_OVER]: { issueType: 180, action: 200, sport: 150 },
      [IssueTypeConstant.DUPLICATE_TICKETS]: { issueType: 150, action: 170, sport: 150 }
    };

    const widthValues = widthMapping[this.model.issueTypeId] || {};

    this.widthIssueTypeControl = widthValues.issueType || 0;
    this.widthSubIssueTypeControl = widthValues.subIssueType || 0;
    this.widthActionControl = widthValues.action || 0;
    this.widthSportControl = widthValues.sport || 0;
  }

  private updateCurrentAction(): void {
    const actionMapping: { [key: string]: () => number[] } = {
      [IssueTypeConstant.REDUCED_OVER]: () => this.actionVoidService.getActionVoidReducedOver(),
      [IssueTypeConstant.WRONG_ODDS]: () => this.actionVoidService.getActionVoidWrongOdds(),
      [IssueTypeConstant.DANGER_ACCEPTED]: () => this.actionVoidService.getActionVoidDangerAccepted(),
      [IssueTypeConstant.WRONG_SCORE]: () => this.actionVoidService.getActionVoidWrongScore(),
      [IssueTypeConstant.WRONG_HDP]: () => this.actionVoidService.getActionVoidWrongHdp(),
      [IssueTypeConstant.WRONG_1ST_HDP]: () => this.actionVoidService.getActionVoidWrong1stHdp(),
      [IssueTypeConstant.WRONG_OU]: () => this.actionVoidService.getActionVoidWrongOu(),
      [IssueTypeConstant.WRONG_1ST_OU]: () => this.actionVoidService.getActionVoidWrong1stOu(),
      [IssueTypeConstant.EARLY_KICK_OFF]: () => this.actionVoidService.getActionVoidEarlyKickOff(),
      [IssueTypeConstant.WRONG_KICK_OFF]: () => this.actionVoidService.getActionVoidWrongKickOff(),
      [IssueTypeConstant.RED_CARD]: () => this.actionVoidService.getActionVoidRedCard(),
      [IssueTypeConstant.ABNORMAL_ACCOUNT]: () => this.actionVoidService.getActionVoidAbnormalAccount(),
      [IssueTypeConstant.ABNORMAL_BET]: () => this.actionVoidService.getActionAbnormalBet(this.abnormalFilterBy),
      [IssueTypeConstant.ABNORMAL_BET_REAL_MEMBER]: () => this.actionVoidService.getActionVoidAbnormalBetRealMember(),
      [IssueTypeConstant.ARCHIVED_TICKET]: () => this.actionVoidService.getActionVoidArchivedTicket(),
      [IssueTypeConstant.DUPLICATE_TICKETS]: () => this.actionVoidService.getActionVoidDuplicateTickets(this.isEdit, this.model.action),
    };

    const actionFunction = actionMapping[this.issueTypes.issueId];
    if (actionFunction) {
      const selectedActionVoid = actionFunction();
      this.updateCurrentActionByIssue(selectedActionVoid);
    } else {
      this.actions = this.originActions;
    }
    this.model.action = this.isEditOrExternalUrl() ? this.model.action : this.actions[0].value;
  }



  private updateCurrentActionByIssue(actionIds: number[]): void {
    this.actions = actionIds.map((id: number) => {
      const foundAction = this.originActions.find((action) => action.value === id.toString());
      const name = foundAction ? foundAction.name : '';
      return { value: id.toString(), name };
    });
  }

  async getIssueTypes() {
    this.addRequestStore.changeBlockingUiStatus(true);
    this.issueTypesPermission = await this.commonService.getIssueTypePermissionList();
    if (_.isNil(this.issueTypesPermission) || this.issueTypesPermission.length === 0) {
      this.backToNotAuthorizedPage();
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

  updateModel() {
    this.model.eventDate = `${this.date.year}/${this.date.month}/${this.date.day}`;
    this.model.issueTypeId = this.issueTypes.issueId?.toString();
    this.model.subIssueTypeId = this.issueTypes.subIssueId?.toString();
    this.model.subIssueTypes = this.issueTypes.selectedSubIssueTypes;
    if (this.isLikelyDangerAccepted() || this.isWrongScore()) {
      this.model.sportType = SportType.SOCCER;
    }
    if (this.isReducedOver()) {
      this.model.sportType = SportType.CRICKET;
    }
    this.modelChange.emit(this.model);
  }

  public isDisabledSportControl(): boolean {
    return this.isEdit || this.isLikelyDangerAccepted() || this.isWrongScore() || this.isWrongHDP() || this.isWrong1stHDP()
      || this.isWrongOU() || this.isWrong1stOU() || this.isWrongOdds() || this.isReducedOver();
  }

  isShowSubType(): boolean {
    return this.issueTypes.selectedSubIssueTypes.length > 1
      && !this.isWrongOU()
      && !this.isWrong1stOU();
  }

  isShowButtonSelectSubType(): boolean {
    return StaticService.isDangerAccepted(this.issueTypes.issueId?.toString())
      || StaticService.isRedCard(this.issueTypes.issueId?.toString())
      || StaticService.isWrongScore(this.issueTypes.issueId?.toString());
  }

  isLikelyAbnormalBet(): boolean {
    return this.isAbnormalBet() || this.isAbnormalBetRealMember();
  }

  isAbnormalBet(): boolean {
    return StaticService.isAbnormalBet(this.issueTypes.issueId?.toString());
  }

  private isAbnormalBetRealMember(): boolean {
    return StaticService.isAbnormalBetRealMember(this.issueTypes.issueId?.toString());
  }

  isAbnormalAccount(): boolean {
    return StaticService.isAbnormalAccount(this.isEdit ? this.model.issueTypeId : this.issueTypes.issueId?.toString());
  }

  isWrongScore(): boolean {
    return StaticService.isWrongScore(this.issueTypes.issueId?.toString());
  }

  isWrongHDP(): boolean {
    return StaticService.isWrongHDP(this.issueTypes.issueId?.toString());
  }

  isWrong1stHDP(): boolean {
    return StaticService.isWrong1stHDP(this.issueTypes.issueId?.toString());
  }

  isLikelyDangerAccepted(): boolean {
    return StaticService.isDangerAccepted(this.issueTypes.issueId?.toString())
      || StaticService.isRedCard(this.issueTypes.issueId?.toString());
  }

  isDangerAccepted(): boolean {
    return StaticService.isDangerAccepted(this.issueTypes.issueId?.toString());
  }

  isRedCard(): boolean {
    return StaticService.isRedCard(this.issueTypes.issueId?.toString());
  }

  isArchivedTicket(): boolean {
    return StaticService.isArchivedTicket(this.issueTypes.issueId?.toString());
  }

  isWrongOU(): boolean {
    return StaticService.isWrongOU(this.issueTypes.issueId?.toString());
  }

  isWrong1stOU(): boolean {
    return StaticService.isWrong1stOU(this.issueTypes.issueId?.toString());
  }

  isWrongOdds(): boolean {
    return StaticService.isWrongOdds(this.issueTypes.issueId?.toString());
  }

  isReducedOver(): boolean {
    return StaticService.isReducedOver(this.issueTypes.issueId?.toString());
  }

  isDuplicateTickets(): boolean {
    return StaticService.isDuplicateTickets(this.issueTypes.issueId?.toString());
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

  backToNotAuthorizedPage() {
    window.location.assign(`Home/NotAuthorized`);
  }

  isEditOrExternalUrl(): boolean {
    return this.isEdit || this.isExternalUrl;
  }

  updateSubByIssue() {
    this.issueTypes.selectedSubIssueTypes = this.issueTypes.subIssueTypes.filter(x => x.issueTypeId === this.issueTypes.issueId);
    //TODO: only remove subtype on UI - feat: 173229
    if (this.isLikelyAbnormalBet() || this.isAbnormalAccount()) {
    this.issueTypes.selectedSubIssueTypes = this.issueTypes.selectedSubIssueTypes.filter(x => x.subIssueTypeId !== 27 && x.subIssueTypeId !== 39 && x.subIssueTypeId !== 41);
    }

    if (this.isDangerAccepted() || this.isRedCard() || this.isWrongScore()) {
      this.issueTypes.subIssueId = null;
    } else {
      this.issueTypes.subIssueId = this.issueTypes.selectedSubIssueTypes[0].subIssueTypeId;
    }
  }

  private updateIssueBySub() {
    const sub = this.issueTypes.subIssueTypes.find(x => x.subIssueTypeId === Number(this.model.subIssueTypeId));
    this.issueTypes.issueId = _.isUndefined(sub) ? this.issueTypes.issueId : sub.issueTypeId;
    this.issueTypes.subIssueId = _.isUndefined(sub) ? this.issueTypes.issueId : sub.subIssueTypeId;
    this.issueTypes.selectedSubIssueTypes = this.issueTypes.subIssueTypes.filter(x => x.issueTypeId === this.issueTypes.issueId);

    //TODO: only remove subtype on UI - feat: 173229
    if (this.isLikelyAbnormalBet() || this.isAbnormalAccount()) {
      this.issueTypes.selectedSubIssueTypes = this.issueTypes.selectedSubIssueTypes.filter(x => x.subIssueTypeId !== 27 && x.subIssueTypeId !== 39 && x.subIssueTypeId !== 41);
    }
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

  public isShowSportType(): boolean {
    return !this.isLikelyAbnormalBet() && !this.isAbnormalAccount() && !this.isArchivedTicket() && !this.isDuplicateTickets();
  }

  public isShowEventDate(): boolean {
    return !this.isLikelyAbnormalBet() && !this.isAbnormalAccount() && !this.isArchivedTicket() && !this.isDuplicateTickets();
  }

  public isDisableActionVoid(): boolean {
    if (this.model.issueTypeId === IssueTypeConstant.DUPLICATE_TICKETS && this.model.action === TVSRequestActionType.AUTO_VOID_INSTANT_ID.toString()) {
      return true;
    }

     return this.model.isVoided;
  }
}
