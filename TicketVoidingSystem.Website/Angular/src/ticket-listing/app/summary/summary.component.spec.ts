import { NgModule, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Shallow } from 'shallow-render';
import { SummaryComponent } from './summary.component';
import { SummaryItem } from './summary.model';

class Helper {
  static readonly totalBetCountSelector = '.total-bet-count';
  static readonly emptyTableSelector = '.empty-table';
  static readonly affectedLicenseesSelector = '.affected-licensees';
  static readonly fakeSummaryItem = new SummaryItem('ABC', 1129, false, '12Bet', '2', [], 'Handicap');
  static readonly fakeSummaryItemHaveItems = new SummaryItem('DEF', 1130, false, 'Bet', '2', [Helper.fakeSummaryItem], 'Handicap');
  static readonly fakeSummaryItemHaveItemsCV = new SummaryItem('DEF', 1130, true, 'Bet', '2', [Helper.fakeSummaryItem], 'Handicap');
  static readonly fakeSummaryItemByCN88 = new SummaryItem('haifa', 1131, true, '12Bet', '2', [], 'Handicap');
  static readonly fakeSummaryItemByCredit = new SummaryItem('Credit', 1132, true, '12Bet', '2', [], 'Handicap');
}

describe('SummaryComponent', () => {
  @NgModule({
    declarations: [
    ],
    imports: [
      FormsModule
    ],
    providers: []
  })
  class AppModuleTest { }

  let shallow: Shallow<SummaryComponent>;

  beforeEach(() => {
    shallow = new Shallow(SummaryComponent, AppModuleTest);
  });

  it('#ngOnChanges should call #updateAffectedLicensees and #updateTotalBetCount', async () => {
    // Arrange
    const { instance } = await shallow.render();
    const changes = {
      'items': new SimpleChange([], [Helper.fakeSummaryItem], true) ,
      'itemsGroupByLicensee': new SimpleChange([], [Helper.fakeSummaryItem], true)
    };
    instance.display = true;
    instance.updateAffectedLicensees = jest.fn();
    instance.updateTotalBetCount = jest.fn();

    // Action
    instance.ngOnChanges(changes);

    // Assert
    expect(instance.updateAffectedLicensees).toHaveBeenCalled();
    expect(instance.updateTotalBetCount).toHaveBeenCalled();
  });

  it('#getWidth should return expected width', async () => {
    // Arrange
    const { instance } = await shallow.render();
    const testCases = [
      { showSendColumn: true, width: '746px' },
      { showSendColumn: false, width: '607px' },
    ];

    // Action and Assert
    for (const item of testCases) {
      instance.showSendColumn = item.showSendColumn;
      expect(instance.getWidth()).toBe(item.width);
    }
  });

  it('#getTicketsDetail should call #getTicketsEvent.emit with expected SummaryItem model', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.getTicketsEvent.emit = jest.fn();

    // Action
    instance.getTicketsDetail(Helper.fakeSummaryItem);

    // Assert
    expect(instance.getTicketsEvent.emit).toHaveBeenCalledWith(Helper.fakeSummaryItem);
  });

  it('#exportExcel should call #exportExcelEvent.emit with expected SummaryItem model', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.exportExcelEvent.emit = jest.fn();

    // Action
    instance.exportExcel(Helper.fakeSummaryItem);

    // Assert
    expect(instance.exportExcelEvent.emit).toHaveBeenCalledWith(Helper.fakeSummaryItem);
  });

  it('#changedCheckAll should return expected data', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.checkedAll = true;
    instance.items = [Helper.fakeSummaryItemHaveItems,Helper.fakeSummaryItemHaveItemsCV];

    // Action
    instance.changedCheckAll();

    // Assert
    expect(instance.checkedAll).toBe(true);
    expect(instance.isShowSend).toBe(true);
  });

  it('#changedCheckItem should return expected data', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.items = [Helper.fakeSummaryItem, Helper.fakeSummaryItemHaveItems];

    // Action
    instance.changedCheckItem();

    // Assert
    expect(instance.checkedAll).toBe(false);
    expect(instance.isShowSend).toBe(true);
  });

  it('#updateTotalBetCount should return expected total data', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.itemsGroupByLicensee = [Helper.fakeSummaryItem, Helper.fakeSummaryItemByCN88, Helper.fakeSummaryItemByCredit];

    // Action
    instance.updateTotalBetCount();

    // Assert
    expect(instance.totalBetCountOfCredit).toBe(1132);
    expect(instance.totalBetCountOfChinaView).toBe(2263);
    expect(instance.totalBetCountOfLicensee).toBe(1129);
  });

  it('#sendExcelFile should call #sendExcelFileEvent.emit with expected SummaryItem model list', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.items = [Helper.fakeSummaryItem, Helper.fakeSummaryItemHaveItems];
    instance.sendExcelFileEvent.emit = jest.fn();

    // Action
    instance.sendExcelFile();

    // Assert
    expect(instance.sendExcelFileEvent.emit).toHaveBeenCalledWith([Helper.fakeSummaryItemHaveItems]);
  });

  it('#sendExcelFile should not call #sendExcelFileEvent.emit with expected SummaryItem model list', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.items = [];
    instance.sendExcelFileEvent.emit = jest.fn();

    // Action
    instance.sendExcelFile();

    // Assert
    expect(instance.sendExcelFileEvent.emit).toHaveBeenCalledTimes(0);
  });

  it('#copyClipboard should display pop-up from window', async() => {
    // Arrange
    const { instance } = await shallow.render();
    const selectionObject = {
      removeAllRanges: () => {},
      addRange: () => {}
    };
    const rangeObject = {
      selectNode: () => {}
    };
    window.getSelection = jest.fn().mockImplementation(() => selectionObject);
    document.createRange = jest.fn().mockImplementation(() => rangeObject);
    document.getElementById = jest.fn();
    window.alert = jest.fn();
    document.execCommand = jest.fn();

    // Action
    instance.copyClipboard('The Licensee list has been copied to clipboard.');

    // Assert
    expect(window.alert).toHaveBeenCalledWith('The Licensee list has been copied to clipboard.');
  });

  it('should display empty table', async() => {
    const { fixture, find, instance } =  await shallow.render('<summary-tickets [display]="isShowSummary"></summary-tickets>', {
      bind: {
        isShowSummary: true,
      }
    });
    instance.items = [];
    fixture.detectChanges();

    expect(find(Helper.emptyTableSelector)).toHaveFoundOne();
  });

  it('should show/hide affected-licensees correctly', async() => {
    const { fixture, find, instance } =  await shallow.render('<summary-tickets [display]="isShowSummary" [showSendColumn]="showSendColumn"></summary-tickets>', {
      bind: {
        isShowSummary: true,
        showSendColumn: true
      }
    });
    instance.affectedLicensees = 'Bet';
    fixture.detectChanges();
    expect(find(Helper.affectedLicenseesSelector)).toHaveFoundOne();

    instance.affectedLicensees = '';
    fixture.detectChanges();
    expect(find(Helper.affectedLicenseesSelector)).toHaveFound(0);
  });
  
  it('#sendCreditDataToLetstalk should emit sendCreditToLetstalk', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.sendCreditToLetstalk.emit = jest.fn();

    // Action
    instance.sendCreditDataToLetstalk(null);

    // Assert
    expect(instance.sendCreditToLetstalk.emit).toHaveBeenCalledTimes(1);
  });
  
  it('#updateAffectedLicensees should update affectedLicensees', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.sendCreditToLetstalk.emit = jest.fn();

    // Action
    [0, 1].forEach(x => {
      instance.groupBy = x;
      Helper.fakeSummaryItem.isChecked = true;
      Helper.fakeSummaryItemByCredit.isChecked = true;
      instance.items = [Helper.fakeSummaryItem, Helper.fakeSummaryItemByCredit]
      instance.itemsGroupByLicensee = [Helper.fakeSummaryItem, Helper.fakeSummaryItemByCredit]
      instance.updateAffectedLicensees();

      // Assert
      expect(instance.affectedLicensees).toBe('12Bet');
      expect(instance.chinaViewLicensees ).toBe('12Bet');
    })
  });
});
