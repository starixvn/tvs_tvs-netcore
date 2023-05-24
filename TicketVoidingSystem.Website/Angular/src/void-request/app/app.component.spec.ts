import { NgModule } from '@angular/core';
import { Shallow } from 'shallow-render';
import { RequestDetailModel, RequestDetailViewModel } from '../../add-request/app/add-request/models/request.model';
import { BlockUiModule } from '../../utility/components/block-ui/block-ui.module';
import { TemplateService } from '../../utility/components/template-message/template-message/template.service';
import { ToolTipModule } from '../../utility/components/tooltip/tooltip.module';
import { IssueTypeConstant } from '../../utility/constants/issue-type.constant';
import { HttpService } from '../../utility/services/http.service';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { RequestLastModifiedDate } from './models/request-last-modified-date.model';
import { VoidDangerAcceptedComponent } from './void-danger-accepted/void-danger-accepted.component';
import { VoidOtherIssueComponent } from './void-other-issue/void-other-issue.component';

jest.mock('../../utility/services/signal-r.service.native');
class Helper {
  static readonly url = 'http://localhost:60196/415421';
  static readonly fakeRequestId = 50121;
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
    userId: 0
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
    wrongOddsModels: []
  };
}

describe('AppComponent', () => {
  @NgModule({
    declarations: [
      VoidDangerAcceptedComponent,
      VoidOtherIssueComponent
    ],
    imports: [
      ToolTipModule,
      BlockUiModule
    ],
    providers: [HttpService, TemplateService]
  })
  class AppModuleTest { }

  let shallow: Shallow<AppComponent>;

  beforeEach(() => {
    shallow = new Shallow(AppComponent, AppModuleTest)    
    .mock(SignalRService, { initializeConnection: jest.fn()});
  });

  it('AppComponent should init match snapshot', async () => {
    const { fixture } = await shallow.render();
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
  
  it('ngOnInit should called expected', async () => {
    const mockGetRemark = jest.fn();
    const mockGetRequestById = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeRequestDetailViewModel));
    const mockGetLastModifiedDate = jest.fn().mockImplementation(() => Promise.resolve(new RequestLastModifiedDate()));
    const mockInitializeConnection = jest.fn();
    Object.defineProperty(window, 'location', {
      value: new URL(Helper.url)
    });
    const { instance } = await shallow
    .mock(AppService, {
      getRemark: mockGetRemark,
      getRequestById: mockGetRequestById,
      getLastModifiedDate: mockGetLastModifiedDate
    })
    .mock(SignalRService, { initializeConnection: mockInitializeConnection })
    .render();

    await instance.ngOnInit();

    expect(mockGetRemark).toHaveBeenCalled();
    expect(mockGetRequestById).toHaveBeenCalled();
    expect(mockGetLastModifiedDate).toHaveBeenCalled();
    expect(mockInitializeConnection).toHaveBeenCalled();
  });
  
  it('isApplyVoidNewDesign should be return false', async () => {
    const { instance } = await shallow.render();
    instance.requestDetail = Helper.fakeRequestDetailViewModel;
    instance.requestDetail.request.issueTypeId = Number(IssueTypeConstant.ABNORMAL_BET);

    const actual = instance.isApplyVoidNewDesign();

    expect(actual).toBeFalsy();
  });
  
  it('isApplyVoidNewDesign should be return false', async () => {
    const { instance } = await shallow.render();
    instance.requestDetail = Helper.fakeRequestDetailViewModel;
    instance.requestDetail.request = null;

    const actual = instance.isApplyVoidNewDesign();

    expect(actual).toBeFalsy();
  });

  it('updateBlockUI should update #isBlockUI ', async () => {
    const { instance } = await shallow.render();

    instance.updateBlockUI(false);

    expect(instance.isBlockUI).toBeFalsy();
  });
});