import { TestBed } from '@angular/core/testing';
import { CreateMapService } from './create-map.service';
import { ValidationService } from './validation.service';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { ChildMatchModel } from '../../models/related-event.model';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { WrongScoreModel } from '../../models/event-wrong-score.model';
import { SaveRequestArg } from '../models/save-request.model';
import { AddRelatedEventArg } from '../models/add-related-event.model';
import { ValidationBusinessRuleArgs } from '../models/validation.model';
import { TVSRequestFilterBy } from '../../../../../utility/constants/config';
import { PrimitiveProperty } from '../event-wrong-score.model';
import { LogInfoDetail } from 'src/utility/models/log-info-detail.model';

// Mock the JSON config
jest.mock('../../filter/sub-issue-type-dialog/sub-type-wrong-score.json', () => ([
  {
    groups: [
      {
        aa: '10',
        pa: '20',
        sa: '30',
        buttonSelectAll: [
          { subIssueTypeId: 1 },
          { subIssueTypeId: 2 }
        ],
        buttonSelectHomeAway: [
          { subIssueTypeId: 3 },
          { subIssueTypeId: 4 }
        ]
      },
      {
        aa: '15',
        pa: '25',
        sa: '35',
        buttonSelectAll: [
          { subIssueTypeId: 5 }
        ],
        buttonSelectHomeAway: [
          { subIssueTypeId: 6 }
        ]
      }
    ]
  }
]));

class Helper {
  static readonly fakeMatchId = 12345;
  static readonly fakeSubIssueTypeId = 1;

  static getFakeChildMatchModel(): ChildMatchModel {
    const model = new ChildMatchModel();
    model.matchId = Helper.fakeMatchId;
    model.matchCode = 'TEST001';
    model.leagueName = 'Test League';
    model.matchEvent = 'Test Event';
    model.eventDate = new Date('2024-03-20T10:00:00');
    model.sportType = 1;
    model.isChecked = false;
    model.matchType = 1;
    return model;
  }

  static getFakeFilterTimeWithAllowance(): FilterTimeWithAllowance {
    const filterTime = new FilterTimeWithAllowance();
    filterTime.fromDateTime = '2024-03-20T10:00:00';
    filterTime.toDateTime = '2024-03-20T11:00:00';
    filterTime.aaTime = 10;
    filterTime.paTime = 20;
    filterTime.saTime = 30;
    return filterTime;
  }

  static getFakeLogInfoRelatedEvent(): LogInfoRelatedEvent {
    const event = new LogInfoRelatedEvent();
    event.matchId = Helper.fakeMatchId;
    event.matchCode = 'TEST001';
    event.leagueName = 'Test League';
    event.eventName = 'Test Event';
    event.eventDate = new Date('2024-03-20T10:00:00');
    event.sportType = 1;
    event.isMainMatch = false;
    event.subIssueTypeId = Helper.fakeSubIssueTypeId;
    event.voidTimeArea = Helper.getFakeFilterTimeWithAllowance();
    return event;
  }

  static getFakeWrongScoreModel(): WrongScoreModel {
    const model = new WrongScoreModel();
    model.matchId = Helper.fakeMatchId;
    model.subIssueTypeId = Helper.fakeSubIssueTypeId;
    model.filterBy = TVSRequestFilterBy.CHECK_TIME;
    model.isMainMatch = false;
    model.filterFromTransTime = '2024-03-20T10:00:00';
    model.filterToTransTime = '2024-03-20T11:00:00';
    model.aaTime = 10;
    model.paTime = 20;
    model.saTime = 30;
    model.voidFromTime = '2024-03-20T10:00:00';
    model.voidToTime = '2024-03-20T11:00:00';
    model.actualScore = '1-0';
    model.isCheckedVar = false;
    model.eventDate = new Date('2024-03-20T10:00:00');
    model.sportType = 1;
    return model;
  }

