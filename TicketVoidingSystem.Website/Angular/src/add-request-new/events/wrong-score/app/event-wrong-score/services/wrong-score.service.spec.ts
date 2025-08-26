import { EventEmitter, QueryList } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import moment from 'moment-timezone';
import { DateTimeFormat, TimeZone } from '../../../../../../utility/constants/config';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { WrongScoreModel } from '../../../../../models/event-wrong-score.model';
import { AddRequestApiService } from '../../../../../services/add-request-api.service';
import { FilterTimeWithAllowance } from '../../../../red-card/app/event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { WrongScoreInfoComponent } from '../wrong-score-info/wrong-score-info.component';
import { WrongScoreService } from './wrong-score.service';

describe('WrongScoreService', () => {
  let service: WrongScoreService;

  const mockAddRequestApiService = {
    getWrongScores: jest.fn(),
    getLastTimeScore: jest.fn()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        WrongScoreService,
        { provide: AddRequestApiService, useValue: mockAddRequestApiService }
      ]
    });

    service = TestBed.inject(WrongScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initDefaultFilterWrongScore', () => {
    it('should initialize filter with current time', () => {
      // Arrange
      const currentMoment = moment.utc().tz(TimeZone.AMERICA_CARACAS).startOf('second');
      const expectedFromTime = currentMoment.format(DateTimeFormat.FULL_DATE_TIME_FORMAT);

      // Act
      const result = service.initDefaultFilterWrongScore();

      // Assert
      expect(result).toBeInstanceOf(FilterTimeWithAllowance);
      expect(result.fromDateTime).toBe(expectedFromTime);
      expect(result.toDateTime).toBeDefined();
      expect(result.aaTime).toBeUndefined();
      expect(result.paTime).toBeUndefined();
      expect(result.saTime).toBeUndefined();
    });
  });

  describe('getFilterWrongScore', () => {
    it('should return filter model from wrong score model', () => {
      // Arrange
      const wrongScoreModel = new WrongScoreModel();
      wrongScoreModel.filterFromTransTime = '2024-01-01 00:00:00';
      wrongScoreModel.filterToTransTime = '2024-01-01 01:00:00';
      wrongScoreModel.aaTime = 1;
      wrongScoreModel.paTime = 2;
      wrongScoreModel.saTime = 3;

      // Act
      const result = service.getFilterWrongScore(wrongScoreModel);

      // Assert
      expect(result).toBeInstanceOf(FilterTimeWithAllowance);
      expect(result.fromDateTime).toBe(wrongScoreModel.filterFromTransTime);
      expect(result.toDateTime).toBe(wrongScoreModel.filterToTransTime);
      expect(result.aaTime).toBe(wrongScoreModel.aaTime);
      expect(result.paTime).toBe(wrongScoreModel.paTime);
      expect(result.saTime).toBe(wrongScoreModel.saTime);
    });

    it('should handle null values in wrong score model', () => {
      // Arrange
      const wrongScoreModel = new WrongScoreModel();

      // Act
      const result = service.getFilterWrongScore(wrongScoreModel);

      // Assert
      expect(result).toBeInstanceOf(FilterTimeWithAllowance);
      expect(result.fromDateTime).toBeUndefined();
      expect(result.toDateTime).toBeUndefined();
      expect(result.aaTime).toBeUndefined();
      expect(result.paTime).toBeUndefined();
      expect(result.saTime).toBeUndefined();
    });
  });

  describe('createMainWrongScoreModel', () => {
    it('should create wrong score model from filter', () => {
      // Arrange
      const filterWrongScore = new FilterTimeWithAllowance();
      filterWrongScore.fromDateTime = '2024-01-01 00:00:00';
      filterWrongScore.toDateTime = '2024-01-01 01:00:00';
      filterWrongScore.aaTime = 1;
      filterWrongScore.paTime = 2;
      filterWrongScore.saTime = 3;

      // Act
      const result = service.createMainWrongScoreModel(filterWrongScore);

      // Assert
      expect(result).toBeInstanceOf(WrongScoreModel);
      expect(result.filterFromTransTime).toBe(filterWrongScore.fromDateTime);
      expect(result.filterToTransTime).toBe(filterWrongScore.toDateTime);
      expect(result.aaTime).toBe(filterWrongScore.aaTime);
      expect(result.paTime).toBe(filterWrongScore.paTime);
      expect(result.saTime).toBe(filterWrongScore.saTime);
      expect(result.isChecked).toBeTruthy();
    });

    it('should handle null values in filter', () => {
      // Arrange
      const filterWrongScore = new FilterTimeWithAllowance();

      // Act
      const result = service.createMainWrongScoreModel(filterWrongScore);

      // Assert
      expect(result).toBeInstanceOf(WrongScoreModel);
      expect(result.filterFromTransTime).toBeUndefined();
      expect(result.filterToTransTime).toBeUndefined();
      expect(result.aaTime).toBeUndefined();
      expect(result.paTime).toBeUndefined();
      expect(result.saTime).toBeUndefined();
      expect(result.isChecked).toBeTruthy();
    });
  });

  describe('handleCheckedLastScore', () => {
    it('should update wrong score models when API returns new data', async () => {
      // Arrange
      const originWrongScoreModels = [new WrongScoreModel()];
      originWrongScoreModels[0].scoreId = 1;
      const wrongScoreModel = new WrongScoreModel();
      wrongScoreModel.scoreId = 1;
      const updateByOriginWrongScoreModelEvent = { emit: jest.fn() } as unknown as EventEmitter<WrongScoreModel[]>;
      const matchId = 1;
      const actionId = 1;
      const filterBy = 1;

      const mockWrongScores = [
        { scoreId: 1, filterToTransTime: '2024-01-01 02:00:00' },
        { scoreId: 2, filterToTransTime: '2024-01-01 03:00:00' }
      ];

      mockAddRequestApiService.getWrongScores.mockResolvedValue(mockWrongScores);

      // Act
      await service.handleCheckedLastScore(
        originWrongScoreModels,
        wrongScoreModel,
        updateByOriginWrongScoreModelEvent,
        matchId,
        actionId,
        filterBy
      );

      // Assert
      expect(updateByOriginWrongScoreModelEvent.emit).toHaveBeenCalled();
      expect(originWrongScoreModels.length).toBe(2);
      expect(originWrongScoreModels[0].filterToTransTime).toBe('2024-01-01 02:00:00');
    });

    it('should get last time ticket when no new data', async () => {
      // Arrange
      const originWrongScoreModels = [new WrongScoreModel()];
      originWrongScoreModels[0].scoreId = 1;
      const wrongScoreModel = new WrongScoreModel();
      wrongScoreModel.scoreId = 1;
      const updateByOriginWrongScoreModelEvent = { emit: jest.fn() } as unknown as EventEmitter<WrongScoreModel[]>;
      const matchId = 1;
      const actionId = 1;
      const filterBy = 1;

      const mockWrongScores = [{ scoreId: 1, filterToTransTime: '2024-01-01 02:00:00' }];
      mockAddRequestApiService.getWrongScores.mockResolvedValue(mockWrongScores);

      const mockLastTimeScore = { lastTime: '2024-01-01 02:00:00' };
      mockAddRequestApiService.getLastTimeScore.mockResolvedValue(mockLastTimeScore);

      // Act
      await service.handleCheckedLastScore(
        originWrongScoreModels,
        wrongScoreModel,
        updateByOriginWrongScoreModelEvent,
        matchId,
        actionId,
        filterBy
      );

      // Assert
      expect(mockAddRequestApiService.getLastTimeScore).toHaveBeenCalled();
      expect(wrongScoreModel.filterToTransTime).toBe(mockLastTimeScore.lastTime);
    });

    it('should handle API errors gracefully', async () => {
      // Arrange
      const originWrongScoreModels = [new WrongScoreModel()];
      originWrongScoreModels[0].scoreId = 1;
      const wrongScoreModel = new WrongScoreModel();
      wrongScoreModel.scoreId = 1;
      const updateByOriginWrongScoreModelEvent = { emit: jest.fn() } as unknown as EventEmitter<WrongScoreModel[]>;
      const matchId = 1;
      const actionId = 1;
      const filterBy = 1;

      mockAddRequestApiService.getWrongScores.mockRejectedValue(new Error('API Error'));

      // Act & Assert
      await expect(service.handleCheckedLastScore(
        originWrongScoreModels,
        wrongScoreModel,
        updateByOriginWrongScoreModelEvent,
        matchId,
        actionId,
        filterBy
      )).rejects.toThrow('API Error');
    });
  });

  describe('setNullAllowanceTime', () => {
    it('should set all allowance times to null', () => {
      // Arrange
      const wrongScoreModel = new WrongScoreModel();
      wrongScoreModel.aaTime = 1;
      wrongScoreModel.paTime = 2;
      wrongScoreModel.saTime = 3;

      // Act
      service.setNullAllowanceTime(wrongScoreModel);

      // Assert
      expect(wrongScoreModel.aaTime).toBeNull();
      expect(wrongScoreModel.paTime).toBeNull();
      expect(wrongScoreModel.saTime).toBeNull();
    });

    it('should handle model with null values', () => {
      // Arrange
      const wrongScoreModel = new WrongScoreModel();

      // Act
      service.setNullAllowanceTime(wrongScoreModel);

      // Assert
      expect(wrongScoreModel.aaTime).toBeNull();
      expect(wrongScoreModel.paTime).toBeNull();
      expect(wrongScoreModel.saTime).toBeNull();
    });
  });

  describe('getSelectedWrongScoreComponents', () => {
    it('should return only checked components', () => {
      // Arrange
      const components = new QueryList<WrongScoreInfoComponent>();
      components.reset([
        { wrongScoreModel: { isChecked: true } } as WrongScoreInfoComponent,
        { wrongScoreModel: { isChecked: false } } as WrongScoreInfoComponent,
        { wrongScoreModel: { isChecked: true } } as WrongScoreInfoComponent
      ]);

      // Act
      const result = service.getSelectedWrongScoreComponents(components);

      // Assert
      expect(result.length).toBe(2);
      expect(result.every(x => x.wrongScoreModel.isChecked)).toBeTruthy();
    });

    it('should return empty array when no components are checked', () => {
      // Arrange
      const components = new QueryList<WrongScoreInfoComponent>();
      components.reset([
        { wrongScoreModel: { isChecked: false } } as WrongScoreInfoComponent,
        { wrongScoreModel: { isChecked: false } } as WrongScoreInfoComponent
      ]);

      // Act
      const result = service.getSelectedWrongScoreComponents(components);

      // Assert
      expect(result.length).toBe(0);
    });
  });

  describe('getDurationTime', () => {
    it('should return formatted duration between two times', () => {
      // Arrange
      const fromTime = '2024-01-01 00:00:00';
      const toTime = '2024-01-01 01:00:00';

      // Act
      const result = service.getDurationTime(fromTime, toTime);

      // Assert
      expect(result).toBe('60m0s');
    });
  });

  describe('callApiGetWrongScores', () => {
    it('should call API and return wrong scores', async () => {
      // Arrange
      const matchId = 1;
      const mockWrongScores = [new WrongScoreModel()];
      mockAddRequestApiService.getWrongScores.mockResolvedValue(mockWrongScores);

      // Act
      const result = await service.callApiGetWrongScores(matchId);

      // Assert
      expect(mockAddRequestApiService.getWrongScores).toHaveBeenCalledWith(matchId);
      expect(result).toEqual(mockWrongScores);
    });

    it('should handle API errors', async () => {
      // Arrange
      const matchId = 1;
      mockAddRequestApiService.getWrongScores.mockRejectedValue(new Error('API Error'));

      // Act & Assert
      await expect(service.callApiGetWrongScores(matchId)).rejects.toThrow('API Error');
    });
  });

  describe('updateByOriginWrongScoreModel', () => {
    it('should update wrong score models with new data', () => {
      // Arrange
      const originWrongScoreModels = [
        new WrongScoreModel(),
        new WrongScoreModel()
      ];
      originWrongScoreModels[0].scoreId = 1;
      originWrongScoreModels[1].scoreId = 2;

      const wrongScoreModels = [
        new WrongScoreModel()
      ];
      wrongScoreModels[0].scoreId = 1;

      // Act
      service.updateByOriginWrongScoreModel(originWrongScoreModels, wrongScoreModels);

      // Assert
      expect(wrongScoreModels.length).toBe(2);
      expect(wrongScoreModels[0].scoreId).toBe(1);
      expect(wrongScoreModels[1].scoreId).toBe(2);
    });

    it('should handle empty arrays', () => {
      // Arrange
      const originWrongScoreModels: WrongScoreModel[] = [];
      const wrongScoreModels: WrongScoreModel[] = [];

      // Act
      service.updateByOriginWrongScoreModel(originWrongScoreModels, wrongScoreModels);

      // Assert
      expect(wrongScoreModels.length).toBe(0);
    });
  });

  describe('getTimeSelectedScore', () => {
    it('should return formatted time range for selected scores', () => {
      // Arrange
      const wrongScoreModels = [
        {
          isChecked: true,
          logInfoDetail: {
            voidFromTime: new Date('2024-01-01 00:00:00'),
            voidToTime: new Date('2024-01-01 01:00:00')
          }
        } as WrongScoreModel,
        {
          isChecked: true,
          logInfoDetail: {
            voidFromTime: new Date('2024-01-01 01:00:00'),
            voidToTime: new Date('2024-01-01 02:00:00')
          }
        } as WrongScoreModel
      ];

      // Act
      const result = service.getTimeSelectedScore(wrongScoreModels);

      // Assert
      expect(result).toBe('2024/01/01 12:00:00.000 AM - 2024/01/01 02:00:00.000 AM');
    });

    it('should handle models without log info detail', () => {
      // Arrange
      const wrongScoreModels = [
        { isChecked: true } as WrongScoreModel,
        { isChecked: true } as WrongScoreModel
      ];

      // Act
      const result = service.getTimeSelectedScore(wrongScoreModels);

      // Assert
      expect(result).toBe(' - ');
    });
  });

  describe('displayFullDateTimeFormat', () => {
    it('should format date to full date time format', () => {
      // Arrange
      const date = new Date('2024-01-01 00:00:00');

      // Act
      const result = service.displayFullDateTimeFormat(date);

      // Assert
      expect(result).toBe('2024/01/01 12:00:00.000 AM');
    });

    it('should handle invalid date', () => {
      // Arrange
      const date = new Date('invalid-date');

      // Act
      const result = service.displayFullDateTimeFormat(date);

      // Assert
      expect(result).toBe('Invalid date');
    });
  });
});
