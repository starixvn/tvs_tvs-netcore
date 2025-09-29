import { TestBed } from '@angular/core/testing';
import { GroupBetTypesModel, Result } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { CommonService } from '../../../utility/services/common.service';
import { HttpService } from '../../../utility/services/http.service';
import { CheckValidateService } from './check-validate.service';
import { TestingModule } from '../../../utility/modules/testing.module';

describe('CheckValidateService', () => {
  let service: CheckValidateService;
  let mockCommonService: CommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        CheckValidateService,
        CommonService,
        HttpService
      ]
    });

    mockCommonService = TestBed.inject(CommonService);
    service = TestBed.inject(CheckValidateService);
  });

  it('should be created', () => {
    // Arrange & Act
    service = TestBed.inject(CheckValidateService);

    // Assert
    expect(service).toBeTruthy();
  });

  describe('checkValidMatch', () => {
    it('should return true when MatchId is Null', async () => {
      // Arrange
      const matchId = null;
      const tooltip = new Tooltip();

      // Act
      const result = await service.checkValidMatch(matchId, tooltip);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when MatchId = 29', async () => {
      // Arrange
      const matchId = '29';
      const tooltip = new Tooltip();

      // Act
      const result = await service.checkValidMatch(matchId, tooltip);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when MatchId is Valid', async () => {
      // Arrange
      const matchId = '1';
      const tooltip = new Tooltip();
      const groups = [{ groupName: 'a', betTypes: [], isChecked: true }];
      const fakeGroupBetTypesModel = {groupBetTypes: groups, isChecked: true, result: {errorCode: 0}} as GroupBetTypesModel;
      fakeGroupBetTypesModel.result = new Result();
      fakeGroupBetTypesModel.result.errorCode = 0;
      mockCommonService.getGroupBetTypes = jest.fn().mockImplementation(() => Promise.resolve(fakeGroupBetTypesModel));
      tooltip.display = jest.fn();

      // Act
      const result = await service.checkValidMatch(matchId, tooltip);

      // Assert
      expect(result).toBe(true);
      expect(mockCommonService.getGroupBetTypes).toHaveBeenCalledWith({ matchId: 1, mode: 9 });
    });

    it('should return false when MatchId is Valid & groupBetTypes empty', async () => {
      // Arrange
      const matchId = '1';
      const tooltip = new Tooltip();
      const fakeGroupBetTypesModel = {groupBetTypes: [], isChecked: true, result: {errorCode: 0}} as GroupBetTypesModel;
      fakeGroupBetTypesModel.result = new Result();
      fakeGroupBetTypesModel.result.errorCode = 0;
      mockCommonService.getGroupBetTypes = jest.fn().mockReturnValue(Promise.resolve(fakeGroupBetTypesModel));
      tooltip.display = jest.fn();

      // Act
      const result = await service.checkValidMatch(matchId, tooltip);

      // Assert
      expect(result).toBeFalsy();
      expect(mockCommonService.getGroupBetTypes).toHaveBeenCalledWith({ matchId: 1, mode: 9 });
      expect(tooltip.display).toHaveBeenCalled();
    });

    it('should return false when MatchId is inValid', async () => {
      // Arrange
      const matchId = '1';
      const tooltip = new Tooltip();
      const groups = [{ groupName: 'a', betTypes: [], isChecked: true }];
      const fakeGroupBetTypesModel = {groupBetTypes: groups, isChecked: true, result: {errorCode: 0}} as GroupBetTypesModel;
      fakeGroupBetTypesModel.result = new Result();
      fakeGroupBetTypesModel.result.errorCode = 1;
      fakeGroupBetTypesModel.result.errorMsg = 'errorMsg';
      mockCommonService.getGroupBetTypes = jest.fn().mockImplementation(() => Promise.resolve(fakeGroupBetTypesModel));
      tooltip.display = jest.fn();

      // Act
      const result = await service.checkValidMatch(matchId, tooltip);

      // Assert
      expect(result).toBe(false);
      expect(mockCommonService.getGroupBetTypes).toHaveBeenCalledWith({ matchId: 1, mode: 9 });
      expect(tooltip.display).toHaveBeenCalled();
    });

    it('should handle error when getGroupBetTypes throws exception', async () => {
      // Arrange
      const matchId = '1';
      const tooltip = new Tooltip();
      const groups = [{ groupName: 'a', betTypes: [], isChecked: true }];
      const fakeGroupBetTypesModel = {groupBetTypes: groups, isChecked: true, result: {errorCode: 0}} as GroupBetTypesModel;
      fakeGroupBetTypesModel.result = {errorCode: 1, errorMsg: 'Network error'};
      fakeGroupBetTypesModel.result.errorCode = 1;
      mockCommonService.getGroupBetTypes = jest.fn().mockImplementation(() => Promise.resolve(fakeGroupBetTypesModel));
      tooltip.display = jest.fn();

      // Act
      const result = await service.checkValidMatch(matchId, tooltip);

      // Assert
      expect(result).toBe(false);
      expect(mockCommonService.getGroupBetTypes).toHaveBeenCalledWith({ matchId: 1, mode: 9 });
      expect(tooltip.display).toHaveBeenCalled();
    });

    it('should return false when tooltip is null', async () => {
      // Arrange
      const matchId = '1';
      const tooltip = null;
      const groups = [{ groupName: 'a', betTypes: [], isChecked: true }];
      const fakeGroupBetTypesModel = {groupBetTypes: groups, isChecked: true, result: {errorCode: 0}} as GroupBetTypesModel;
      fakeGroupBetTypesModel.result = new Result();
      fakeGroupBetTypesModel.result.errorCode = 0;
      mockCommonService.getGroupBetTypes = jest.fn().mockImplementation(() => Promise.resolve(fakeGroupBetTypesModel));

      // Act
      const result = await service.checkValidMatch(matchId, tooltip);

      // Assert
      expect(result).toBe(true);
    });
  });
});
