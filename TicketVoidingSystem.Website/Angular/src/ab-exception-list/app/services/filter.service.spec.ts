import * as _ from 'lodash';
import { ABWhiteListLevel } from '../../../utility/constants/config';
import { Selection } from '../../../utility/models/selection.model';
import { MultipleSelection } from '../../../utility/modules/multiple-selection/multiple-selection';
import { CommonService } from '../../../utility/services/common.service';
import { AppService } from '../app.service';
import { FilterModel } from '../filter/filter.model';
import { AbExceptionSubType } from '../models/ab-exception-sub-type.mode';
import { GetUserModel } from '../models/get-user.model';
import { GroupSiteModel, SiteModel } from '../models/site.model';
import { UserModel } from '../models/user.model';
import { FilterService } from './filter.service';

class Helper {
  static fakeUserModel: UserModel = {
    username: 'name',
    level: '1',
    site: '1,2',
    addedDate: new Date('2020-11-06 00:00:00.000'),
    addedBy: 'zane',
    isChecked: true,
    custId: 123,
    subTypeName: '',
    isAllowVoidVIP: ''
  };
  static fakeGetUserModel: GetUserModel = {
    users: [Helper.fakeUserModel],
    invalidUsername: ''
  };
  static fakeSiteModel: SiteModel = {
    siteId: '1111',
    siteName: '188VN',
    groupName: 'Credit',
    hidden: false,
  };
  static fakeGroupSiteModel: GroupSiteModel = {
    groupName: 'credit',
    groupId: '1',
    sites: [Helper.fakeSiteModel]
  };
}
describe('FilterService', () => {
  let filterService: FilterService;

  beforeEach(() => {
    filterService = new FilterService(null, null);
  });

  it('#getSites should call #commonService.getSites', async () => {
    // Arrange
    const commonService = new CommonService(null);
    commonService.getSites = jest.fn().mockImplementation(() => Promise.resolve([Helper.fakeGroupSiteModel]));
    const mockFilterService = new FilterService(null, commonService);

    // action
    const result = await mockFilterService.getSites();

    // Assert
    expect(result).toEqual([Helper.fakeGroupSiteModel]);
  });
  
  it('#initDefaultFilter should update correct model', async () => {
    // Arrange
    const filterModel = new FilterModel();

    // action
    filterService.initDefaultFilter(filterModel, [Helper.fakeGroupSiteModel], [], [new Selection()]);

    // Assert
    expect(filterModel.username).toEqual('');
    expect(filterModel.level).toEqual(ABWhiteListLevel.All);
    expect(filterModel.sites).toEqual(Helper.fakeSiteModel.siteId);
  });
  
  it('#initDefaultProperties should update correct model', async () => {
    // Arrange
    const multipleSelection = new MultipleSelection();

    // action
    filterService['initDefaultProperties'](multipleSelection);

    // Assert
    expect(multipleSelection.checkAllCheckBoxText).toEqual('All');
    expect(multipleSelection.allItemsCheckedText).toEqual('All');
    expect(multipleSelection.noneItemCheckedText).toEqual('Select options');
    expect(multipleSelection.maxWidth).toEqual('170px');
    expect(multipleSelection.numberItemsDisplay).toEqual(1);
  });
  
  it('#initMultiSelectSites should update correct model', async () => {
    // action
    const result = filterService.initMultiSelectSites([Helper.fakeGroupSiteModel]);

    // Assert
    expect(result.items.length).toEqual(1);
  });
  
  it('#initMultiSelectSites should not update correct model when groupName is All', async () => {
    // Arrange
    const fakeGroupSiteModel = _.clone(Helper.fakeGroupSiteModel);
    fakeGroupSiteModel.groupName = 'All';
    fakeGroupSiteModel.groupId = 'All';

    // action
    const result = filterService.initMultiSelectSites([fakeGroupSiteModel]);

    // Assert
    expect(result.items.length).toEqual(0);
  });
  
  it('#initSubType should not update correct model when groupName is All', async () => {
    // Arrange
    const subIssueType = new AbExceptionSubType();
    subIssueType.subIssueTypeIds = '1';
    const subIssueTypes = [subIssueType];
    const appService = new AppService(null);
    appService.getSubTypes = jest.fn().mockImplementation(() => Promise.resolve(subIssueTypes));
    const mockFilterService = new FilterService(appService, null);

    // action
    const result = await mockFilterService.initSubType();

    // Assert
    expect(result.length).toEqual(1);
  });
});
