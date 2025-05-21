import { ComponentFixture, TestBed } from '@angular/core/testing';
import moment from 'moment-timezone';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { PagingModel } from '../../../../utility/components/paging/paging/paging.model';
import { LABELS } from '../../../../utility/constants/labels';
import { TicketDetailId } from '../../models/query.model';
import { AllMarkedTicketListComponent } from './all-marked-ticket-list.component';
import { AllMarkedTicketModel } from './all-marked-ticket.model';

enum IconCheckBox {
  none = 0,
  any = 1,
  all = 2
}

class Helper {
  static readonly fakeAllMarkedTicketModel: AllMarkedTicketModel = {
    createdDate: new Date('2020-08-14 03:42:02.737'),
    event: 'Eastern Conference- vs -Western Conference',
    ftScore: '-',
    htScore: '-',
    isChecked: true,
    kickOffTime: new Date('2020-03-11 18:59:59.000'),
    matchId: '31757960',
    no: 1,
    total: 1,
    userId: 8,
    username: 'sa'
  };

  static readonly fakeOTherAllMarkedTicketModel: AllMarkedTicketModel = {
    createdDate: new Date('2020-10-14 22:19:51.960'),
    event: 'Barnet- vs -Harrogate Town',
    ftScore: '-',
    htScore: '-',
    isChecked: true,
    kickOffTime: new Date('2020-10-11 22:00:00.000'),
    matchId: '702001046',
    no: 2,
    total: 1,
    userId: 8,
    username: 'sa'
  };

  static readonly fakeUncheckedAllMarkedTicketModel: AllMarkedTicketModel = {
    createdDate: new Date('2020-07-02 02:54:42.890'),
    event: 'Republicans- vs -Democrats',
    ftScore: '-',
    htScore: '-',
    isChecked: false,
    kickOffTime: new Date('2020-11-03 08:59:59.000'),
    matchId: '34038292',
    no: 3,
    total: 1,
    userId: 8,
    username: 'sa'
  };

  static getFakePagingModel(): PagingModel {
    const model = new PagingModel();
    model.page = 2;
    return model;
  }
}