  static getFakePrimitiveProperty(): PrimitiveProperty {
    const primitiveProps = new PrimitiveProperty();
    primitiveProps.filterBy = TVSRequestFilterBy.CHECK_TIME;
    primitiveProps.isBlock = false;
    primitiveProps.actualScore = '1-0';
    primitiveProps.isShowActualScore = false;
    primitiveProps.isCheckedVar = false;
    primitiveProps.isHighLightVarCheck = false;
    primitiveProps.isShowRelatedEvents = false;
    return primitiveProps;
  }

  static getFakeSaveRequestArg(): SaveRequestArg {
    return {
      primitiveProps: Helper.getFakePrimitiveProperty(),
      filter: { subIssueTypeId: Helper.fakeSubIssueTypeId },
      tvDetectionModel: {
        actualTime: '2024-03-20T10:00:00',
        minuteOffset: 5,
        secondOffset: 30,
        serviceAcceptTime: '2024-03-20T10:05:30',
        tvDetectionValue: 'test-value'
      },
      defaultFilterTimeWithAllowance: Helper.getFakeFilterTimeWithAllowance()
    } as unknown as SaveRequestArg;
  }

  static getFakeAddRelatedEventArg(): AddRelatedEventArg {
    return {
      isEdit: false,
      requestId: 1,
      filter: { subIssueTypeId: Helper.fakeSubIssueTypeId },
      primitiveProps: Helper.getFakePrimitiveProperty(),
      mainEvent: Helper.getFakeWrongScoreModel(),
      relatedEvents: [Helper.getFakeLogInfoRelatedEvent()],
      defaultFilterTimeWithAllowance: Helper.getFakeFilterTimeWithAllowance()
    } as unknown as AddRelatedEventArg;
  }

  static getFakeValidationBusinessRuleArgs(): ValidationBusinessRuleArgs {
    return {
      isEdit: true,
      requestId: 2,
      filter: { subIssueTypeId: Helper.fakeSubIssueTypeId },
      primitiveProps: Helper.getFakePrimitiveProperty(),
      mainEvent: Helper.getFakeWrongScoreModel(),
      relatedEvents: [Helper.getFakeLogInfoRelatedEvent()],
      defaultFilterTimeWithAllowance: Helper.getFakeFilterTimeWithAllowance()
    } as unknown as ValidationBusinessRuleArgs;
  }
}

