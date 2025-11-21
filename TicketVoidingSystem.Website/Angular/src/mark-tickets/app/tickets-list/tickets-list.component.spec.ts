import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TEXT} from '../../../utility/constants/text';
import { BetID } from '../../../utility/models/bet-id.model';
import { GroupModel } from './group-tickets.model';
import { TicketsListComponent } from './tickets-list.component';
import { TicketsModel } from './tickets.model';
import { By } from '@angular/platform-browser';
import { TestingModule } from '../../../utility/modules/testing.module';
import { EventEmitter } from '@angular/core';
import { MarkedTicketQuery } from '../models/query.model';
import { TicketsListService } from './tickets-list.service';
import { TicketModel } from './ticket.model';

class Helper {
  public static getFakeTicketsModel(): TicketsModel {
    const groups = new GroupModel();
    groups.tickets = [
      new TicketModel({ value: '108936575088', isChecked: true, isDisable: false, mainTransId: '108936575088', siteDbGroupId: 1 }),
      new TicketModel({ value: '108936575089', isChecked: false, isDisable: false, mainTransId: '108936575089', siteDbGroupId: 1 })
    ];
    groups.name = 'Test Group';
    groups.isCheckAll = false;
    groups.isExpanded = true;
    groups.isDisabled = false;
    
    const model = new TicketsModel();
    model.groups = [groups];
    model.totalItemsList = [
      { transId: '108936575088' } as BetID,
      { transId: '108936575089' } as BetID
    ];
    model.tempUncheckedList = ['108936575089'];

    return model;
  }
}

