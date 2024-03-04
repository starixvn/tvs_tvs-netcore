import { GroupBetType, GroupBetTypesModel, Result } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { CommonService } from '../../../utility/services/common.service';
import { HttpService } from '../../../utility/services/http.service';
import { CheckValidateService } from './check-validate.service';

describe('CheckValidateService', () => {
    let mockCommonService: CommonService;
    let mockHttpService: jest.Mocked<HttpService>;
    let service: CheckValidateService
    beforeEach(() => {
      mockHttpService = new HttpService(null) as jest.Mocked<HttpService>;
      mockCommonService = new CommonService(mockHttpService);
      service = new CheckValidateService(mockCommonService);
    });

  it('should be created', () => {

    expect(service).toBeTruthy();
  });

  it('#checkValidMatch return true when MatchId is Null', async () => {
    // Arrange
    const matchId = null;
    const tooltip = new Tooltip();

    // Action
    const result = await service.checkValidMatch(matchId, tooltip);

    // Assert
    expect(result).toBe(true);
  });

  it('#checkValidMatch return true when MatchId = 29', async () => {
    // Arrange
    const matchId = '29';
    const tooltip = new Tooltip();

    // Action
    const result = await service.checkValidMatch(matchId, tooltip);

    // Assert
    expect(result).toBe(true);
  });

  it('#checkValidMatch return true when MatchId is Valid', async () => {
    // Arrange
    const matchId = '1';
    const tooltip = new Tooltip();
    const groups = [new GroupBetType('a',[],true)];
    const fakeGroupBetTypesModel = new GroupBetTypesModel(groups, true);
    fakeGroupBetTypesModel.result = new Result();
    fakeGroupBetTypesModel.result.errorCode = 0;
    mockCommonService.getGroupBetTypes = jest.fn().mockImplementation(() => Promise.resolve(fakeGroupBetTypesModel));
    tooltip.display = jest.fn();

    // Action
    const result = await service.checkValidMatch(matchId, tooltip);

    // Assert
    expect(result).toBe(true);
  });

  it('#checkValidMatch return false when MatchId is Valid & groupBetTypes empty', async () => {
    // Arrange
    const tooltip = new Tooltip();
    const fakeGroupBetTypesModel = new GroupBetTypesModel([], true);
    fakeGroupBetTypesModel.result = new Result();
    fakeGroupBetTypesModel.result.errorCode = 0;
    mockCommonService.getGroupBetTypes = jest.fn().mockReturnValue(fakeGroupBetTypesModel);
    tooltip.display = jest.fn();

    // Action
    const result = await service.checkValidMatch('1', tooltip);

    // Assert
    expect(result).toBeFalsy();
  });

  it('#checkValidMatch return false when MatchId is inValid', async () => {
    // Arrange
    const matchId = '1';
    const tooltip = new Tooltip();
    const groups = [new GroupBetType('a',[],true)];
    const fakeGroupBetTypesModel = new GroupBetTypesModel(groups, true);
    fakeGroupBetTypesModel.result = new Result();
    fakeGroupBetTypesModel.result.errorCode = 1;
    fakeGroupBetTypesModel.result.errorMsg = 'errorMsg' ;
    mockCommonService.getGroupBetTypes = jest.fn().mockImplementation(() => Promise.resolve(fakeGroupBetTypesModel));
    tooltip.display = jest.fn();

    // Action
    const result = await service.checkValidMatch(matchId, tooltip);

    // Assert
    expect(result).toBe(false);
  });
});
