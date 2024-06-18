import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Shallow } from 'shallow-render';
import { AdvancedModeComponent } from '../../../utility/components/advanced-mode/advanced-mode/advanced-mode.component';
import { GroupBetTypesComponent } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.component';
import { BetType, GetBetTypesQuery, GroupBetType, GroupBetTypesModel } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { BetTypesVirtualSportComponent } from '../../../utility/components/bettypes-virtualsports/bettypes-virtualsports.component';
import { BetTypeVirtualSport, GroupBetTypeVirtualSport } from '../../../utility/components/bettypes-virtualsports/bettypes-virtualsports.model';
import { BetTypesComponent } from '../../../utility/components/bettypes/bettypes.component';
import { BetTypeModel, BetTypesModel } from '../../../utility/components/bettypes/bettypes.model';
import { DateFullTimeComponent } from '../../../utility/components/date-time/date-full-time/date-full-time.component';
import { ItemsSelect } from '../../../utility/components/multiple-selection/items-select';
import { MultipleSelection } from '../../../utility/components/multiple-selection/multiple-selection';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { ToolTipModule } from '../../../utility/components/tooltip/tooltip.module';
import { Product } from '../../../utility/constants/config';
import { LABELS } from '../../../utility/constants/labels';
import { SportType } from '../../../utility/constants/sport.constant';
import { TEXT } from '../../../utility/constants/text';
import { MatchModel } from '../../../utility/models/match.model';
import { Result } from '../../../utility/models/result';
import { CommonService } from '../../../utility/services/common.service';
import { AppService } from '../app.service';
import { GetSummaryQuery } from '../models/query.model';
import { FilterComponent } from './filter.component';
import { Licensee, SelectionTypeModel } from './filter.model';

class Helper {
  static readonly fakeLicenseeList: Licensee[] = [
    {
      id: 268,
      name: '108bet'
    },
    {
      id: 195,
      name: '12betco'
    },
  ];
  static readonly fakeBetTypeVirtualSportList: BetTypeVirtualSport[] = [
    new BetTypeVirtualSport(2701, 'FT 1X2'),
    new BetTypeVirtualSport(2702, '1H 1X2'),
  ];
  static readonly fakeGroupBetTypeVirtualSportList: GroupBetTypeVirtualSport[] = [
    new GroupBetTypeVirtualSport(Helper.fakeBetTypeVirtualSportList)
  ];

  static getFakeBetTypesModel(): BetTypesModel {
    const betTypesModel = new BetTypesModel([new BetTypeModel('2702', '1H 1X2', false, 5, true)], true);
    betTypesModel.result = {
      errorCode: 0,
      errorMsg: '',
      isSuccessful: true
    };

    return betTypesModel;
  }
}

