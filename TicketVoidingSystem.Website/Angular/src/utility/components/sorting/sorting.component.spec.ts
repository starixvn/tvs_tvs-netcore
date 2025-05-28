import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';
import { SortingComponent } from './sorting.component';

describe('SortingComponent', () => {
  let component: SortingComponent;
  let fixture: ComponentFixture<SortingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SortingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isDesc).toBeNull();
  });

  it('should emit sort event with true when clicked first time', () => {
    // Arrange
    const sortEventSpy = jest.spyOn(component.sortEvent, 'emit');

    // Act
    component.clickEvent();

    // Assert
    expect(component.isDesc).toBeTruthy();
    expect(sortEventSpy).toHaveBeenCalledWith(true);
  });

  it('should emit sort event with false when clicked second time', () => {
    // Arrange
    const sortEventSpy = jest.spyOn(component.sortEvent, 'emit');
    component.isDesc = true;

    // Act
    component.clickEvent();

    // Assert
    expect(component.isDesc).toBeFalsy();
    expect(sortEventSpy).toHaveBeenCalledWith(false);
  });

  it('should emit sort event with true when clicked third time', () => {
    // Arrange
    const sortEventSpy = jest.spyOn(component.sortEvent, 'emit');
    component.isDesc = false;

    // Act
    component.clickEvent();

    // Assert
    expect(component.isDesc).toBeTruthy();
    expect(sortEventSpy).toHaveBeenCalledWith(true);
  });

  it('should accept input id', () => {
    // Arrange
    const testId = 123;

    // Act
    component.id = testId;

    // Assert
    expect(component.id).toBe(testId);
  });
});
