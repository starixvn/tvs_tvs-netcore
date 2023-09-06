import { IssueTypesModel } from '../../../../utility/models/issue-type.model';
import { Result } from '../../../../utility/models/result';
import { CommonService } from '../../../../utility/services/common.service';
import { VoidPageService } from './void-page.service';

class Helper {
  static readonly fakeResultError: Result<null> = {
    isSuccessful: false,
    errorCode: 111111,
    errorMsg: '',
  };
}

let voidPageService : VoidPageService ;

beforeEach(() => {
  voidPageService = new VoidPageService(null, null, null, null, null);
});

describe('VoidPageService', () => {

  it('#getIssueTypes should return issueTypesModel', async () => {
    const expected = new IssueTypesModel();
    const commonService = new CommonService(null);
    commonService.getIssueTypes = jest.fn().mockReturnValue(expected);
    const mockVoidPageService = new VoidPageService(null, commonService, null, null, null);

    const actual = await mockVoidPageService.getIssueTypes();

    expect(actual).toEqual(expected);
  });
});