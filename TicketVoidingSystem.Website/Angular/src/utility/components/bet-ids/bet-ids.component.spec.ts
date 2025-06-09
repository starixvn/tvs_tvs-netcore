import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';
import { BetIdsComponent } from './bet-ids.component';
import { GroupNumber, NumberItem } from './bet-ids.model';

class Helper {
  static readonly fakeBetIds = '123,456,789';
  static readonly fakeGroupNumber = new GroupNumber();
  static readonly fakeNumberItem = new NumberItem('123');
}

describe('BetIdsComponent', () => {
  let component: BetIdsComponent;
  let fixture: ComponentFixture<BetIdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(BetIdsComponent);
    component = fixture.componentInstance;
    
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = jest.fn();
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.maxItems).toBe(2000);
    expect(component.initBetIds).toBe('');
    expect(component.hideWarningMove).toBeFalsy();
    expect(component.warningMoveText).toBe('(*) Moved tickets are highlighted in ORANGE.');
    expect(component.hideInvalid).toBeFalsy();
    expect(component.hideDifferentMatch).toBeTruthy();
    expect(component.disabled).toBeFalsy();
    expect(component.isShowLabel).toBeTruthy();
  });

  it('should initialize with provided betIds', () => {
    // Arrange
    component.initBetIds = Helper.fakeBetIds;

    // Act
    component.ngOnInit();

    // Assert
    expect(component.groupNumber.items.length).toBe(3);
    expect(component.groupNumber.items[0].value).toBe('123');
    expect(component.groupNumber.items[1].value).toBe('456');
    expect(component.groupNumber.items[2].value).toBe('789');
  });

  it('should get invalid items as string', () => {
    // Arrange
    const invalidItem = new NumberItem('invalid');
    invalidItem.isValid = false;
    component.groupNumber.items = [invalidItem];

    // Act
    const result = component.getInvalidItems();

    // Assert
    expect(result).toBe('invalid');
  });

  it('should get all bet ids as string', () => {
    // Arrange
    component.groupNumber.items = [
      new NumberItem('123'),
      new NumberItem('456')
    ];

    // Act
    const result = component.getAllBetIds();

    // Assert
    expect(result).toBe('123,456');
  });

  it('should get all non-number bet ids as string', () => {
    // Arrange
    const item1 = new NumberItem('123');
    const item2 = new NumberItem('abc');
    component.groupNumber.items = [item1, item2];

    // Act
    const result = component.getAllBetIdsAreNotNumber();

    // Assert
    expect(result).toBe('abc');
  });

  it('should validate if has bet id', () => {
    // Arrange
    component.groupNumber.items = [];

    // Act
    const result = component.isHasBetId();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should validate all bet ids', () => {
    // Arrange
    const invalidItem = new NumberItem('invalid');
    invalidItem.isValid = false;
    component.groupNumber.items = [invalidItem];

    // Act
    const result = component.isAllBetIdsValid();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should handle blur event and add new bet id', () => {
    // Arrange
    const value = '123';
    component.afterFocusOutBetIds.emit = jest.fn();

    // Act
    component.onBlurBetIdInput(value);

    // Assert
    expect(component.groupNumber.items.length).toBe(1);
    expect(component.groupNumber.items[0].value).toBe('123');
    expect(component.afterFocusOutBetIds.emit).toHaveBeenCalledWith(value);
  });

  it('should clear bet ids', () => {
    // Arrange
    component.groupNumber.items = [
      new NumberItem('123'),
      new NumberItem('456')
    ];

    // Act
    component.clearBetId();

    // Assert
    expect(component.groupNumber.items.length).toBe(0);
  });

  it('should handle key event for adding new bet id', () => {
    // Arrange
    const event = new KeyboardEvent('keypress', {
      key: 'E'
    });
    component.transId = '123';

    // Act
    const result = component.onKey(event);

    // Assert
    expect(result).toBeFalsy();
    expect(component.groupNumber.items.length).toBe(1);
    expect(component.groupNumber.items[0].value).toBe('123');
  });

  it('should remove trans id', () => {
    // Arrange
    component.groupNumber.items = [
      new NumberItem('123'),
      new NumberItem('456'),
      new NumberItem('789')
    ];

    // Act
    component.removeTransId('123,456');

    // Assert
    expect(component.groupNumber.items.length).toBe(1);
    expect(component.groupNumber.items[0].value).toBe('789');
  });
});
