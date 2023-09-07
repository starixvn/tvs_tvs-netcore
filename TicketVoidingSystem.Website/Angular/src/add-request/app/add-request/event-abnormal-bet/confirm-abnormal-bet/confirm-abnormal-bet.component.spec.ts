import { NgModule, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Shallow } from 'shallow-render';
import { ConfirmAbnormalBetComponent } from './confirm-abnormal-bet.component';
import { ConfirmAbnormalBetModel } from './confirm-abnormal-bet.model';

class Helper {
  static readonly fakeConfirmAbnormalBetModel: ConfirmAbnormalBetModel = {
    isOpenDialog: true,
    isHasWarningForAbnormalBet: true,
    isHasWarningEditTakeNoteRequest: false,
    transIds: '1022222',
    cn88Tickets: '2123122',
    ticketsOfVIPCustomer: '2123122',
    settledTickets:'2123122',
    ticketsOfCustomerClass201: '2123122',
    ticketsOfCustomerClass4K: '2123122',
    isHasWarningRemovedTickets: false,
    isEditingByAnotherUser: false,
    requestId: 1,
    requestedBy: '',
    listBettype : '',
    listBetteam : ''
  };
}

describe('ConfirmAbnormalBetComponent', () => {
  @NgModule({
    imports: [
      FormsModule,
      NgbModule
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<ConfirmAbnormalBetComponent>;

  beforeEach(() => {
    shallow = new Shallow(ConfirmAbnormalBetComponent, AppModuleTest).dontMock(NgbModule);
  });

  it('ConfirmAbnormalBetComponent should init match snapshot', async () => {
    // Arrange
    const fakeConfirmAbnormalBetModel = _.cloneDeep(Helper.fakeConfirmAbnormalBetModel);
    fakeConfirmAbnormalBetModel.isOpenDialog = false;
    const { fixture } = await shallow.render({
      bind: {
        model: fakeConfirmAbnormalBetModel
      }
    });
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
  });

  it('#ngOnChanges should call #updateData when data', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        model: Helper.fakeConfirmAbnormalBetModel
      }
    });
    instance['updateData'] = jest.fn();
    const changes = {
      'model': new SimpleChange(new ConfirmAbnormalBetModel(), Helper.fakeConfirmAbnormalBetModel, true)
    };

    // Action
    instance.ngOnChanges(changes);

    // Assert
    expect(instance['updateData']).toHaveBeenCalledTimes(1);
  });

  it('#updateData should update value', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        model: Helper.fakeConfirmAbnormalBetModel
      }
    });
    const cn88Tickets = instance.model.cn88Tickets.split(',').join(', ');
    const ticketsOfVIPCustomer = instance.model.ticketsOfVIPCustomer.split(',').join(', ');
    const settledTickets = instance.model.settledTickets.split(',').join(', ');
    const ticketsOfCustomerClass201 = instance.model.ticketsOfCustomerClass201.split(',').join(', ');
    const ticketsOfCustomerClass4K = instance.model.ticketsOfCustomerClass4K.split(',').join(', ');

    // Action
    instance['updateData']();

    // Assert
    expect(instance.cn88Tickets).toEqual(cn88Tickets);
    expect(instance.ticketsOfVIPCustomer).toEqual(ticketsOfVIPCustomer);
    expect(instance.settledTickets).toEqual(settledTickets);
    expect(instance.ticketsOfCustomerClass201).toEqual(ticketsOfCustomerClass201);
    expect(instance.ticketsOfCustomerClass4K).toEqual(ticketsOfCustomerClass4K);
  });

  it('#updateData should only update isConfirmCalculator value when Has Warning For AbnormalBet ', async () => {
    // Arrange
    const fakeConfirmAbnormalBetModel = _.clone(Helper.fakeConfirmAbnormalBetModel);
    fakeConfirmAbnormalBetModel.isHasWarningForAbnormalBet = false;
    const { instance } = await shallow.render({
      bind: {
        model: fakeConfirmAbnormalBetModel
      }
    });
    instance['updateRemoveCustomerClassStatus'] = jest.fn();

    // Action
    instance['updateData']();

    // Assert
    expect(instance.isConfirmCalculator).toBeTruthy();
  });

  it('#updateData should update value when isHasWarningForAbnormalBet but invalid data', async () => {
    // Arrange
    const fakeConfirmAbnormalBetModel = _.clone(Helper.fakeConfirmAbnormalBetModel);
    fakeConfirmAbnormalBetModel.cn88Tickets = '';
    fakeConfirmAbnormalBetModel.ticketsOfVIPCustomer = '';
    fakeConfirmAbnormalBetModel.settledTickets = '';
    fakeConfirmAbnormalBetModel.ticketsOfCustomerClass201 = '';
    fakeConfirmAbnormalBetModel.ticketsOfCustomerClass4K = '';

    const { instance } = await shallow.render({
      bind: {
        model: fakeConfirmAbnormalBetModel
      }
    });
    instance['updateRemoveCustomerClassStatus'] = jest.fn();

    // Action
    instance['updateData']();

    // Assert
    expect(instance.cn88Tickets).toBe('');
    expect(instance.ticketsOfVIPCustomer).toBe('');
    expect(instance.settledTickets).toBe('');
    expect(instance.ticketsOfCustomerClass201).toBe('');
    expect(instance.ticketsOfCustomerClass4K).toBe('');

  });

  it('#closeClick should close popup and emit action close', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        model: Helper.fakeConfirmAbnormalBetModel
      }
    });

    // Action
    instance.closeClick();

    // Assert
    expect(instance.close.emit).toHaveBeenCalledTimes(1);
    expect(instance.model.isOpenDialog).toEqual(false);
  });

  it('#saveClick should close popup and emit action save', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        model: Helper.fakeConfirmAbnormalBetModel
      }
    });

    // Action
    instance.saveClick();

    // Assert
    expect(instance.save.emit).toHaveBeenCalledTimes(1);
    expect(instance.model.isOpenDialog).toEqual(false);
  });

  it('#updateRemoveCustomerClassStatus should close popup and emit action save when isAllTicketsOfCustomerClass', async () => {
    // Arrange
    const fakeConfirmAbnormalBetModel = _.clone(Helper.fakeConfirmAbnormalBetModel);
    fakeConfirmAbnormalBetModel.transIds = '6666,2222';
    fakeConfirmAbnormalBetModel.ticketsOfCustomerClass201 = '6666';
    fakeConfirmAbnormalBetModel.ticketsOfCustomerClass4K = '2222';
    const { instance } = await shallow.render({
      bind: {
        model: fakeConfirmAbnormalBetModel
      }
    });

    // Action
    instance['updateRemoveCustomerClassStatus']();

    // Assert
    expect(instance.isRemoveCustomerClass201).toEqual(false);
    expect(instance.isRemoveCustomerClass4K).toEqual(false);
    expect(instance.isCanNotSelectedRemoveTicketCC201).toEqual(false);
    expect(instance.isCanNotSelectedRemoveTicketCC4K).toEqual(false);
    expect(instance.isShowErrorCannotRemoveAllTickets).toBeTruthy();
  });

  it('#updateRemoveCustomerClassStatus should close popup and emit action save when only tickets that have CC = 201', async () => {
    // Arrange
    const fakeConfirmAbnormalBetModel = _.clone(Helper.fakeConfirmAbnormalBetModel);
    fakeConfirmAbnormalBetModel.transIds = '6666';
    fakeConfirmAbnormalBetModel.ticketsOfCustomerClass201 = '6666';
    const { instance } = await shallow.render({
      bind: {
        model: fakeConfirmAbnormalBetModel
      }
    });

    // Action
    instance['updateRemoveCustomerClassStatus']();

    // Assert
    expect(instance.isRemoveCustomerClass201).toEqual(false);
    expect(instance.isShowErrorCannotRemoveAllTickets).toBeTruthy();
    expect(instance.isCanNotSelectedRemoveTicketCC201).toBeTruthy();
  });

  it('#updateRemoveCustomerClassStatus should close popup and emit action save when only tickets that have CC = 4K', async () => {
    // Arrange
    const fakeConfirmAbnormalBetModel = _.clone(Helper.fakeConfirmAbnormalBetModel);
    fakeConfirmAbnormalBetModel.transIds = '6666';
    fakeConfirmAbnormalBetModel.ticketsOfCustomerClass4K = '6666';
    const { instance } = await shallow.render({
      bind: {
        model: fakeConfirmAbnormalBetModel
      }
    });

    // Action
    instance['updateRemoveCustomerClassStatus']();

    // Assert
    expect(instance.isRemoveCustomerClass4K).toEqual(false);
    expect(instance.isShowErrorCannotRemoveAllTickets).toBeTruthy();
    expect(instance.isCanNotSelectedRemoveTicketCC4K).toBeTruthy();
  });

  it('#updateRemoveCustomerClassStatus have value expected save when no have ticketsOfCustomerClass4K and ticketsOfCustomerClass201', async () => {
    // Arrange
    const fakeConfirmAbnormalBetModel = _.clone(Helper.fakeConfirmAbnormalBetModel);
    fakeConfirmAbnormalBetModel.transIds = '6666';
    fakeConfirmAbnormalBetModel.ticketsOfCustomerClass4K = '';
    fakeConfirmAbnormalBetModel.ticketsOfCustomerClass201 = '';
    const { instance } = await shallow.render({
      bind: {
        model: fakeConfirmAbnormalBetModel
      }
    });

    // Action
    instance['updateRemoveCustomerClassStatus']();

    // Assert
    expect(instance.isRemoveCustomerClass4K).toEqual(true);
    expect(instance.isCanNotSelectedRemoveTicketCC4K).toEqual(false);
    expect(instance.isRemoveCustomerClass201).toEqual(true);
    expect(instance.isCanNotSelectedRemoveTicketCC201).toEqual(false);
  });

  it('#updateRemoveCustomerClassStatus should close popup and emit action save when only tickets that have CC = 4000 & 201', async () => {
    // Arrange
    const fakeConfirmAbnormalBetModel = _.clone(Helper.fakeConfirmAbnormalBetModel);
    fakeConfirmAbnormalBetModel.transIds = '6666,1111';
    fakeConfirmAbnormalBetModel.ticketsOfCustomerClass201 = '1111';
    fakeConfirmAbnormalBetModel.ticketsOfCustomerClass4K = '6666';
    const { instance } = await shallow.render({
      bind: {
        model: fakeConfirmAbnormalBetModel
      }
    });

    // Action
    instance['updateRemoveCustomerClassStatus']();

    // Assert
    expect(instance.isRemoveCustomerClass201).toEqual(false);
    expect(instance.isCanNotSelectedRemoveTicketCC201).toEqual(false);
    expect(instance.isRemoveCustomerClass4K).toEqual(false);
    expect(instance.isCanNotSelectedRemoveTicketCC4K).toEqual(false);
  });

  it('#updateRemoveCustomerClassStatus should close popup and emit action save when not only tickets that have CC = 4000 & 201', async () => {
    // Arrange
    const fakeConfirmAbnormalBetModel = _.clone(Helper.fakeConfirmAbnormalBetModel);
    fakeConfirmAbnormalBetModel.transIds = '6666,3333,1111,2222';
    fakeConfirmAbnormalBetModel.ticketsOfCustomerClass201 = '1111';
    fakeConfirmAbnormalBetModel.ticketsOfCustomerClass4K = '6666';
    const { instance } = await shallow.render({
      bind: {
        model: fakeConfirmAbnormalBetModel
      }
    });

    // Action
    instance['updateRemoveCustomerClassStatus']();

    // Assert
    expect(instance.isRemoveCustomerClass201).toEqual(true);
    expect(instance.isCanNotSelectedRemoveTicketCC201).toEqual(false);
    expect(instance.isRemoveCustomerClass4K).toEqual(true);
    expect(instance.isCanNotSelectedRemoveTicketCC4K).toEqual(false);
  });

  it('#checkRemoveCC201 should update isCanNotSelectedRemoveTicketCC4K = true', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.isShowErrorCannotRemoveAllTickets= true;
    instance.isCanNotSelectedRemoveTicketCC4K = false;

    // Action
    instance['checkRemoveCC201']();

    // Assert
    expect(instance.isCanNotSelectedRemoveTicketCC4K).toEqual(true);

  });

  it('#checkRemoveCC201 should update isCanNotSelectedRemoveTicketCC4K = false', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.isShowErrorCannotRemoveAllTickets= true;
    instance.isCanNotSelectedRemoveTicketCC4K = true;

    // Action
    instance['checkRemoveCC201']();

    // Assert
    expect(instance.isCanNotSelectedRemoveTicketCC4K).toEqual(false);

  });

  it('#checkRemoveCC4K should update isCanNotSelectedRemoveTicketCC201 = true', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.isShowErrorCannotRemoveAllTickets= true;
    instance.isCanNotSelectedRemoveTicketCC201 = false;

    // Action
    instance['checkRemoveCC4K']();

    // Assert
    expect(instance.isCanNotSelectedRemoveTicketCC201).toEqual(true);

  });

  it('#checkRemoveCC4K should update isCanNotSelectedRemoveTicketCC201 = false', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.isShowErrorCannotRemoveAllTickets= true;
    instance.isCanNotSelectedRemoveTicketCC201 = true;

    // Action
    instance['checkRemoveCC4K']();

    // Assert
    expect(instance.isCanNotSelectedRemoveTicketCC201).toEqual(false);

  });

  it('#isAllTicketsOfCustomerClass should be return true', async () => {
    // Arrange
    const { instance } = await shallow.render();

    // Action
    const isShowErrorCannotRemoveAllTickets= instance['isAllTicketsOfCustomerClass'](['1111','2222'], ['1111','2222']);

    // Assert
    expect(isShowErrorCannotRemoveAllTickets).toEqual(true);

  });

  it('#isAllTicketsOfCustomerClass should be return false', async () => {
    // Arrange
    const { instance } = await shallow.render();

    // Action
    const isShowErrorCannotRemoveAllTickets= instance['isAllTicketsOfCustomerClass'](['1111','2222'], null);

    // Assert
    expect(isShowErrorCannotRemoveAllTickets).toBeFalsy();

  });
});
