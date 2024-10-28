import {
  Component,
  ElementRef, EventEmitter, Input,
  OnInit, Output, QueryList, ViewChild, ViewChildren
} from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment';
import { AdvancedModeComponent } from '../../../../../utility/components/advanced-mode/advanced-mode/advanced-mode.component';
import { GetPlayersQuery } from '../../../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { GroupBetTypesComponent } from '../../../../../utility/components/advanced-mode/group-bettypes/group-bettypes.component';
import { BetType, GetBetTypesQuery, GroupBetTypesModel } from '../../../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { GroupLicenseeModel } from '../../../../../utility/components/licensees/licensees.model';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { DateTimeFormat, ModeType } from '../../../../../utility/constants/config';
import { LABELS } from '../../../../../utility/constants/labels';
import { CommonService } from '../../../../../utility/services/common.service';
import { StaticService } from '../../../../../utility/services/static.service';
import { GetTicketsQuery, RangeTime } from '../../../models/query.model';
import { EventType } from '../filter.model';
import { Duration } from './../../../models/query.model';
import { Currencies } from './../filter.model';

@Component({
  selector: 'match-id',
  templateUrl: './match-id.component.html',
  styleUrls: ['./match-id.component.scss']
})
export class MatchIdComponent implements OnInit {
  @Input() currencies = new Currencies();
  @Input() groupLicenseeModel: GroupLicenseeModel;
  @Input() model = new GetTicketsQuery();
  @Output() blockComponent = new EventEmitter<boolean>();
  @Output() modelChange = new EventEmitter<GetTicketsQuery>();
  @Output() changeMatch = new EventEmitter();
  @ViewChild('groupBetTypesComponent') groupBetTypesComponent: GroupBetTypesComponent;
  @ViewChild('advancedMode') advancedModelComponent: AdvancedModeComponent;
  @ViewChildren('dateTimeComponent') dateTimeComponents: QueryList<DateFullTimeNewComponent>;
  groupBetTypes: GroupBetTypesModel;
  allBetTypes: BetType[];
  getPlayerQuery: GetPlayersQuery;

  rangeTimes: RangeTime[] = [new RangeTime()];
  eventType = new EventType();
  preMatchId: string;
  isSuccessMatch: boolean;
  titleSelectedCurrency = 'Select All';
  tooltip = new Tooltip();

  constructor(
    private readonly commonService: CommonService,
    private readonly element: ElementRef
  ) {
    this.tooltip.element = this.element;
  }

  async ngOnInit() {
    this.model.matchId = '';
    this.model.bet = 'All';
  }

  addRangeTimes() {
    let rangeTime = new RangeTime();
    if(this.rangeTimes[0].isValid()) {
      rangeTime = _.cloneDeep(this.rangeTimes[0]);
    }
    this.rangeTimes.push(rangeTime);
  }

  removeRangeTimes(index: number) {
    this.rangeTimes.splice(index, 1);
  }

  async blurMatchId() {
    if (this.model.matchId !== undefined && this.model.matchId !== '' && this.model.matchId !== this.preMatchId) {
      this.groupBetTypes = new GroupBetTypesModel([], false);
      this.advancedModelComponent.resetBetTeam();
      await this.getGroupBetTypes();
      this.preMatchId = this.model.matchId;
      await this.setFromDate();
    }
  }

  async setFromDate() {
    if (this.model.matchId.toString() !== '') {
      const firstTime = await this.commonService.getFirstTimeAndKickOffTime(parseInt(this.model.matchId, 10));
      if (!_.isNull(firstTime)) {
        const currentDate = this.eventType.value !== '1' ? firstTime.minTransDate : firstTime.kickOffTime;
        const date = new Date(currentDate);
        if (!_.isNull(currentDate)) {
          const year = parseInt(currentDate.split('-')[0], 10);
          const minValidYear = 100;
          if (year < minValidYear) {
            date.setFullYear(year);
          }
        }
        this.rangeTimes.forEach(item => {
          item.from = moment(date).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
        });
      }
    }
  }

