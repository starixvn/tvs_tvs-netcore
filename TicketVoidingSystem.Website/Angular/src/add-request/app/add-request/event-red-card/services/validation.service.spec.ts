import { QueryList } from '@angular/core';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { AddRequestStore } from '../../add-request.store';
import { TvDetectionComponent } from '../../components/tv-detection/tv-detection.component';
import { FilterModel } from '../../filter/filter.model';
import { ValidationMessage } from '../../models/get-log-info.model';
import { FilterTimeAreaComponent } from '../filter-time-area/filter-time-area.component';
import { FilterTimeWithAllowanceComponent } from '../filter-time-with-allowance/filter-time-with-allowance.component';
import { LogInfoRelatedEventComponent } from '../../components/log-info-related-event/log-info-related-event.component';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
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
  static readonly fakeLogInfoRedCard: LogInfoRelatedEvent = {
    matchId: 1111,
    isMainMatch: true,
    eventName: '',
    leagueName: '',
    subIssueTypeId: 7,
    voidTimeArea: null,
    logInfoDetail: null,
    messageValidationLogInfo: [Helper.fakeValidationMessageNotError],
    sportType: 0
  } as LogInfoRelatedEvent;
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
    const logInfoRedCard = new LogInfoRelatedEvent();
    logInfoRedCard.voidTimeArea.aaTime = 1;
    logInfoRedCard.voidTimeArea.paTime = 1;
    logInfoRedCard.voidTimeArea.saTime = 1;

    // Action
    const result = validationService.isHasAllowanceTime(logInfoRedCard);

    // Assert
    expect(result).toBeTruthy();
  });

  it('#isAllEventsValid should return false when has not event isEventMatchValid', async () => {
    // Arrange
    validationService.isEventMatchValid = jest.fn().mockReturnValue(false);

    // Action
    const result = validationService.isAllEventsValid([Helper.fakeLogInfoRedCard]);

    // Assert
    expect(result).toBeFalsy();
  });

  it('#isAllEventsValid should return true when has event isEventMatchValid', async () => {
    // Arrange
    validationService.isEventMatchValid = jest.fn().mockReturnValue(true);

    // Action
    const result = validationService.isAllEventsValid([Helper.fakeLogInfoRedCard]);

    // Assert
    expect(result).toBeTruthy();
  });

  it('#isValidInputRelatedEvent should return false when Invalid MatchId', async () => {
    // Arrange
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();

    // Action
    const result = validationService.isValidInputRelatedEvent(1111, '1', [Helper.fakeLogInfoRedCard], tooltip);

    // Assert
    expect(result).toBeFalsy();
    expect(tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('#isValidInputRelatedEvent should return false when Invalid MatchId', async () => {
    // Arrange
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();

    // Action
    const result = validationService.isValidInputRelatedEvent(1111, '1', [Helper.fakeLogInfoRedCard], tooltip);

    // Assert
    expect(result).toBeFalsy();
    expect(tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('#isValidInputRelatedEvent should return true when MatchId is Valid', async () => {
    // Arrange

    // Action
    const result = validationService.isValidInputRelatedEvent(1, '1', [Helper.fakeLogInfoRedCard], null);

    // Assert
    expect(result).toBeTruthy();
  });

  it('#isValidInputRelatedEvent should return true when MatchId already exists in the list', async () => {
    // Arrange
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const fackRelatedEvent: LogInfoRelatedEvent = {
      matchId: 1,
      isMainMatch: false,
      eventName: '',
      leagueName: '',
      subIssueTypeId: 7,
      voidTimeArea: null,
      logInfoDetail: null,
      messageValidationLogInfo: [Helper.fakeValidationMessageNotError],
      sportType: 0
    } as LogInfoRelatedEvent;

    // Action
    const result = validationService.isValidInputRelatedEvent(1, '1', [Helper.fakeLogInfoRedCard, fackRelatedEvent], tooltip);

    // Assert
    expect(result).toBeFalsy();
    expect(tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('#isHasAllowanceTime should return true when allowance time and is zero', async () => {
    // Arrange
    const logInfoRedCard = new LogInfoRelatedEvent();
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
    const logInfoRedCard = new LogInfoRelatedEvent();
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
    mockTvDetection.isValid = jest.fn().mockReturnValue(true);

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
    mockTvDetection.isValid = jest.fn().mockReturnValue(true);

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
    mockTvDetection.isValid = jest.fn().mockReturnValue(true);

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
    const LogInfoRelatedEventComponent = new LogInfoRelatedEventComponent(null, null);
    LogInfoRelatedEventComponent.filterTimeWithAllowanceComponent = new FilterTimeWithAllowanceComponent(null);
    LogInfoRelatedEventComponent.filterTimeWithAllowanceComponent.isValid = jest.fn();
    LogInfoRelatedEventComponent.showValidationDetail = jest.fn();
    const logInfoComponents = new QueryList<LogInfoRelatedEventComponent>();
    logInfoComponents.reset([...logInfoComponents.toArray(), LogInfoRelatedEventComponent]);
    const mockTvDetection = new TvDetectionComponent(null, null);
    mockTvDetection.isValid = jest.fn().mockReturnValue(true);

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
    const LogInfoRelatedEventComponent = new LogInfoRelatedEventComponent(null, null);
    LogInfoRelatedEventComponent.filterTimeWithAllowanceComponent = new FilterTimeWithAllowanceComponent(null);
    LogInfoRelatedEventComponent.filterTimeWithAllowanceComponent.isValid = jest.fn().mockImplementation(() => true);
    LogInfoRelatedEventComponent.showValidationDetail = jest.fn();
    const logInfoComponents = new QueryList<LogInfoRelatedEventComponent>();
    logInfoComponents.reset([...logInfoComponents.toArray(), LogInfoRelatedEventComponent]);
    const mockTvDetection = new TvDetectionComponent(null, null);
    mockTvDetection.isValid = jest.fn().mockReturnValue(true);

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
    const result = validationService.isEventMatchValid(event);

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
    const result = validationService.isEventMatchValid(event);

    // Assert
    expect(result).toBe(false);
  });

  it('#isEventMatchValid should return true', async () => {
    // Arrange
    const event = Helper.fakeLogInfoRedCard;
    event.isMainMatch = false;
    event.messageValidationLogInfo = [Helper.fakeValidationMessageNotError];

    // Action
    const result = validationService.isEventMatchValid(event);

    // Assert
    expect(result).toBeTruthy();
  });

  it('#isEditingByAnotherUser should return true', async () => {
    const result = validationService.isEditingByAnotherUser(true, 1, 2);

    // Assert
    expect(result).toBeTruthy();
  });
});