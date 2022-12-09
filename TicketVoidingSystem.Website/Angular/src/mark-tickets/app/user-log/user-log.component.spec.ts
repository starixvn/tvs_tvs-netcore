import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Shallow } from 'shallow-render';
import { PagingModel } from '../../../utility/modules/paging/paging/paging.model';
import { AppService } from '../app.service';
import { GetLogsQuery } from '../models/query.model';
import { FilterLogsComponent } from './filter-logs/filter-logs.component';
import { LogsListComponent } from './logs-list/logs-list.component';
import { LogModel, LogsModel } from './logs-list/logs-list.model';
import { UserLogComponent } from './user-log.component';

@NgModule({
  declarations: [UserLogComponent, FilterLogsComponent, LogsListComponent],
  imports: [
    FormsModule,
  ],
})
class ModuleTest { }

class Helper {
  static getFakeLogsModel() {
    return {
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
  }

  static getFakeQuery() {
    return {
      matchId: '113', doneBy: 'sa', logActionIds: '111,112',
      logDateFrom: '11/2', logDateTo: '12/2', pageIndex: 2, pageSize: 50
    } as GetLogsQuery;
  }
}
describe('UserLogComponent', () => {
  let shallow: Shallow<UserLogComponent>;

  beforeEach(() => {
    shallow = new Shallow(UserLogComponent, ModuleTest).mock(AppService, {});
  });

  it('UserLogComponent should init match snapshot', async () => {
    const { fixture, instance } = await shallow.render();

    expect(fixture).toMatchSnapshot();
    expect(instance.isBlockLogs).toBe(undefined);
    expect(instance.isShowLogs).toBe(undefined);
    expect(instance.logsModel).toStrictEqual(new Array<LogModel>());
    expect(instance.pagingOfLogs).toStrictEqual(new PagingModel());
    expect(instance.queryLog).toStrictEqual(new GetLogsQuery());
    expect(instance.pageSizeOfLogs).toStrictEqual([50, 100, 200, 500]);
  });

  it('UserLogComponent should render html with correct model', async () => {
    const { instance, findComponent } = await shallow.render();

    const logsList = findComponent(LogsListComponent);

    expect(logsList).toHaveFoundOne();
    expect(logsList.model).toBe(instance.logsModel);
    expect(logsList.isShowLogs).toBe(instance.isShowLogs);
    expect(logsList.isBlock).toBe(instance.isBlockLogs);
    expect(logsList.paging).toBe(instance.pagingOfLogs);
  });

  it('should call #searchLogs when </filter-logs> emit event (searchEvent)', async () => {
    const fakeLogsModel = Helper.getFakeLogsModel();
    const fakeQuery = Helper.getFakeQuery();
    const mockGetUserLogs = jest.fn().mockImplementation(x => Promise.resolve(fakeLogsModel));
    const { fixture, instance, findComponent } = await shallow
      .mock(AppService, { getUserLogs: mockGetUserLogs })
      .render();
    const spySearchLogs = jest.spyOn(instance, 'searchLogs');
    const filterLogs = findComponent(FilterLogsComponent);
    filterLogs.searchEvent.emit(fakeQuery);
    await fixture.whenStable();

    expect(filterLogs).toHaveFoundOne();
    expect(spySearchLogs).toHaveBeenCalledTimes(1);
    expect(spySearchLogs).toHaveBeenCalledWith(fakeQuery);
    const expectedPaging = new PagingModel();
    expectedPaging.pageSize = 50;
    expectedPaging.selection = [50, 100, 200, 500];
    expectedPaging.total = fakeLogsModel.totalLogs;
    expect(instance.pagingOfLogs).toStrictEqual(expectedPaging);
    expect(instance.queryLog).toBe(fakeQuery);
    expect(instance.isBlockLogs).toBe(false);
    expect(instance.isShowLogs).toBe(true);
    expect(instance.logsModel).toBe(fakeLogsModel.logList);
    expect(mockGetUserLogs).toBeCalledTimes(1);
    expect(mockGetUserLogs).toBeCalledWith(fakeQuery);
  });

  it('should call #pagingEventOfLogs when </logs-list> emit event (pagingChange)', async () => {
    const fakeLogsModel = Helper.getFakeLogsModel();
    const mockGetUserLogs = jest.fn().mockImplementation(x => Promise.resolve(fakeLogsModel));
    const { fixture, instance, findComponent } = await shallow
      .mock(AppService, { getUserLogs: mockGetUserLogs })
      .render();
    const spyPagingEventOfLogs = jest.spyOn(instance, 'pagingEventOfLogs');
    const fakePagingModel = new PagingModel();
    fakePagingModel.page = 3;
    fakePagingModel.pageSize = 200;
    const logsList = findComponent(LogsListComponent);
    logsList.pagingChange.emit(fakePagingModel);
    await fixture.whenStable();

    expect(spyPagingEventOfLogs).toHaveBeenCalledTimes(1);
    expect(spyPagingEventOfLogs).toHaveBeenCalledWith();
    expect(instance.queryLog.pageIndex).toEqual(fakePagingModel.page - 1);
    expect(instance.queryLog.pageSize).toEqual(fakePagingModel.pageSize);
    expect(mockGetUserLogs).toBeCalledTimes(1);
    expect(mockGetUserLogs).toBeCalledWith(instance.queryLog);
  });
});