describe('AllMarkedTicketListComponent', () => {
  let component: AllMarkedTicketListComponent;
  let fixture: ComponentFixture<AllMarkedTicketListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AllMarkedTicketListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit pagingChange event with expected paging when call pagingEvent', () => {
    // Arrange
    component.paging = Helper.getFakePagingModel();
    component.pagingChange.emit = jest.fn();

    // Act
    component.pagingEvent();

    // Assert
    expect(component.pagingChange.emit).toHaveBeenCalledWith(Helper.getFakePagingModel());
  });

  it('should emit getDetailTickets event with expected TicketDetailId when call getMarkedTicketDetail', () => {
    // Arrange
    const ticketDetailId: TicketDetailId = {
      matchId: '31757960',
      userId: 8,
      createdDate: new Date('2020-08-14 03:42:02.737')
    };
    component.getDetailTickets.emit = jest.fn();

    // Act
    component.getMarkedTicketDetail(Helper.fakeAllMarkedTicketModel);

    // Assert
    expect(component.getDetailTickets.emit).toHaveBeenCalledWith(ticketDetailId);
  });

  it('should set iconCheckBox to none and uncheck all tickets when call checkGroups with all tickets checked', () => {
    // Arrange
    component.iconCheckBox = IconCheckBox.all;
    component.model = [Helper.fakeAllMarkedTicketModel, Helper.fakeOTherAllMarkedTicketModel];

    // Act
    component.checkGroups();

    // Assert
    expect(component.iconCheckBox).toBe(IconCheckBox.none);
    expect(component.model[0].isChecked).toBe(false);
    expect(component.model[1].isChecked).toBe(false);
  });

  it('should set iconCheckBox to all and check all tickets when call checkGroups with no tickets checked', () => {
    // Arrange
    component.iconCheckBox = IconCheckBox.none;
    component.model = [Helper.fakeAllMarkedTicketModel, Helper.fakeOTherAllMarkedTicketModel];

    // Act
    component.checkGroups();

    // Assert
    expect(component.iconCheckBox).toBe(IconCheckBox.all);
    expect(component.model[0].isChecked).toBe(true);
    expect(component.model[1].isChecked).toBe(true);
  });

  it('should return correct total when call getTotalMarkedTickets', () => {
    // Arrange
    component.model = [Helper.fakeAllMarkedTicketModel, Helper.fakeOTherAllMarkedTicketModel];

    // Act
    const actual = component.getTotalMarkedTickets();

    // Assert
    expect(actual).toBe(2);
  });

  it('should add ticket to tempUncheckedList when ticket is unchecked', () => {
    // Arrange
    component.tempUncheckedList = ['31757960'];

    // Act
    component.getUncheckedTicketList(Helper.fakeUncheckedAllMarkedTicketModel);

    // Assert
    expect(component.tempUncheckedList.length).toBe(2);
  });

  it('should remove ticket from tempUncheckedList when ticket is checked', () => {
    // Arrange
    component.tempUncheckedList = ['31757960'];

    // Act
    component.getUncheckedTicketList(Helper.fakeOTherAllMarkedTicketModel);

    // Assert
    expect(component.tempUncheckedList.length).toBe(1);
  });

  it('should set iconCheckBox to none when model is empty', () => {
    // Arrange
    component.model = [];

    // Act
    component.changeIconCheckBox();

    // Assert
    expect(component.iconCheckBox).toBe(IconCheckBox.none);
  });

  it('should set iconCheckBox to all when all tickets are checked', () => {
    // Arrange
    component.model = [Helper.fakeAllMarkedTicketModel];

    // Act
    component.changeIconCheckBox();

    // Assert
    expect(component.iconCheckBox).toBe(IconCheckBox.all);
  });

  it('should set iconCheckBox to any when some tickets are checked', () => {
    // Arrange
    component.model = [Helper.fakeAllMarkedTicketModel, Helper.fakeUncheckedAllMarkedTicketModel];

    // Act
    component.changeIconCheckBox();

    // Assert
    expect(component.iconCheckBox).toBe(IconCheckBox.any);
  });

  it('should display tooltip when all tickets are unchecked', () => {
    // Arrange
    component.model = [Helper.fakeUncheckedAllMarkedTicketModel];
    component.tooltip.display = jest.fn();

    // Act
    component.unmarkAllCheckedMarkedTickets();

    // Assert
    expect(component.tooltip.display).toHaveBeenCalledWith('invalid-data', LABELS.EMPTY_MATCH);
  });

  it('should emit updateAllMarkedTickets event with checked tickets', () => {
    // Arrange
    component.model = [Helper.fakeAllMarkedTicketModel];
    component.updateAllMarkedTickets.emit = jest.fn();

    // Act
    component.unmarkAllCheckedMarkedTickets();

    // Assert
    expect(component.updateAllMarkedTickets.emit).toHaveBeenCalledWith([Helper.fakeAllMarkedTicketModel]);
  });

  it('should convert date to GMT8 correctly', () => {
    // Arrange
    const date = new Date('2020-03-11 18:59:59.000');

    // Act
    const actual = component.convertToGMT8(date);

    // Assert
    expect(moment(actual).format('YYYY-MM-DD HH:mm:ss')).toBe('2020-03-12 06:59:59');
  });

  it('should emit refreshData event and set iconCheckBox to all when call refreshTickets', () => {
    // Arrange
    component.refreshData.emit = jest.fn();

    // Act
    component.refreshTickets();

    // Assert
    expect(component.refreshData.emit).toHaveBeenCalledTimes(1);
    expect(component.iconCheckBox).toBe(IconCheckBox.all);
  });

  it('should return all selected tickets when call getMatchsParam', () => {
    // Arrange
    component.model = [Helper.fakeAllMarkedTicketModel, Helper.fakeOTherAllMarkedTicketModel];

    // Act
    const actual = component.getMatchsParam();

    // Assert
    expect(actual.length).toBe(2);
    expect(component.iconCheckBox).toBe(IconCheckBox.all);
  });

  it('should display only matchId when childMatchId is null', () => {
    // Arrange
    const matchId = '111';
    const childMatchId = null;

    // Act
    const actual = component.getShowMatchId(matchId, childMatchId);

    // Assert
    expect(actual).toBe('111');
  });

  it('should display both matchId and childMatchId when childMatchId is not null', () => {
    // Arrange
    const matchId = '111';
    const childMatchId = '222';

    // Act
    const actual = component.getShowMatchId(matchId, childMatchId);

    // Assert
    expect(actual).toBe('111\n(222)');
  });
});