describe('CreateMapService', () => {
  let service: CreateMapService;
  let validationService: jest.Mocked<ValidationService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CreateMapService,
        { provide: ValidationService, useValue: {
          isHasAllowanceTime: jest.fn(),
          isHasAllowanceTimeWrongScoreModel: jest.fn()
        } }
      ]
    });

    service = TestBed.inject(CreateMapService);
    validationService = TestBed.inject(ValidationService) as jest.Mocked<ValidationService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createNewLogInfoRelatedEvent', () => {
    it('should create new LogInfoRelatedEvent with correct properties', () => {
      // Arrange
      const childEvent = Helper.getFakeChildMatchModel();
      const defaultFilterTimeWithAllowance = Helper.getFakeFilterTimeWithAllowance();
      const subIssueTypeId = Helper.fakeSubIssueTypeId;

      // Act
      const result = service.createNewLogInfoRelatedEvent(childEvent, defaultFilterTimeWithAllowance, subIssueTypeId);

      // Assert
      expect(result).toBeInstanceOf(LogInfoRelatedEvent);
      expect(result.matchId).toBe(childEvent.matchId);
      expect(result.subIssueTypeId).toBe(subIssueTypeId);
      expect(result.matchCode).toBe(childEvent.matchCode);
      expect(result.leagueName).toBe(childEvent.leagueName);
      expect(result.eventName).toBe(`${childEvent.matchId} - ${childEvent.matchEvent}`);
      expect(result.sportType).toBe(childEvent.sportType);
      expect(result.eventDate).toBe(childEvent.eventDate);
      expect(result.isMainMatch).toBe(false);
      expect(result.voidTimeArea).toBeInstanceOf(FilterTimeWithAllowance);
      expect(result.voidTimeArea.fromDateTime).toBe(defaultFilterTimeWithAllowance.fromDateTime);
      expect(result.voidTimeArea.toDateTime).toBe(defaultFilterTimeWithAllowance.toDateTime);
      expect(result.voidTimeArea.aaTime).toBe(10); // From mock config
      expect(result.voidTimeArea.paTime).toBe(20); // From mock config
      expect(result.voidTimeArea.saTime).toBe(30); // From mock config
    });

    it('should handle different subIssueTypeId and get correct allowance times', () => {
      // Arrange
      const childEvent = Helper.getFakeChildMatchModel();
      const defaultFilterTimeWithAllowance = Helper.getFakeFilterTimeWithAllowance();
      const subIssueTypeId = 5; // Different subIssueTypeId

      // Act
      const result = service.createNewLogInfoRelatedEvent(childEvent, defaultFilterTimeWithAllowance, subIssueTypeId);

      // Assert
      expect(result.voidTimeArea.aaTime).toBe(15); // From second group in mock config
      expect(result.voidTimeArea.paTime).toBe(25);
      expect(result.voidTimeArea.saTime).toBe(35);
    });

    it('should handle subIssueTypeId not found in config', () => {
      // Arrange
      const childEvent = Helper.getFakeChildMatchModel();
      const defaultFilterTimeWithAllowance = Helper.getFakeFilterTimeWithAllowance();
      const subIssueTypeId = 999; // Non-existent subIssueTypeId

      // Act & Assert
      expect(() => {
        service.createNewLogInfoRelatedEvent(childEvent, defaultFilterTimeWithAllowance, subIssueTypeId);
      }).toThrow('Cannot read properties of null (reading \'aa\')');
    });
  });

  describe('mapRelatedEventToWrongScoreModel', () => {
    it('should map LogInfoRelatedEvent to WrongScoreModel correctly when isMainMatch is false', () => {
      // Arrange
      const logInfoRelatedEvent = Helper.getFakeLogInfoRelatedEvent();
      logInfoRelatedEvent.isMainMatch = false;
      logInfoRelatedEvent.logInfoDetail = {
        voidFromTime: new Date('2024-03-20T10:00:00'),
        voidToTime: new Date('2024-03-20T11:00:00')
      } as unknown as LogInfoDetail;
      const args = Helper.getFakeSaveRequestArg();
      validationService.isHasAllowanceTime.mockReturnValue(false);

      // Act
      const result = service.mapRelatedEventToWrongScoreModel(logInfoRelatedEvent, args);

      // Assert
      expect(result).toBeInstanceOf(WrongScoreModel);
      expect(result.matchId).toBe(logInfoRelatedEvent.matchId);
      expect(result.filterBy).toBe(args.primitiveProps.filterBy);
      expect(result.subIssueTypeId).toBe(logInfoRelatedEvent.subIssueTypeId);
      expect(result.logInfoDetail).toBe(logInfoRelatedEvent.logInfoDetail);
      expect(result.isMainMatch).toBe(logInfoRelatedEvent.isMainMatch);
      expect(result.filterFromTransTime).toBe(logInfoRelatedEvent.voidTimeArea.fromDateTime);
      expect(result.filterToTransTime).toBe(logInfoRelatedEvent.voidTimeArea.toDateTime);
      expect(result.aaTime).toBe(logInfoRelatedEvent.voidTimeArea.aaTime);
      expect(result.paTime).toBe(logInfoRelatedEvent.voidTimeArea.paTime);
      expect(result.saTime).toBe(logInfoRelatedEvent.voidTimeArea.saTime);
      expect(result.voidFromTime).toBe(logInfoRelatedEvent.logInfoDetail.voidFromTime.toString());
      expect(result.voidToTime).toBe(logInfoRelatedEvent.logInfoDetail.voidToTime.toString());
      expect(result.isChecked).toBe(true);
      expect(result.actualScore).toBe(args.primitiveProps.actualScore);
      expect(result.actualTime).toBe(args.tvDetectionModel.actualTime);
      expect(result.minuteOffset).toBe(args.tvDetectionModel.minuteOffset);
      expect(result.secondOffset).toBe(args.tvDetectionModel.secondOffset);
      expect(result.serviceAcceptTime).toBe(args.tvDetectionModel.serviceAcceptTime);
      expect(result.isCheckedVar).toBe(args.primitiveProps.isCheckedVar);
      expect(result.tvDetectionValue).toBe(args.tvDetectionModel.tvDetectionValue);
    });

    it('should use default filter time when isMainMatch is true', () => {
      // Arrange
      const logInfoRelatedEvent = Helper.getFakeLogInfoRelatedEvent();
      logInfoRelatedEvent.isMainMatch = true;
      logInfoRelatedEvent.logInfoDetail = {
        voidFromTime: new Date('2024-03-20T10:00:00'),
        voidToTime: new Date('2024-03-20T11:00:00')
      } as unknown as LogInfoDetail;
      const args = Helper.getFakeSaveRequestArg();
      validationService.isHasAllowanceTime.mockReturnValue(false);

      // Act
      const result = service.mapRelatedEventToWrongScoreModel(logInfoRelatedEvent, args);

      // Assert
      expect(result.filterFromTransTime).toBe(args.defaultFilterTimeWithAllowance.fromDateTime);
      expect(result.filterToTransTime).toBe(args.defaultFilterTimeWithAllowance.toDateTime);
      expect(result.aaTime).toBe(args.defaultFilterTimeWithAllowance.aaTime);
      expect(result.paTime).toBe(args.defaultFilterTimeWithAllowance.paTime);
      expect(result.saTime).toBe(args.defaultFilterTimeWithAllowance.saTime);
    });

    it('should use default filter time when has allowance time', () => {
      // Arrange
      const logInfoRelatedEvent = Helper.getFakeLogInfoRelatedEvent();
      logInfoRelatedEvent.isMainMatch = false;
      logInfoRelatedEvent.logInfoDetail = {
        voidFromTime: new Date('2024-03-20T10:00:00'),
        voidToTime: new Date('2024-03-20T11:00:00')
      } as unknown as LogInfoDetail;
      const args = Helper.getFakeSaveRequestArg();
      validationService.isHasAllowanceTime.mockReturnValue(true);

      // Act
      const result = service.mapRelatedEventToWrongScoreModel(logInfoRelatedEvent, args);

      // Assert
      expect(result.filterFromTransTime).toBe(args.defaultFilterTimeWithAllowance.fromDateTime);
      expect(result.filterToTransTime).toBe(args.defaultFilterTimeWithAllowance.toDateTime);
    });

    it('should handle null logInfoDetail', () => {
      // Arrange
      const logInfoRelatedEvent = Helper.getFakeLogInfoRelatedEvent();
      logInfoRelatedEvent.logInfoDetail = null;
      const args = Helper.getFakeSaveRequestArg();
      validationService.isHasAllowanceTime.mockReturnValue(false);

      // Act
      const result = service.mapRelatedEventToWrongScoreModel(logInfoRelatedEvent, args);

      // Assert
      expect(result.voidFromTime).toBeUndefined();
      expect(result.voidToTime).toBeUndefined();
    });
  });

  describe('mapWrongScoreSaveRequestModel', () => {
    it('should map WrongScoreModel with SaveRequestArg correctly', () => {
      // Arrange
      const wrongScoreModel = Helper.getFakeWrongScoreModel();
      const args = Helper.getFakeSaveRequestArg();

      // Act
      const result = service.mapWrongScoreSaveRequestModel(wrongScoreModel, args);

      // Assert
      expect(result).toBe(wrongScoreModel);
      expect(result.filterBy).toBe(args.primitiveProps.filterBy);
      expect(result.subIssueTypeId).toBe(Number(args.filter.subIssueTypeId));
      expect(result.isChecked).toBe(true);
      expect(result.actualScore).toBe(args.primitiveProps.actualScore);
      expect(result.isCheckedVar).toBe(args.primitiveProps.isCheckedVar);
    });

    it('should handle string subIssueTypeId in filter', () => {
      // Arrange
      const wrongScoreModel = Helper.getFakeWrongScoreModel();
      const args = Helper.getFakeSaveRequestArg();
      args.filter.subIssueTypeId = '5';

      // Act
      const result = service.mapWrongScoreSaveRequestModel(wrongScoreModel, args);

      // Assert
      expect(result.subIssueTypeId).toBe(5);
    });
  });

  describe('assignMainEvent', () => {
    it('should assign main event with allowance time correctly', () => {
      // Arrange
      const event = Helper.getFakeWrongScoreModel();
      validationService.isHasAllowanceTimeWrongScoreModel.mockReturnValue(true);

      // Act
      const result = service.assignMainEvent(event);

      // Assert
      expect(result).toEqual(expect.objectContaining({
        logInfoDetail: event.logInfoDetail,
        messageValidationLogInfo: event.messageValidationLogInfo,
        matchId: event.matchId,
        subIssueTypeId: event.subIssueTypeId,
        eventDate: event.eventDate,
        sportType: event.sportType
      }));
      expect(result.voidTimeArea).toBeInstanceOf(FilterTimeWithAllowance);
      expect(result.voidTimeArea.fromDateTime).toBe(event.voidFromTime);
      expect(result.voidTimeArea.toDateTime).toBe(event.voidToTime);
      expect(result.voidTimeArea.aaTime).toBe(event.aaTime);
      expect(result.voidTimeArea.paTime).toBe(event.paTime);
      expect(result.voidTimeArea.saTime).toBe(event.saTime);
    });

    it('should assign main event without allowance time correctly', () => {
      // Arrange
      const event = Helper.getFakeWrongScoreModel();
      validationService.isHasAllowanceTimeWrongScoreModel.mockReturnValue(false);

      // Act
      const result = service.assignMainEvent(event);

      // Assert
      expect(result.voidTimeArea.fromDateTime).toBe(event.filterFromTransTime);
      expect(result.voidTimeArea.toDateTime).toBe(event.filterToTransTime);
    });
  });

  describe('createGetLogInfoParams', () => {
    it('should create GetLogInfoParams from AddRelatedEventArg', () => {
      // Arrange
      const args = Helper.getFakeAddRelatedEventArg();

      // Act
      const result = service.createGetLogInfoParams(args);

      // Assert
      expect(result).toBeInstanceOf(Object);
      expect(result.isEdit).toBe(args.isEdit);
      expect(result.requestId).toBe(args.requestId);
      expect(result.filter).toBe(args.filter);
      expect(result.primitiveProps).toBe(args.primitiveProps);
      expect(result.wrongScoreModels).toEqual(undefined);
      expect(result.mainEvent).toBe(args.mainEvent);
      expect(result.relatedEvents).toBe(args.relatedEvents);
      expect(result.defaultFilterTimeWithAllowance).toBe(args.defaultFilterTimeWithAllowance);
    });

    it('should create GetLogInfoParams from ValidationBusinessRuleArgs', () => {
      // Arrange
      const args = Helper.getFakeValidationBusinessRuleArgs();

      // Act
      const result = service.createGetLogInfoParams(args);

      // Assert
      expect(result).toBeInstanceOf(Object);
      expect(result.isEdit).toBe(args.isEdit);
      expect(result.requestId).toBe(args.requestId);
      expect(result.filter).toBe(args.filter);
      expect(result.primitiveProps).toBe(args.primitiveProps);
      expect(result.wrongScoreModels).toEqual(undefined);
      expect(result.mainEvent).toBe(args.mainEvent);
      expect(result.relatedEvents).toBe(args.relatedEvents);
      expect(result.defaultFilterTimeWithAllowance).toBe(args.defaultFilterTimeWithAllowance);
    });

    it('should always initialize wrongScoreModels as undefined', () => {
      // Arrange
      const args = Helper.getFakeAddRelatedEventArg();

      // Act
      const result = service.createGetLogInfoParams(args);

      // Assert
      expect(result.wrongScoreModels).toEqual(undefined);
    });
  });
}); 