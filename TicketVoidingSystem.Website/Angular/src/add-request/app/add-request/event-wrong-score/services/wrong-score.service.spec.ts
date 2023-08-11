import { EventEmitter, QueryList } from '@angular/core';
import * as _ from 'lodash';
import { AllowanceTime } from '../../../../../utility/models/allowance-time.model';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { AddRequestApiService } from '../../add-request-api.service';
import { LeagueEventRedCardComponent } from '../../event-red-card/league-event-red-card/league-event-red-card.component';
import { WrongScoreModel } from '../../models/event-wrong-score.model';
import { LastTimeScore } from '../../models/last-time-score.model';
import { FilterWrongScoreModel } from '../models/filter-wrong-score.model';
import { WrongScoreInfoComponent } from '../wrong-score-info/wrong-score-info.component';
import { ValidationService } from './validation.service';
import { WrongScoreService } from './wrong-score.service';


class Helper {
  static readonly fakeRequestId = 1001;
  static readonly fakeFirstMatchId = 1111;
  static readonly fakeSecondMatchId = 2222;
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
  static readonly fakeAllowanceTime: AllowanceTime = {
    aaTime: 1,
    paTime: 1,
    saTime: 1,
  };
  static readonly fakeLogInfoDetail: LogInfoDetail =
  {
    matchId: 12345,
    liveScores: '0 - 0',
    voidFromTime: new Date(Helper.fakeFromDateTime),
    voidToTime: new Date(Helper.fakeToDateTime),
    singleCount: 1,
    mainParlayCount: 1,
    cashOutCount: 3,
    settleCount: 1,
    scoreOfMatch: '',
    scoreNormalTicket: '',
    instantlySettleCount: 2,
    cancelCashOutCount: 1
  };
  static readonly fakeWrongScoreModels: WrongScoreModel[] = [{
    scoreId: 5464,
    isActive: true,
    wrongScore: '0-1',
    subIssueTypeId: 5,
    filterBy: 1,
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeToDateTime,
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: [],
    actualScore: '',
    matchId: 900000,
    isChecked: true,
    eventDate: null,
    voidFromTime: Helper.fakeFromDateTime,
    voidToTime: Helper.fakeToDateTime,
  },
  {
    scoreId: 5465,
    isActive: false,
    wrongScore: '2-1',
    subIssueTypeId: 5,
    filterBy: 1,
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeToDateTime,
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: [],
    actualScore: '',
    matchId: 900000,
    isChecked: false,
    eventDate: null,
    voidFromTime: Helper.fakeFromDateTime,
    voidToTime: Helper.fakeToDateTime,
  }];
}
describe('WrongScoreService', () => {

  let wrongScoreService: WrongScoreService;

  beforeEach(() => {
    wrongScoreService = new WrongScoreService(null, null);
  });

  it('#handleCheckedLastScore should call #getWrongScores when have new score', async () => {
    const leagueEventRedCardComponent = new LeagueEventRedCardComponent(null, null);
    leagueEventRedCardComponent.isMatchIdValid = jest.fn().mockImplementation(() => false);

    const newModels = _.cloneDeep(Helper.fakeWrongScoreModels);
    newModels.push(new WrongScoreModel());
    const updateByOriginWrongScoreModelEvent = new EventEmitter<WrongScoreModel[]>();
    wrongScoreService['getWrongScores'] = jest.fn().mockImplementation(() => Promise.resolve(newModels));
    await wrongScoreService.handleCheckedLastScore(Helper.fakeWrongScoreModels, Helper.fakeWrongScoreModels[0],
      updateByOriginWrongScoreModelEvent, null, null, null);

    expect(wrongScoreService['getWrongScores']).toBeCalledTimes(1);
  });

  it('#handleCheckedLastScore should call #getWrongScores when have not new score', async () => {
    const leagueEventRedCardComponent = new LeagueEventRedCardComponent(null, null);
    leagueEventRedCardComponent.isMatchIdValid = jest.fn().mockImplementation(() => false);

    const newModels = _.cloneDeep(Helper.fakeWrongScoreModels);
    newModels.push(new WrongScoreModel());
    const updateByOriginWrongScoreModelEvent = new EventEmitter<WrongScoreModel[]>();
    wrongScoreService['getWrongScores'] = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeWrongScoreModels));
    wrongScoreService['getLastTimeTicket'] = jest.fn().mockImplementation();
    await wrongScoreService.handleCheckedLastScore(Helper.fakeWrongScoreModels, Helper.fakeWrongScoreModels[0],
      updateByOriginWrongScoreModelEvent, null, null, null);

    expect(wrongScoreService['getWrongScores']).toBeCalledTimes(1);
    expect(wrongScoreService['getLastTimeTicket']).toBeCalledTimes(1);
  });

  it('#getSelectedWrongScores should return model', async () => {
    const actual = wrongScoreService.getSelectedWrongScores(Helper.fakeWrongScoreModels);

    expect(actual.length).toBe(1);
  });

  it('#getSelectedWrongScoreComponents should return components', async () => {
    const component = new WrongScoreInfoComponent(null, null, null, null, null);
    component.wrongScoreModel = new WrongScoreModel();
    component.wrongScoreModel.isChecked = true;
    const components = new QueryList<WrongScoreInfoComponent>();
    components.reset([...components.toArray(), component]);
    const actual = wrongScoreService.getSelectedWrongScoreComponents(components);

    expect(actual.length).toBe(1);
  });

  it('#getLastTimeTicket should update correct data', async () => {
    const model = new WrongScoreModel();
    const lastTimeScore = new LastTimeScore();
    wrongScoreService['getLastTimeScore'] = jest.fn().mockImplementation(() => Promise.resolve(lastTimeScore));
    await wrongScoreService['getLastTimeTicket'](model, null, null, null);

    expect(model.filterToTransTime).toBe(lastTimeScore.lastTime);
  });

  it('#getWrongScores should update correct data', async () => {
    const addRequestApiService = new AddRequestApiService(null);
    addRequestApiService.getWrongScores = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeWrongScoreModels));
    const mockWrongScoreService = new WrongScoreService(addRequestApiService, null);
    const actual = await mockWrongScoreService['getWrongScores'](null);

    expect(actual).toStrictEqual(Helper.fakeWrongScoreModels);
  });

  it('#getLastTimeScore should update correct data', async () => {
    const lastTimeScore = new LastTimeScore();
    const addRequestApiService = new AddRequestApiService(null);
    addRequestApiService.getLastTimeScore = jest.fn().mockImplementation(() => Promise.resolve(lastTimeScore));
    const mockWrongScoreService = new WrongScoreService(addRequestApiService, null);
    const actual = await mockWrongScoreService['getLastTimeScore'](Helper.fakeWrongScoreModels[0], null, null, null);

    expect(actual).toStrictEqual(lastTimeScore);
  });

  it('#initDefaultFilterWrongScore should return model', async () => {
    const actual = wrongScoreService.initDefaultFilterWrongScore();

    expect(actual).toBeDefined();
  });

  it('#getFilterWrongScore should return model', async () => {
    const actual = wrongScoreService.getFilterWrongScore(Helper.fakeWrongScoreModels[0]);

    expect(actual).toBeDefined();
  });

  it('#createMainWrongScoreModel should return model', async () => {
    const actual = wrongScoreService.createMainWrongScoreModel(new FilterWrongScoreModel());

    expect(actual).toBeDefined();
    expect(actual.isChecked).toBeTruthy();
  });

  it('#getFilterByBaseOnSubIssueType should return 2', async () => {
    const validation = new ValidationService();
    validation.isSubTypeFilterByAcceptedTime = jest.fn().mockImplementation(() => true);
    const service = new WrongScoreService(null, validation);
    const actual = service.getFilterByBaseOnSubIssueType('1');

    expect(actual).toBe(2);
  });

  it('#getFilterByBaseOnSubIssueType should return 4', async () => {
    const validation = new ValidationService();
    validation.isSubTypeFilterByAcceptedTime = jest.fn().mockImplementation(() => false);
    validation.isSubTypeFilterByTransTimeAndAcceptedTime = jest.fn().mockImplementation(() => true);
    const service = new WrongScoreService(null, validation);
    const actual = service.getFilterByBaseOnSubIssueType('1');

    expect(actual).toBe(4);
  });

  it('#getFilterByBaseOnSubIssueType should return 1', async () => {
    const validation = new ValidationService();
    validation.isSubTypeFilterByAcceptedTime = jest.fn().mockImplementation(() => false);
    validation.isSubTypeFilterByTransTimeAndAcceptedTime = jest.fn().mockImplementation(() => false);
    const service = new WrongScoreService(null, validation);
    const actual = service.getFilterByBaseOnSubIssueType('1');

    expect(actual).toBe(1);
  });

  it('#getDurationTime should return 1', async () => {
    const service = new WrongScoreService(null, null);
    const actual = service.getDurationTime('2020-10-09 09:44:41.000 PM', '2020-10-09 09:44:46.000 PM');

    expect(actual).toBe('0m5s');
  });
});
