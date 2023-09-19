import { HttpClientModule } from '@angular/common/http';
import { NgModule, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import * as _ from 'lodash';
import { Shallow } from 'shallow-render';
import { BlockUiModule } from '../../../../utility/components/block-ui/block-ui.module';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { HttpService } from '../../../../utility/services/http.service';
import { AddRequestStore } from '../add-request.store';
import { OthersComponent } from './others.component';
import { GroupOperator, OperatorDefault, OperatorInfo, OthersModel } from './others.model';
import { OthersService } from './others.service';

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

describe('OthersComponent', () => {
  @NgModule({
    imports: [
      FormsModule,
      NgSelectModule,
      BlockUiModule,
      HttpClientModule
    ],
    providers: [
      HttpService,
      AddRequestStore
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<OthersComponent>;

  beforeEach(() => {
    shallow = new Shallow(OthersComponent, AppModuleTest);
  });

  it('OthersComponent should init match snapshot', async () => {
    // Arrange
    const { fixture, instance } = await shallow.render();
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
    expect(instance.operators.length).toBe(2);
  });

  it('OthersComponent should init default value for all filter', async () => {
    // Arrange
    const { find, findComponent, fixture } = await shallow.render();
    fixture.detectChanges();
    const inputsElement = find(Helper.inputsSelector);
    const mistakenBySelector = inputsElement[0];
    const decidedBySelector = inputsElement[1];
    const providerSelector = inputsElement[2];
    const sourceSelector = inputsElement[3];
    const operators = findComponent(NgSelectComponent);
    const traderSelector = operators[0];
    const suspenderSelector = operators[1];

    // Assert
    expect(mistakenBySelector.nativeElement.value).toBe('');
    expect(decidedBySelector.nativeElement.value).toBe('');
    expect(providerSelector.nativeElement.value).toBe('');
    expect(sourceSelector.nativeElement.value).toBe('');
    expect(traderSelector.items).toStrictEqual([OperatorDefault.TRADER]);
    expect(suspenderSelector.items).toStrictEqual([OperatorDefault.SUSPENDER]);
  });

  it('Props(mistakenBy, decidedBy, provider, source and remark) should change when input value', async () => {
    // Arrange
    const { find, fixture, instance } = await shallow.render();
    const inputsElement = find(Helper.inputsSelector);
    const mistakenBySelector = inputsElement[0];
    const decidedBySelector = inputsElement[1];
    const providerSelector = inputsElement[2];
    const sourceSelector = inputsElement[3];

    mistakenBySelector.nativeElement.value = 'sa';
    decidedBySelector.nativeElement.value = 'sa';
    providerSelector.nativeElement.value = 'sa';
    sourceSelector.nativeElement.value = 'sa';
    mistakenBySelector.triggerEventHandler('input', { target: mistakenBySelector.nativeElement });
    decidedBySelector.triggerEventHandler('input', { target: decidedBySelector.nativeElement });
    providerSelector.triggerEventHandler('input', { target: providerSelector.nativeElement });
    sourceSelector.triggerEventHandler('input', { target: sourceSelector.nativeElement });
    fixture.detectChanges();

    // Assert
    expect(instance.model.mistakenBy).toBe('sa');
    expect(instance.model.decidedBy).toBe('sa');
    expect(instance.model.provider).toBe('sa');
    expect(instance.model.source).toBe('sa');
  });

  it('Trader and Suspender should return expected data', async () => {
    const { findComponent, fixture, instance } = await shallow
      .mock(AddRequestStore, { changeBlockingUiStatus: jest.fn() })
      .mock(OthersService, { getOperators : jest.fn().mockImplementation(() => Helper.getFakeOperatorInfo())})
      .render();

    const operatorsBefore = findComponent(NgSelectComponent);
    const traderSelectorBefore = operatorsBefore[0];
    const suspenderSelectorBefore = operatorsBefore[1];
    expect(traderSelectorBefore.items.length).toBe(1);
    expect(suspenderSelectorBefore.items.length).toBe(1);

    instance.matchId = 54321;
    const changes = {
      'matchId': new SimpleChange('12345', '54321', true),
    };
    instance.model.operatorsList = Helper.getFakeOperatorInfo();
    instance.isEdit = true;
    await instance.ngOnChanges(changes);
    fixture.detectChanges();
    const operatorsAfter = findComponent(NgSelectComponent);
    const traderSelectorAfter = operatorsAfter[0];
    const suspenderSelectorAfter = operatorsAfter[1];

    // Assert
    expect(instance.groupOperators.length).toBe(2);
    expect(instance.groupOperators[0].items.length).toBe(3);
    expect(instance.groupOperators[0].selected.length).toBe(3);
    expect(instance.groupOperators[1].items.length).toBe(3);
    expect(instance.groupOperators[1].selected.length).toBe(3);
    expect(traderSelectorAfter.items.length).toBe(3);
    expect(suspenderSelectorAfter.items.length).toBe(3);
  });
  
  it('#ngOnChanges should not call #intDefaultValueGroupOperators', async () => {
    const { fixture, instance } = await shallow
        .mock(OthersService, { getOperators : jest.fn().mockImplementation(() => Helper.getFakeOperatorInfo())})
        .render();
    instance['intDefaultValueGroupOperators'] = jest.fn();
    instance['updateSelectedValueGroupOperators'] = jest.fn();
    const changes = {};
    instance.isEdit = true;
    await instance.ngOnChanges(changes);
    fixture.detectChanges();

    // Assert
    expect(instance['intDefaultValueGroupOperators']).toHaveBeenCalledTimes(0);
    expect(instance['updateSelectedValueGroupOperators']).toHaveBeenCalledTimes(0);
  });
  
  it('#ngOnChanges should call #ngOnInit', async () => {
    const { instance } = await shallow
        .mock(OthersService, { getOperators : jest.fn().mockImplementation(() => Helper.getFakeOperatorInfo())})
        .render();
    instance['intDefaultValueGroupOperators'] = jest.fn();
    instance['updateSelectedValueGroupOperators'] = jest.fn();
    const changes = {
      'matchId': new SimpleChange('0', '1', true) 
    };
    instance.matchId = null;
    instance.ngOnInit = jest.fn();
    
    await instance.ngOnChanges(changes);

    // Assert
    expect(instance.ngOnInit).toHaveBeenCalledTimes(1);
  });
  
  it('#updateSelectedValueGroupOperators should update data', async () => {
    const { instance } = await shallow
        .mock(OthersService, { getOperators : jest.fn().mockImplementation(() => Helper.getFakeOperatorInfo())})
        .render();
    instance.isEdit = true;
    instance.model = _.clone(Helper.fakeOthersModel);
    instance.model.operatorsList = _.clone(Helper.getFakeOperatorInfo());
    instance.model.operatorsList.filter = jest.fn().mockImplementation(() => []);

    instance['updateSelectedValueGroupOperators']();
    
    // Assert
    expect(instance.groupOperators.length).toBe(2);
  });

  it('#updateSelectedValueGroupOperators should not update data', async () => {
    const { instance } = await shallow
        .mock(OthersService, { getOperators : jest.fn().mockImplementation(() => Helper.getFakeOperatorInfo())})
        .render();
    instance.isEdit = false;

    instance['updateSelectedValueGroupOperators']();
    
    // Assert
    expect(instance.groupOperators.length).toBe(2);
  });

  it('#updateModel should call #updateOperatorList', async () => {
    const { instance } = await shallow
        .mock(OthersService, { getOperators : jest.fn().mockImplementation(() => Helper.getFakeOperatorInfo())})
        .render();
    instance.isEdit = false;
    instance['updateOperatorList'] = jest.fn();
    instance.modelChange.emit = jest.fn();

    // Action
    instance.updateModel();
    
    // Assert
    expect(instance['updateOperatorList']).toHaveBeenCalledTimes(1);
    expect(instance.modelChange.emit).toHaveBeenCalledTimes(1);
  });
  
  it('#updateOperatorList should update correct data', async () => {
    const { instance } = await shallow
        .mock(OthersService, { getOperators : jest.fn().mockImplementation(() => Helper.getFakeOperatorInfo())})
        .render();
    instance.isEdit = false;
    instance.modelChange.emit = jest.fn();

    // Action
    instance['updateOperatorList']();
    
    // Assert
    expect(instance.groupOperators.length).toBe(2);
  });
  
  it('#onSelectOperator should update correct data', async () => {
    const { instance } = await shallow
        .mock(OthersService, { getOperators : jest.fn().mockImplementation(() => Helper.getFakeOperatorInfo())})
        .render();
    instance.isEdit = false;
    instance.modelChange.emit = jest.fn();
    instance.updateModel = jest.fn();
    
    // Action
    instance.onSelectOperator();
    
    // Assert
    expect(instance.groupOperators.length).toBe(2);
    expect(instance.updateModel).toHaveBeenCalledTimes(1);
  });
  
  it('#onSelectOperator should update correct data when have selected in group', async () => {
    const { instance } = await shallow
        .mock(OthersService, { getOperators : jest.fn().mockImplementation(() => Helper.getFakeOperatorInfo())})
        .render();
    instance.isEdit = false;
    instance.modelChange.emit = jest.fn();
    instance.updateModel = jest.fn();
    instance.groupOperators = _.clone([Helper.fakeGroupOperator]);
    instance.groupOperators[0].selected = Helper.getFakeOperatorInfo();

    // Action
    instance.onSelectOperator();
    
    // Assert
    expect(instance.groupOperators.length).toBe(1);
    expect(instance.updateModel).toHaveBeenCalledTimes(1);
  });
  
  it('#onSelectOperator should update correct data when have only one selected in group and operatorId is not zero', async () => {
    const { instance } = await shallow
        .mock(OthersService, { getOperators : jest.fn().mockImplementation(() => Helper.getFakeOperatorInfo())})
        .render();
    instance.isEdit = false;
    instance.modelChange.emit = jest.fn();
    instance.updateModel = jest.fn();
    instance.groupOperators = _.clone([Helper.fakeGroupOperator]);
    const operatorInfo = Helper.getFakeOperatorInfo()[0];
    operatorInfo.operatorId = 10000;
    instance.groupOperators[0].selected = [operatorInfo];

    // Action
    instance.onSelectOperator();
    
    // Assert
    expect(instance.groupOperators.length).toBe(1);
    expect(instance.updateModel).toHaveBeenCalledTimes(1);
  });
  
  it('#initProvider should call #getProvider when has parentMatchId ', async () => {
    const mockGetProvider = jest.fn().mockImplementation(() => []);
    const { instance } = await shallow
    .mock(OthersService, { getProvider : mockGetProvider})
    .render();
    instance.isEdit = false;
    instance.operators = [];
    [
      IssueTypeConstant.DANGER_ACCEPTED,
      IssueTypeConstant.RED_CARD,
      IssueTypeConstant.WRONG_SCORE,
    ].forEach(async x => {
      instance.issueTypeId = x;
      await instance['initProvider'](false, 1, 1);
      
      // Assert
      expect(mockGetProvider).toHaveBeenCalled;
    });
  });
  
  it('#initProvider should call #getProvider when has not parentMatchId ', async () => {
    const mockGetProvider = jest.fn().mockImplementation(() => null);
    const { instance } = await shallow
    .mock(OthersService, { getProvider : mockGetProvider})
    .render();
    instance.isEdit = false;
    instance.operators = [];
    [
      IssueTypeConstant.DANGER_ACCEPTED,
      IssueTypeConstant.RED_CARD,
      IssueTypeConstant.WRONG_SCORE,
    ].forEach(async x => {
      instance.issueTypeId = x;
      await instance['initProvider'](false, 1, null);
      
      // Assert
      expect(mockGetProvider).toHaveBeenCalled();
    });
  });
});