describe('FilterComponent', () => {
  @NgModule({
    declarations: [
      GroupBetTypesComponent,
      BetTypesComponent,
      BetTypesVirtualSportComponent,
      AdvancedModeComponent,
      DateFullTimeComponent
    ],
    imports: [
      ToolTipModule,
      FormsModule
    ],
    providers: [
      AppService,
      CommonService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<FilterComponent>;

  beforeEach(() => {
    shallow = new Shallow(FilterComponent, AppModuleTest);
  });  

  it('FilterComponent should init match snapshot', async () => {
    // Arrange
    const { fixture } = await shallow.render();
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
  });

  it('#ngOnInit should call #initFilter and init from-to date with current date', async() => {
    // Arrange
    const { instance } = await shallow.render();
    instance.initFilter = jest.fn();

    // Action
    await instance.ngOnInit();

    // Assert
    expect(instance.initFilter).toHaveBeenCalledTimes(1);
    expect(instance.groupBetTypes.groupBetTypes.length).toBe(0);
  });

  it('#initFilter should call expected functions', async() => {
    // Arrange
    const { instance } = await shallow.render();
    instance.getLicensees = jest.fn();
    instance.renderGroupBy = jest.fn();
    instance.renderTicketType = jest.fn();
    instance.renderProduct = jest.fn();
    instance.renderEventType = jest.fn();
    instance.getBetTypes = jest.fn();
    instance.getBetTypesVS = jest.fn();

    // Action
    await instance.initFilter();

    // Assert
    expect(instance.getLicensees).toHaveBeenCalledTimes(1);
    expect(instance.renderGroupBy).toHaveBeenCalledTimes(1);
    expect(instance.renderTicketType).toHaveBeenCalledTimes(1);
    expect(instance.renderProduct).toHaveBeenCalledTimes(1);
    expect(instance.renderEventType).toHaveBeenCalledTimes(1);
    expect(instance.getBetTypes).toHaveBeenCalledTimes(1);
  });

  it('#getLicensees should return expected list licensee', async() => {
    // Arrange
    const { instance } = await shallow
      .mock(AppService, { getLicensees: jest.fn().mockImplementation(() => Helper.fakeLicenseeList) })
      .render();

    // Action
    await instance.getLicensees();

    // Assert
    expect(instance.licensees.length).toBe(2);
  });

  it('#renderGroupBy should return expected list groupBy', async() => {
    // Arrange
    const { instance } = await shallow.render();

    // Action
    instance.renderGroupBy();

    // Assert
    expect(instance.groupBy.items.length).toBe(2);
  });

  it('#renderTicketType should return expected list ticketType', async() => {
     // Arrange
     const { instance } = await shallow.render();

     // Action
     instance.renderTicketType();

     // Assert
     expect(instance.ticketType.items.length).toBe(3);
  });

  it('#renderProduct should return expected list product', async() => {
    // Arrange
    const { instance } = await shallow.render();

    // Action
    instance.renderProduct();

    // Assert
    expect(instance.product.items.length).toBe(5);
 });

 it('#renderEventType should return expected list eventtType', async() => {
  // Arrange
  const { instance } = await shallow.render();

  // Action
  instance.renderEventType();

  // Assert
  expect(instance.eventType.items.length).toBe(3);
});

  it('#changeProduct with sportbooks product should call #blurMatchId and call #changeCheckedModelToGroup of groupBetTypes', async() => {
    // Arrange
    const { instance } = await shallow.render();
    instance.blurMatchId = jest.fn();
    instance.groupBetTypes = new GroupBetTypesModel([], false);
    instance.groupBetTypes.changeCheckedModelToGroup = jest.fn();

    // Action
    await instance.changeProduct(0);

    // Assert
    expect(instance.groupBetTypes.isChecked).toBe(true);
    expect(instance.groupBetTypes.changeCheckedModelToGroup).toHaveBeenCalledTimes(1);
    expect(instance.blurMatchId).toHaveBeenCalledTimes(1);
  });

  it('#changeProduct with another product should disable date-time control and call #blurMatchId', async() => {
    // Arrange
    const { instance } = await shallow.render();
    instance.blurMatchId = jest.fn();

    // Action
    await instance.changeProduct(1);

    // Assert
    expect(instance.blurMatchId).toHaveBeenCalledTimes(1);
    expect(instance.disabledTransDate).toBe(true);
  });

  it('#changeProduct with betbuilder product should set betTypes is empty and call #blurMatchId', async() => {
    // Arrange
    const { instance } = await shallow.render();
    instance.blurMatchId = jest.fn();

    // Action
    await instance.changeProduct(8);

    // Assert
    expect(instance.blurMatchId).toHaveBeenCalledTimes(1);
    expect(instance.betTypes.betTypes.length).toBe(0);
  });

  it('#getBetTypes should return expected commonBetTypes', async() => {
    // Arrange
    const { instance } = await shallow
      .mock(CommonService, { getBetTypes: jest.fn().mockImplementation(() => Helper.getFakeBetTypesModel()) })
      .render();

    // Action
    await instance.getBetTypes();

    // Assert
    expect(instance.commonBetTypes.betTypes.length).toBe(1);
  });

  it('#blurMatchId should return sportType is 0 when matchid is undefined or null', async() => {
    // Arrange
    const { instance } = await shallow.render();
    const matchIdTestCases = [undefined, ''];

    // Action and Assert
    for (const item of matchIdTestCases) {
      instance.matchId = item;
      await instance.blurMatchId();
      expect(instance.sportType).toBe(0);
    }
  });

  it('#blurMatchId should call #getMatchInfo when matchid is not null and not equal prematchid', async() => {
    // Arrange
    const { instance } = await shallow.render();
    instance.matchId = '12345';
    instance.preMatchId = '54321';
    instance.getMatchInfo = jest.fn();

    // Action
    await instance.blurMatchId();

    // Assert
    expect(instance.getMatchInfo).toHaveBeenCalledTimes(1);
  });

  it('#blurMatchId should call #checkSportType when match is not null and not undefined', async() => {
    // Arrange
    const { instance } = await shallow.render();
    instance.matchId = '12345';
    instance.preMatchId = '12345';
    instance.switchMatch3rd = false;
    instance.match = new MatchModel();
    instance.checkSportType = jest.fn();

    // Action
    await instance.blurMatchId();

    // Assert
    expect(instance.checkSportType).toHaveBeenCalledTimes(1);
  });

  it('#blurMatchId should display tooltip when match is null and undefined', async() => {
    // Arrange
    const { instance } = await shallow.render();
    instance.matchId = '12345';
    instance.preMatchId = '12345';
    instance.switchMatch3rd = false;
    instance.match = null;
    instance.tooltip.display = jest.fn();

    // Action
    await instance.blurMatchId();

    // Assert
    expect(instance.tooltip.display).toHaveBeenCalledWith('match-id', TEXT.INVALID_MATCHID);
  });

  it('Get match info when have data', async() => {
    // Arrange
    const matchModel: MatchModel = {
      matchId: 28321695,
      homeId: 10935,
      homeName: 'American League',
      homeNameNewSimplified: '美国聯盟',
      homeNameSimplified: '美国聯盟',
      homeNameTraditional: '美國聯盟',
      awayId: 16277,
      awayName: 'National League',
      awayNameNewSimplified: '国家联盟',
      awayNameSimplified: '国家联盟',
      awayNameTraditional: '國家聯盟',
      matchCode: '*B0001',
      eventDate: new Date(),
      dateTime: new Date(),
      leagueId: 12345,
      leagueName: '',
      leagueNameNewSimplified: '',
      leagueNameSimplified: '',
      leagueNameTraditional: '',
      matchEvent: '',
      matchEventSimplified: '',
      matchEventNewSimplified: '',
      kickOffTime: '2019-11-18 12:08:49.737',
      sportType: 8,
      sportTypeName: '',
      sportTypeNameNewSimplified: '',
      sportTypeNameSimplified: '',
      sportTypeNameTraditional: '',
      leagueGroupId: 1,
      endTime: null,
      startTime: null
    };
    const { instance } = await shallow
    .mock(AppService, { getMatchInfo: jest.fn().mockImplementation(() => Promise.resolve(matchModel)) })
    .render();
    instance.checkSportType = jest.fn();
    
    // Action and Assert
    await instance.getMatchInfo();
    
    expect(instance.checkSportType).toHaveBeenCalled();
  });

  it('Get match info when match is null', async() => {
    const { instance } = await shallow
    .mock(AppService, { getMatchInfo: jest.fn().mockImplementation(() => null) })
    .render();
    instance.tooltip = new Tooltip();
    instance.tooltip.display = jest.fn();

    await instance.getMatchInfo();

    expect(instance.tooltip.display).toHaveBeenCalledTimes(1);
  });
  
  it('Get match info when match is not null', async() => {
    const matchModel = new MatchModel();
    const { instance } = await shallow
    .mock(AppService, { getMatchInfo: jest.fn().mockImplementation(() => matchModel)})
    .render();
    instance.checkSportType = jest.fn();

    await instance.getMatchInfo();

    expect(instance.sportType).toBe(matchModel.sportType);
    expect(instance.checkSportType).toHaveBeenCalledTimes(1);
  });
  
  it('#checkSportType should call #resetBetTeam', async() => {
    const matchModel = new MatchModel();
    const { instance } = await shallow
    .mock(AppService, { getMatchInfo: jest.fn().mockImplementation(() => matchModel)})
    .render();
    instance.advancedModeComponent = new AdvancedModeComponent(null, null, null);
    instance.advancedModeComponent.resetBetTeam = jest.fn();
    instance.validateProduct = jest.fn().mockImplementation(() => false);

    await instance.checkSportType();

    expect(instance.advancedModeComponent.resetBetTeam).toHaveBeenCalledTimes(1);
  });
  
  it('#checkSportType should call #handleByProduct', async() => {
    const matchModel = new MatchModel();
    const { instance } = await shallow
    .mock(AppService, { getMatchInfo: jest.fn().mockImplementation(() => matchModel)})
    .render();
    instance.advancedModeComponent = new AdvancedModeComponent(null, null, null);
    instance.advancedModeComponent.resetBetTeam = jest.fn();    
    instance.validateProduct = jest.fn().mockImplementation(() => true);
    instance.handleByProduct = jest.fn();

    await instance.checkSportType();

    expect(instance.advancedModeComponent.resetBetTeam).toHaveBeenCalledTimes(1);
    expect(instance.validateProduct).toHaveBeenCalledTimes(1);
    expect(instance.handleByProduct).toHaveBeenCalledTimes(1);
  });

  it('#validateProduct should be return expected', async() => {
    // Arrange
    const { instance } = await shallow.render();
    const testCases = [
      { productId: 0, sportType: 100, expected: false },
      { productId: 1, sportType: 1, expected: false },
      { productId: 2, sportType: 1, expected: false },
      { productId: 2, sportType: 187, expected: false },
      { productId: 9, sportType: 1, expected: false },
      { productId: 111, sportType: 200, expected: false },
      { productId: 11111, sportType: 1, expected: true },
    ];
    instance.tooltip = new Tooltip();
    instance.tooltip.display = jest.fn();
    for (const item of testCases) {
      instance.query = new GetSummaryQuery();
      instance.query.product = item.productId;
      instance.sportType = item.sportType;
      
      const actual = instance.validateProduct();
      expect(actual).toBe(item.expected);
    }
  });

  it('Is invalid product 0', async () => {
    // Arrange
    let actualResult = false;
    const testCases = [
      { product: 0, sportType: 100, expectResult: true },
      { product: 0, sportType: 154, expectResult: false },
    ];
    const { instance } = await shallow.render();

    // Action and Assert
    for (const item of testCases) {
      actualResult = instance['isInvalidProduct0'](item.product, item.sportType);
      expect(actualResult).toBe(item.expectResult);
    }
  });

  it('Is invalid product 1', async () => {
    // Arrange
    let actualResult = false;
    const testCases = [
      { product: 1, sportType: 100, expectResult: true },
      { product: 1, sportType: 161, expectResult: false },
      { product: 1, sportType: 164, expectResult: false },
    ];
    const { instance } = await shallow.render();

    // Action and Assert
    for (const item of testCases) {
      actualResult = instance['isInvalidProduct1'](item.product, item.sportType);
      expect(actualResult).toBe(item.expectResult);
    }
  });

  it('Is invalid product 2', async () => {
    // Arrange
    let actualResult = false;
    const testCases = [
      { product: 2, sportType: 170, expectResult: true },
      { product: 2, sportType: 200, expectResult: true },
      { product: 2, sportType: 181, expectResult: false },
    ];
    const { instance } = await shallow.render();

    // Action and Assert
    for (const item of testCases) {
      actualResult = instance['isInvalidProduct2'](item.product, item.sportType);
      expect(actualResult).toBe(item.expectResult);
    }
  });

  it('Is invalid others product', async () => {
    // Arrange
    let actualResult = false;
    const testCases = [
      { sportType: 170, expectResult: true },
      { sportType: 200, expectResult: true },
      { sportType: 154, expectResult: false },
      { sportType: 178, expectResult: false },
    ];
    const { instance } = await shallow.render();

    // Action and Assert
    for (const item of testCases) {
      actualResult = instance['isInvalidOtherProducts'](item.sportType);
      expect(actualResult).toBe(item.expectResult);
    }
  });

  it('Handle by product', async() => {
    // Arrange
    const { instance } = await shallow.render();
    instance.query.product = 0;
    instance.handleBetTypes = jest.fn();
    instance.changeMatchEvent.emit = jest.fn();

    // Action and Assert
    await instance.handleByProduct();
    expect(instance.changeMatchEvent.emit).toHaveBeenCalled();
  });

  it('Is number', async () => {
    // Arrange
    let actualResult = false;
    const testCases = [
      { value: '1', expectResult: true },
      { value: 'aaa', expectResult: false },
    ];
    const { instance } = await shallow.render();

    // Action and Assert
    for (const item of testCases) {
      actualResult = instance.isNumber(item.value);
      expect(actualResult).toBe(item.expectResult);
    }
  });

  it('Search', async () => {
    // Arrange
    const { instance } = await shallow.render();
    jest.spyOn(instance, 'checkFilterParams').mockImplementation(() => true);
    jest.spyOn(instance, 'validateProduct').mockImplementation(() => true);
    jest.spyOn(instance, 'validateBetTypes').mockImplementation(() => true);
    jest.spyOn(instance, 'getParams').mockImplementation();
    jest.spyOn(instance.searchEvent, 'emit').mockImplementation();

    // Action and Assert
    instance.search();
    expect(instance.getParams).toHaveBeenCalled();
    expect(instance.searchEvent.emit).toHaveBeenCalled();
  });

  it('Check filter params with invalid match info', async () => {
    // Arrange
    let actualResult = true;
    const testCases = [
      { matchid: '', match: null, message: TEXT.REQUIRED_MATCHID },
      { matchid: undefined, match: null, message: TEXT.REQUIRED_MATCHID },
      { matchid: 'abc', match: null, message: TEXT.INVALID_MATCHID },
      { matchid: '12345', match: null, message: TEXT.INVALID_MATCHID },
    ];
    const { instance } = await shallow.render();
    instance.tooltip = new Tooltip();
    instance.tooltip.display = jest.fn();
    instance.tooltip.display = jest.fn();

    // Action and Assert
    for (const item of testCases) {
      instance.matchId = item.matchid;
      instance.match = item.match;
      actualResult = instance.checkFilterParams();
      expect(instance.tooltip.display).toHaveBeenCalledWith('match-id', item.message);
      expect(actualResult).toBe(false);
    }
  });

  it('Check filter params with invalid transdate', async () => {
    // Arrange
    const { instance } = await shallow.render();
    let actualResult = true;
    instance.tooltip = new Tooltip();
    instance.tooltip.display = jest.fn();
    instance.matchId = '12345';
    instance.fromDate = '2020-09-02';
    instance.toDate = '2020-08-03';
    instance.disabledTransDate = false;
    instance.match = new MatchModel();
    instance.isShowFilterTime = jest.fn().mockImplementation(() => true);
    // Action and Assert
    actualResult = instance.checkFilterParams();
    expect(instance.tooltip.display).toHaveBeenCalledWith('from-date-time', LABELS.FROM_TIME_MUST_SMALLER_THAN_TO_TIME);
    expect(actualResult).toBe(false);
  });

  it('Check filter params with advanced mode', async () => {
    // Arrange
    const { instance } = await shallow.render();
    let actualResult = true;
    instance.advancedModeComponent = new AdvancedModeComponent(null, null, null);
    instance.matchId = '12345';
    instance.fromDate = '2020-08-01';
    instance.toDate = '2020-08-02';
    instance.disabledTransDate = false;
    instance.sportType = 43;
    instance.query.product = Product.SPORTS_BOOK;
    const testCases = [
      { validation: true, expectedResult: true },
      { validation: false, expectedResult: false },
    ];
    // Action and Assert
    for (const item of testCases) {
      instance.advancedModeComponent.validate = jest.fn().mockReturnValue(item.validation);
      actualResult = instance.checkFilterParams();
      expect(actualResult).toBe(item.expectedResult);
    }
  });

  it('Check filter params should return false when selection combo parlay not valid', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.advancedModeComponent = new AdvancedModeComponent(null, null, null);
    instance.matchId = '12345';
    instance.fromDate = '2020-08-01';
    instance.toDate = '2020-08-02';
    instance.disabledTransDate = true;
    instance.sportType = 0;
    instance.singleOrSubParlay = "SubParlay";
    instance.getSelectionSubParlays = jest.fn().mockReturnValue('');
    instance.tooltip = new Tooltip();
    instance.tooltip.display = jest.fn();

    // Action and Assert
    const actual = instance.checkFilterParams();
    expect(actual).toBeFalsy();
    expect(instance.tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('Check filter params with all checking is valid', async () => {
    // Arrange
    const { instance } = await shallow.render();
    let actualResult = true;
    instance.advancedModeComponent = new AdvancedModeComponent(null, null, null);
    instance.matchId = '12345';
    instance.fromDate = '2020-08-01';
    instance.toDate = '2020-08-02';
    instance.disabledTransDate = true;
    instance.sportType = 0;
    // Action and Assert
    actualResult = instance.checkFilterParams();
    expect(actualResult).toBe(true);
  });

  it('Validate bettypes with sporttype product and valid match', async () => {
    // Arrange
    const { instance } = await shallow.render();
    let actualResult = false;
    instance.query.product = Product.SPORTS_BOOK;
    instance.checkMatch = '';
    instance.groupBetTypesComponent = new GroupBetTypesComponent(null);
    const testCases = [
      { validation: true, expectedResult: true },
      { validation: false, expectedResult: false },
    ];
    // Action and Assert
    for (const item of testCases) {
      instance.groupBetTypesComponent.validate = jest.fn().mockImplementation(() => item.validation);
      actualResult = instance.validateBetTypes();
      expect(actualResult).toBe(item.expectedResult);
    }
  });

  it('Validate bettypes with sporttype product and invalid match', async () => {
    // Arrange
    const { instance } = await shallow.render();
    let actualResult = false;
    instance.query.product = Product.SPORTS_BOOK;
    instance.checkMatch = 'Invalid match';
    instance.tooltip = new Tooltip();
    instance.tooltip.display = jest.fn();
    
    // Action and Assert
    actualResult = instance.validateBetTypes();
    expect(instance.tooltip.display).toHaveBeenCalledWith('match-id', instance.checkMatch);
    expect(actualResult).toBe(false);
  });

  it('Validate bettypes with virtual sporttypes product', async () => {
    // Arrange
    const { instance } = await shallow.render();
    let actualResult = false;
    instance.query.product = Product.VIRTUAL_SPORTS;
    instance.betTypesVSComponent = new BetTypesVirtualSportComponent(null);
    instance.groupsBetTypesVS = new GroupBetTypeVirtualSport(Helper.fakeBetTypeVirtualSportList);
    const testCases = [
      { validation: true, expectedResult: true },
      { validation: false, expectedResult: false },
    ];
    // Action and Assert
    for (const item of testCases) {
      instance.betTypesVSComponent.validate = jest.fn().mockImplementation(() => item.validation);
      actualResult = instance.validateBetTypes();
      expect(actualResult).toBe(item.expectedResult);
    }
  });

  it('Validate bettypes with other product', async () => {
    // Arrange
    const { instance } = await shallow.render();
    let actualResult = false;
    instance.query.product = Product.NUMBER_GAME;
    instance.betTypesComponent = new BetTypesComponent(null);
    const testCases = [
      { validation: true, expectedResult: true },
      { validation: false, expectedResult: false },
    ];
    // Action and Assert
    for (const item of testCases) {
      instance.betTypesComponent.validate = jest.fn().mockImplementation(() => item.validation);
      actualResult = instance.validateBetTypes();
      expect(actualResult).toBe(item.expectedResult);
    }
  });

  it('Get params with esport sporttype', async () => {
    // Arrange
    const { instance } = await shallow.render();
    const checkedBettypes = '1,2,3';
    jest.spyOn(instance, 'getCheckedBetTypes').mockImplementation(() => checkedBettypes);
    instance.sportType = SportType.E_SPORTS;
    instance.groupBetTypes = new GroupBetTypesModel([], false);
    jest.spyOn(instance.groupBetTypes, 'getValueCheckedBetTypes').mockImplementation(() => checkedBettypes);
    instance.advancedModeComponent = new AdvancedModeComponent(null, null, null);
    jest.spyOn(instance.advancedModeComponent, 'getBetTypeModels');
    instance.query.product = Product.SPORTS_BOOK;
    // Action and Assert
    instance.getParams();
    expect(instance.advancedModeComponent.getBetTypeModels).toHaveBeenCalledWith(checkedBettypes);
    expect(instance.query.betTypes).toBe(checkedBettypes);
  });

  it('Get params with not esport sporttype', async () => {
    // Arrange
    const { instance } = await shallow.render();
    const checkedBettypes = '1,2,3';
    jest.spyOn(instance, 'getCheckedBetTypes').mockImplementation(() => checkedBettypes);
    instance.sportType = 0;
    instance.query.product = Product.BET_BUILDER;
    instance.disabledTransDate = false;

    // Action and Assert
    instance.getParams();
    expect(instance.query.betTypes).toBe('38');
  });

  it('Get checked bettypes with product of sportbook', async () => {
    // Arrange
    const { instance } = await shallow.render();
    const checkedBettypes = '1,2,3';
    instance.query.product = Product.SPORTS_BOOK;
    instance.groupBetTypes = new GroupBetTypesModel([], false);
    jest.spyOn(instance.groupBetTypes, 'getValueCheckedBetTypes').mockImplementation(() => checkedBettypes);
    // Action and Assert
    const actualResult = instance.getCheckedBetTypes();
    expect(actualResult).toBe(checkedBettypes);
  });

  it('Get checked bettypes with product of virtual sports', async () => {
    // Arrange
    const { instance } = await shallow.render();
    const checkedBettypes = ["1", "2", "3"];
    instance.query.product = Product.VIRTUAL_SPORTS;
    instance.betTypesVSComponent = new BetTypesVirtualSportComponent(null);
    jest.spyOn(instance.betTypesVSComponent, 'getCheckedBetTypes').mockImplementation(() => checkedBettypes);

    // Action 
    const actualResult = instance.getCheckedBetTypes();

    // Assert
    expect(actualResult).toBe("1,2,3");
  });

  it('Get checked bettypes with anothers product', async () => {
    // Arrange
    const { instance } = await shallow.render();
    const checkedBettypes = '1,2,3';
    instance.query.product = Product.NUMBER_GAME;
    instance.betTypes = new BetTypesModel([], true);
    jest.spyOn(instance.betTypes, 'getCheckedBetTypes').mockImplementation(() => [checkedBettypes]);
    // Action and Assert
    const actualResult = instance.getCheckedBetTypes();
    expect(actualResult).toBe(checkedBettypes);
  });

  it('Change bettypes', async () => {
    // Arrange
    const { instance } = await shallow.render();
    const bettype15 = new BetType(15, '1H 1X2', false, 0, true);
    const bettype4 = new BetType(4, 'Correct Score', false, 0, false);
    instance.allBetTypes = [];

    // Action and Assert
    instance.changeBetTypes([bettype15, bettype4]);
    expect(instance.allBetTypes.length).toBe(2);
  });
  
  it('isShowFilterTime should retrun true', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.query.eventType = 1;
    instance.query.product = 0;
   
    // Action and Assert
    const actual = instance.isShowFilterTime();
    expect(actual).toBeTruthy();
  });
  
  it('handleBetTypesAndAdvancedMode should call #enableBetTypesAndAdvancedMode', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.isReSettled = false;
    instance['enableBetTypesAndAdvancedMode'] = jest.fn();
    instance.query.product = Product.BET_BUILDER;

    // Action and Assert
    instance.handleBetTypesAndAdvancedMode();
    expect(instance['enableBetTypesAndAdvancedMode']).toHaveBeenCalledTimes(1);
  });
  
  it('unCheckAffectedTickets should call #enableBetTypesAndAdvancedMode', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance['enableBetTypesAndAdvancedMode'] = jest.fn();
   
    // Action and Assert
    instance.unCheckAffectedTickets();
    expect(instance['enableBetTypesAndAdvancedMode']).toHaveBeenCalledTimes(1);
  });
  
  it('isShowCheckboxAffected should return true', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.groupBetTypes = new GroupBetTypesModel([], false);
    instance.groupBetTypes.groupBetTypes = [new GroupBetType('', [new BetType(1,'',true,1,true)], false)];
    instance.query.product = Product.SPORTS_BOOK;
    instance.sportType = SportType.SOCCER;

    // Action and Assert
    const actual = instance.isShowCheckboxAffected();
    expect(actual).toBeTruthy();
  });
  
  it('handleBetTypes should call #handleGroupBetTypesOfSportBook', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.query.product = Product.SPORTS_BOOK;
    instance.handleGroupBetTypesOfSportBook = jest.fn();

    // Action and Assert
    instance.handleBetTypes();
    expect(instance.handleGroupBetTypesOfSportBook).toHaveBeenCalledTimes(1);
  });
  
  it('handleBetTypes should call #handleBetTypesOfBetBuilder', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.query.product = Product.BET_BUILDER;
    instance.handleBetTypesOfBetBuilder = jest.fn();

    // Action and Assert
    instance.handleBetTypes();
    expect(instance.handleBetTypesOfBetBuilder).toHaveBeenCalledTimes(1);
  });
  
  it('handleGroupBetTypesOfSportBook should not call #tooltip when have bettype', async () => {
    // Arrange
    const groupBetTypes = new GroupBetTypesModel([new GroupBetType('Special', [], true)], false);
    groupBetTypes.result = new Result();
    groupBetTypes.result.errorCode = 0;
    const { instance } = await shallow
    .mock(CommonService, { getGroupBetTypes: jest.fn().mockImplementation(() => Promise.resolve(groupBetTypes)) })
    .render();
    instance.query.product = Product.SPORTS_BOOK;
    instance.tooltip.display = jest.fn();

    // Action and Assert
    await instance.handleGroupBetTypesOfSportBook(new GetBetTypesQuery());
    expect(instance.tooltip.display).toHaveBeenCalledTimes(0);
  });
  
  it('handleGroupBetTypesOfSportBook should call #tooltip when have not bettype', async () => {
    // Arrange
    const groupBetTypes = new GroupBetTypesModel([], false);
    groupBetTypes.result = new Result();
    groupBetTypes.result.errorCode = 0;
    const { instance } = await shallow
    .mock(CommonService, { getGroupBetTypes: jest.fn().mockImplementation(() => Promise.resolve(groupBetTypes)) })
    .render();
    instance.query.product = Product.SPORTS_BOOK;
    instance.tooltip.display = jest.fn();

    // Action and Assert
    await instance.handleGroupBetTypesOfSportBook(new GetBetTypesQuery());
    expect(instance.tooltip.display).toHaveBeenCalledTimes(1);
  });
  
  it('handleGroupBetTypesOfSportBook should call #tooltip when have error code', async () => {
    // Arrange
    const groupBetTypes = new GroupBetTypesModel([], false);
    groupBetTypes.result = new Result();
    groupBetTypes.result.errorCode = 1;
    const { instance } = await shallow
    .mock(CommonService, { getGroupBetTypes: jest.fn().mockImplementation(() => Promise.resolve(groupBetTypes)) })
    .render();
    instance.query.product = Product.SPORTS_BOOK;
    instance.tooltip.display = jest.fn();

    // Action and Assert
    await instance.handleGroupBetTypesOfSportBook(new GetBetTypesQuery());
    expect(instance.tooltip.display).toHaveBeenCalledTimes(1);
  });
  
  it('handlBetTypesOfBetBuilder should call #tooltip when have not getSelectionTypes', async () => {
    // Arrange
    const { instance } = await shallow
    .mock(AppService, { getSelectionTypes: jest.fn().mockImplementation(() => Promise.resolve([])) })
    .render();
    instance.tooltip.display = jest.fn();

    // Action and Assert
    await instance.handleBetTypesOfBetBuilder(new GetBetTypesQuery());
    expect(instance.tooltip.display).toHaveBeenCalledTimes(1);
  });
  
  it('handlBetTypesOfBetBuilder should update betTypes when have getSelectionTypes', async () => {
    // Arrange
    const selectionTypeModel = new SelectionTypeModel();
    selectionTypeModel.selectionType = 1;
    selectionTypeModel.selectionName = '12312';
    const { instance } = await shallow
    .mock(AppService, { getSelectionTypes: jest.fn().mockImplementation(() => Promise.resolve([selectionTypeModel])) })
    .render();

    // Action and Assert
    await instance.handleBetTypesOfBetBuilder(new GetBetTypesQuery());
    expect(instance.betTypes).toBeDefined();
  });

  it('resetCheckedComboParlay should checked to all items', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.comboParlay = new MultipleSelection();
    instance.comboParlay.items = [{ checked: false } as ItemsSelect];

    // Action
    instance.resetCheckedComboParlay();

    // Assert
    expect(instance.comboParlay.items.every(x => x.checked)).toBeTruthy();
  });

  it('getSelectionSubParlays should return selectedItems', async () => {
    const { instance } = await shallow.render();
    const comboParlay = new MultipleSelection();
    comboParlay.items = [{ checked: true, value: '1' } as ItemsSelect];
    const actual = instance.getSelectionSubParlays('SubParlay', comboParlay);

    expect(actual).toBe('1');
  });

  it('enableBetTypesAndAdvancedMode should update isDisabledAllBetTypes = false', async () => {
    const { instance } = await shallow.render();
    instance.groupBetTypesComponent = new GroupBetTypesComponent(null);
    instance['enableBetTypesAndAdvancedMode']();

    expect(instance.groupBetTypesComponent.isDisabledAllBetTypes).toBeFalsy();
  });

  it('handleBetTypesAndAdvancedMode should disabled all bettypes and update them to checked', async () => {
    const { instance } = await shallow.render();
    instance.isReSettled = true;
    instance.groupBetTypes = new GroupBetTypesModel([new GroupBetType('Special', [], true)], false);
    instance.query.product = Product.SPORTS_BOOK;
    instance.handleBetTypesAndAdvancedMode();

    expect(instance.groupBetTypesComponent.isDisabledAllBetTypes).toBeTruthy();
    expect(instance.groupBetTypes.isChecked).toBeTruthy();
    expect(instance.groupBetTypes.groupBetTypes.every(x => x.isChecked)).toBeTruthy();
    expect(instance.groupBetTypes.groupBetTypes.every(x => x.betTypes.every(x => x.isChecked))).toBeTruthy();
  });
});
