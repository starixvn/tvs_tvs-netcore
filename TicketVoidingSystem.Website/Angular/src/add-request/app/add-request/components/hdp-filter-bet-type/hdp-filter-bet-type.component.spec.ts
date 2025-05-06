import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { HdpFilterBetTypeComponent } from './hdp-filter-bet-type.component';
import { HdpFilterBetTypeService } from './hdp-filter-bet-type.service';
import { FilterBetType } from '../../event-wrong-hdp/models/filter-with-hdp.model';
import { HdpFilterBetType } from '../../models/hdp-filter-betType.model';
import { SimpleChange } from '@angular/core';

class Helper {
  static readonly fakeSportTypeId = 1;
  static readonly fakeIssueTypeId = '1';
  static readonly fakeFilterBetType = {
    filterBetTypeId: '1',
    isChecked: true
  } as unknown as FilterBetType;
  static readonly fakeHdpFilterBetTypes= [
    {
      betType: '1',
      isChecked: true,
      description: 'Test Bet Type 1'
    },
    {
      betType: '2', 
      isChecked: false,
      description: 'Test Bet Type 2'
    }
  ] as unknown as HdpFilterBetType[];
}

describe('HdpFilterBetTypeComponent', () => {
  let component: HdpFilterBetTypeComponent;
  let fixture: ComponentFixture<HdpFilterBetTypeComponent>;
  let hdpFilterBetTypeService: HdpFilterBetTypeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        HdpFilterBetTypeService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HdpFilterBetTypeComponent);
    hdpFilterBetTypeService = fixture.debugElement.injector.get(HdpFilterBetTypeService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values when sportTypeId changes', async () => {
    // Arrange
    component.sportTypeId = Helper.fakeSportTypeId;
    component.issueTypeId = Helper.fakeIssueTypeId;
    component.filterBetType = Helper.fakeFilterBetType;
    hdpFilterBetTypeService.GetHdpFilterBetTypes = jest.fn().mockResolvedValue(Helper.fakeHdpFilterBetTypes);
    hdpFilterBetTypeService.loadDataEditPage = jest.fn();
    hdpFilterBetTypeService.updateAllFilterBetTypeData = jest.fn();

    // Act
    await component.ngOnChanges({
      sportTypeId: {
        currentValue: Helper.fakeSportTypeId,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });

    // Assert
    expect(hdpFilterBetTypeService.GetHdpFilterBetTypes).toHaveBeenCalledWith(Helper.fakeSportTypeId, Helper.fakeIssueTypeId);
    expect(component.allFilterBetType).toEqual(Helper.fakeHdpFilterBetTypes);
    expect(hdpFilterBetTypeService.loadDataEditPage).toHaveBeenCalled();
    expect(component.filterBetTypeId).toBe(Helper.fakeFilterBetType.filterBetTypeId);
    expect(component.betTypeSelected).toEqual(Helper.fakeHdpFilterBetTypes[0]);
  });

  it('should refresh filter bet types when no filterBetTypeId is provided', async () => {
    // Arrange
    component.sportTypeId = Helper.fakeSportTypeId;
    component.issueTypeId = Helper.fakeIssueTypeId;
    component.filterBetType = { filterBetTypeId: '' } as FilterBetType;
    hdpFilterBetTypeService.GetHdpFilterBetTypes = jest.fn().mockResolvedValue(Helper.fakeHdpFilterBetTypes);
    hdpFilterBetTypeService.updateAllFilterBetTypeData = jest.fn();

    // Act
    await component.ngOnChanges({
      sportTypeId: {
        currentValue: Helper.fakeSportTypeId,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });

    // Assert
    expect(component.filterBetTypeId).toBe(Helper.fakeHdpFilterBetTypes[0].betType);
    expect(component.allFilterBetType[0].isChecked).toBeTruthy();
    expect(hdpFilterBetTypeService.updateAllFilterBetTypeData).toHaveBeenCalled();
  });

  it('should handle bet type change correctly', () => {
    // Arrange
    component.allFilterBetType = Helper.fakeHdpFilterBetTypes;
    component.filterBetType = { filterBetTypeId: '' } as FilterBetType;
    const selectedBetType = Helper.fakeHdpFilterBetTypes[1];
    hdpFilterBetTypeService.updateAllFilterBetTypeData = jest.fn();

    // Act
    component.onChangeBetType(selectedBetType);

    // Assert
    expect(component.allFilterBetType[0].isChecked).toBeFalsy();
    expect(component.allFilterBetType[1].isChecked).toBeTruthy();
    expect(component.betTypeSelected).toEqual(selectedBetType);
    expect(component.filterBetType.filterBetTypeId).toBe(selectedBetType.betType);
    expect(hdpFilterBetTypeService.updateAllFilterBetTypeData).toHaveBeenCalled();
  });

  it('should emit change event when filter changes', () => {
    // Arrange
    component.allFilterBetType = Helper.fakeHdpFilterBetTypes;
    component.changeEvent.emit = jest.fn();
    hdpFilterBetTypeService.updateAllFilterBetTypeData = jest.fn();

    // Act
    component.onChangeFilter();

    // Assert
    expect(hdpFilterBetTypeService.updateAllFilterBetTypeData).toHaveBeenCalled();
    expect(component.changeEvent.emit).toHaveBeenCalled();
  });

  it('should show filter bet type for wrong HDP or OU issue types', () => {
    // Arrange
    component.issueTypeId = '4'; // Wrong HDP
    expect(component.iddShowFilterBetType()).toBeTruthy();

    component.issueTypeId = '6'; // Wrong OU
    expect(component.iddShowFilterBetType()).toBeTruthy();

    component.issueTypeId = '3'; // Other type
    expect(component.iddShowFilterBetType()).toBeFalsy();
  });
});
