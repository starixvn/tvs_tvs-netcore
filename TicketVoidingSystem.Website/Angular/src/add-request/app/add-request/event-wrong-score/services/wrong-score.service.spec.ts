import { TestBed } from '@angular/core/testing';
import { WrongScoreService } from './wrong-score.service';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { AddRequestApiService } from '../../add-request-api.service';
import { DateTimeFormat, TimeZone } from '../../../../../utility/constants/config';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { WrongScoreModel } from '../../models/event-wrong-score.model';
import moment from 'moment-timezone';
import { LogInfoDetail } from 'src/utility/models/log-info-detail.model';
import { WrongScoreInfoComponent } from '../wrong-score-info/wrong-score-info.component';
import { EventEmitter, QueryList } from '@angular/core';

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
  });

  describe('mapWrongScoreModel', () => {
    it('should map and update wrong score models', () => {
      // Arrange
      const originWrongScoreModels = [
        new WrongScoreModel(),
        new WrongScoreModel()
      ];
      originWrongScoreModels[0].scoreId = 1;
      originWrongScoreModels[0].isActive = true;
      originWrongScoreModels[1].scoreId = 2;
      originWrongScoreModels[1].isActive = false;

      const wrongScoreModels = [
        new WrongScoreModel(),
        new WrongScoreModel()
      ];
      wrongScoreModels[0].scoreId = 1;
      wrongScoreModels[0].isActive = false;
      wrongScoreModels[1].scoreId = 3;
      wrongScoreModels[1].isActive = true;

      // Act
      service.mapWrongScoreModel(originWrongScoreModels, wrongScoreModels);

      // Assert
      expect(wrongScoreModels.length).toBe(3);
      expect(wrongScoreModels.find(x => x.scoreId === 1).isActive).toBeTruthy();
    });
  });

  describe('updateByOriginWrongScoreModel', () => {
    it('should update wrong score models with new models from origin', () => {
      // Arrange
      const originWrongScoreModels = [
        new WrongScoreModel(),
        new WrongScoreModel()
      ];
      originWrongScoreModels[0].scoreId = 1;
      originWrongScoreModels[0].isActive = true;
      originWrongScoreModels[1].scoreId = 2;
      originWrongScoreModels[1].isActive = false;

      const wrongScoreModels = [
        new WrongScoreModel()
      ];
      wrongScoreModels[0].scoreId = 1;
      wrongScoreModels[0].isActive = false;

      // Act
      service.updateByOriginWrongScoreModel(originWrongScoreModels, wrongScoreModels);

      // Assert
      expect(wrongScoreModels.length).toBe(2);
      expect(wrongScoreModels.find(x => x.scoreId === 2)).toBeDefined();
    });
  });

  describe('getTimeSelectedScore', () => {
    it('should return formatted time range for selected scores', () => {
      // Arrange
      const wrongScoreModels = [
        new WrongScoreModel(),
        new WrongScoreModel()
      ];
      wrongScoreModels[0].isChecked = true;
      wrongScoreModels[0].logInfoDetail = {
        matchId: 1,
        liveScores: '',
        voidFromTime: new Date('2024-01-01 00:00:00'),
        voidToTime: new Date('2024-01-01 00:00:00'),
        transVoidToTime: new Date('2024-01-01 00:00:00')
      } as LogInfoDetail;
      wrongScoreModels[1].isChecked = true;
      wrongScoreModels[1].logInfoDetail = {
        matchId: 1,
        liveScores: '',
        voidFromTime: new Date('2024-01-01 00:00:00'),
        voidToTime: new Date('2024-01-01 01:00:00'),
        transVoidToTime: new Date('2024-01-01 00:00:00')
      } as LogInfoDetail;

      // Act
      const result = service.getTimeSelectedScore(wrongScoreModels);

      // Assert
      expect(result).toBe('2024/01/01 12:00:00.000 AM - 2024/01/01 01:00:00.000 AM');
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
  });
});
