import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagingComponent } from './paging.component';
import { PagingModel } from './paging.model';

describe('PagingComponent', () => {
  let component: PagingComponent;
  let fixture: ComponentFixture<PagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    }).compileComponents();

    fixture = TestBed.createComponent(PagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default PagingModel', () => {
    expect(component.model).toBeInstanceOf(PagingModel);
  });

  it('should emit modelChange when changePageSize is called', () => {
    // Arrange
    const spy = jest.spyOn(component.modelChange, 'emit');
    component.model.page = 2;
    component.model.pageSize = 10;

    // Act
    component.changePageSize();

    // Assert
    expect(component.model.page).toBe(1);
    expect(spy).toHaveBeenCalledWith(component.model);
  });

  it('should emit modelChange when pageChange is called', () => {
    // Arrange
    const spy = jest.spyOn(component.modelChange, 'emit');
    component.model.page = 3;

    // Act
    component.pageChange();

    // Assert
    expect(spy).toHaveBeenCalledWith(component.model);
  });

  it('should update model when input changes', () => {
    // Arrange
    const newModel = new PagingModel();
    newModel.page = 5;
    newModel.pageSize = 20;

    // Act
    component.model = newModel;
    fixture.detectChanges();

    // Assert
    expect(component.model.page).toBe(5);
    expect(component.model.pageSize).toBe(20);
  });
}); 