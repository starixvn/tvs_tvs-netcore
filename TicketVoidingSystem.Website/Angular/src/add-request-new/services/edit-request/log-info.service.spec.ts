import { TestBed } from '@angular/core/testing';
import { LogInfoArg } from '../../models/edit/log-info.model';
import { CheckIssueTypeObjectType } from '../../../utility/models/check-issue-type.model';
import { CommonService } from '../../../utility/services/common.service';
import { MappingModelStaticService } from '../../../utility/services/mapping-model-static.service';
import { StaticService } from '../../../utility/services/static.service';
import { PrimitiveProperty } from '../../models/primitive-property.model';
import { RequestDetailViewModel } from '../../models/request-detail.model';
import { LogInfoService } from './log-info.service';

describe('LogInfoService', () => {
  let service: LogInfoService;
  let commonService: CommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LogInfoService,
        {
          provide: CommonService,
          useValue: {
            getLogInfo: jest.fn()
          }
        },
        {
          provide: StaticService,
          useValue: {
            checkAllIssueTypes: jest.fn(),
            getSubIssueTypeId: jest.fn(),
            isWrongHDP: jest.fn(),
            isWrongOU: jest.fn()
          }
        },
        {
          provide: MappingModelStaticService,
          useValue: {
            buildRedCardGetLogInfoModel: jest.fn(),
            buildWrongScoreGetLogInfoModel: jest.fn(),
            buildWrongHdpGetLogInfoModel: jest.fn(),
            buildWrongOuGetLogInfoModel: jest.fn(),
            buildWrongOddsGetLogInfoModel: jest.fn(),
            buildReducedOverGetLogInfoModel: jest.fn(),
            buildNotParticipateGetLogInfoModel: jest.fn(),
            buildWrongMarketOfferedGetLogInfoModels: jest.fn(),
            buildWrongOddsSportsBookGetLogInfoModel: jest.fn(),
            buildWrongOfferedNameGetLogInfoModel: jest.fn(),
            buildOtherIssuesGetLogInfoModel: jest.fn(),
            buildTechnicalErrorGetLogInfoModel: jest.fn()
          }
        }
      ]
    });

    service = TestBed.inject(LogInfoService);
    commonService = TestBed.inject(CommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLogInfo', () => {
    it('should call appropriate handler based on issue type', async () => {
      // Arrange
      const primitiveProperty = {
        requestId: '123',
        matchId: '1',
        sportType: '1',
        userId: '1',
        requestedBy: 'test',
        actionIdOfFirstTimeAccess: '1'
      } as unknown as PrimitiveProperty;

      const detailViewModel = {
        request: { issueTypeId: '1', actionId: 'action1' },
        requestId: '123',
        playerNames: ['test'],
        lastModifiedDate: new Date(),
        redCardModels: [{ matchId: '1' }],
        wrongScoreModels: [{ scoreId: '1', matchId: '1', subIssueTypeId: 1 }],
        dangerAcceptedModels: [{ matchId: '1', isMainMatch: true }]
      } as unknown as RequestDetailViewModel;

      jest.spyOn(StaticService, 'checkAllIssueTypes').mockReturnValue({
        isRedCard: true
      } as unknown as CheckIssueTypeObjectType);

      const mockLogInfoModels = [{
        matchId: '1',
        logInfoDetail: 'test detail'
      }];

      commonService.getLogInfo = jest.fn().mockResolvedValue({
        getLogInfoModels: mockLogInfoModels
      });

      // Act
      await service.getLogInfo(primitiveProperty, detailViewModel);

      // Assert
      expect(StaticService.checkAllIssueTypes).toHaveBeenCalledWith('1');
      expect(commonService.getLogInfo).toHaveBeenCalled();
    });
  });

  describe('getLogInfoRedCard', () => {
    it('should update log info for red card models', async () => {
      // Arrange
      const args = {
        primitiveProperty: {
          requestId: '123',
          matchId: '1',
          sportType: '1',
          userId: '1',
          requestedBy: 'test',
          actionIdOfFirstTimeAccess: '1'
        },
        detailViewModel: {
          request: { actionId: 'action1', issueTypeId: '1' },
          redCardModels: [{ matchId: '1' }],
          requestId: '123',
          playerNames: ['test'],
          lastModifiedDate: new Date()
        }
      } as unknown as LogInfoArg;

      const mockLogInfoModels = [{
        matchId: '1',
        logInfoDetail: 'test detail'
      }];

      commonService.getLogInfo = jest.fn().mockResolvedValue({
        getLogInfoModels: mockLogInfoModels
      });

      // Act
      await service['getLogInfoRedCard'](args);

      // Assert
      expect(commonService.getLogInfo).toHaveBeenCalledWith(expect.objectContaining({
        requestId: '123',
        actionId: 'action1',
        issueTypeId: '1'
      }));
      expect(args.detailViewModel.redCardModels[0].logInfoDetail).toBe('test detail');
      expect(args.detailViewModel.redCardModels[0].isChecked).toBe(true);
    });
  });

  describe('getLogInfoWrongScore', () => {
    it('should update log info for wrong score models', async () => {
      // Arrange
      const args = {
        primitiveProperty: {
          requestId: '123',
          matchId: '1',
          sportType: '1',
          userId: '1',
          requestedBy: 'test',
          actionIdOfFirstTimeAccess: '1'
        },
        detailViewModel: {
          request: { actionId: 'action1', issueTypeId: '1' },
          wrongScoreModels: [{ scoreId: '1', matchId: '1', subIssueTypeId: 1 }],
          requestId: '123',
          playerNames: ['test'],
          lastModifiedDate: new Date(),
          dangerAcceptedModels: [],
          redCardModels: []
        }
      } as unknown as LogInfoArg;

      jest.spyOn(StaticService, 'checkAllIssueTypes').mockReturnValue({
        isWrongScore: true,
        isDangerAccepted: false,
        isRedCard: false
      } as unknown as CheckIssueTypeObjectType);

      jest.spyOn(StaticService, 'getSubIssueTypeId').mockReturnValue(1);

      const mockLogInfoModels = [{
        scoreId: '1',
        matchId: '1',
        logInfoDetail: 'test detail'
      }];

      commonService.getLogInfo = jest.fn().mockResolvedValue({
        getLogInfoModels: mockLogInfoModels
      });

      // Act
      await service['getLogInfoWrongScore'](args);

      // Assert
      expect(commonService.getLogInfo).toHaveBeenCalledWith(expect.objectContaining({
        requestId: '123',
        actionId: 'action1',
        issueTypeId: '1',
        subIssueTypeId: 1,
        isShowLogOnly: true
      }));
      expect(args.detailViewModel.wrongScoreModels[0].logInfoDetail).toBe('test detail');
    });
  });

  describe('createLogInfoArg', () => {
    it('should create LogInfoArg with correct properties', () => {
      // Arrange
      const primitiveProperty = {
        requestId: '123',
        matchId: '1',
        sportType: '1',
        userId: '1',
        requestedBy: 'test',
        actionIdOfFirstTimeAccess: '1'
      } as unknown as PrimitiveProperty;

      const detailViewModel = {
        request: { issueTypeId: '1' },
        requestId: '123',
        playerNames: ['test'],
        lastModifiedDate: new Date()
      } as unknown as RequestDetailViewModel;

      // Act
      const result = service['createLogInfoArg'](primitiveProperty, detailViewModel);

      // Assert
      expect(result.primitiveProperty).toBe(primitiveProperty);
      expect(result.detailViewModel).toBe(detailViewModel);
    });
  });
});
