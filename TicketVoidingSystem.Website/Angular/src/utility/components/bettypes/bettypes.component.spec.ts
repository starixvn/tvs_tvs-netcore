import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BetTypesComponent } from './bettypes.component';
import { BetTypesModel, BetTypeModel } from './bettypes.model';
import { Product } from '../../constants/config';
import { TestingModule } from '../../modules/testing.module';
import { SimpleChange } from '@angular/core';

describe('BetTypesComponent', () => {
  let component: BetTypesComponent;
  let fixture: ComponentFixture<BetTypesComponent>;

  const mockBetType = new BetTypeModel('2702', '1H 1X2', false, Product.NUMBER_GAME, true);
  const mockBetTypesModel = new BetTypesModel([mockBetType], true);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BetTypesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    // Arrange
    component.model = mockBetTypesModel;
    component.product = Product.NUMBER_GAME;
    component.sportType = 161;
    component.ballSequence = [1, 2, 3];

    // Act
    component.ngOnChanges({
      model: new SimpleChange(null, mockBetTypesModel, true),
      product: new SimpleChange(null, Product.NUMBER_GAME, true),
      sportType: new SimpleChange(null, 161, true),
      ballSequence: new SimpleChange(null, [1, 2, 3], true)
    });
    fixture.detectChanges();

    // Assert
    expect(component.display).toBeFalsy();
    expect(component.model.isChecked).toBeTruthy();
    expect(component.model.betTypes[0].isShow).toBeFalsy();
  });

  it('should not display when model is undefined', () => {
    // Arrange
    component.model = undefined;
    component.product = Product.NUMBER_GAME;

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.display).toBeFalsy();
  });

  it('should not display when product is not in productDisplay', () => {
    // Arrange
    component.model = mockBetTypesModel;
    component.product = 999; // Invalid product

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.display).toBeFalsy();
  });

  it('should validate correctly when bet types are checked', () => {
    // Arrange
    component.model = mockBetTypesModel;
    component.model.betTypes[0].isChecked = true;
    component.model.betTypes[0].isShow = true;

    // Act
    const result = component.validate();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should validate incorrectly when no bet types are checked', () => {
    // Arrange
    component.model = mockBetTypesModel;
    component.model.betTypes[0].isChecked = false;
    component.model.betTypes[0].isShow = true;

    // Act
    const result = component.validate();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should handle changes correctly', () => {
    // Arrange
    component.model = mockBetTypesModel;
    component.product = Product.NUMBER_GAME;
    component.sportType = 161;
    component.ballSequence = [1, 2, 3];

    // Act
    component.ngOnChanges({
      model: new SimpleChange(null, mockBetTypesModel, true),
      product: new SimpleChange(null, Product.NUMBER_GAME, true),
      sportType: new SimpleChange(null, 161, true),
      ballSequence: new SimpleChange(null, [1, 2, 3], true)
    });
    fixture.detectChanges();

    // Assert
    expect(component.model.isChecked).toBeTruthy();
    expect(component.model.betTypes[0].isShow).toBeFalsy();
  });

  it('should match snapshot', () => {
    // Arrange
    component.model = mockBetTypesModel;
    component.product = Product.NUMBER_GAME;
    component.sportType = 161;
    component.ballSequence = [1, 2, 3];

    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
  });
});
