import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketsComponent } from './tickets.component';
import { PagingModel } from '../../../utility/components/paging/paging/paging.model';
import { Product } from '../../../utility/constants/config';
import { SummaryItem } from '../summary/summary.model';
import { TicketsModel } from './ticket.model';
import { PagingComponent } from '../../../utility/components/paging/paging/paging.component';
import { SanitizeHtmlPipe } from '../../../utility/pipes/sanitize-html.pipe';

class Helper {
  static readonly mockSummaryItem = {
    name: 'Test Item',
    total: 100,
    isChinaView: false,
    licenseeName: 'Test Licensee',
    betTypes: '29',
    items: [],
    betTypeName: 'Test Bet Type',
    isGroup: false,
    specialPlatform: null,
    isChecked: false,
    isShow: true
  } as SummaryItem;

  static readonly mockTicketsModel = {
    pagingModel: new PagingModel(),
    tickets: [],
    item: Helper.mockSummaryItem,
    title: 'Test Title'
  } as unknown as TicketsModel;

  static readonly mockPagingModel = {
    page: 1,
    pageSize: 50,
    total: 100,
    selection: [50, 100, 150, 500]
  } as unknown as PagingModel;
}

describe('TicketsComponent', () => {
  let component: TicketsComponent;
  let fixture: ComponentFixture<TicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, PagingComponent, SanitizeHtmlPipe, TicketsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketsComponent);
    component = fixture.componentInstance;
    component.model = Helper.mockTicketsModel;
    component.isShowTickets = true;
    component.product = Product.SPORTS_BOOK;
    fixture.detectChanges();
  });

  it('should create', () => {
    // Arrange & Act & Assert
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should initialize paging selection', () => {
    // Arrange & Act
    component.ngOnInit();
    
    // Assert
    expect(component.paging.selection).toEqual([50, 100, 150, 500]);
  });

  it('#ngOnChanges should update paging when model.item exists', () => {
    // Arrange
    component.model = Helper.mockTicketsModel;
    
    // Act
    component.ngOnChanges();
    
    // Assert
    expect(component.paging.total).toBe(Helper.mockSummaryItem.total);
    expect(component.paging.pageSize).toBe(component.paging.selection[0]);
  });

  it('#ngOnChanges should not update paging when model.item is null', () => {
    // Arrange
    component.model = { ...Helper.mockTicketsModel, item: null };
    const originalPaging = { ...component.paging };
    
    // Act
    component.ngOnChanges();
    
    // Assert
    expect(component.paging).toEqual(originalPaging);
  });

  it('#getWidth should return correct width for SPORTS_BOOK product', () => {
    // Arrange
    component.product = Product.SPORTS_BOOK;
    
    // Act
    const width = component.getWidth();
    
    // Assert
    expect(width).toBe('1275px');
  });

  it('#getWidth should return correct width for NUMBER_GAME product', () => {
    // Arrange
    component.product = Product.NUMBER_GAME;
    
    // Act
    const width = component.getWidth();
    
    // Assert
    expect(width).toBe('1335px');
  });

  it('#exportExcel should emit exportExcelEvent with model.item', () => {
    // Arrange
    component.exportExcelEvent = { emit: jest.fn() } as any;
    
    // Act
    component.exportExcel();
    
    // Assert
    expect(component.exportExcelEvent.emit).toHaveBeenCalledWith(component.model.item);
  });

  it('#pagingEvent should emit pagingSearchTicket with paging', () => {
    // Arrange
    component.pagingSearchTicket = { emit: jest.fn() } as any;
    
    // Act
    component.pagingEvent();
    
    // Assert
    expect(component.pagingSearchTicket.emit).toHaveBeenCalledWith(component.paging);
  });
});
