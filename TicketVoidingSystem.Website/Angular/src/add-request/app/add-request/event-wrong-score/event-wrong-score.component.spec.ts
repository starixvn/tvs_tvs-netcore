import { QueryList, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventLeagueComponent } from '../../../../utility/components/event-league/event-league.component';
import { TVSRequestFilterBy } from '../../../../utility/constants/config';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { AddRequestStore } from '../add-request.store';
import { LogInfoRelatedEventComponent } from '../components/log-info-related-event/log-info-related-event.component';
import { LogInfoRelatedEvent } from '../components/log-info-related-event/log-info-related-event.model';
import { TvDetectionComponent } from '../components/tv-detection/tv-detection.component';
import { TvDetectionService } from '../components/tv-detection/tv-detection.service';
import { FilterModel } from '../filter/filter.model';
import { IssueTypes } from '../filter/issue-types.model';
import { WrongScoreModel } from '../models/event-wrong-score.model';
import { OthersModel } from '../others/others.model';
import { EventWrongScoreComponent } from './event-wrong-score.component';
import { FilterWrongScoreComponent } from './filter-wrong-score/filter-wrong-score.component';
import { SubIssueTypeRelatedEvent } from './models/subIssue-type-related-event.model';
import { RelatedEventsComponent } from './related-events/related-events.component';
import { EditRequestService } from './services/edit-request.service';
import { EventWrongScoreService } from './services/event-wrong-score.service';
import { LogInfoService } from './services/log-info.service';
import { RelatedEventService } from './services/related-event.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';
import { WrongScoreService } from './services/wrong-score.service';
import { WrongScoreInfoComponent } from './wrong-score-info/wrong-score-info.component';

class Helper {
  static readonly fakeRequestId = 1212;
  static readonly fakeUserId = 123;
  static readonly fakeRequestedBy = 'testUser';
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isChangeSubTypeManual: true,
    isAbnormal: false
  } as FilterModel;
  static readonly fakeOthersModel = new OthersModel();
  static readonly fakeWrongScoreModel = [{
    matchId: 123,
    sportType: 1,
    isMainMatch: true,
    eventDate: new Date(),
    scoreId: 1,
    isChecked: true,
    logInfoDetail: {
      matchId: 123,
      singleCount: 1,
      mainParlayCount: 2,
      cancelCashOutCount: 0
    } as LogInfoDetail
  }] as WrongScoreModel[];
  static readonly fakeIssueTypes = new IssueTypes();
  static readonly fakeLogInfoRelatedEvent: LogInfoRelatedEvent = {
    matchId: 123,
    isMainMatch: true,
    subIssueTypeId: 1
  } as LogInfoRelatedEvent;
}

