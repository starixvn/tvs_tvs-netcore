import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { GroupModel } from './group-tickets.model';
import { TicketsComponent } from './tickets.component';
import { TicketsModel } from './tickets.model';

describe('TicketsComponent', () => {
  let component: TicketsComponent;
  let fixture: ComponentFixture<TicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(TicketsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    // Arrange
    component.model = new TicketsModel();
    component.isBlock = false;

    // Act
    component.ngOnInit();

    // Assert
    expect(component.model).toBeDefined();
    expect(component.isBlock).toBeFalsy();
  });

  it('should show no data when groups is undefined', () => {
    // Arrange
    component.model = new TicketsModel();
    component.model.groups = undefined;

    // Act
    const result = component.isShowNoData();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should show no data when groups is null', () => {
    // Arrange
    component.model = new TicketsModel();
    component.model.groups = null;

    // Act
    const result = component.isShowNoData();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should show no data when groups is empty array', () => {
    // Arrange
    component.model = new TicketsModel();
    component.model.groups = [];

    // Act
    const result = component.isShowNoData();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should show no data when all groups have displayTotalTickets = 0', () => {
    // Arrange
    component.model = new TicketsModel();
    component.model.groups = [
      new GroupModel('Group 1', [], 0),
      new GroupModel('Group 2', [], 0)
    ];

    // Act
    const result = component.isShowNoData();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should not show no data when at least one group has displayTotalTickets > 0', () => {
    // Arrange
    component.model = new TicketsModel();
    component.model.groups = [
      new GroupModel('Group 1', [], 0),
      new GroupModel('Group 2', [], 1)
    ];

    // Act
    const result = component.isShowNoData();

    // Assert
    expect(result).toBeFalsy();
  });
});
