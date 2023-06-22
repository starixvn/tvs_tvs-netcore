import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Shallow } from 'shallow-render';
import { GroupBetTypesModel } from '../../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { Tooltip } from '../../../../utility/components/tooltip/tooltip.model';
import { ToolTipModule } from '../../../../utility/components/tooltip/tooltip.module';
import { Selection } from '../../../../utility/models/selection.model';
import { CommonService } from '../../../../utility/services/common.service';
import { GetLogsQuery } from '../../models/query.model';
import { CheckValidateService } from '../../services/check-validate.service';
import { FilterLogsComponent } from './filter-logs.component';
import { FilterAction, FilterDate } from './filter-logs.model';

class Helper {
  static readonly matchIdSelector = 'input.match-id';
  static readonly filterActionList: Selection[] = [
    { name: 'Mark(Manual)', value: '90500', group: 'All' },
    { name: 'Mark(Auto)', value: '90508', group: 'All' },
    { name: 'Mark(V.Winning)', value: '90509', group: 'All' },
    { name: 'Unmark(Manual)', value: '90501', group: 'All' },
    { name: 'Unmark(Auto)', value: '90510', group: 'All' },
    { name: 'Unmark All', value: '90502', group: 'All' }
  ];

  static getFakeErrorGroupBetTypesModel(): GroupBetTypesModel {
    const model = new GroupBetTypesModel([], null);
    model.result = { errorCode: 1, errorMsg: 'errorABC' };
    return model;
  }
}

describe('FilterLogsComponent', () => {
  @NgModule({
    declarations: [],
    imports: [
      ToolTipModule,
      FormsModule,
      NgbModule,
      NgSelectModule
    ],
    providers: [
      CheckValidateService
    ]
  })
  class ModuleTest { }
  let shallow: Shallow<FilterLogsComponent>;

  beforeEach(() => {
    shallow = new Shallow(FilterLogsComponent, ModuleTest)
      .dontMock(NgbModule)
      .mock(CheckValidateService, { checkValidMatch: jest.fn().mockImplementation(() => Promise.resolve(true)) })
      .mock(ElementRef, {});
  });

  it('FilterLogsComponent should match snapshot', async () => {
    const { instance, fixture } = await shallow
      .render();

    expect(fixture).toMatchSnapshot();
    expect(instance.model).toStrictEqual(new GetLogsQuery());
    expect(instance.action).toStrictEqual(new FilterAction());
    expect(instance.tooltip.element).toBeInstanceOf(ElementRef);
    expect(instance.isSuccessMatch).toBe(true);
    expect(instance.selectedActions).toStrictEqual(['90500', '90508', '90501', '90511', '90502']);
    const date = new Date();
    expect(instance.date.ngbFromDate).toStrictEqual(new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate()));
    expect(instance.date.ngbToDate).toStrictEqual(new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate()));
    expect(instance.minDate).toStrictEqual(new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate() - 7));
  });

  it('Props model.matchId should change when change match id input value', async () => {
    const { instance, find } = await shallow.render();
    const matchId = find(Helper.matchIdSelector);
    matchId.nativeElement.value = '1222';
    matchId.triggerEventHandler('input', { target: matchId.nativeElement });

    expect(instance.model.matchId).toBe('1222');
  });

  it('Should call checkValidMatch not display tooltip when matchId input blur', async () => {
    const mockGetGroupBetTypes = jest.fn();
    const { instance, find } = await shallow
      .mock(CommonService, { getGroupBetTypes: mockGetGroupBetTypes })
      .render();
    const spyCheckValidMatch = jest.spyOn(instance, 'checkValidMatch');
    const matchId = find(Helper.matchIdSelector);
    matchId.nativeElement.value = '';
    matchId.triggerEventHandler('input', { target: matchId.nativeElement });
    matchId.triggerEventHandler('blur', {});

    expect(spyCheckValidMatch).toBeCalledTimes(1);
    expect(mockGetGroupBetTypes).toBeCalledTimes(0);
    expect(instance.isSuccessMatch).toBe(true);
  });

  it('Props model.doneBy should be changed when change Done by input', async () => {
    const { instance, find } = await shallow
      .render();

    const doneBy = find('input.form-control')[3];
    doneBy.nativeElement.value = 'starix02';
    doneBy.triggerEventHandler('input', { target: doneBy.nativeElement });

    expect(instance.model.doneBy).toStrictEqual('starix02');
  });

  it('#search should emit searchEvent', async () => {
    const { instance } = await shallow
    .mock(CheckValidateService, { checkValidMatch: jest.fn().mockImplementation(() => true) })
    .render();
    instance.checkValidMatch = jest.fn();
    instance['getParams'] = jest.fn();
    instance.searchEvent.emit = jest.fn();
    instance.isSuccessMatch = true;
    await instance.search();

    expect(instance['getParams']).toBeCalledTimes(1);
    expect(instance.searchEvent.emit).toBeCalledTimes(1);
  });

  it('#search should call #tooltip.display', async () => {
    const { instance } = await shallow
    .mock(CheckValidateService, { checkValidMatch: jest.fn().mockImplementation(() => false) })
    .render();
    instance.checkValidMatch = jest.fn();
    instance.tooltip = new Tooltip();
    instance.tooltip.display = jest.fn();
    instance.isSuccessMatch = false;
    await instance.search();

    expect(instance.tooltip.display).toBeCalledTimes(1);
  });

  it('#checkValidMatch should update isSuccessMatch to true and return', async () => {
    const { instance } = await shallow
    .mock(CheckValidateService, { checkValidMatch: jest.fn().mockImplementation(() => Promise.resolve(true)) })
    .render();
    instance.model.matchId = '29';
    await instance.checkValidMatch();

    expect(instance.isSuccessMatch).toBeTruthy();
  });

  it('#getParams should return correct model', async () => {
    const expected = new GetLogsQuery();
    expected.logActionIds = '';
    expected.logDateFrom = '2021/12/3';
    expected.logDateTo = '2021/12/5';
    expected.pageIndex = 0;
    expected.pageSize = 3000;
    const { instance } = await shallow.render();
    instance.model = new GetLogsQuery();
    instance.date = new FilterDate();
    instance.date.ngbFromDate = new NgbDate(2021, 12, 3);
    instance.date.ngbToDate = new NgbDate(2021, 12, 5);
    instance.selectedActions = [];
    const actual = instance['getParams']();

    expect(actual).toStrictEqual(expected);
  });
});