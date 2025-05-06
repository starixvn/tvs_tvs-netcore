import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { TicketsListComponent } from './tickets-list.component';
import { TableTicketsModel } from './table-tickets.model';
import { PagingModel } from '../../../../../utility/components/paging/paging/paging.model';
import { GroupModel } from './group-tickets.model';

class Helper {
  static readonly fakeTableTicketsModel: TableTicketsModel = {
    id: '1',
    groups: new Array<GroupModel>(),
    total: 0,
    totalSingle: 0,
    totalParlay: 0,
    totalCancelCashOut: 0,
    fromTime: new Date(),
    toTime: new Date(),
    strFromTime: '',
    strToTime: '',
    isHasSettledTicket: false,
    groupPHAffected: 0
  } as TableTicketsModel;

  static readonly fakePagingModel: PagingModel = new PagingModel({
    page: 1,
    pageSize: 10,
    total: 0,
    selection: [500, 1000, 2000, 3000]
  });
}

describe('TicketsListComponent', () => {
  let component: TicketsListComponent;
  let fixture: ComponentFixture<TicketsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(TicketsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    // Arrange
    component.model = Helper.fakeTableTicketsModel;
    component.isBlock = false;
    component.paging = Helper.fakePagingModel;

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.model).toBeDefined();
    expect(component.isBlock).toBeFalsy();
    expect(component.paging).toBeDefined();
  });

  it('should emit paging event when paging changes', () => {
    // Arrange
    const spy = jest.spyOn(component.pagingChange, 'emit');
    component.paging = Helper.fakePagingModel;

    // Act
    component.pagingEvent();

    // Assert
    expect(spy).toHaveBeenCalledWith(Helper.fakePagingModel);
  });

  it('should update paging model correctly', () => {
    // Arrange
    const newPagingModel = new PagingModel({
      page: 2,
      pageSize: 20,
      total: 100,
      selection: [500, 1000, 2000, 3000]
    });
    component.paging = newPagingModel;

    // Act
    component.pagingEvent();

    // Assert
    expect(component.paging.page).toBe(2);
    expect(component.paging.pageSize).toBe(20);
  });
});
