import { TestBed } from '@angular/core/testing';
import { EventOtherIssuesService } from './event-other-issues.service';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { CommonService } from '../../../../../utility/services/common.service';
import { ValidationService } from './validation.service';
import { FilterOtherIssuesModel } from '../models/filter-other-isssues.model';
import { LogInfoOtherIssues } from '../models/log-info-other-issues.model';
import { OtherIssuesModel } from '../../models/event-other-issues.model';
import { GroupBetTypesAddRequestModel } from '../../../../../utility/components/advanced-mode-add-request/group-bet-types/group-bet-types.model';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import moment from 'moment-timezone';
import { GroupBetTypesModel } from '../../pool-house-ticket/group-bettypes-pool-house/group-bettypes-pool-house.model';
import { CheckAddPermissionService } from '../../services/check-permission.service';

describe('EventOtherIssuesService', () => {
  let service: EventOtherIssuesService;
  let commonService: CommonService;
  let validationService: ValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [EventOtherIssuesService, ValidationService, CheckAddPermissionService]
    });

    service = TestBed.inject(EventOtherIssuesService);
    commonService = TestBed.inject(CommonService);
    validationService = TestBed.inject(ValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getGroupBetTypes', () => {
    it('should call getGroupBetTypesTvs with correct query when subIssueTypeId is restart', async () => {
      // Arrange
      const matchId = 123;
      const filterModel: FilterOtherIssuesModel = {
        fromDateTime: '2024-03-20T10:00:00',
        toDateTime: '2024-03-20T11:00:00'
      };
      const subIssueTypeId = '1';
      const mockResponse = { 
        groupBetTypes: [],
        timeRanges: [{
          fromDate: '2024-03-20T10:00:00',
          toDate: '2024-03-20T11:00:00'
        }],
        isChecked: false,
        isDisable: false,
        isCollapsed: false,
        changeCheckGroupByBetTypes: () => {},
        betTypes: [],
        name: '',
        id: 0,
        isShow: true,
        isShowBetTypes: true
      } as unknown as GroupBetTypesModel;
      
      commonService.getGroupBetTypesTvs = jest.fn().mockResolvedValue(mockResponse);
      validationService.isShowFilterTime = jest.fn().mockReturnValue(true);
      
      // Act
      const result = await service.getGroupBetTypes(matchId, filterModel, subIssueTypeId, "1");

      // Assert
      expect(commonService.getGroupBetTypesTvs).toHaveBeenCalledWith({
        mode: 0,
        matchId: 123,
        timeRanges: [{
          fromDate: '2024-03-20T10:00:00',
          toDate: '2024-03-20T11:00:00'
        }]
      });
      expect(result).toBeInstanceOf(GroupBetTypesAddRequestModel);
    });

    it('should call getGroupBetTypesTvs without timeRanges when subIssueTypeId is not restart', async () => {
      // Arrange
      const matchId = 123;
      const filterModel: FilterOtherIssuesModel = {
        fromDateTime: '2024-03-20T10:00:00',
        toDateTime: '2024-03-20T11:00:00'
      };
      const subIssueTypeId = '2';
      const mockResponse = { groupBetTypes: [] } as GroupBetTypesModel;
      commonService.getGroupBetTypesTvs = jest.fn().mockResolvedValue(mockResponse);

      // Act
      const result = await service.getGroupBetTypes(matchId, filterModel, subIssueTypeId, "1");

      // Assert
      expect(commonService.getGroupBetTypesTvs).toHaveBeenCalledWith({
        mode: 0,
        matchId: 123
      });
      expect(result).toBeInstanceOf(GroupBetTypesAddRequestModel);
    });
  });

  describe('initDefaultFilter', () => {
    it('should return filter model with current datetime', () => {
      // Arrange
      const mockCurrentMoment = moment.utc().tz('America/Caracas');
      jest.spyOn(moment, 'utc').mockReturnValue(mockCurrentMoment);

      // Act
      const result = service.initDefaultFilter();

      // Assert
      expect(result).toEqual({
        fromDateTime: mockCurrentMoment.format(DateTimeFormat.FULL_DATE_TIME_FORMAT),
        toDateTime: mockCurrentMoment.format(DateTimeFormat.FULL_DATE_TIME_FORMAT)
      });
    });
  });

  describe('initDefaultLogInfoOtherIssues', () => {
    it('should return LogInfoOtherIssues with default filter', () => {
      // Act
      const result = service.initDefaultLogInfoOtherIssues();

      // Assert
      expect(result).toBeInstanceOf(LogInfoOtherIssues);
      expect(result.filterOtherIssues).toBeDefined();
    });
  });

  describe('getOtherIssuesModel', () => {
    it('should map LogInfoOtherIssues to OtherIssuesModel correctly', () => {
      // Arrange
      const logInfo: LogInfoOtherIssues = {
        matchId: 123,
        betTeamsResult: 'result',
        logInfoDetail: 'detail',
        allBetTypesSelection: true,
        filterOtherIssues: {
          fromDateTime: '2024-03-20T10:00:00',
          toDateTime: '2024-03-20T11:00:00'
        },
        betTypeCount: undefined,
        isHasSettledTicket: false,
        isHasInstantlySettledTicket: false
      } as unknown as LogInfoOtherIssues;
      const subIssueTypeId = '1';
      validationService.isShowFilterTime = jest.fn().mockReturnValue(true);
      // Act
      const result = service.getOtherIssuesModel(logInfo, subIssueTypeId, "1");

      // Assert
      expect(result).toEqual({
        matchId: 123,
        betTeamsResult: 'result',
        logInfoDetail: 'detail',
        subIssueTypeId: 1,
        allBetTypesSelection: true,
        filterFromTransTime: '2024-03-20T10:00:00',
        filterToTransTime: '2024-03-20T11:00:00',
        betTypeCount: undefined
      });
    });
  });

  describe('assignModelsToEvents', () => {
    it('should map OtherIssuesModel to LogInfoOtherIssues correctly', () => {
      // Arrange
      const inputModel: OtherIssuesModel = {
        matchId: 123,
        logInfoDetail: 'detail',
        allBetTypesSelection: true,
        filterFromTransTime: '2024-03-20T10:00:00',
        filterToTransTime: '2024-03-20T11:00:00'
      } as unknown as OtherIssuesModel;

      // Act
      const result = service.assignModelsToEvents(inputModel);

      // Assert
      expect(result).toEqual({
        matchId: 123,
        logInfoDetail: 'detail',
        allBetTypesSelection: true,
        filterOtherIssues: {
          fromDateTime: '2024-03-20T10:00:00',
          toDateTime: '2024-03-20T11:00:00'
        }
      });
    });
  });

  describe('initOtherIssuesGetLogInfoModel', () => {
    it('should create OtherIssuesGetLogInfoQuery with correct values', () => {
      // Arrange
      const subIssueTypeId = 1;
      const logInfo: LogInfoOtherIssues = {
        matchId: 123,
        betTeamsResult: 'result',
        filterOtherIssues: {
          fromDateTime: '2024-03-20T10:00:00',
          toDateTime: '2024-03-20T11:00:00'
        },
        logInfoDetail: '',
        isHasSettledTicket: false,
        isHasInstantlySettledTicket: false,
        allBetTypesSelection: false
      } as unknown as LogInfoOtherIssues;
      validationService.isShowFilterTime = jest.fn().mockReturnValue(true);
      // Act
      const result = service.initOtherIssuesGetLogInfoModel("1", subIssueTypeId, logInfo);

      // Assert
      expect(result).toEqual({
        matchId: 123,
        subIssueTypeId: 1,
        betTeamsResult: 'result',
        filterFromTransTime: '2024-03-20T10:00:00',
        filterToTransTime: '2024-03-20T11:00:00'
      });
    });
  });
}); 