  async getGroupBetTypes() {
    this.blockComponent.emit(true);
    const query: GetBetTypesQuery = { mode: ModeType.MARK_TICKET, matchId: parseInt(this.model.matchId, 10) };
    const data = await this.commonService.getGroupBetTypes(query);
    this.handleGroupBetTypes(data);
    this.blockComponent.emit(false);
  }

  handleGroupBetTypes(data: GroupBetTypesModel) {
    if (data.result.errorCode === 0) {
      if (data.groupBetTypes.length === 0) {
        this.tooltip.display('match-id', LABELS.INVALID_MATCH);
        this.isSuccessMatch = false;
      } else {
        this.isSuccessMatch = true;
      }
    } else {
      this.tooltip.display('match-id', data.result.errorMsg);
      this.isSuccessMatch = false;
    }
    this.groupBetTypes = new GroupBetTypesModel(data.groupBetTypes, false);
    this.allBetTypes = this.groupBetTypes.getAllBetType();
    this.handleBetType216();
    this.changeMatch.emit();
  }

  handleBetType216() {
    const betType216Id = 216;
    if (this.groupBetTypes.hasBetType(betType216Id)) {
      this.getPlayerQuery = new GetPlayersQuery(this.model.matchId, '216');
    }
  }

  changeBetTypes(betTypes: BetType[]) {
    this.allBetTypes = betTypes;
  }

  changeEventType() {
    this.model.liveHomeScore = null;
    this.model.liveAwayScore = null;
    this.setFromDate();
  }

  getCheckedLicensees() {
    return this.groupLicenseeModel.getCheckedLicensees().map(license => license.name);
  }

  checkValidationOfMatch(): boolean {
    if (this.model.matchId === '' || _.isUndefined(this.model.matchId)) {
      this.tooltip.display('match-id', LABELS.REQUIRED_MATCHID);
      return false;
    }
    if (!this.isSuccessMatch) {
      this.tooltip.display('match-id', LABELS.INVALID_MATCHID);
      return false;
    }

    return true;
  }

  checkValidate(): boolean {
    let validation = true;
    validation = this.checkValidationOfMatch();
    if (!validation) {
      return validation;
    }

    if (!this.checkValidateRangeTime()) {
      return false;
    }
    if (this.getCheckedLicensees().length === 0) {
      this.tooltip.display('check-group-licensee', LABELS.EMPTY_LICENSEE);
      return false;
    }
    if (this.model.currencyIds === '') {
      this.tooltip.display('currencies-id', LABELS.EMPTY_CURRENCY);
      return false;
    }

    return this.groupBetTypesComponent.validate() && this.advancedModelComponent.validate();
  }

  getParams(): GetTicketsQuery {
    this.model.licenseeNames = this.getCheckedLicensees().join(',');
    this.model.liveIndicator = this.eventType.value.isNumber() ? Number(this.eventType.value) : null;
    this.model.liveAwayScore =  `${this.model.liveAwayScore}`.isNumber() ? Number(this.model.liveAwayScore) : null;
    this.model.liveHomeScore = `${this.model.liveHomeScore}`.isNumber() ? Number(this.model.liveHomeScore) : null;

    const checkedBetTypes = this.groupBetTypes.getValueCheckedBetTypes();
    this.model.betTypes = this.advancedModelComponent.getBetTypeModels(checkedBetTypes);
    this.getDurationTime();

    return this.model;
  }

  getDurationTime() {
    this.model.durations = [];
    this.rangeTimes.forEach(item => {
      const duration: Duration = {
        fromTransDate: item.from,
        toTransDate: item.to
      };
      this.model.durations.push(duration);
    });
  }

  checkValidateRangeTime(): boolean {
    if (this.dateTimeComponents.some(x => !x.validateWithTooltip())) {
      return false;
    }

    return this.rangeTimes.every((item, index) => {
      return StaticService.isFromTimeSameOrBeforeToTime(item.from, item.to, this.tooltip, `from-date-time${index}`);
    });
  }

  updateSelectedCurrency() {
    this.model.currencyIds = this.currencies.selected.join(',');
  }
}
