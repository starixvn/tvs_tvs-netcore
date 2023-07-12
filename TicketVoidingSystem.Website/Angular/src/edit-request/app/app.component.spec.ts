import { NgModule } from '@angular/core';
import { Shallow } from 'shallow-render';
import { AddRequestComponent } from '../../add-request/app/add-request/add-request.component';
import { BlockFullUiModule } from '../../utility/components/block-full-ui/block-full-ui.module';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { HttpService } from './../../utility/services/http.service';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { PrimitiveProperty } from './models/primitive-property.model';
import { RequestDetailModel, RequestDetailViewModel } from './request.model';
import { LogInfoService } from './services/log-info.service';
import { ObjectService } from './services/object.service';

jest.mock('../../utility/services/signal-r.service.native');
class Helper {
  static readonly titleSelector = '.title';
  static readonly addRequestSelector = 'add-request';
  static readonly fakeScoreId = 28291;
  static readonly fakeRequestId = 50121;
  static readonly fakeMatchId = 90000;
  static readonly fakeDate = '2020-11-09 12:08:49.737';
  static readonly fakePrimitiveProperty: PrimitiveProperty = {
    isBlock: false,
    matchId: Helper.fakeMatchId,
    requestId: Helper.fakeRequestId,
    sportType: 1,
    actionIdOfFirstTimeAccess: '2',
    requestedBy: '',
    userId: 1
  };
  static readonly fakeRequestDetailModel: RequestDetailModel = {
    actionId: 1,
    decidedBy: null,
    isTest: false,
    isVoided: false,
    issueTypeId: 11,
    mistakenBy: null,
    operators: [],
    provider: null,
    remark: 'test',
    requestedBy: "sa",
    source: null,
    sportType: 2,
    voidedBy: null,
    userId: 1,
  };
  static readonly fakeRequestDetailViewModel: RequestDetailViewModel = {
    requestId: Helper.fakeRequestId,
    lastModifiedDate: null,
    request: Helper.fakeRequestDetailModel,
    event: null,
    messages: [],
    wrongScoreModels: [],
    dangerAcceptedModels: [],
    redCardModels: [],
    wrongHdpModels: [],
    wrongOuModels: [],
    wrongOddsModels: [],
    reducedOverModels: []
  };
}

describe('AppComponent', () => {
  @NgModule({
    declarations: [ AddRequestComponent ],
    imports: [
      BlockFullUiModule
    ],
    providers: [
      HttpService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<AppComponent>;

  beforeEach(() => {
    shallow = new Shallow(AppComponent, AppModuleTest)
    .mock(SignalRService, { initializeConnection: jest.fn()});
  });

  it('AppComponent should init match snapshot', async () => {
    // Arrange
    window.history.pushState({}, '', '/12345');
    const { find, fixture } = await shallow
      .mock(AppService, {
        getRequestById: jest.fn().mockImplementation(() => Helper.fakeRequestDetailViewModel)
      })
      .render();
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
    expect(find(Helper.titleSelector).nativeElement.textContent.trim()).toBe('Home / Manage Request / Edit Request - 12345');
  });

  it('#ngOnInit should call expected function', async () => {
    // Arrange
    window.history.pushState({}, '', '/12345');
    const spyGetPrimitiveProperty = jest.fn().mockImplementation(() => new PrimitiveProperty());
    const spyGteRequestById = jest.fn().mockImplementation(() => Helper.fakeRequestDetailViewModel);
    const spyMapRequestModel = jest.fn();
    const spyGetLogInfo = jest.fn();

    const { instance } = await shallow
    .mock(AppService, {
      getRequestById: spyGteRequestById
    })
    .mock(ObjectService, {
      getPrimitiveProperty: spyGetPrimitiveProperty,
      mapRequestModel: spyMapRequestModel
    })
    .mock(LogInfoService, {
      getLogInfo: spyGetLogInfo
    })
    .render();

    // Action
    instance.ngOnInit();

    // Assert
    expect(spyGteRequestById).toHaveBeenCalled();
    expect(spyGetPrimitiveProperty).toHaveBeenCalledTimes(1);
    expect(spyMapRequestModel).toHaveBeenCalledTimes(1);
    expect(spyGetLogInfo).toHaveBeenCalledTimes(1);
  });
});
