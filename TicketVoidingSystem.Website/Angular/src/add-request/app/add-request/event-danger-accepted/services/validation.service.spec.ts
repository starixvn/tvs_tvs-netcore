import { QueryList } from '@angular/core';
import * as _ from 'lodash';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { AddRequestStore } from '../../add-request.store';
import { TvDetectionComponent } from '../../components/tv-detection/tv-detection.component';
import { FilterTimeAreaComponent } from '../../event-red-card/filter-time-area/filter-time-area.component';
import { FilterTimeWithAllowanceComponent } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.component';
import { LogInfoRedCardComponent } from '../../event-red-card/log-info-red-card/log-info-red-card.component';
import { LogInfoRedCard } from '../../event-red-card/log-info-red-card/log-info-red-card.model';
import { FilterModel } from '../../filter/filter.model';
import { ValidationMessage } from '../../models/get-log-info.model';
import { ValidationService } from './validation.service';

class Helper {
  static readonly fakeValidationMessageError: ValidationMessage = {
    isError: true,
    reason: '',
    isShowPopup: true,
    transIds: '',
    requestId: 1,
  };
  static readonly fakeValidationMessageNotError: ValidationMessage = {
    isError: false,
    reason: '',
    isShowPopup: true,
    transIds: '',
    requestId: 1,
  };
  static readonly fakeLogInfoRedCard: LogInfoRedCard = {
    matchId: 1111,
    isMainMatch: true,
    eventName: '',
    leagueName: '',
    subIssueTypeId: 7,
    voidTimeArea: null,
    logInfoDetail: null,
    messageValidationLogInfo: [Helper.fakeValidationMessageNotError],
    sportType: 0
  } as LogInfoRedCard;
}

