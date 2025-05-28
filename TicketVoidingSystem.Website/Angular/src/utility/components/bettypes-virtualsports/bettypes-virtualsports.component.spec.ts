import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';
import { BetTypesVirtualSportComponent } from './bettypes-virtualsports.component';
import { GroupBetTypeVirtualSport } from './bettypes-virtualsports.model';
import { Product } from '../../constants/config';
import { SimpleChange } from '@angular/core';

class Helper {
  static readonly fakeGroupBetType: GroupBetTypeVirtualSport = {
    betTypes: [
      { id: '1', checked: true },
      { id: '2', checked: false },
      { id: '3', checked: true }
    ]
  } as unknown as GroupBetTypeVirtualSport;

  static readonly emptyGroupBetType: GroupBetTypeVirtualSport = {
    betTypes: []
  } as unknown as GroupBetTypeVirtualSport;
}

describe('BetTypesVirtualSportComponent', () => {
  let component: BetTypesVirtualSportComponent;
  let fixture: ComponentFixture<BetTypesVirtualSportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(BetTypesVirtualSportComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.display).toBeUndefined();
    expect(component.checkAll).toBeTruthy();
    expect(component.tooltip).toBeTruthy();
  });

  it('should handle ngOnChanges when group changes', () => {
    // Arrange
    component.group = Helper.fakeGroupBetType;

    // Act
    component.ngOnChanges({
      group: {
        currentValue: Helper.fakeGroupBetType,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });

    // Assert
    expect(component.display).toBeTruthy();
  });

  it('should return false for changeDisplay when betTypes is empty', () => {
    // Arrange
    component.group = Helper.emptyGroupBetType;

    // Act
    const result = component.changeDisplay();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should return true for changeDisplay when betTypes has items', () => {
    // Arrange
    component.group = Helper.fakeGroupBetType;

    // Act
    const result = component.changeDisplay();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should validate and return true when betTypes are checked', () => {
    // Arrange
    component.group = Helper.fakeGroupBetType;

    // Act
    const result = component.validate();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should validate and return false when no betTypes are checked', () => {
    // Arrange
    component.group = Helper.emptyGroupBetType;

    // Act
    const result = component.validate();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should get checked betTypes', () => {
    // Arrange
    component.group = Helper.fakeGroupBetType;

    // Act
    const result = component.getCheckedBetTypes();

    // Assert
    expect(result).toEqual(['1', '3']);
  });

  it('should return empty array when no betTypes are checked', () => {
    // Arrange
    component.group = Helper.emptyGroupBetType;

    // Act
    const result = component.getCheckedBetTypes();

    // Assert
    expect(result).toEqual([]);
  });

  it('should show checked betTypes when product is VIRTUAL_SPORTS and display is true', () => {
    // Arrange
    component.product = Product.VIRTUAL_SPORTS;
    component.display = true;

    // Act
    const result = component.isShowCheckedBetTypes();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should not show checked betTypes when product is not VIRTUAL_SPORTS', () => {
    // Arrange
    component.product = 1;
    component.display = true;

    // Act
    const result = component.isShowCheckedBetTypes();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should not show checked betTypes when display is false', () => {
    // Arrange
    component.product = Product.VIRTUAL_SPORTS;
    component.display = false;

    // Act
    const result = component.isShowCheckedBetTypes();

    // Assert
    expect(result).toBeFalsy();
  });
});
