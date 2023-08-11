import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Shallow } from 'shallow-render';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { ToolTipModule } from '../../../../../utility/components/tooltip/tooltip.module';
import { AbnormalAccountModel } from '../../models/abnormal-account.model';
import { ProductFilterComponent } from './product-filter.component';

describe('ProductFilterComponent', () => { 
  @NgModule({
    declarations: [      
    ],
    imports: [
      NgbModule,
      FormsModule,
      ToolTipModule,
      NgSelectModule
    ],
    providers: [
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<ProductFilterComponent>;

  beforeEach(() => {
    shallow = new Shallow(ProductFilterComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('#ProductFilterComponent init should match snapshot', async () => {
    const { fixture } = await shallow.render();

    expect(fixture).toMatchSnapshot();
  });
  
  it('#isValidComponent should return false when do not select any products', async () => {
    const { instance } = await shallow.render();
    instance.selectedProducts = [];
    instance.tooltip = new Tooltip();
    instance.tooltip.display = jest.fn();
    instance.abnormalAccountModel = new AbnormalAccountModel();

    const actual = instance.isValidComponent();
    
    expect(actual).toBe(false);
    expect(instance.tooltip.display).toHaveBeenCalledTimes(1);
  });
  
  it('#isValidComponent should return false when do not select any status', async () => {
    const { instance } = await shallow.render();
    instance.selectedProducts = ['1','2'];
    instance.selectedTicketStatus = [];
    instance.tooltip = new Tooltip();
    instance.tooltip.display = jest.fn();
    instance.abnormalAccountModel = new AbnormalAccountModel();

    const actual = instance.isValidComponent();
    
    expect(actual).toBe(false);
    expect(instance.tooltip.display).toHaveBeenCalledTimes(1);
  });
  
  it('#isValidComponent should return true', async () => {
    const { instance } = await shallow.render();
    instance.selectedProducts = ['1','2'];
    instance.selectedTicketStatus = ['1','2'];
    instance.abnormalAccountModel = new AbnormalAccountModel();

    const actual = instance.isValidComponent();
    
    expect(actual).toBe(true);
  });
  
  it('#updateItem should update correct data when is edit', async () => {
    const { instance } = await shallow.render();
    instance.isEdit = true;
    instance.abnormalAccountModel = new AbnormalAccountModel();
    instance.abnormalAccountModel.productIds = '1,2,3,5';
    instance.abnormalAccountModel.statusIds = '111,0,1';

    instance.updateItem();
    
    expect(instance.selectedProducts.length).toBeGreaterThan(0);
    expect(instance.selectedTicketStatus.length).toBeGreaterThan(0);
  });
  
  it('#updateItem should update correct data when is not edit', async () => {
    const { instance } = await shallow.render();
    instance.isEdit = false;
    instance.abnormalAccountModel = new AbnormalAccountModel();

    instance.updateItem();
    
    expect(instance.selectedProducts.length).toBeGreaterThan(0);
    expect(instance.selectedTicketStatus.length).toBeGreaterThan(0);
  });
});