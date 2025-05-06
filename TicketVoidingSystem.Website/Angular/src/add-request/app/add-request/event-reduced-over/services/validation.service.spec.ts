import { TestBed } from '@angular/core/testing';
import { ValidationService } from './validation.service';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { FilterReducedOverComponent } from '../filter-reduced-over/filter-reduced-over.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { FilterReducedOverModel } from '../models/filter-reduced-over.model';
import { PrimitivePropertyItem } from '../filter-reduced-over-item/filter-reduced-over-item.model';
import { LogInfoReducedOver } from '../models/log-info-reduced-over.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { StaticService } from '../../../../../utility/services/static.service';
import { TEXT } from '../../../../../utility/constants/text';
import { JSDOM } from 'jsdom';

describe('ValidationService', () => {
  let service: ValidationService;
  let dom: JSDOM;

  beforeAll(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body id="body" user-id="123"></body></html>');
    global.document = dom.window.document;
    (global as any).window = dom.window;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ValidationService, StaticService]
    });

    service = TestBed.inject(ValidationService);
    
    // Mock document.getElementById
    document.getElementById = jest.fn().mockReturnValue({
      getAttribute: jest.fn().mockReturnValue('123')
    });
  });

  afterAll(() => {
    delete global.document;
    delete global.window;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('validateCommonData', () => {
    it('should return true when both components are valid', () => {
      // Arrange
      const mockEventLeagueComponent = {
        isMatchIdValid: () => true
      } as unknown as EventLeagueComponent;

      const mockFilterReducedOverComponent = {
        isValid: () => true
      } as unknown as FilterReducedOverComponent;

      // Act
      const result = service.validateCommonData(mockEventLeagueComponent, mockFilterReducedOverComponent);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when eventLeagueComponent is invalid', () => {
      // Arrange
      const mockEventLeagueComponent = {
        isMatchIdValid: () => false
      } as unknown as EventLeagueComponent;

      const mockFilterReducedOverComponent = {
        isValid: () => true
      } as unknown as FilterReducedOverComponent;

      // Act
      const result = service.validateCommonData(mockEventLeagueComponent, mockFilterReducedOverComponent);

      // Assert
      expect(result).toBeFalsy();
    });

    it('should return false when filterReducedOverComponent is invalid', () => {
      // Arrange
      const mockEventLeagueComponent = {
        isMatchIdValid: () => true
      } as unknown as EventLeagueComponent;

      const mockFilterReducedOverComponent = {
        isValid: () => false
      } as unknown as FilterReducedOverComponent;

      // Act
      const result = service.validateCommonData(mockEventLeagueComponent, mockFilterReducedOverComponent);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('isAllFieldsHaveValue', () => {
    let mockTooltip: Tooltip;
    let mockModel: FilterReducedOverModel;
    let mockPrimitivePropertyItem: PrimitivePropertyItem;

    beforeEach(() => {
      mockTooltip = {
        display: jest.fn(),
        hide: jest.fn()
      } as unknown as Tooltip;

      mockModel = {
        betTypeIds: [],
        wicketOver: '',
        playerIds: [],
        runs: '',
        nonLive: false,
        live: false
      } as FilterReducedOverModel;

      mockPrimitivePropertyItem = {
        isDisabledPlayer: false,
        isDisabledWicketOver: false,
        isDisabledRuns: false
      } as PrimitivePropertyItem;
    });

    it('should return false when betTypeIds is empty', () => {
      // Act
      const result = service.isAllFieldsHaveValue(mockModel, 0, mockPrimitivePropertyItem, mockTooltip);

      // Assert
      expect(result).toBeFalsy();
      expect(mockTooltip.display).toHaveBeenCalledWith('bet-type-dropdown0', TEXT.REQUIRED_FIELD);
    });

    it('should return false when wicketOver is invalid', () => {
      // Arrange
      mockModel.betTypeIds = ['1'];
      mockModel.wicketOver = 'invalid';

      // Act
      const result = service.isAllFieldsHaveValue(mockModel, 0, mockPrimitivePropertyItem, mockTooltip);

      // Assert
      expect(result).toBeFalsy();
    });

    it('should return false when playerIds is empty and player is not disabled', () => {
      // Arrange
      mockModel.betTypeIds = ['1'];
      mockModel.wicketOver = '5';

      // Act
      const result = service.isAllFieldsHaveValue(mockModel, 0, mockPrimitivePropertyItem, mockTooltip);

      // Assert
      expect(result).toBeFalsy();
      expect(mockTooltip.display).toHaveBeenCalledWith('player-dropdown0', TEXT.REQUIRED_FIELD);
    });

    it('should return false when runs is invalid', () => {
      // Arrange
      mockModel.betTypeIds = ['1'];
      mockModel.wicketOver = '5';
      mockModel.playerIds = ['1'];
      mockModel.runs = 'invalid';

      // Act
      const result = service.isAllFieldsHaveValue(mockModel, 0, mockPrimitivePropertyItem, mockTooltip);

      // Assert
      expect(result).toBeFalsy();
    });

    it('should return false when neither nonLive nor live is selected', () => {
      // Arrange
      mockModel.betTypeIds = ['1'];
      mockModel.wicketOver = '5';
      mockModel.playerIds = ['1'];
      mockModel.runs = '10.5';

      // Act
      const result = service.isAllFieldsHaveValue(mockModel, 0, mockPrimitivePropertyItem, mockTooltip);

      // Assert
      expect(result).toBeFalsy();
      expect(mockTooltip.display).toHaveBeenCalledWith('live-indicator0', TEXT.REQUIRED_FIELD);
    });

    it('should return true when all fields are valid', () => {
      // Arrange
      mockModel.betTypeIds = ['1'];
      mockModel.wicketOver = '5';
      mockModel.playerIds = ['1'];
      mockModel.runs = '10.5';
      mockModel.live = true;

      // Act
      const result = service.isAllFieldsHaveValue(mockModel, 0, mockPrimitivePropertyItem, mockTooltip);

      // Assert
      expect(result).toBeTruthy();
    });
  });

  describe('isValidSingleDecimalRuns', () => {
    it('should call StaticService.isCorrectFormatSingleDecimal with correct parameters', () => {
      // Arrange
      const value = '10.5';
      const elementClass = 'runs-input0';
      const tooltip = {} as Tooltip;
      
      jest.spyOn(StaticService, 'isCorrectFormatSingleDecimal').mockReturnValue(true);

      // Act
      const result = service.isValidSingleDecimalRuns(value, elementClass, tooltip);

      // Assert
      expect(StaticService.isCorrectFormatSingleDecimal).toHaveBeenCalledWith(value, elementClass, tooltip, TEXT.INVALID_RUNS);
      expect(result).toBeTruthy();
    });
  });

  describe('isValidOnlyNumberWicketOver', () => {
    it('should call StaticService.isCorrectFormatOnlyNumber with correct parameters', () => {
      // Arrange
      const value = '5';
      const elementClass = 'wicket-over-input0';
      const tooltip = {} as Tooltip;
      
      jest.spyOn(StaticService, 'isCorrectFormatOnlyNumber').mockReturnValue(true);

      // Act
      const result = service.isValidOnlyNumberWicketOver(value, elementClass, tooltip);

      // Assert
      expect(StaticService.isCorrectFormatOnlyNumber).toHaveBeenCalledWith(value, elementClass, tooltip, TEXT.INVALID_WICKET_OVER);
      expect(result).toBeTruthy();
    });
  });

  describe('isValidLogInfoEvent', () => {
    it('should return true when no error messages', () => {
      // Arrange
      const logInfoReducedOver = {
        messageValidationLogInfo: [
          { isError: false },
          { isError: false }
        ]
      } as LogInfoReducedOver;

      // Act
      const result = service.isValidLogInfoEvent(logInfoReducedOver);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when has error messages', () => {
      // Arrange
      const logInfoReducedOver = {
        messageValidationLogInfo: [
          { isError: false },
          { isError: true }
        ]
      } as LogInfoReducedOver;

      // Act
      const result = service.isValidLogInfoEvent(logInfoReducedOver);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('checkCanShowConfirmationReducedOver', () => {
    let mockSaveRequestArg: SaveRequestArg;

    beforeEach(() => {
      mockSaveRequestArg = {
        logInfoEvent: {
          logInfoDetail: {
            settleCount: 0
          },
          messageValidationLogInfo: []
        },
        isEdit: false,
        userId: 0,
        filter: {
          action: ''
        },
        actionIdOfFirstTimeAccess: ''
      } as SaveRequestArg;
    });

    it('should return true when has settled tickets', () => {
      // Arrange
      mockSaveRequestArg.logInfoEvent.logInfoDetail.settleCount = 1;

      // Act
      const result = service.checkCanShowConfirmationReducedOver(mockSaveRequestArg);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return true when has warning tickets', () => {
      // Arrange
      mockSaveRequestArg.logInfoEvent.messageValidationLogInfo = [
        { isError: false, reason: '' }
      ];

      // Act
      const result = service.checkCanShowConfirmationReducedOver(mockSaveRequestArg);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return true when editing by another user', () => {
      // Arrange
      mockSaveRequestArg.isEdit = true;
      mockSaveRequestArg.userId = 456;

      // Act
      const result = service.checkCanShowConfirmationReducedOver(mockSaveRequestArg);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return true when has warning taken note', () => {
      // Arrange
      mockSaveRequestArg.isEdit = true;
      mockSaveRequestArg.filter.action = TVSRequestActionType.TAKE_NOTE_ID.toString();
      mockSaveRequestArg.actionIdOfFirstTimeAccess = 'different_action';

      // Act
      const result = service.checkCanShowConfirmationReducedOver(mockSaveRequestArg);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when no conditions are met', () => {
      // Act
      const result = service.checkCanShowConfirmationReducedOver(mockSaveRequestArg);

      // Assert
      expect(result).toBeFalsy();
    });
  });
});