describe('TicketsListComponent', () => {
  let component: TicketsListComponent;
  let fixture: ComponentFixture<TicketsListComponent>;
  let mockTicketsListService: jest.Mocked<TicketsListService>;

  beforeEach(async () => {
    mockTicketsListService = {
      getTicketsParam: jest.fn(),
      getAllTickets: jest.fn(),
      getTicketsParamWithAllPage: jest.fn(),
      getNumberOfTickets: jest.fn(),
      checkGroups: jest.fn(),
      getUncheckedTicketList: jest.fn(),
      getUncheckedTicketListFromGroup: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        TestingModule
      ],
      providers: [
        { provide: TicketsListService, useValue: mockTicketsListService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketsListComponent);
    component = fixture.componentInstance;
    
    // Mock event emitters
    component.ticketsChange = new EventEmitter<number>();
    component.updateMarkedTickets = new EventEmitter<MarkedTicketQuery>();
    
    // Mock functions
    component.clickBody = jest.fn();
    component.exportExcel = jest.fn();
    component.showListCheckGroup = jest.fn();
    
    // Mock service methods to return empty arrays by default
    mockTicketsListService.getTicketsParam.mockReturnValue([]);
    mockTicketsListService.getAllTickets.mockReturnValue([]);
    mockTicketsListService.getTicketsParamWithAllPage.mockReturnValue([]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty model groups', () => {
    // Arrange
    component.isShowTickets = true;
    component.model = new TicketsModel();
    component.model.groups = [];
    component.clickBody = jest.fn();

    // Act
    component.ngOnInit();

    // Assert
    expect(fixture).toMatchSnapshot();
    expect(component.clickBody).toHaveBeenCalled();
  });

  it('should initialize with expected model groups', () => {
    // Arrange
    component.isShowTickets = true;
    component.model = Helper.getFakeTicketsModel();
    component.clickBody = jest.fn();

    // Act
    component.ngOnInit();

    // Assert
    expect(fixture).toMatchSnapshot();
    expect(component.clickBody).toHaveBeenCalled();
  });

  it('should handle checkbox select all tickets correctly', () => {
    // Arrange
    component.isShowTickets = true;
    component.model = Helper.getFakeTicketsModel();
    const mockEmit = jest.fn();
    component.ticketsChange.emit = mockEmit;
    
    // Mock service methods
    mockTicketsListService.getNumberOfTickets.mockReturnValue(2);
    mockTicketsListService.checkGroups.mockImplementation(() => {});
    
    fixture.detectChanges();

    // Act & Assert - First click (uncheck all)
    const checkboxAll = fixture.debugElement.query(By.css('span.checkbox-dropdown-list'));
    checkboxAll.triggerEventHandler('click', {});
    expect(checkboxAll).toBeTruthy();
    expect(mockTicketsListService.checkGroups).toHaveBeenCalledWith(component.model);
    expect(mockTicketsListService.getNumberOfTickets).toHaveBeenCalledWith(component.model.groups);

    // Act & Assert - Second click (check all)
    checkboxAll.triggerEventHandler('click', {});
    expect(mockTicketsListService.checkGroups).toHaveBeenCalledTimes(2);
  });

  it('should call exportExcel when clicking export excel button', () => {
    // Arrange
    component.isShowTickets = true;
    component.model = Helper.getFakeTicketsModel();
    component.exportExcel = jest.fn();
    
    // Mock service methods
    mockTicketsListService.getNumberOfTickets.mockReturnValue(2);
    
    fixture.detectChanges();

    // Act
    const buttonExportExcel = fixture.debugElement.query(By.css('input.title-tickets-list-toolbox-excel'));
    buttonExportExcel.triggerEventHandler('click', {});

    // Assert
    expect(buttonExportExcel).toBeTruthy();
    expect(component.exportExcel).toHaveBeenCalled();
  });

  it('should call showListCheckGroup when clicking show list group icon', () => {
    // Arrange
    component.isShowTickets = true;
    component.model = Helper.getFakeTicketsModel();
    component.showListCheckGroup = jest.fn();
    
    // Mock service methods
    mockTicketsListService.getNumberOfTickets.mockReturnValue(2);
    
    fixture.detectChanges();

    // Act
    const iconShowListGroup = fixture.debugElement.query(By.css('span.icon-arrow-white-down'));
    iconShowListGroup.triggerEventHandler('click', {});

    // Assert
    expect(iconShowListGroup).toBeTruthy();
    expect(component.showListCheckGroup).toHaveBeenCalled();
  });

  it('should display tooltip when marking selected tickets on page with no transid', () => {
    // Arrange
    component.model = new TicketsModel();
    component.model.groups = [];
    component.tooltip.display = jest.fn();
    
    // Mock service to return empty array
    mockTicketsListService.getTicketsParam.mockReturnValue([]);

    // Act
    component.markSelectedTicketsOnPage();

    // Assert
    expect(component.tooltip.display).toHaveBeenCalledWith('invalid-data', TEXT.EMPTY_TICKET);
  });

  it('should emit updateMarkedTickets event when marking selected tickets on page', () => {
    // Arrange
    component.model = Helper.getFakeTicketsModel();
    const mockEmit = jest.fn();
    component.updateMarkedTickets.emit = mockEmit;
    
    // Mock service methods
    const mockTickets = [{ transId: '108936575088', matchId: null, siteDbGroupId: 1 }] as BetID[];
    mockTicketsListService.getTicketsParam.mockReturnValue(mockTickets);
    mockTicketsListService.getAllTickets.mockReturnValue(mockTickets);

    // Act
    component.markSelectedTicketsOnPage();

    // Assert
    expect(mockTicketsListService.getTicketsParam).toHaveBeenCalledWith(component.model.groups);
    expect(mockTicketsListService.getAllTickets).toHaveBeenCalledWith(component.model.groups);
    expect(mockEmit).toHaveBeenCalled();
  });

  it('should display tooltip when marking selected tickets on all pages with no transid', () => {
    // Arrange
    component.model = new TicketsModel();
    component.model.totalItemsList = [];
    component.tooltip.display = jest.fn();
    
    // Mock service to return empty array
    mockTicketsListService.getTicketsParamWithAllPage.mockReturnValue([]);

    // Act
    component.markSelectedTicketsAllPage();

    // Assert
    expect(component.tooltip.display).toHaveBeenCalledWith('invalid-data', TEXT.EMPTY_TICKET);
  });

  it('should emit updateMarkedTickets event when marking selected tickets on all pages', () => {
    // Arrange
    component.model = Helper.getFakeTicketsModel();
    const mockEmit = jest.fn();
    component.updateMarkedTickets.emit = mockEmit;
    
    // Mock service methods
    const mockTickets = [{ transId: '108936575088', matchId: null, siteDbGroupId: 1 }] as BetID[];
    mockTicketsListService.getTicketsParamWithAllPage.mockReturnValue(mockTickets);
    mockTicketsListService.getAllTickets.mockReturnValue(mockTickets);

    // Act
    component.markSelectedTicketsAllPage();

    // Assert
    expect(mockTicketsListService.getTicketsParamWithAllPage).toHaveBeenCalledWith(component.model);
    expect(mockTicketsListService.getAllTickets).toHaveBeenCalledWith(component.model.groups);
    expect(mockEmit).toHaveBeenCalled();
  });

  describe('GroupModel', () => {
    it('should handle getEnableSingleTickets correctly', () => {
      // Arrange
      const groupModel = new GroupModel();
      groupModel.isCheckAll = false;
      // Khởi tạo tickets array
      groupModel.tickets = [
        new TicketModel({ value: '108936575088', isChecked: true, isDisable: false, mainTransId: '108936575088' }),
        new TicketModel({ value: '108936575089', isChecked: false, isDisable: false, mainTransId: '108936575089' })
      ];

      // Act
      const result = groupModel.getEnableSingleTickets();

      // Assert
      expect(result).toEqual(['108936575088', '108936575089']);
      expect(groupModel.isCheckAll).toBe(false);
    });

    it('should handle getDisableBonusTickets correctly', () => {
      // Arrange
      const groupModel = new GroupModel();
      groupModel.isCheckAll = false;
      // Khởi tạo tickets array
      groupModel.tickets = [
        new TicketModel({ value: '108936575088', isChecked: true, isDisable: true, mainTransId: '108936575088' }),
        new TicketModel({ value: '108936575089', isChecked: false, isDisable: false, mainTransId: '108936575089' })
      ];

      // Act
      const result = groupModel.getDisableBonusTickets();

      // Assert
      expect(result).toEqual([]);
      expect(groupModel.isCheckAll).toBe(false);
    });

    it('should handle getEnableParlayTickets correctly', () => {
      // Arrange
      const groupModel = new GroupModel();
      groupModel.isCheckAll = false;
      // Khởi tạo tickets array
      groupModel.tickets = [
        new TicketModel({ value: '108936575088', isChecked: true, isDisable: false, mainTransId: '108936575088' }),
        new TicketModel({ value: '108936575089', isChecked: false, isDisable: false, mainTransId: '108936575089' })
      ];

      // Act
      const result = groupModel.getEnableParlayTickets();

      // Assert
      expect(result).toEqual(['108936575088', '108936575089']);
      expect(groupModel.isCheckAll).toBe(false);
    });
  });
});