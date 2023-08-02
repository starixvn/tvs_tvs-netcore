import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { BlockUiModule } from '../../../../../utility/components/block-ui/block-ui.module';
import { GroupOperator, OperatorInfo, OthersModel } from '../../others/others.model';
import { OthersWrongHdpComponent } from './others-wrong-hdp.component';
import { PipeModule } from '../../../../../utility/pipes/pipe.module';

class Helper {
  static readonly inputsSelector = '.form-control';
  static getFakeOperatorInfo(): OperatorInfo[] {
    return  [
      { matchId: 0, userName: 'N/A', groupName: 'Trader', operatorId: 0, operatorType: 1 },
      { matchId: 0, userName: 'UserA', groupName: 'Trader', operatorId: 1, operatorType: 1 },
      { matchId: 0, userName: 'UserB', groupName: 'Trader', operatorId: 1, operatorType: 1 },
      { matchId: 0, userName: 'N/A', groupName: 'Suspender', operatorId: 0, operatorType: 2 },
      { matchId: 0, userName: 'UserC', groupName: 'Suspender', operatorId: 2, operatorType: 2 },
      { matchId: 0, userName: 'UserD', groupName: 'Suspender', operatorId: 2, operatorType: 2 },
    ];
  }
  static readonly fakeGroupOperator: GroupOperator = {
    name: '',
    items: Helper.getFakeOperatorInfo(),
    selected: [],
  };
  static readonly fakeOthersModel: OthersModel = {
    mistakenBy: '',
    decidedBy: '',
    operatorsList: Helper.getFakeOperatorInfo(),
    provider: '',
    source: '',
    remark: '',
  };
}

describe('OthersWrongHdpComponent', () => { 
  @NgModule({
    declarations: [
    ],
    imports: [
      NgbModule,
      FormsModule,
      BlockUiModule,
      PipeModule
    ],
    providers: [
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<OthersWrongHdpComponent>;

  beforeEach(() => {
    shallow = new Shallow(OthersWrongHdpComponent, AppModuleTest)
      .mock(ElementRef, {})
      .dontMock(NgbModule);
  });

  it('OthersWrongHdpComponent init should match snapshot', async () => {
    const { fixture } = await shallow
    .render({
      bind: {
        isEdit: false,
        model: Helper.fakeOthersModel
      }
    });

    expect(fixture).toMatchSnapshot();
  });
});