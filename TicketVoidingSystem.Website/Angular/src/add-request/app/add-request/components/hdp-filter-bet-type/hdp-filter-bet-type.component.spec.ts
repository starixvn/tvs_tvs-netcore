import { HdpFilterBetTypeService } from './hdp-filter-bet-type.service';
import { HdpFilterBetTypeComponent } from './hdp-filter-bet-type.component';
import { NgModule, SimpleChange } from '@angular/core';
import { Shallow } from 'shallow-render';
import { HdpFilterBetType } from '../../models/hdp-filter-betType.model';
import { FilterBetType } from '../../event-wrong-hdp/models/filter-with-hdp.model';

describe('HdpFilterBetTypeComponent', () => {
  @NgModule({
    declarations: [],
    providers: [ HdpFilterBetTypeService ]
  })
  class AppModuleTest { }

  let shallow: Shallow<HdpFilterBetTypeComponent>;

  beforeEach(() => {
    shallow = new Shallow(HdpFilterBetTypeComponent, AppModuleTest);
  });

  it('#iddShowFilterBetType should return true', async () => {
    // Arrange
    const { instance } = await shallow
    .render();

    // Action & Assert
    ['4', '6'].forEach(x => {
      instance.issueTypeId = x;
      expect(instance.iddShowFilterBetType()).toBeTruthy();
    })
  });

  it('#iddShowFilterBetType should return false', async () => {
    // Arrange
    const { instance } = await shallow
    .render();

    // Action & Assert
    ['1', '3'].forEach(x => {
      instance.issueTypeId = x;
      expect(instance.iddShowFilterBetType()).toBeFalsy();
    })   
  });

  it('#ngOnChanges should update filterBetType when filterBetTypeId has value', async () => {
    // Arrange
    const allFilterBetType = [{betType: '1', selections:[], isChecked: true}] as HdpFilterBetType[];
    const { instance } = await shallow
    .mock(HdpFilterBetTypeService, {GetHdpFilterBetTypes: jest.fn().mockReturnValue(allFilterBetType),
      loadDataEditPage: jest.fn()
    })
    .render();
    instance.filterBetType = new FilterBetType('', '', '1');
    const changes = {'sportTypeId': new SimpleChange(0, 1, true)};
    
    // Action 
    await instance.ngOnChanges(changes);

    // & Assert
    expect(instance.filterBetTypeId).toBe('1');
    expect(instance.betTypeSelected).toEqual(allFilterBetType[0]);
  });

  it('#ngOnChanges should not update filterBetType when sportTypeId not change', async () => {
    // Arrange
    const { instance } = await shallow
    .render();
    instance.filterBetType = new FilterBetType('', '', '1');
    instance.filterBetTypeId = '3'
    const changes = {'issueTypeId': new SimpleChange('1', '1', false)};
    
    // Action 
    await instance.ngOnChanges(changes);

    // & Assert
    expect(instance.filterBetTypeId).toBe('3');
  });
  
  it('#ngOnChanges should not update filterBetType default vale when filterBetTypeId no has valse', async () => {
    // Arrange
    const allFilterBetType = [{betType: '1', selections:[], isChecked: false}] as HdpFilterBetType[];
    const { instance } = await shallow
    .mock(HdpFilterBetTypeService, {GetHdpFilterBetTypes: jest.fn().mockReturnValue(allFilterBetType),
      loadDataEditPage: jest.fn(),
      updateFilterBetTypeData: jest.fn()
    })
    .render();
    instance.filterBetType = new FilterBetType('', '', '');
    const changes = {'sportTypeId': new SimpleChange(0, 1, true)};
    instance.changeEvent.emit = jest.fn();

    // Action 
    await instance.ngOnChanges(changes);

    // & Assert
    expect(instance.filterBetTypeId).toBe('1');
    expect(instance.allFilterBetType[0].isChecked).toBeTruthy();
  });
  
  it('#onChangeBetType should not update filterBetType default vale when filterBetTypeId no has valse', async () => {
    // Arrange
    const allFilterBetType = [{betType: '1', selections:[], isChecked: false},
    {betType: '3', selections:[{value:'801', name: 'AA'}], isChecked: false}] as HdpFilterBetType[];
    const { instance } = await shallow
    .mock(HdpFilterBetTypeService, {
      updateFilterBetTypeData: jest.fn()
    })
    .render();
    instance.filterBetType = new FilterBetType('', '', '1');
    instance.allFilterBetType = allFilterBetType;
    instance.changeEvent.emit = jest.fn();

    // Action 
    instance.onChangeBetType(allFilterBetType[1]);

    // & Assert
    expect(instance.allFilterBetType[0].isChecked).toBeFalsy();
    expect(instance.allFilterBetType[1].isChecked).toBeTruthy();
    expect(instance.betTypeSelected).toEqual(allFilterBetType[1]);
  });
});
