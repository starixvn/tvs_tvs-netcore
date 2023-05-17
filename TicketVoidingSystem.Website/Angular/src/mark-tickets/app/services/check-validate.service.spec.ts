import { CheckValidateService } from './check-validate.service';
import { CommonService } from '../../../utility/services/common.service';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { Result, GroupBetTypesModel, GroupBetType } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { HttpService } from '../../../utility/services/http.service';

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
    let matchId = null;
    let tooltip = new Tooltip();

    // Action
    const result = await service.checkValidMatch(matchId, tooltip);

    // Assert
    expect(result).toBe(true);
  });

  it('#checkValidMatch return true when MatchId = 29', async () => {
    // Arrange
    let matchId = '29';
    let tooltip = new Tooltip();

    // Action
    const result = await service.checkValidMatch(matchId, tooltip);

    // Assert
    expect(result).toBe(true);
  });

  it('#checkValidMatch return true when MatchId is Valid', async () => {
    // Arrange
    let matchId = '1';
    let tooltip = new Tooltip();
    let groups = [new GroupBetType('a',[],true)];
    let fakeGroupBetTypesModel = new GroupBetTypesModel(groups, true);
    fakeGroupBetTypesModel.result = new Result();
    fakeGroupBetTypesModel.result.errorCode = 0;
    mockCommonService.getGroupBetTypes = jest.fn().mockImplementation(() => Promise.resolve(fakeGroupBetTypesModel));
    tooltip.display = jest.fn();

    // Action
    const result = await service.checkValidMatch(matchId, tooltip);

    // Assert
    expect(result).toBe(true);
  });

  it('#checkValidMatch return false when MatchId is inValid', async () => {
    // Arrange
    let matchId = '1';
    let tooltip = new Tooltip();
    let groups = [new GroupBetType('a',[],true)];
    let fakeGroupBetTypesModel = new GroupBetTypesModel(groups, true);
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
