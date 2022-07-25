import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Shallow } from 'shallow-render';
import { MultipleSelectionModule } from '../../../utility/components/multiple-selection/multiple-selection.module';
import { ToolTipModule } from '../../../utility/components/tooltip/tooltip.module';
import { AppStore } from '../app.store';
import { PermissionABExceptionList } from '../models/permission.model';
import { GroupSiteModel, SiteModel } from '../models/site.model';
import { FilterService } from '../services/filter.service';
import { FilterComponent } from './filter.component';
import { FilterModel } from './filter.model';
class Helper {
  static fakeFilterModel: FilterModel = {
    username: 'name',
    level: '1',
    sites: '1,2',
    subTypes: '',
    voidVIP: ''
  };
  static fakePermission: PermissionABExceptionList = {
    abExceptionListHost: true
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

describe('FilterComponent', () => { 
  @NgModule({
    declarations: [
    ],
    imports: [
      NgbModule,
      FormsModule,
      NgSelectModule,
      ToolTipModule,
      MultipleSelectionModule
    ],
    providers: [
      FilterService,
      AppStore 
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<FilterComponent>;

  beforeEach(() => {
    shallow = new Shallow(FilterComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('#FilterComponent init should match snapshot', async () => {
    const { fixture } = await shallow
      .render({
        bind: {
          filterModel: Helper.fakeFilterModel,
          permission: Helper.fakePermission
        }
      });

    expect(fixture).toMatchSnapshot();
  });

  it('#ngOnInit should call #initData', async () => {
    // Arrange
    const mockGetSites = jest.fn().mockImplementation(() => Promise.resolve([Helper.fakeGroupSiteModel]));
    const { instance } = await shallow
      .mock(FilterService, { getSites: mockGetSites })
      .render({
        bind: {
          filterModel: Helper.fakeFilterModel,
          permission: Helper.fakePermission
        }
      });
    instance.initData = jest.fn();
    instance.clickSearch = jest.fn();

    // Action
    await instance.ngOnInit();

    // Assert
    expect(instance.initData).toHaveBeenCalled();
    expect(instance.clickSearch).toHaveBeenCalled();
  });

  it('#initData should call #initDefaultFilter #initMultiSelectSites', async () => {
    // Arrange
    const mockInitDefaultFilter = jest.fn();
    const mockInitMultiSelectSites = jest.fn();
    const { instance } = await shallow
      .mock(FilterService,
        {
          initDefaultFilter: mockInitDefaultFilter,
          initMultiSelectSites: mockInitMultiSelectSites,
          getSites: jest.fn(),
          initSubType: jest.fn().mockImplementation(() => Promise.resolve([]))
        })
      .mock(AppStore, {changeBlockingUiStatus: jest.fn()})
      .render({
        bind: {
          filterModel: Helper.fakeFilterModel,
          permission: Helper.fakePermission
        }
      });

    // Action
    instance.initData();

    // Assert
    expect(mockInitDefaultFilter).toHaveBeenCalled();
    expect(mockInitMultiSelectSites).toHaveBeenCalled();
  });
  
  it('#clickAddUser should emit #addUserEvent', async () => {
    // Arrange
    const mockAddUserEvent = jest.fn();
    const { instance } = await shallow
      .render({
        bind: {
          filterModel: Helper.fakeFilterModel,
          permission: Helper.fakePermission
        }
      });
    instance.addUserEvent.emit = mockAddUserEvent;

    // Action
    instance.clickAddUser();

    // Assert
    expect(mockAddUserEvent).toHaveBeenCalled();
  });
  
  it('#clickSearch should emit #searchEvent', async () => {
    // Arrange
    const mockSearchEvent = jest.fn();
    const { instance } = await shallow
      .render({
        bind: {
          filterModel: Helper.fakeFilterModel,
          permission: Helper.fakePermission
        }
      });
    instance.searchEvent.emit = mockSearchEvent;

    // Action
    instance.clickSearch();

    // Assert
    expect(mockSearchEvent).toHaveBeenCalled();
  });
  
  it('#updateSelectedSites should update correct model', async () => {
    // Arrange
    const filterModel = new FilterModel();
    const { instance } = await shallow
      .render({
        bind: {
          filterModel: filterModel,
          permission: Helper.fakePermission
        }
      });

    // Action
    instance.updateSelectedSites(['1','2']);

    // Assert
    expect(filterModel.sites).toBe('1,2');
  });
  
  it('#updateSelectedSubIssueType should update correct model', async () => {
    // Arrange
    const filterModel = new FilterModel();
    const { instance } = await shallow
      .render({
        bind: {
          filterModel: filterModel,
          permission: Helper.fakePermission
        }
      });
    instance.selectedSubType = ['1','2','3'];

    // Action
    instance.updateSelectedSubIssueType();

    // Assert
    expect(filterModel.subTypes).toBe('1,2,3');
  });
  
  it('#updateSelectedVoidVIP should update correct model', async () => {
    // Arrange
    const filterModel = new FilterModel();
    const { instance } = await shallow
      .render({
        bind: {
          filterModel: filterModel,
          permission: Helper.fakePermission
        }
      });
    instance.selectedVoidVIP = ['1','2','3'];

    // Action
    instance.updateSelectedVoidVIP();

    // Assert
    expect(filterModel.voidVIP).toBe('1,2,3');
  });
});