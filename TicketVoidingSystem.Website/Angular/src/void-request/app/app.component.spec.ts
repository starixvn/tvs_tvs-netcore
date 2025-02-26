import { RequestDetailModel, RequestDetailViewModel } from '../../edit-request/app/request.model';
import { IssueTypeConstant } from '../../utility/constants/issue-type.constant';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlockUiModule } from '../../utility/components/block-ui/block-ui.module';
import { MenuBarComponent } from '../../utility/components/menu-bar/menu-bar.component';
import { VoidAbnormalBetComponent } from './void-abnormal-bet/void-abnormal-bet.component';
import { VoidDangerAcceptedComponent } from './void-danger-accepted/void-danger-accepted.component';
import { VoidDuplicateTicketsComponent } from './void-duplicate-tickets/void-duplicate-tickets.component';
import { VoidEarlyKickOffComponent } from './void-early-kick-off/void-early-kick-off.component';
import { VoidNotParticipateComponent } from './void-not-participate/void-not-participate.component';
import { VoidOtherIssueComponent } from './void-other-issue/void-other-issue.component';
import { VoidWrongMarketOfferedComponent } from './void-wrong-market-offered/void-wrong-market-offered.component';

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
    userId: 0,
    requestId: 1,
    briefInfoNote: ''
  };
  static readonly fakeRequestDetailViewModel: RequestDetailViewModel = {
    requestId: Helper.fakeRequestId,
    lastModifiedDate: null,
    request: Helper.fakeRequestDetailModel,
    event: null,
    playerNames: [],
    wrongScoreModels: [],
    dangerAcceptedModels: [],
    redCardModels: [],
    wrongHdpModels: [],
    wrongOuModels: [],
    wrongOddsModels: [],
    reducedOverModels: [],
    duplicateTicketsModel: null
  };
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoidDangerAcceptedComponent, VoidOtherIssueComponent, VoidDuplicateTicketsComponent,
        VoidNotParticipateComponent, VoidEarlyKickOffComponent, VoidAbnormalBetComponent,
        VoidWrongMarketOfferedComponent, MenuBarComponent, BlockUiModule],
      providers: [AppService, SignalRService]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('AppComponent should init match snapshot', async () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('isApplyVoidNewDesign should be return false', async () => {
    component.requestDetail = Helper.fakeRequestDetailViewModel;
    component.requestDetail.request.issueTypeId = Number(IssueTypeConstant.ABNORMAL_BET);

    const actual = component.isLikelyVoidDangerAccepted();

    expect(actual).toBeFalsy();
  });

  it('isApplyVoidNewDesign should be return false', async () => {
    component.requestDetail = Helper.fakeRequestDetailViewModel;
    component.requestDetail.request = null;

    const actual = component.isLikelyVoidDangerAccepted();

    expect(actual).toBeFalsy();
  });

  it('updateBlockUI should update #isBlockUI ', async () => {
    component.updateBlockUI(false);

    expect(component.isBlockUI).toBeFalsy();
  });
});