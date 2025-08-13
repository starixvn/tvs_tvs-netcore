import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChildMatchModel } from '../../../add-request/app/add-request/models/related-event.model';
import { MatchType } from '../../constants/config';
import { TestingModule } from '../../modules/testing.module';
import { AddChildMatchComponent } from './add-child-match.component';
import { AddChildMatchModel } from './add-child-match.model';

class Helper {
  static readonly fakeChildMatchModel: ChildMatchModel[] = [
    {
      matchId: 1,
      matchType: MatchType.CHILD,
      isChecked: false,
      matchCode: 'TEST1',
      leagueName: 'Test League',
      matchEvent: 'Test Event',
      isSpecialChildMatch: false
    },
    {
      matchId: 2,
      matchType: MatchType.CHILD,
      isChecked: false,
      matchCode: 'TEST2',
      leagueName: 'Test League',
      matchEvent: 'Test Event',
      isSpecialChildMatch: false
    }
  ];

  static readonly fakeAddChildMatchModel = new AddChildMatchModel();
}

describe('AddChildMatchComponent', () => {
  let component: AddChildMatchComponent;
  let fixture: ComponentFixture<AddChildMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AddChildMatchComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.relatedEvents).toEqual([]);
    expect(component.model).toBeInstanceOf(AddChildMatchModel);
    expect(component.isBlock).toBeFalsy();
    expect(component.tempRelatedEvents).toEqual([]);
  });

  it('should handle ngOnChanges when model changes', () => {
    // Arrange
    component.relatedEvents = Helper.fakeChildMatchModel;
    component.model = Helper.fakeAddChildMatchModel;
    component.model.matchType = MatchType.CHILD;
    component.model.selectedMatchIds = [1];

    // Act
    component.ngOnChanges({
      model: {
        currentValue: component.model,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      } as SimpleChange
    });

    // Assert
    expect(component.tempRelatedEvents.length).toBe(2);
    expect(component.tempRelatedEvents[0].isChecked).toBeTruthy();
    expect(component.tempRelatedEvents[1].isChecked).toBeFalsy();
  });

  it('should handle checkbox state correctly', () => {
    // Arrange
    component.tempRelatedEvents = Helper.fakeChildMatchModel;

    // Act & Assert
    component.handleCheckBox();
    expect(component.isCheckedAll).toBeFalsy();

    component.tempRelatedEvents.forEach(x => x.isChecked = true);
    component.handleCheckBox();
    expect(component.isCheckedAll).toBeTruthy();
  });

  it('should check if match exists', () => {
    // Arrange
    const matches = Helper.fakeChildMatchModel;
    const existingMatchId = 1;
    const nonExistingMatchId = 999;

    // Act & Assert
    expect(component.isMatchExisted(matches, existingMatchId)).toBeTruthy();
    expect(component.isMatchExisted(matches, nonExistingMatchId)).toBeFalsy();
  });

  it('should save selected related events and close modal', () => {
    // Arrange
    const selectedEvents = Helper.fakeChildMatchModel;
    selectedEvents[0].isChecked = true;
    selectedEvents[1].isChecked = true;
    component.tempRelatedEvents = selectedEvents;
    component.selectedEventsChange.emit = jest.fn();
    component.isOpenChange.emit = jest.fn();

    // Act
    component.saveSelectedRelatedEvents();

    // Assert
    expect(component.selectedEventsChange.emit).toHaveBeenCalledWith(selectedEvents);
    expect(component.tempRelatedEvents).toEqual([]);
    expect(component.model.isOpen).toBeFalsy();
    expect(component.isOpenChange.emit).toHaveBeenCalledWith(false);
  });

  it('should close child match modal', () => {
    // Arrange
    component.tempRelatedEvents = Helper.fakeChildMatchModel;
    component.model.isOpen = true;
    component.isOpenChange.emit = jest.fn();

    // Act
    component.closeChildMatchModal();

    // Assert
    expect(component.tempRelatedEvents).toEqual([]);
    expect(component.model.isOpen).toBeFalsy();
    expect(component.isOpenChange.emit).toHaveBeenCalledWith(false);
  });

  it('should emit change event when save button is clicked', () => {
    // Arrange
    component.changeEvent.emit = jest.fn();

    // Act
    component.clickButtonSave();

    // Assert
    expect(component.changeEvent.emit).toHaveBeenCalled();
  });

  it('should handle check all matches', () => {
    // Arrange
    component.tempRelatedEvents = Helper.fakeChildMatchModel;
    component.model.matchType = MatchType.CHILD;
    const event = { target: { checked: true } };

    // Act
    component.handleCheckAllMatches(event);

    // Assert
    expect(component.tempRelatedEvents.every(x => x.isChecked)).toBeTruthy();
  });
});