describe('ValidationService', () => {
  let validationService: ValidationService;
  let mockAddRequestStore: AddRequestStore;

  beforeEach(() => {
    validationService = new ValidationService();
    mockAddRequestStore = new AddRequestStore() as jest.Mocked<AddRequestStore>;
    mockAddRequestStore.checkValidSubIssueTypeInFilter = jest.fn();
  });

  it('#isHasAllowanceTime should return true when has allowance time and is not zero', async () => {
    // Arrange
    const logInfoRedCard = new LogInfoRedCard();
    logInfoRedCard.voidTimeArea.aaTime = 1;
    logInfoRedCard.voidTimeArea.paTime = 1;
    logInfoRedCard.voidTimeArea.saTime = 1;

    // Action
    const result = validationService.isHasAllowanceTime(logInfoRedCard);

    // Assert
    expect(result).toBeTruthy();
  });

  it('#isHasAllowanceTime should return true when allowance time and is zero', async () => {
    // Arrange
    const logInfoRedCard = new LogInfoRedCard();
    logInfoRedCard.voidTimeArea.aaTime = 0;
    logInfoRedCard.voidTimeArea.paTime = 0;
    logInfoRedCard.voidTimeArea.saTime = 0;

    // Action
    const result = validationService.isHasAllowanceTime(logInfoRedCard);

    // Assert
    expect(result).toBeTruthy();
  });

  it('#isHasAllowanceTime should return true when allowance time is null', async () => {
    // Arrange
    const logInfoRedCard = new LogInfoRedCard();
    logInfoRedCard.voidTimeArea.aaTime = null;
    logInfoRedCard.voidTimeArea.paTime = null;
    logInfoRedCard.voidTimeArea.saTime = null;

    // Action
    const result = validationService.isHasAllowanceTime(logInfoRedCard);

    // Assert
    expect(result).toBe(false);
  });

  it('#validateCommonData should return undefined when has not subIssueTypeId', async () => {
    // Arrange
    const filterModel = new FilterModel();
    filterModel.subIssueTypeId = undefined;
    const mockTvDetection = new TvDetectionComponent(null, null);
    mockTvDetection.isValidality = jest.fn().mockReturnValue(true);

    // Action
    const result = validationService.validateCommonData(filterModel, null, null, null, mockAddRequestStore, mockTvDetection);

    // Assert
    expect(result).toBeUndefined();
  });

  it('#validateCommonData should return false when #eventLeagueComponent.isMatchIdValid return false', async () => {
    // Arrange
    const filterModel = new FilterModel();
    filterModel.subIssueTypeId = '1';
    const eventLeagueComponent = new EventLeagueComponent(null, null, null);
    const spyIsMatchIdValid = jest.spyOn(eventLeagueComponent, 'isMatchIdValid').mockImplementation(() => false);
    const mockTvDetection = new TvDetectionComponent(null, null);
    mockTvDetection.isValidality = jest.fn().mockReturnValue(true);

    // Action
    const result = validationService.validateCommonData(filterModel, eventLeagueComponent, null, null, mockAddRequestStore, mockTvDetection);

    // Assert
    expect(spyIsMatchIdValid).toHaveBeenCalledTimes(1);
    expect(result).toBe(false);
  });

  it('#validateCommonData should return false when #filterTimeAreaComponent.isValid return false', async () => {
    // Arrange
    const filterModel = new FilterModel();
    filterModel.subIssueTypeId = '1';
    const eventLeagueComponent = new EventLeagueComponent(null, null, null);
    const spyeventLeagueComponentIsMatchIdValid = jest.spyOn(eventLeagueComponent, 'isMatchIdValid').mockImplementation(() => true);
    const filterTimeAreaComponent = new FilterTimeAreaComponent(null, null);
    const spyFilterTimeAreaComponentIsValid = jest.spyOn(filterTimeAreaComponent, 'isValid').mockImplementation(() => false);
    const mockTvDetection = new TvDetectionComponent(null, null);
    mockTvDetection.isValidality = jest.fn().mockReturnValue(true);

    // Action
    const result = validationService.validateCommonData(filterModel, eventLeagueComponent, filterTimeAreaComponent, null, mockAddRequestStore, mockTvDetection);

    // Assert
    expect(spyeventLeagueComponentIsMatchIdValid).toHaveBeenCalledTimes(1);
    expect(spyFilterTimeAreaComponentIsValid).toHaveBeenCalledTimes(1);
    expect(result).toBe(false);
  });

  it('#validateCommonData should return false when #filterTimeWithAllowanceComponent.isValid() return false', async () => {
    // Arrange
    const filterModel = new FilterModel();
    filterModel.subIssueTypeId = '1';
    const eventLeagueComponent = new EventLeagueComponent(null, null, null);
    const spyeventLeagueComponentIsMatchIdValid = jest.spyOn(eventLeagueComponent, 'isMatchIdValid').mockImplementation(() => true);
    const filterTimeAreaComponent = new FilterTimeAreaComponent(null, null);
    const spyFilterTimeAreaComponentIsValid = jest.spyOn(filterTimeAreaComponent, 'isValid').mockImplementation(() => true);
    const logInfoRedCardComponent = new LogInfoRedCardComponent(null, null);
    logInfoRedCardComponent.filterTimeWithAllowanceComponent = new FilterTimeWithAllowanceComponent(null);
    logInfoRedCardComponent.filterTimeWithAllowanceComponent.isValid = jest.fn();
    logInfoRedCardComponent.showValidationDetail = jest.fn();
    const logInfoComponents = new QueryList<LogInfoRedCardComponent>();
    logInfoComponents.reset([...logInfoComponents.toArray(), logInfoRedCardComponent]);
    const mockTvDetection = new TvDetectionComponent(null, null);
    mockTvDetection.isValidality = jest.fn().mockReturnValue(true);

    // Action
    const result = validationService.validateCommonData(filterModel, eventLeagueComponent, filterTimeAreaComponent, logInfoComponents, mockAddRequestStore, mockTvDetection);

    // Assert
    expect(spyeventLeagueComponentIsMatchIdValid).toHaveBeenCalledTimes(1);
    expect(spyFilterTimeAreaComponentIsValid).toHaveBeenCalledTimes(1);
    expect(result).toBe(false);
  });

  it('#validateCommonData should return true', async () => {
    // Arrange
    const filterModel = new FilterModel();
    filterModel.subIssueTypeId = '1';
    const eventLeagueComponent = new EventLeagueComponent(null, null, null);
    const spyeventLeagueComponentIsMatchIdValid = jest.spyOn(eventLeagueComponent, 'isMatchIdValid').mockImplementation(() => true);
    const filterTimeAreaComponent = new FilterTimeAreaComponent(null, null);
    const spyFilterTimeAreaComponentIsValid = jest.spyOn(filterTimeAreaComponent, 'isValid').mockImplementation(() => true);
    const logInfoRedCardComponent = new LogInfoRedCardComponent(null, null);
    logInfoRedCardComponent.filterTimeWithAllowanceComponent = new FilterTimeWithAllowanceComponent(null);
    logInfoRedCardComponent.filterTimeWithAllowanceComponent.isValid = jest.fn().mockImplementation(() => true);
    logInfoRedCardComponent.showValidationDetail = jest.fn();
    const logInfoComponents = new QueryList<LogInfoRedCardComponent>();
    logInfoComponents.reset([...logInfoComponents.toArray(), logInfoRedCardComponent]);
    const mockTvDetection = new TvDetectionComponent(null, null);
    mockTvDetection.isValidality = jest.fn().mockReturnValue(true);

    // Action
    const result = validationService.validateCommonData(filterModel, eventLeagueComponent, filterTimeAreaComponent, logInfoComponents, mockAddRequestStore, mockTvDetection);

    // Assert
    expect(spyeventLeagueComponentIsMatchIdValid).toHaveBeenCalledTimes(1);
    expect(spyFilterTimeAreaComponentIsValid).toHaveBeenCalledTimes(1);
    expect(result).toBeTruthy();
  });

  it('#isEventMatchValid should return false when mainMatch has error', async () => {
    // Arrange
    const event = Helper.fakeLogInfoRedCard;
    event.isMainMatch = true;
    event.messageValidationLogInfo = [Helper.fakeValidationMessageError];

    // Action
    const result = validationService.isAllEventsValid([event]);

    // Assert
    expect(result).toBe(false);
  });

  it('#isEventMatchValid should return false when is not mainMatch and has error NO_VALID_TICKETS_IN_RANGE', async () => {
    // Arrange
    const event = Helper.fakeLogInfoRedCard;
    event.isMainMatch = false;
    event.messageValidationLogInfo = [Helper.fakeValidationMessageError];
    event.messageValidationLogInfo[0].reason = '';

    // Action
    const result = validationService.isAllEventsValid([event]);

    // Assert
    expect(result).toBe(false);
  });

  it('#isEventMatchValid should return true', async () => {
    // Arrange
    const event = Helper.fakeLogInfoRedCard;
    event.isMainMatch = false;
    event.messageValidationLogInfo = [Helper.fakeValidationMessageNotError];

    // Action
    const result = validationService.isAllEventsValid([event]);

    // Assert
    expect(result).toBeTruthy();
  });

  it('#isValidInputRelatedEvent should return false', async () => {
    // Arrange
    const event = _.cloneDeep(Helper.fakeLogInfoRedCard);
    event.isMainMatch = true;
    const toolTip = new Tooltip();
    toolTip.display = jest.fn();

    // Action
    const result = validationService.isValidInputRelatedEvent(1111, '', [event], toolTip);

    // Assert
    expect(result).toBe(false);
    expect(toolTip.display).toHaveBeenCalledTimes(1);
  });

  it('#isValidInputRelatedEvent should return false', async () => {
    // Arrange
    const mainEvent = _.cloneDeep(Helper.fakeLogInfoRedCard);
    mainEvent.isMainMatch = true;
    const event = new LogInfoRedCard();
    event.matchId = 999;
    const events = [];
    events.push(event);
    events.push(mainEvent);
    const toolTip = new Tooltip();
    toolTip.display = jest.fn();

    // Action
    const result = validationService.isValidInputRelatedEvent(999, '', events, toolTip);

    // Assert
    expect(result).toBe(false);
    expect(toolTip.display).toHaveBeenCalledTimes(1);
  });

  it('#isValidInputRelatedEvent should return true', async () => {
    // Arrange
    const event = _.cloneDeep(Helper.fakeLogInfoRedCard);
    event.isMainMatch = true;
    const toolTip = new Tooltip();
    toolTip.display = jest.fn();

    // Action
    const result = validationService.isValidInputRelatedEvent(9999, '', [event], toolTip);

    // Assert
    expect(result).toBe(true);
  });

  it('#isEditingByAnotherUser should return true', async () => {
    const result = validationService.isEditingByAnotherUser(true, 1, 2);

    expect(result).toBe(true);
  });
});