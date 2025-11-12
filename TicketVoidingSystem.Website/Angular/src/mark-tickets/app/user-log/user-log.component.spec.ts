import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';
import { PagingModel } from '../../../utility/components/paging/paging.model';
import { AppService } from '../app.service';
import { GetLogsQuery } from '../models/query.model';
import { FilterLogsComponent } from './filter-logs/filter-logs.component';
import { LogsListComponent } from './logs-list/logs-list.component';
import { LogModel, LogsModel } from './logs-list/logs-list.model';
import { UserLogComponent } from './user-log.component';
import { By } from '@angular/platform-browser';

class Helper {
  static readonly fakeLogsModel = {
    totalLogs: 13,
    logList: [{
      no: 1,
      actionId: 12,
      logDate: new Date(150000000),
      action: 'aa',
      matchId: 12,
      event: 'event',
      kickOffTime: new Date(160000000),
      htScore: 'htScore',
      ftScore: 'ftScore',
      singleTickets: ['11'],
      parlayTickets: ['22'],
      doneBy: 'sa'
    }]
  } as LogsModel;

  static readonly fakeQuery: GetLogsQuery = {
    matchId: '113',
    doneBy: 'sa',
    logActionIds: '111,112',
    logDateFrom: '11/2',
    logDateTo: '12/2',
    pageIndex: 2,
    pageSize: 50
  };

  static readonly fakePagingModel: PagingModel = {
    page: 3,
    pageSize: 200,
    selection: [50, 100, 200, 500],
    total: 13,
    begin: 0,
    end: 13
  };
}

describe('UserLogComponent', () => {
  let component: UserLogComponent;
  let fixture: ComponentFixture<UserLogComponent>;
  let appService: AppService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule      ],
      providers: [
        AppService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserLogComponent);
    appService = fixture.debugElement.injector.get(AppService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    // Act
    fixture.detectChanges();

    // Assert
    expect(component.isBlockLogs).toBeUndefined();
    expect(component.isShowLogs).toBeUndefined();
    expect(component.logsModel).toStrictEqual(new Array<LogModel>());
    expect(component.pagingOfLogs).toStrictEqual(new PagingModel());
    expect(component.queryLog).toStrictEqual(new GetLogsQuery());
    expect(component.pageSizeOfLogs).toStrictEqual([50, 100, 200, 500]);
  });

  it('should render html with correct model', () => {
    // Act
    fixture.detectChanges();
    const logsList = fixture.debugElement.query(By.directive(LogsListComponent));

    // Assert
    expect(logsList).toBeTruthy();
    expect(logsList.componentInstance.model).toBe(component.logsModel);
    expect(logsList.componentInstance.isShowLogs).toBe(component.isShowLogs);
    expect(logsList.componentInstance.isBlock).toBe(component.isBlockLogs);
    expect(logsList.componentInstance.paging).toBe(component.pagingOfLogs);
  });

  it('should handle search logs when filter logs component emits search event', async () => {
    // Arrange
    const mockGetUserLogs = jest.fn().mockImplementation(x => Promise.resolve(Helper.fakeLogsModel));
    appService.getUserLogs = mockGetUserLogs;
    const spySearchLogs = jest.spyOn(component, 'searchLogs');
    fixture.detectChanges();
    const filterLogs = fixture.debugElement.query(By.directive(FilterLogsComponent));

    // Act
    filterLogs.componentInstance.searchEvent.emit(Helper.fakeQuery);
    await fixture.whenStable();

    // Assert
    expect(spySearchLogs).toHaveBeenCalledTimes(1);
    expect(spySearchLogs).toHaveBeenCalledWith(Helper.fakeQuery);
    
    const expectedPaging = new PagingModel();
    expectedPaging.pageSize = 50;
    expectedPaging.selection = [50, 100, 200, 500];
    expectedPaging.total = Helper.fakeLogsModel.totalLogs;
    
    expect(component.pagingOfLogs).toStrictEqual(expectedPaging);
    expect(component.queryLog).toBe(Helper.fakeQuery);
    expect(component.isBlockLogs).toBe(false);
    expect(component.isShowLogs).toBe(true);
    expect(component.logsModel).toBe(Helper.fakeLogsModel.logList);
    expect(mockGetUserLogs).toHaveBeenCalledTimes(1);
    expect(mockGetUserLogs).toHaveBeenCalledWith(Helper.fakeQuery);
  });

  it('should handle paging event when logs list component emits paging change', async () => {
    // Arrange
    const mockGetUserLogs = jest.fn().mockImplementation(x => Promise.resolve(Helper.fakeLogsModel));
    appService.getUserLogs = mockGetUserLogs;
    const spyPagingEventOfLogs = jest.spyOn(component, 'pagingEventOfLogs');
    fixture.detectChanges();
    const logsList = fixture.debugElement.query(By.directive(LogsListComponent));

    // Act
    logsList.componentInstance.pagingChange.emit(Helper.fakePagingModel);
    await fixture.whenStable();

    // Assert
    expect(spyPagingEventOfLogs).toHaveBeenCalledTimes(1);
    expect(spyPagingEventOfLogs).toHaveBeenCalledWith();
    expect(component.queryLog.pageIndex).toEqual(Helper.fakePagingModel.page - 1);
    expect(component.queryLog.pageSize).toEqual(Helper.fakePagingModel.pageSize);
    expect(mockGetUserLogs).toHaveBeenCalledTimes(1);
    expect(mockGetUserLogs).toHaveBeenCalledWith(component.queryLog);
  });
});
