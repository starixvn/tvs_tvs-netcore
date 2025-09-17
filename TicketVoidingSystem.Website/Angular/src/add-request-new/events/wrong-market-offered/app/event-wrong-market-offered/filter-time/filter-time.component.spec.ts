import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { FilterTimeComponent } from './filter-time.component';
import { EventWrongMarketOfferedService } from '../services/event-wrong-market-offfered.service';
import { FilterWrongMarketOfferedModel } from '../models/filter-wrong-market-offered.model';
import { DateTimeFormat } from '../../../../../../utility/constants/config';
import { TEXT } from '../../../../../../utility/constants/text';
import moment from 'moment-timezone';

class Helper {
  static readonly fakeFilterModel = {
    id: 1,
    fromDateTime: moment().format(DateTimeFormat.FULL_DATE_TIME_FORMAT),
    toDateTime: moment().add(1, 'hour').format(DateTimeFormat.FULL_DATE_TIME_FORMAT)
  } as FilterWrongMarketOfferedModel;
}

describe('FilterTimeComponent', () => {
  let component: FilterTimeComponent;
  let fixture: ComponentFixture<FilterTimeComponent>;
  let eventWrongMarketOfferedService: EventWrongMarketOfferedService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        EventWrongMarketOfferedService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterTimeComponent);
    eventWrongMarketOfferedService = fixture.debugElement.injector.get(EventWrongMarketOfferedService);
    component = fixture.componentInstance;
    component.models = [Helper.fakeFilterModel];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit change filter event', () => {
    // Arrange
    component.changeFilterEvent.emit = jest.fn();

    // Act
    component.changeFilter();

    // Assert
    expect(component.changeFilterEvent.emit).toHaveBeenCalled();
  });

  it('should emit refresh event', () => {
    // Arrange
    component.refreshEvent.emit = jest.fn();

    // Act
    component.emitRefreshEvent();

    // Assert
    expect(component.refreshEvent.emit).toHaveBeenCalled();
  });

  it('should add new item', () => {
    // Arrange
    const previousTime = Helper.fakeFilterModel;
    component.changeFilterEvent.emit = jest.fn();
    eventWrongMarketOfferedService.initRangeTimeByInputTime = jest.fn().mockReturnValue({
      ...Helper.fakeFilterModel,
      id: 2
    });

    // Act
    component.addItem(previousTime);

    // Assert
    expect(component.models.length).toBe(2);
    expect(component.changeFilterEvent.emit).toHaveBeenCalled();
    expect(eventWrongMarketOfferedService.initRangeTimeByInputTime).toHaveBeenCalledWith(previousTime.toDateTime);
  });

  it('should remove item', () => {
    // Arrange
    component.changeFilterEvent.emit = jest.fn();
    const indexToRemove = 0;

    // Act
    component.removeItem(indexToRemove);

    // Assert
    expect(component.models.length).toBe(0);
    expect(component.changeFilterEvent.emit).toHaveBeenCalled();
  });

  it('should validate time ranges correctly', () => {
    // Arrange
    component.models = [
      {
        id: 1,
        fromDateTime: moment().format(DateTimeFormat.FULL_DATE_TIME_FORMAT),
        toDateTime: moment().add(1, 'hour').format(DateTimeFormat.FULL_DATE_TIME_FORMAT)
      },
      {
        id: 2,
        fromDateTime: moment().add(2, 'hour').format(DateTimeFormat.FULL_DATE_TIME_FORMAT),
        toDateTime: moment().add(3, 'hour').format(DateTimeFormat.FULL_DATE_TIME_FORMAT)
      }
    ] as FilterWrongMarketOfferedModel[];

    // Act
    const result = component.isToTimeSmallerThanFromTimeNextScore();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should detect invalid time ranges', () => {
    // Arrange
    const mockFilterItemComponents = [
      { 
        isValidity: () => true,
        tooltip: {
          display: jest.fn()
        }
      },
      { 
        isValidity: () => true,
        tooltip: {
          display: jest.fn()
        }
      }
    ];
    component.filterItemComponents = {
      toArray: () => mockFilterItemComponents
    } as any;
    component.models = [
      {
        id: 1,
        fromDateTime: moment().format(DateTimeFormat.FULL_DATE_TIME_FORMAT),
        toDateTime: moment().add(3, 'hour').format(DateTimeFormat.FULL_DATE_TIME_FORMAT)
      },
      {
        id: 2,
        fromDateTime: moment().add(2, 'hour').format(DateTimeFormat.FULL_DATE_TIME_FORMAT),
        toDateTime: moment().add(4, 'hour').format(DateTimeFormat.FULL_DATE_TIME_FORMAT)
      }
    ] as FilterWrongMarketOfferedModel[];

    // Act
    const result = component.isToTimeSmallerThanFromTimeNextScore();

    // Assert
    expect(result).toBeFalsy();
    expect(mockFilterItemComponents[0].tooltip.display).toHaveBeenCalledWith('to-date-time-1', TEXT.TO_TIME_MUST_SMALLER_THAN_NEXT_FROM_TIME);
  });

  it('should re-render IDs after adding/removing items', () => {
    // Arrange
    component.models = [
      { id: 1 } as FilterWrongMarketOfferedModel,
      { id: 3 } as FilterWrongMarketOfferedModel,
      { id: 5 } as FilterWrongMarketOfferedModel
    ];

    // Act
    component.removeItem(1);

    // Assert
    expect(component.models[0].id).toBe(1);
    expect(component.models[1].id).toBe(2);
  });

  it('should validate all items correctly', () => {
    // Arrange
    const mockFilterItemComponents = [
      { isValidity: () => true },
      { isValidity: () => true }
    ];
    component.filterItemComponents = {
      toArray: () => mockFilterItemComponents
    } as any;
    component.models = [
      {
        fromDateTime: moment().format(DateTimeFormat.FULL_DATE_TIME_FORMAT),
        toDateTime: moment().add(1, 'hour').format(DateTimeFormat.FULL_DATE_TIME_FORMAT)
      },
      {
        fromDateTime: moment().add(2, 'hour').format(DateTimeFormat.FULL_DATE_TIME_FORMAT),
        toDateTime: moment().add(3, 'hour').format(DateTimeFormat.FULL_DATE_TIME_FORMAT)
      }
    ] as FilterWrongMarketOfferedModel[];

    // Act
    const result = component.isValidity();

    // Assert
    expect(result).toBeTruthy();
  });
});