describe('EventWrongScoreComponent', () => {
  let component: EventWrongScoreComponent;
  let fixture: ComponentFixture<EventWrongScoreComponent>;
  let validationService: ValidationService;
  let eventWrongScoreService: EventWrongScoreService;
  let wrongScoreService: WrongScoreService;
  let editRequestService: EditRequestService;
  let addRequestStore: AddRequestStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ValidationService,
        EventWrongScoreService,
        LogInfoService,
        SaveRequestService,
        WrongScoreService,
        RelatedEventService,
        EditRequestService,
        TvDetectionService,
        AddRequestStore
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventWrongScoreComponent);
    validationService = fixture.debugElement.injector.get(ValidationService);
    eventWrongScoreService = fixture.debugElement.injector.get(EventWrongScoreService);
    wrongScoreService = fixture.debugElement.injector.get(WrongScoreService);
    editRequestService = fixture.debugElement.injector.get(EditRequestService);
    addRequestStore = fixture.debugElement.injector.get(AddRequestStore);
    component = fixture.componentInstance;

    const mockRelatedEventsComponent = {
      resetData: jest.fn(),
      getDataWhenSearch: jest.fn().mockResolvedValue(undefined),
      logInfoComponents: new QueryList<LogInfoRelatedEventComponent>(),
      relatedEvents: [],
      filter: Helper.fakeFilterModel,
      isEdit: false,
      primitiveProps: component.primitiveProps
    };
    component.relatedEventsComponent = mockRelatedEventsComponent as unknown as RelatedEventsComponent;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values when not in edit mode', () => {
    // Arrange
    component.isEdit = false;
    wrongScoreService.initDefaultFilterWrongScore = jest.fn().mockReturnValue({});
    addRequestStore.changeSavingRequestStatus = jest.fn();

    // Act
    component.ngOnInit();

    // Assert
    expect(wrongScoreService.initDefaultFilterWrongScore).toHaveBeenCalled();
    expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
  });

  it('should initialize with existing values when in edit mode', () => {
    // Arrange
    component.isEdit = true;
    component.wrongScoreModels = Helper.fakeWrongScoreModel;
    component.mainEvent = Helper.fakeLogInfoRelatedEvent;
    editRequestService.getMainWrongScoreModel = jest.fn().mockReturnValue(Helper.fakeWrongScoreModel[0]);
    editRequestService.assignPrimitivePropsEditRequest = jest.fn();
    wrongScoreService.getFilterWrongScore = jest.fn().mockReturnValue({});
    eventWrongScoreService.getTvDetectionModel = jest.fn().mockReturnValue({});
    component.filter = Helper.fakeFilterModel;

    // Act
    component.ngOnInit();

    // Assert
    expect(editRequestService.getMainWrongScoreModel).toHaveBeenCalledWith(Helper.fakeWrongScoreModel);
    expect(editRequestService.assignPrimitivePropsEditRequest).toHaveBeenCalledWith(Helper.fakeWrongScoreModel[0], component.primitiveProps);
  });

  it('should handle filter changes and reset data', () => {
    // Arrange
    component.filter = Helper.fakeFilterModel;
    component.filter.isChangeSubTypeManual = true;
    eventWrongScoreService.resetPrimitiveProperty = jest.fn();
    component.tvDetectionComponent = {} as TvDetectionComponent;
    component.tvDetectionComponent.initDefaultValues = jest.fn();

    // Act
    component.ngOnChanges({
      filter: {
        currentValue: Helper.fakeFilterModel,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });

    // Assert
    expect(eventWrongScoreService.resetPrimitiveProperty).toHaveBeenCalled();
    expect(component.tvDetectionComponent.initDefaultValues).toHaveBeenCalled();
    expect(component.filter.isChangeSubTypeManual).toBeFalsy();
    expect(component.relatedEventsComponent.resetData).toHaveBeenCalled();
  });

  it('should handle search event with validation', async () => {
    // Arrange
    component.eventLeagueComponent = {} as EventLeagueComponent;
    component.filterWrongScoreComponent = {} as FilterWrongScoreComponent;
    component.tvDetectionComponent = {} as TvDetectionComponent;
    component.wrongScoreInfoComponents = new QueryList<WrongScoreInfoComponent>();
    component.wrongScoreInfoComponents.reset([]);
    component.eventLeagueComponent.selectedMatch = new MatchModel();
    validationService.validateCommonData = jest.fn().mockReturnValue(true);
    validationService.isValidAllSubIssueType = jest.fn().mockReturnValue(true);
    component.primitiveProps.filterBy = TVSRequestFilterBy.CHECK_TIME;
    component.wrongScoreModels = [];
    component.mainEvent = Helper.fakeLogInfoRelatedEvent;
    component.filter = Helper.fakeFilterModel;
    component.filter.subIssueTypeId = '1';
    component.eventLeagueComponent.selectedMatch = {matchId: 123, parentId: 123} as MatchModel;
    jest.spyOn(SubIssueTypeRelatedEvent, 'isHasRelatedEvent').mockReturnValue(true);
    // Mock validateVarCheck to return true to avoid early return
    component.validateVarCheck = jest.fn().mockReturnValue(true);

    // Act
    await component.handleSearchEvent();

    // Assert
    expect(validationService.validateCommonData).toHaveBeenCalled();
    expect(component.relatedEventsComponent.getDataWhenSearch).toHaveBeenCalled();
    expect(component.primitiveProps.isShowRelatedEvents).toBeTruthy();
  });

  it('should handle save request with validation', async () => {
    // Arrange
    component.filter = Helper.fakeFilterModel;
    component.filter.isVoided = true;
    validationService.isValidAllSubIssueType = jest.fn().mockReturnValue(true);
    component.validateVarCheck = jest.fn().mockReturnValue(true);
    component['openConfirmWrongScore'] = jest.fn();

    // Act
    await component.saveRequest();

    // Assert
    expect(validationService.isValidAllSubIssueType).toHaveBeenCalled();
    expect(component.validateVarCheck).toHaveBeenCalled();
    expect(component['openConfirmWrongScore']).toHaveBeenCalled();
  });

  it('should handle match event change', () => {
    // Arrange
    const matchInfo = { matchId: 123 } as MatchModel;
    eventWrongScoreService.updateMainMatch = jest.fn();
    component.updateMatchId.emit = jest.fn();

    // Act
    component.changeMatchEvent(matchInfo);

    // Assert
    expect(component.matchId).toBe(123);
    expect(eventWrongScoreService.updateMainMatch).toHaveBeenCalled();
    expect(component.updateMatchId.emit).toHaveBeenCalledWith(matchInfo);
    expect(component.relatedEventsComponent.resetData).toHaveBeenCalled();
  });

  it('should reset data', () => {
    // Act
    component.resetData();

    // Assert
    expect(component.wrongScoreModels).toEqual([]);
    expect(component.primitiveProps.isShowActualScore).toBeFalsy();
    expect(component.primitiveProps.actualScore).toBe('');
    expect(component.relatedEventsComponent.resetData).toHaveBeenCalled();
  });

  it('should validate var check', () => {
    // Arrange
    component.filter = Helper.fakeFilterModel;
    component.filter.subIssueTypeId = '1';
    component.primitiveProps.isCheckedVar = null;
    component.tooltip.display = jest.fn();

    // Act
    const result = component.validateVarCheck();

    // Assert
    expect(result).toBeFalsy();
    expect(component.primitiveProps.isHighLightVarCheck).toBeTruthy();
    expect(component.tooltip.display).toHaveBeenCalled();
  });

  it('should get selected wrong scores', () => {
    // Arrange
    const wrongScoreModels = [
      { isChecked: true },
      { isChecked: false }
    ] as WrongScoreModel[];

    // Act
    const result = component.getSelectedWrongScores(wrongScoreModels);

    // Assert
    expect(result.length).toBe(1);
    expect(result[0].isChecked).toBeTruthy();
  });

  it('should get single count selected score', () => {
    // Arrange
    component.wrongScoreModels = Helper.fakeWrongScoreModel;

    // Act
    const result = component.getSingleCountSelectedScore(component.wrongScoreModels);

    // Assert
    expect(result).toBe(1);
  });

  it('should get parlay count selected score', () => {
    // Arrange
    component.wrongScoreModels = Helper.fakeWrongScoreModel;

    // Act
    const result = component.getParlayCountSelectedScore(component.wrongScoreModels);

    // Assert
    expect(result).toBe(2);
  });

  it('should get cancel cash out count selected score', () => {
    // Arrange
    component.wrongScoreModels = Helper.fakeWrongScoreModel;

    // Act
    const result = component.getCancelCashOutCountSelectedScore(component.wrongScoreModels);

    // Assert
    expect(result).toBe(0);
  });

  it('should update status button save request', () => {
    // Arrange
    component.wrongScoreModels = Helper.fakeWrongScoreModel;
    component.mainEvent = Helper.fakeLogInfoRelatedEvent;
    addRequestStore.changeSavingRequestStatus = jest.fn();

    // Act
    component.updateStatusButtonSaveRequest();

    // Assert
    expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(false);
  });

  it('should show var check when sub issue type is valid', () => {
    // Arrange
    component.filter = Helper.fakeFilterModel;
    component.filter.subIssueTypeId = '1';

    // Act
    const result = component.isShowVarCheck();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should change var check value', () => {
    // Arrange
    const isVarChecked = true;

    // Act
    component.changeVarCheckValue(isVarChecked);

    // Assert
    expect(component.primitiveProps.isCheckedVar).toBe(isVarChecked);
    expect(component.primitiveProps.isHighLightVarCheck).toBeFalsy();
  });

  it('should show log info selected scores when multiple scores are selected', () => {
    // Arrange
    component.wrongScoreModels = [
      { isChecked: true, logInfoDetail: { matchId: 123 } as LogInfoDetail },
      { isChecked: true, logInfoDetail: { matchId: 124 } as LogInfoDetail }
    ] as WrongScoreModel[];
    component.primitiveProps.filterBy = TVSRequestFilterBy.TRANS_TIME;

    // Act
    const result = component.isShowLogInfoSelectedScores(component.wrongScoreModels);

    // Assert
    expect(result).toBeTruthy();
  });

  it('should get log info detail', () => {
    // Arrange
    component.wrongScoreModels = Helper.fakeWrongScoreModel;

    // Act
    const result = component.getLogInfoDetail();

    // Assert
    expect(result.length).toBe(1);
    expect(result[0].matchId).toBe(123);
  });
});

