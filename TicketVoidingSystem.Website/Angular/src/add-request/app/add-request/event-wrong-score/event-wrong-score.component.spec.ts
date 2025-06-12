import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { EventWrongScoreComponent } from './event-wrong-score.component';
import { ValidationService } from './services/validation.service';
import { EventWrongScoreService } from './services/event-wrong-score.service';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { WrongScoreService } from './services/wrong-score.service';
import { RelatedEventService } from './services/related-event.service';
import { EditRequestService } from './services/edit-request.service';
import { TvDetectionService } from '../components/tv-detection/tv-detection.service';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { WrongScoreModel } from '../models/event-wrong-score.model';
import { OthersModel } from '../others/others.model';
import { IssueTypes } from '../filter/issue-types.model';
import { EventLeagueComponent } from '../../../../utility/components/event-league/event-league.component';
import { MatchModel } from '../../../../utility/models/match.model';
import { FilterWrongScoreComponent } from './filter-wrong-score/filter-wrong-score.component';
import { TvDetectionComponent } from '../components/tv-detection/tv-detection.component';
import { QueryList, SimpleChange } from '@angular/core';
import { TVSRequestFilterBy } from '../../../../utility/constants/config';
import { LogInfoRelatedEventComponent } from '../components/log-info-related-event/log-info-related-event.component';
import { WrongScoreInfoComponent } from './wrong-score-info/wrong-score-info.component';
import { FilterTimeWithAllowanceComponent } from '../event-red-card/filter-time-with-allowance/filter-time-with-allowance.component';

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
    eventDate: new Date()
  }] as WrongScoreModel[];
  static readonly fakeIssueTypes = new IssueTypes();
}

describe('EventWrongScoreComponent', () => {
  let component: EventWrongScoreComponent;
  let fixture: ComponentFixture<EventWrongScoreComponent>;
  let validationService: ValidationService;
  let eventWrongScoreService: EventWrongScoreService;
  let wrongScoreService: WrongScoreService;
  let relatedEventService: RelatedEventService;
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
    relatedEventService = fixture.debugElement.injector.get(RelatedEventService);
    editRequestService = fixture.debugElement.injector.get(EditRequestService);
    addRequestStore = fixture.debugElement.injector.get(AddRequestStore);
    component = fixture.componentInstance;
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
    component.mainEvent = Helper.fakeWrongScoreModel[0];
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
  });

  it('should handle search event with validation', async () => {
    // Arrange
    component.eventLeagueComponent = {} as EventLeagueComponent;
    component.filterWrongScoreComponent = {} as FilterWrongScoreComponent;
    component.tvDetectionComponent = {} as TvDetectionComponent;
    const logInfoRelatedEventComponent = {
      filterTimeWithAllowanceComponent: {} as FilterTimeWithAllowanceComponent
    } as LogInfoRelatedEventComponent;
    logInfoRelatedEventComponent.filterTimeWithAllowanceComponent.updateData = jest.fn();
    logInfoRelatedEventComponent.showValidationDetail = jest.fn();
    component.logInfoComponents = new QueryList<LogInfoRelatedEventComponent>();
    component.logInfoComponents.reset([logInfoRelatedEventComponent]);
    const wrongScoreInfoComponent = {
      filter: Helper.fakeFilterModel,
      wrongScoreModel: Helper.fakeWrongScoreModel[0]
    } as WrongScoreInfoComponent;
    component.wrongScoreInfoComponents = new QueryList<WrongScoreInfoComponent>();
    component.wrongScoreInfoComponents.reset([wrongScoreInfoComponent]);
    validationService.validateCommonData = jest.fn().mockReturnValue(true);
    validationService.isValidAllSubIssueType = jest.fn().mockReturnValue(true);
    component.primitiveProps.filterBy = TVSRequestFilterBy.CHECK_TIME;
    component.wrongScoreModels = [];
    wrongScoreService.createMainWrongScoreModel = jest.fn().mockReturnValue({});
    relatedEventService.getGetInfoChildMatch = jest.fn().mockResolvedValue([]);
    relatedEventService.getDataRelatedEventWhenSearch = jest.fn().mockResolvedValue(undefined);
    eventWrongScoreService.isHasRelatedEvent = jest.fn().mockReturnValue(true);
    component.mainEvent = Helper.fakeWrongScoreModel[0];
    component.filter = Helper.fakeFilterModel;

    // Act
    await component.handleSearchEvent();

    // Assert
    expect(validationService.validateCommonData).toHaveBeenCalled();
    expect(wrongScoreService.createMainWrongScoreModel).toHaveBeenCalled();
    expect(relatedEventService.getGetInfoChildMatch).toHaveBeenCalled();
    expect(relatedEventService.getDataRelatedEventWhenSearch).toHaveBeenCalled();
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
  });

  it('should reset data', () => {
    // Act
    component.resetData();

    // Assert
    expect(component.wrongScoreModels).toEqual([]);
    expect(component.primitiveProps.isShowActualScore).toBeFalsy();
    expect(component.primitiveProps.actualScore).toBe('');
    expect(component.relatedEvents).toEqual([]);
    expect(component.childEvents).toEqual([]);
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
      { isChecked: false, isMainMatch: true }
    ] as WrongScoreModel[];

    // Act
    const result = component.getSelectedWrongScores(wrongScoreModels);

    // Assert
    expect(result.length).toBe(2);
    expect(result[0].isChecked).toBeTruthy();
    expect(result[1].isMainMatch).toBeTruthy();
  });

  it('should update status button save request', () => {
    // Arrange
    component.wrongScoreModels = [
      { isChecked: false },
      { isChecked: false }
    ] as WrongScoreModel[];
    addRequestStore.changeSavingRequestStatus = jest.fn();

    // Act
    component.updateStatusButtonSaveRequest();

    // Assert
    expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
  });
});

