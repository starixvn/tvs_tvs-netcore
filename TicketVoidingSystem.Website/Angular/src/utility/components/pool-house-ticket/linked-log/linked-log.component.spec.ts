import { ElementRef, NgModule, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Shallow } from 'shallow-render';
import { PipeModule } from '../../../../utility/pipes/pipe.module';
import { Result } from '../../../models/result';
import { BlockUiModule } from '../../block-ui/block-ui.module';
import { ToolTipModule } from '../../tooltip/tooltip.module';
import { LinkedLogComponent } from './linked-log.component';
import { LinkedLogsViewModel } from './linked-log.model';

class Helper {
  static readonly inputsSelector = '.form-control';
  static readonly fakeLinkedLogsViewModel: LinkedLogsViewModel = {
    isLinkGroup1X2: true,
    isLinkGroupAIO: true,
    result: new Result(),
    poolHouseLinkedLogsData: [
      {
        groupName: '1X2',
        isShow: true,
        logsData: []
      },
      {
        groupName: 'AIO',
        isShow: true,
        logsData: []
      },
    ]
  };
}

describe('LinkedLogComponent ', () => { 
  @NgModule({
    declarations: [
    ],
    imports: [
      NgbModule,
      FormsModule,
      BlockUiModule,
      PipeModule,
      ToolTipModule
    ],
    providers: [
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<LinkedLogComponent>;

  beforeEach(() => {
    shallow = new Shallow(LinkedLogComponent, AppModuleTest)
      .mock(ElementRef, {})
      .dontMock(NgbModule);
  });

  it('LinkedLogComponent init should match snapshot', async () => {
    const { fixture } = await shallow
    .render({
      bind: {
        linkedLogsViewModel: new LinkedLogsViewModel()
      }
    });

    expect(fixture).toMatchSnapshot();
  });
  
  it('ngOnChanges should update title when change #linkedLogsViewModel', async () => {
    const fakeLinkedLogsViewModel = _.cloneDeep(Helper.fakeLinkedLogsViewModel);
    const { instance } = await shallow
    .render({
      bind: {
        linkedLogsViewModel: fakeLinkedLogsViewModel
      }
    });
    const changes = {
      'model': new SimpleChange(new LinkedLogsViewModel(), Helper.fakeLinkedLogsViewModel, true)
    };

    instance.ngOnChanges(changes);

    expect(instance.title).toBe('1X2 & AIO');
  });
  
  it('ngOnChanges should update title when change others', async () => {
    const fakeLinkedLogsViewModel = _.cloneDeep(Helper.fakeLinkedLogsViewModel);
    fakeLinkedLogsViewModel.poolHouseLinkedLogsData[0].isShow = false;
    const { instance } = await shallow
    .render({
      bind: {
        linkedLogsViewModel: fakeLinkedLogsViewModel
      }
    });
    const changes = {
      'model': new SimpleChange(1, 2, true)
    };

    instance.ngOnChanges(changes);

    expect(instance.title).toBe('AIO');
  });
  
  it('isShowTitle should return true', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        linkedLogsViewModel: Helper.fakeLinkedLogsViewModel
      }
    });

    const actual = instance.isShowTitle();

    expect(actual).toBeTruthy();
  });
});