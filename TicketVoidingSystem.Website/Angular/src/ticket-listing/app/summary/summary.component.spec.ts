import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SummaryComponent } from './summary.component';
import { SummaryItem } from './summary.model';
import { ClipboardService } from 'ngx-clipboard';
import { SpecialPlatform } from '../../../utility/constants/special-platform.constant';

class Helper {
  static createMockSummaryItem(overrides: Partial<SummaryItem> = {}) {
    return {
      name: 'Test Item',
      total: 100,
      isChinaView: false,
      licenseeName: 'Test Licensee',
      betTypes: '29',
      items: [],
      betTypeName: 'Test Bet Type',
      isGroup: false,
      specialPlatform: null,
      isChecked: true,
      isShow: true,
      addSecondaryBetType: jest.fn(),
      renderItems: jest.fn(),
      ...overrides
    } as unknown as SummaryItem;
  }

  static readonly mockSummaryItem = Helper.createMockSummaryItem();

  static readonly mockSummaryItemChinaView = Helper.createMockSummaryItem({
    isChinaView: true,
    licenseeName: 'China Licensee'
  });

  static readonly mockSummaryItemJollySport = Helper.createMockSummaryItem({
    specialPlatform: SpecialPlatform.Jolly_Sports,
    licenseeName: 'Jolly Sport Licensee'
  });

  static readonly mockSummaryItemJollySportCV = Helper.createMockSummaryItem({
    specialPlatform: SpecialPlatform.Jolly_Sports_CV,
    licenseeName: 'Jolly Sport CV Licensee'
  });

