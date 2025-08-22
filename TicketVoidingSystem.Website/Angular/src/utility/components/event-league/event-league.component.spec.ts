import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';
import { EventLeagueComponent } from './event-league.component';
import { ValidationService } from './validation.service';
import { CommonService } from '../../../utility/services/common.service';
import { AddRequestStore } from '../../../add-request/app/add-request/add-request.store';
import { MatchModel } from '../../../utility/models/match.model';
import { SimpleChange } from '@angular/core';
import { TEXT } from '../../../utility/constants/text';

class Helper {
  static readonly fakeMatchId = 123;
  static readonly fakeMatch: MatchModel = {
    matchId: 123,
    sportType: 1,
    isMainMatch: true,
    eventDate: new Date(),
    subtype: '1'
  } as unknown as MatchModel;
}

describe('EventLeagueComponent', () => {
  let component: EventLeagueComponent;
  let fixture: ComponentFixture<EventLeagueComponent>;
  let validationService: ValidationService;
  let commonService: CommonService;
  let addRequestStore: AddRequestStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ValidationService,
        CommonService,
        AddRequestStore
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventLeagueComponent);
    validationService = fixture.debugElement.injector.get(ValidationService);
    commonService = fixture.debugElement.injector.get(CommonService);
    addRequestStore = fixture.debugElement.injector.get(AddRequestStore);
    component = fixture.componentInstance;
    component.changeEvent.emit = jest.fn();
    
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.selectedMatch).toBeInstanceOf(MatchModel);
    expect(component.matches).toBeUndefined();
    expect(component.isBlock).toBeFalsy();
    expect(component.validationMessage).toBeUndefined();
  });

  it('should get match info when in edit mode', async () => {
    // Arrange
    component.isEdit = true;
    component.matchId = Helper.fakeMatchId;
    commonService.getMatchInfoAddRequestTvs = jest.fn().mockResolvedValue({
      errorCode: 0,
      match: Helper.fakeMatch
    });

    // Act
    await component.ngOnChanges({
      matchId: {
        currentValue: Helper.fakeMatchId,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });

    // Assert
    expect(commonService.getMatchInfoAddRequestTvs).toHaveBeenCalledWith(Helper.fakeMatchId);
    expect(component.matches).toEqual([Helper.fakeMatch]);
    expect(component.selectedMatch).toEqual(Helper.fakeMatch);
  });

  it('should handle search match with valid match ID', async () => {
    // Arrange
    const keyword = { term: '123' };
    commonService.getMatchInfoAddRequestTvs = jest.fn().mockResolvedValue({
      errorCode: 0,
      match: Helper.fakeMatch
    });

    // Act
    component.onSearchMatch(keyword);
    await new Promise(resolve => setTimeout(resolve, 400)); // Wait for timer

    // Assert
    expect(commonService.getMatchInfoAddRequestTvs).toHaveBeenCalledWith(123);
    expect(component.matches).toEqual([Helper.fakeMatch]);
    expect(component.validationMessage).toBeUndefined();
  });

  it('should handle search match with invalid match ID', async () => {
    // Arrange
    const keyword = { term: 'abc' };
    component.matches = [];

    // Act
    component.onSearchMatch(keyword);
    await new Promise(resolve => setTimeout(resolve, 400)); // Wait for timer

    // Assert
    expect(component.matches).toEqual([]);
    expect(component.validationMessage).toBe(TEXT.INVALID_MATCHID);
  });

  it('should handle search match with empty term', async () => {
    // Arrange
    const keyword = { term: '' };
    component.validationMessage = '';

    // Act
    await component.onSearchMatch(keyword);

    // Assert
    expect(component.validationMessage).toBe('');
  });

  it('should handle match event change', () => {
    // Arrange
    const match = Helper.fakeMatch;
    addRequestStore.changeStartTimeFilterAnalysis = jest.fn();

    // Act
    component.onChangeMatchEvent(match);

    // Assert
    expect(component.selectedMatch).toEqual(match);
    expect(addRequestStore.changeStartTimeFilterAnalysis).toHaveBeenCalled();
    expect(component.changeEvent.emit).toHaveBeenCalledWith(match);
  });

  it('should validate match ID', () => {
    // Arrange
    component.selectedMatch = new MatchModel();
    component.tooltip.display = jest.fn();

    // Act
    const result = component.isMatchIdValid();

    // Assert
    expect(result).toBeFalsy();
    expect(component.tooltip.display).toHaveBeenCalledWith('match-id', TEXT.REQUIRED_MATCHID);
  });

  it('should update info with only one match', () => {
    // Arrange
    const match = Helper.fakeMatch;

    // Act
    component.updateInfoWithOnlyOneMatch(match);

    // Assert
    expect(component.matches).toEqual([match]);
    expect(component.selectedMatch).toEqual(match);
  });

  it('should update undefined match and league', () => {
    // Act
    component.updateUndefinedMatchAndLeague();

    // Assert
    expect(component.matches).toEqual([]);
    expect(component.selectedMatch).toBeInstanceOf(MatchModel);
  });

  it('should check valid sub type', () => {
    // Arrange
    component.selectedMatch = Helper.fakeMatch;
    component.subIssueTypeId = '1';
    validationService.checkValidSubType = jest.fn().mockReturnValue(true);

    // Act
    const result = component.isValidSubType();

    // Assert
    expect(result).toBeTruthy();
    expect(validationService.checkValidSubType).toHaveBeenCalledWith('1', Helper.fakeMatch.subtype);
  });
}); 