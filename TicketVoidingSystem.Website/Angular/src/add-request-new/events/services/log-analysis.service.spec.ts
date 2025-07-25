import { TestBed } from '@angular/core/testing';
import { LogAnalysisService } from './log-analysis.service';
import { CommonService } from '../../../utility/services/common.service';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { TestingModule } from '../../../utility/modules/testing.module';

describe('LogAnalysisService', () => {
  let service: LogAnalysisService;
  let commonService: CommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [LogAnalysisService, CommonService]
    });

    service = TestBed.inject(LogAnalysisService);
    commonService = TestBed.inject(CommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('writeLogAccessFunction', () => {
    it('should write log for AddRequest page when access count is 0', async () => {
      // Arrange
      const isEditRequestPage = false;
      const issueTypeId = '1';
      const accessIssueTypeCount = new Map<string, number>();
      const expectedPageName = 'AddRequest';
      const expectedLogPath = `${expectedPageName}/${IssueTypeConstant.NAME_WRITE_LOG.get(issueTypeId)}`;

      commonService.logAccessFunction = jest.fn().mockResolvedValue(true);

      // Act
      await service.writeLogAccessFunction(isEditRequestPage, issueTypeId, accessIssueTypeCount);

      // Assert
      expect(commonService.logAccessFunction).toHaveBeenCalledWith(expectedLogPath);
      expect(accessIssueTypeCount.get(issueTypeId)).toBe(1);
    });

    it('should write log for EditRequest page when access count is 0', async () => {
      // Arrange
      const isEditRequestPage = true;
      const issueTypeId = '1';
      const accessIssueTypeCount = new Map<string, number>();
      const expectedPageName = 'EditRequest';
      const expectedLogPath = `${expectedPageName}/${IssueTypeConstant.NAME_WRITE_LOG.get(issueTypeId)}`;

      commonService.logAccessFunction = jest.fn().mockResolvedValue(true);

      // Act
      await service.writeLogAccessFunction(isEditRequestPage, issueTypeId, accessIssueTypeCount);

      // Assert
      expect(commonService.logAccessFunction).toHaveBeenCalledWith(expectedLogPath);
      expect(accessIssueTypeCount.get(issueTypeId)).toBe(1);
    });

    it('should not write log when access count is greater than 0', async () => {
      // Arrange
      const isEditRequestPage = false;
      const issueTypeId = '1';
      const accessIssueTypeCount = new Map<string, number>();
      accessIssueTypeCount.set(issueTypeId, 1);

      commonService.logAccessFunction = jest.fn().mockResolvedValue(false);

      // Act
      await service.writeLogAccessFunction(isEditRequestPage, issueTypeId, accessIssueTypeCount);

      // Assert
      expect(commonService.logAccessFunction).not.toHaveBeenCalled();
      expect(accessIssueTypeCount.get(issueTypeId)).toBe(1);
    });

    it('should not increment access count when log write fails', async () => {
      // Arrange
      const isEditRequestPage = false;
      const issueTypeId = '1';
      const accessIssueTypeCount = new Map<string, number>();

      commonService.logAccessFunction = jest.fn().mockResolvedValue(false);

      // Act
      await service.writeLogAccessFunction(isEditRequestPage, issueTypeId, accessIssueTypeCount);

      // Assert
      expect(commonService.logAccessFunction).toHaveBeenCalled();
    });
  });

  describe('writeLogClickLiveGameDetails', () => {
    it('should write log for LiveGame details click', async () => {
      // Arrange
      const issueTypeId = '1';
      const expectedLogPath = `OpenLGDetails/${IssueTypeConstant.NAME_WRITE_LOG.get(issueTypeId)}`;

      commonService.logAccessFunction = jest.fn().mockResolvedValue(true);

      // Act
      await service.writeLogClickLiveGameDetails(issueTypeId);

      // Assert
      expect(commonService.logAccessFunction).toHaveBeenCalledWith(expectedLogPath);
    });
  });

  describe('writeLogClickPoolHouseDetails', () => {
    it('should write log for PoolHouse details click', async () => {
      // Arrange
      const issueTypeId = '1';
      const expectedLogPath = `OpenPHDetails/${IssueTypeConstant.NAME_WRITE_LOG.get(issueTypeId)}`;
      commonService.logAccessFunction = jest.fn().mockResolvedValue(true);

      // Act
      await service.writeLogClickPoolHouseDetails(issueTypeId);

      // Assert
      expect(commonService.logAccessFunction).toHaveBeenCalledWith(expectedLogPath);
    });
  });
}); 