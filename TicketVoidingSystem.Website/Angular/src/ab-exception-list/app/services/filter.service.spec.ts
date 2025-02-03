import { TestBed } from '@angular/core/testing';
import * as _ from 'lodash';
import { MultipleSelection } from '../../../utility/components/multiple-selection/multiple-selection';
import { ABExceptionListLevel } from '../../../utility/constants/config';
import { Selection } from '../../../utility/models/selection.model';
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
  let appServiceMock: jest.Mocked<AppService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FilterService,
        { provide: AppService, useValue: { getSites: jest.fn(), getSubTypes: jest.fn() } },
      ],
    });

    filterService = TestBed.inject(FilterService);
    appServiceMock = TestBed.inject(AppService) as jest.Mocked<AppService>;
  });

  it('should be created', () => {
    expect(filterService).toBeTruthy();
  });

  it('#getSites should call #appService.getSites', async () => {
    appServiceMock.getSites.mockResolvedValue([Helper.fakeGroupSiteModel]);
    const result = await filterService.getSites();

    expect(result).toEqual([Helper.fakeGroupSiteModel]);
  });

  it('#initDefaultFilter should update correct model', async () => {
    const filterModel = new FilterModel();
    filterService.initDefaultFilter(filterModel, [Helper.fakeGroupSiteModel], [], [new Selection()]);

    expect(filterModel.username).toEqual('');
    expect(filterModel.level).toEqual(ABExceptionListLevel.All);
    expect(filterModel.sites).toEqual(Helper.fakeSiteModel.siteId);
  });

  it('#initDefaultProperties should update correct model', async () => {
    const multipleSelection = new MultipleSelection();
    filterService['initDefaultProperties'](multipleSelection);

    expect(multipleSelection.checkAllCheckBoxText).toEqual('All');
    expect(multipleSelection.allItemsCheckedText).toEqual('All');
    expect(multipleSelection.noneItemCheckedText).toEqual('Select options');
    expect(multipleSelection.maxWidth).toEqual('170px');
    expect(multipleSelection.numberItemsDisplay).toEqual(1);
  });

  it('#initMultiSelectSites should update correct model', async () => {
    const result = filterService.initMultiSelectSites([Helper.fakeGroupSiteModel]);

    expect(result.items.length).toEqual(1);
  });

  it('#initMultiSelectSites should not update correct model when groupName is All', async () => {
    const fakeGroupSiteModel = _.clone(Helper.fakeGroupSiteModel);
    fakeGroupSiteModel.groupName = 'All';
    fakeGroupSiteModel.groupId = 'All';
    const result = filterService.initMultiSelectSites([fakeGroupSiteModel]);

    expect(result.items.length).toEqual(0);
  });

  it('#initSubType should not update correct model when groupName is All', async () => {
    const subIssueType = new AbExceptionSubType();
    subIssueType.subIssueTypeIds = '1';
    const subIssueTypes = [subIssueType];
    appServiceMock.getSubTypes.mockResolvedValue(subIssueTypes);
    const result = await filterService.initSubType();

    expect(result.length).toEqual(1);
  });
});
