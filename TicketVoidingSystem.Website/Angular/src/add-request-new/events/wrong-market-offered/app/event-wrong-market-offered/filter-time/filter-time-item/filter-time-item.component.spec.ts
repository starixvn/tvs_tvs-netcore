import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../../../utility/modules/testing.module';
import { StaticService } from '../../../../../../../utility/services/static.service';
import { FilterWrongMarketOfferedModel } from '../../models/filter-wrong-market-offered.model';
import { FilterTimeItemComponent } from './filter-time-item.component';

class Helper {
  static readonly fakeFilterModel: FilterWrongMarketOfferedModel = {
    id: 1,
    fromDateTime: new Date().toISOString(),
    toDateTime: new Date().toISOString(),
    homeFavorite: '',
    awayFavorite: '',
    actualMarket: '',
    marketValue: '',
    poolHouseCheckedBetTypes: '',
  } as FilterWrongMarketOfferedModel;
}

describe('FilterTimeItemComponent', () => {
  let component: FilterTimeItemComponent;
  let fixture: ComponentFixture<FilterTimeItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(FilterTimeItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    // Arrange
    component.model = Helper.fakeFilterModel;
    component.isVoided = false;
    component.index = 0;
    component.isLast = false;
    component.isFirst = true;

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.model).toBeDefined();
    expect(component.isVoided).toBeFalsy();
    expect(component.index).toBe(0);
    expect(component.isLast).toBeFalsy();
    expect(component.isFirst).toBeTruthy();
  });

  it('should validate time range correctly', () => {
    // Arrange
    component.model = Helper.fakeFilterModel;
    component.fromTimeComponent = {
      validateWithTooltip: jest.fn().mockReturnValue(true)
    } as any;
    component.toTimeComponent = {
      validateWithTooltip: jest.fn().mockReturnValue(true)
    } as any;
    jest.spyOn(StaticService, 'isFromTimeSameOrBeforeToTime').mockReturnValue(true);

    // Act
    const result = component.isValidity();

    // Assert
    expect(result).toBeTruthy();
    expect(component.fromTimeComponent.validateWithTooltip).toHaveBeenCalled();
    expect(component.toTimeComponent.validateWithTooltip).toHaveBeenCalled();
    expect(StaticService.isFromTimeSameOrBeforeToTime).toHaveBeenCalled();
  });

  it('should emit change filter event', () => {
    // Arrange
    const spy = jest.spyOn(component.changeFilterEvent, 'emit');

    // Act
    component.changeFilter();

    // Assert
    expect(spy).toHaveBeenCalled();
  });

  it('should emit add item event when not voided', () => {
    // Arrange
    component.isVoided = false;
    component.model = Helper.fakeFilterModel;
    const spy = jest.spyOn(component.addItemEvent, 'emit');

    // Act
    component.addBetTypeItem();

    // Assert
    expect(spy).toHaveBeenCalledWith(component.model);
  });

  it('should not emit add item event when voided', () => {
    // Arrange
    component.isVoided = true;
    const spy = jest.spyOn(component.addItemEvent, 'emit');

    // Act
    component.addBetTypeItem();

    // Assert
    expect(spy).not.toHaveBeenCalled();
  });

  it('should emit remove item event when not voided', () => {
    // Arrange
    component.isVoided = false;
    const index = 1;
    const spy = jest.spyOn(component.removeItemEvent, 'emit');

    // Act
    component.removeBetTypeItem(index);

    // Assert
    expect(spy).toHaveBeenCalledWith(index);
  });

  it('should not emit remove item event when voided', () => {
    // Arrange
    component.isVoided = true;
    const spy = jest.spyOn(component.removeItemEvent, 'emit');

    // Act
    component.removeBetTypeItem(1);

    // Assert
    expect(spy).not.toHaveBeenCalled();
  });

  it('should show tooltip with correct parameters', () => {
    // Arrange
    const className = 'test-class';
    const text = 'test tooltip';
    const spy = jest.spyOn(component.tooltip, 'display');

    // Act
    component.showTooltip(className, text);

    // Assert
    expect(spy).toHaveBeenCalledWith(className, text);
  });
});
