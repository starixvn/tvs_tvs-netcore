import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgSelectModule } from '@ng-select/ng-select';
import { MultipleSelectionModule } from '../../../utility/components/multiple-selection/multiple-selection.module';
import { ToolTipModule } from '../../../utility/components/tooltip/tooltip.module';
import { Selection } from '../../../utility/models/selection.model';
import { TestingModule } from '../../../utility/modules/testing.module';
import { AppStore } from '../app.store';
import { GroupSiteModel } from '../models/site.model';
import { FilterService } from '../services/filter.service';
import { FilterComponent } from './filter.component';

class Helper {
  static mockGroupSites: GroupSiteModel[] = [
    { groupId: '1', sites: [], groupName: 'Group 1' },
    { groupId: '2', sites: [], groupName: 'Group 2' },
  ];

  static mockSubTypeSelection: Selection[] = [
    { name: 'Type 1', value: '1', group: 'Group 1' },
    { name: 'Type 2', value: '2', group: 'Group 2' },
  ];
}

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let filterService: FilterService;
  let appStore: AppStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule,
        FilterComponent,
        NgSelectModule,
        ToolTipModule,
        MultipleSelectionModule,
      ],
      providers: [
        FilterService,
        AppStore
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    filterService = fixture.debugElement.injector.get(FilterService);
    appStore = fixture.debugElement.injector.get(AppStore);
    appStore.changeBlockingUiStatus = jest.fn();
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize data on ngOnInit', async () => {
    component.initData = jest.fn();
    await component.ngOnInit();

    expect(component.initData).toHaveBeenCalled();
  });

  it('should initialize data on initData', async () => {
    filterService.initSubType = jest.fn().mockResolvedValue(Helper.mockSubTypeSelection);
    filterService.getSites = jest.fn().mockResolvedValue(Helper.mockGroupSites);
    filterService.initMultiSelectSites = jest.fn();
    await component.initData();

    expect(filterService.getSites).toHaveBeenCalled();
    expect(filterService.initSubType).toHaveBeenCalled();
    expect(appStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
    expect(component.groupSites).toEqual(Helper.mockGroupSites);
    expect(component.subTypeSelection).toEqual(Helper.mockSubTypeSelection);
  });

  it('should initialize default filters after data load', async () => {
    filterService.getSites = jest.fn().mockResolvedValue(Helper.mockGroupSites);
    filterService.initDefaultFilter = jest.fn();
    await component.ngOnInit();

    expect(filterService.initDefaultFilter).toHaveBeenCalledWith(
      component.filterModel,
      Helper.mockGroupSites,
      component.selectedSubType,
      component.voidVIPSelection
    );
  });

  it('should update filter model on selection changes', () => {
    // Test site selection
    component.updateSelectedSites(['1', '2']);
    expect(component.filterModel.sites).toBe('1,2');

    // Test subtype selection
    component.selectedSubType = ['0', '1'];
    component.updateSelectedSubIssueType();
    expect(component.filterModel.subTypes).toBe('0,1');

    // Test void VIP selection
    component.selectedVoidVIP = ['v1', 'v2'];
    component.updateSelectedVoidVIP();
    expect(component.filterModel.voidVIP).toBe('v1,v2');
  });

  it('should emit events on user actions', () => {
    // Test search event
    jest.spyOn(component.searchEvent, 'emit');
    component.clickSearch();
    expect(component.searchEvent.emit).toHaveBeenCalled();

    // Test add user event
    jest.spyOn(component.addUserEvent, 'emit');
    component.clickAddUser();
    expect(component.addUserEvent.emit).toHaveBeenCalled();
  });

  it('should handle initialization with undefined data', async () => {
    component.initData = jest.fn();
    await component.ngOnInit();

    expect(component.groupSites).toBeUndefined();
    expect(component.subTypeSelection).toBeUndefined();
  });
});