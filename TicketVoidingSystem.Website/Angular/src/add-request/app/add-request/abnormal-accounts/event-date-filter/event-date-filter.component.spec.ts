import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { ToolTipModule } from '../../../../../utility/components/tooltip/tooltip.module';
import { BalanceUp } from '../../../../../utility/models/balance-up.model';
import { CommonService } from '../../../../../utility/services/common.service';
import { AbnormalAccountModel } from '../../models/abnormal-account.model';
import { EventDateFilterComponent } from './event-date-filter.component';
class Helper {
  static readonly fromDate = '2021-12-18 12:08:49.737';
  static readonly toDate = '2021-12-21 12:08:49.737';

  static readonly fakeBalanceUp: BalanceUp = {
    balanceUpDay: new Date('2021-12-16'),
    moveBetsDay: new Date('2021-12-26')
  };
}

describe('EventDateFilterComponent', () => { 
  @NgModule({
    declarations: [
    ],
    imports: [
      NgbModule,
      FormsModule,
      ToolTipModule
    ],
    providers: [
      CommonService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<EventDateFilterComponent>;

  beforeEach(() => {
    shallow = new Shallow(EventDateFilterComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('#EventDateFilterComponent init should match snapshot', async () => {
    const { fixture } = await shallow.render();

    expect(fixture).toMatchSnapshot();
  });
  
  it('#ngOnInit should call #initEventDate', async () => {
    const { instance } = await shallow.render();
    instance.initEventDate = jest.fn();
    instance.ngOnInit();
    
    expect(instance.initEventDate).toHaveBeenCalledTimes(1);
  });
  
  it('#initEventDate should update correct data when isEdit', async () => {
    const mockGetBalanceUp = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeBalanceUp));
    const { instance } = await shallow
    .mock(CommonService, { getBalanceUp: mockGetBalanceUp})
    .render();
    instance.isEdit = true;
    instance.abnormalAccountModel = new AbnormalAccountModel();
    instance.abnormalAccountModel.fromDate = Helper.fromDate;
    instance.abnormalAccountModel.toDate = Helper.toDate;
    
    await instance.initEventDate();
    
    expect(instance.fromDate).toStrictEqual(new NgbDate(2021, 12, 18));
    expect(instance.toDate).toStrictEqual(new NgbDate(2021, 12, 21));
  });
  
  it('#initEventDate should update correct data when add request', async () => {
    const mockGetBalanceUp = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeBalanceUp));
    const { instance } = await shallow
    .mock(CommonService, { getBalanceUp: mockGetBalanceUp})
    .render();
    instance.isEdit = false;
    instance.abnormalAccountModel = new AbnormalAccountModel();
    
    await instance.initEventDate();
    
    expect(instance.minDate).toBeDefined();
  });
  
  it('#isValidEventDate should return true', async () => {
    const { instance } = await shallow.render();
    instance.fromDate = new NgbDate(2021, 12, 18);
    instance.toDate = new NgbDate(2021, 12, 21);
    instance.abnormalAccountModel = new AbnormalAccountModel();
    
    const actual = instance.isValidEventDate();
    
    expect(actual).toBe(true);
  });
  
  it('#isValidEventDate should return false', async () => {
    const { instance } = await shallow.render();
    instance.fromDate = new NgbDate(2021, 12, 29);
    instance.toDate = new NgbDate(2021, 12, 21);
    instance.tooltip = new Tooltip();
    instance.tooltip.display = jest.fn();
    instance.toDate.year = NaN;
    const actual = instance.isValidEventDate();
    
    expect(actual).toBe(false);
    expect(instance.tooltip.display).toHaveBeenCalledTimes(1);
  });
  
  it('#isValidEventDate should return true', async () => {
    const { instance } = await shallow.render();
    instance.fromDate = new NgbDate(2021, 12, 29);
    instance.toDate = null;
    instance.abnormalAccountModel = new AbnormalAccountModel();

    const actual = instance.isValidEventDate();
    
    expect(actual).toBe(true);
  });
});