  static readonly mockSummaryItemCredit = Helper.createMockSummaryItem({
    name: 'Credit',
    licenseeName: 'Credit Licensee'
  });
}

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;
  let clipboardService: ClipboardService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, SummaryComponent],
      providers: [
        { provide: ClipboardService}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    component.items = [Helper.mockSummaryItem];
    component.itemsGroupByLicensee = [Helper.mockSummaryItem];
    component.display = true;
    component.showSendColumn = true;
    component.groupBy = 0;
    clipboardService = fixture.debugElement.injector.get(ClipboardService);
    fixture.detectChanges();
  });

  it('should create', () => {
    // Arrange & Act & Assert
    expect(component).toBeTruthy();
  });

  it('#ngOnChanges should update affected licensees and total bet count when display is true', () => {
    // Arrange
    component.display = true;
    component.items = [Helper.mockSummaryItem];
    component.itemsGroupByLicensee = [Helper.mockSummaryItem];
    
    // Act
    component.ngOnChanges({
      items: { currentValue: component.items, previousValue: null, firstChange: true, isFirstChange: () => true },
      itemsGroupByLicensee: { currentValue: component.itemsGroupByLicensee, previousValue: null, firstChange: true, isFirstChange: () => true }
    });
    
    // Assert
    expect(component.affectedLicensees).toBe('Test Licensee');
    expect(component.totalBetCountOfNormalLicensee).toBe(100);
    expect(component.totalLicenseeCountOfNormal).toBe(1);
  });

  it('#getWidth should return correct width when showSendColumn is true', () => {
    // Arrange
    component.showSendColumn = true;
    
    // Act
    const width = component.getWidth();
    
    // Assert
    expect(width).toBe('746px');
  });

  it('#getWidth should return correct width when showSendColumn is false', () => {
    // Arrange
    component.showSendColumn = false;
    
    // Act
    const width = component.getWidth();
    
    // Assert
    expect(width).toBe('607px');
  });

  it('#getTicketsDetail should emit getTicketsEvent with item', () => {
    // Arrange
    component.getTicketsEvent = { emit: jest.fn() } as any;
    
    // Act
    component.getTicketsDetail(Helper.mockSummaryItem);
    
    // Assert
    expect(component.getTicketsEvent.emit).toHaveBeenCalledWith(Helper.mockSummaryItem);
  });

  it('#exportExcel should emit exportExcelEvent with item', () => {
    // Arrange
    component.exportExcelEvent = { emit: jest.fn() } as any;
    
    // Act
    component.exportExcel(Helper.mockSummaryItem);
    
    // Assert
    expect(component.exportExcelEvent.emit).toHaveBeenCalledWith(Helper.mockSummaryItem);
  });

  it('#changedCheckAll should update all items isChecked and isShowSend', () => {
    // Arrange
    component.items = [
      Helper.createMockSummaryItem(),
      Helper.createMockSummaryItem({ isChecked: false })
    ];
    component.checkedAll = true;
    
    // Act
    component.changedCheckAll();
    
    // Assert
    expect(component.items[0].isChecked).toBe(true);
    expect(component.items[1].isChecked).toBe(true);
    expect(component.isShowSend).toBe(true);
  });

  it('#changedCheckItem should update checkedAll and isShowSend based on items', () => {
    // Arrange
    component.items = [
      Helper.createMockSummaryItem({ isChecked: true }),
      Helper.createMockSummaryItem({ isChecked: false })
    ];
    
    // Act
    component.changedCheckItem();
    
    // Assert
    expect(component.checkedAll).toBe(false);
    expect(component.isShowSend).toBe(true);
  });

  it('#updateAffectedLicensees should update affected licensees correctly', () => {
    // Arrange
    component.items = [
      Helper.mockSummaryItem,
      Helper.mockSummaryItemChinaView,
      Helper.mockSummaryItemJollySport,
      Helper.mockSummaryItemJollySportCV
    ];
    component.groupBy = 0;
    
    // Act
    component.updateAffectedLicensees();
    
    // Assert
    expect(component.affectedLicensees).toBe('Test Licensee');
    expect(component.chinaViewLicensees).toBe('China Licensee');
    expect(component.jollyViewLicensees).toBe('Jolly Sport Licensee');
    expect(component.jollySportCvLicensees).toBe('Jolly Sport CV Licensee');
  });

  it('#updateTotalBetCount should update total bet counts correctly', () => {
    // Arrange
    component.itemsGroupByLicensee = [
      Helper.mockSummaryItemCredit,
      Helper.mockSummaryItem,
      Helper.mockSummaryItemChinaView,
      Helper.mockSummaryItemJollySport,
      Helper.mockSummaryItemJollySportCV
    ];
    
    // Act
    component.updateTotalBetCount();
    
    // Assert
    expect(component.totalBetCountOfCredit).toBe(100);
    expect(component.totalBetCountOfNormalLicensee).toBe(100);
    expect(component.totalBetCountOfChinaView).toBe(100);
    expect(component.totalBetCountOfJollySport).toBe(100);
    expect(component.totalBetCountOfJollySportCV).toBe(100);
    expect(component.totalLicenseeCountOfNormal).toBe(1);
    expect(component.totalLicenseeCountOfChinaView).toBe(1);
    expect(component.totalLicenseeCountOfJollySport).toBe(1);
    expect(component.totalLicenseeCountOfJollySportCV).toBe(1);
  });

  it('#sendExcelFile should emit sendExcelFileEvent with selected items', () => {
    // Arrange
    component.items = [
      Helper.mockSummaryItem,
      Helper.mockSummaryItemCredit,
      Helper.createMockSummaryItem({ isChecked: false })
    ];
    component.sendExcelFileEvent = { emit: jest.fn() } as any;
    
    // Act
    component.sendExcelFile();
    
    // Assert
    expect(component.sendExcelFileEvent.emit).toHaveBeenCalledWith([Helper.mockSummaryItem]);
  });

  it('#sendCreditDataToLetstalk should emit sendCreditToLetstalk with item', () => {
    // Arrange
    component.sendCreditToLetstalk = { emit: jest.fn() } as any;
    
    // Act
    component.sendCreditDataToLetstalk(Helper.mockSummaryItem);
    
    // Assert
    expect(component.sendCreditToLetstalk.emit).toHaveBeenCalledWith(Helper.mockSummaryItem);
  });

  it('#copyClipboard should copy text to clipboard and show alert', () => {
    // Arrange
    const mockText = 'Test Text';
    window.alert = jest.fn();
    clipboardService.copyFromContent = jest.fn();
    
    // Act
    component.copyClipboard(mockText);
    
    // Assert
    expect(clipboardService.copyFromContent).toHaveBeenCalledWith(mockText);
    expect(window.alert).toHaveBeenCalledWith('The Licensee list has been copied to clipboard.');
  });

  it('#isShowAffectedLicensees should return true when there are affected licensees', () => {
    // Arrange
    component.isShowSend = true;
    component.affectedLicensees = 'Test Licensee';
    clipboardService.copyFromContent = jest.fn();

    // Act
    const result = component.isShowAffectedLicensees();
    
    // Assert
    expect(result).toBe(true);
  });

  it('#isShowAffectedLicensees should return false when there are no affected licensees', () => {
    // Arrange
    component.isShowSend = true;
    component.affectedLicensees = '';
    component.chinaViewLicensees = '';
    component.jollyViewLicensees = '';
    component.jollySportCvLicensees = '';
    
    // Act
    const result = component.isShowAffectedLicensees();
    
    // Assert
    expect(result).toBe(false);
  });
});
