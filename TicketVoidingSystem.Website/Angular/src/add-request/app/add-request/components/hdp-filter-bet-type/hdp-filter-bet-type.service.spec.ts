import { HdpFilterBetTypeService } from './hdp-filter-bet-type.service';
import { CommonService } from '../../../../../utility/services/common.service';
import { HdpFilterBetType } from '../../models/hdp-filter-betType.model';
import { FilterBetType } from '../../event-wrong-hdp/models/filter-with-hdp.model';

describe('HdpFilterBetTypeService', () => {
  let service: HdpFilterBetTypeService;
  beforeEach(() => {
    service = new HdpFilterBetTypeService(null);
  });

  it('#getHdpFilterBetTypes should return list bet_type expected when query valid', async () => {
    const commonService = new CommonService(null);
    const allBetType = [new HdpFilterBetType()]
    commonService.getHdpFilterBetTypes = jest.fn().mockReturnValue(allBetType);
    service = new HdpFilterBetTypeService(commonService);
    
    const actual = await service.GetHdpFilterBetTypes(1, "4");

    expect(actual.length).toEqual(1);
    expect(actual[0].isChecked).toBeTruthy();
  });

  it('#updateFilterBetTypeData should update FilterBetType expected', async () => {
    const allBetType = [{isChecked: true, selections: [{value: "801"}], betType: "1"} as HdpFilterBetType]
    const filterBetType = new FilterBetType();
    service = new HdpFilterBetTypeService(null);
    
    service.updateFilterBetTypeData(allBetType, filterBetType);

    expect(filterBetType.filterBetIdX).toEqual("801");
    expect(filterBetType.filterBetIdY).toEqual("");
    expect(filterBetType.filterBetTypeId).toEqual("1");
  });
  
  it('#loadDataEditPage should update betType selected', async () => {
    const allBetType = [{selections: [{value: ""}], betType: "1"} as HdpFilterBetType]
    const filterBetType = new FilterBetType("801", "", "1");
    service = new HdpFilterBetTypeService(null);
    
    service.loadDataEditPage(allBetType, filterBetType);

    expect(allBetType[0].selections.length).toEqual(1);
    expect(allBetType[0].selections[0].value).toEqual("801");
    expect(allBetType[0].isChecked).toBeTruthy();
  });
});
