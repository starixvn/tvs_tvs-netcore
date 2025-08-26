import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';
import { PoolHouseTicketComponent } from './pool-house-ticket.component';
import { StaticService } from '../../../utility/services/static.service';
import { SimpleChange } from '@angular/core';
import { PoolHouseTicketsModel } from './pool-house-ticket.model';
import { GroupBetTypesModel, GroupBetType, BetType } from './group-bettypes-pool-house/group-bettypes-pool-house.model';
import { TicketsModel } from './tickets/tickets.model';
import { PoolHouseTicketValue } from './pool-house-ticket.constant';

class Helper {
  static readonly fakePoolHouseTicketsModel = new PoolHouseTicketsModel();
  static readonly fakeGroupBetTypes = [
    {
      groupName: 'Group1',
      betTypes: [
        { id: 1, name: 'BetType1', isChecked: false, isDisable: false }
      ],
      isChecked: false,
      isShow: true,
      isDisable: false,
      renderBetTypes: (_betTypes: BetType[], _isChecked: boolean, _isDisable: boolean) => {},
      isShowValidation: false,
      isShowError: false
    },
    {
      groupName: 'Others',
      betTypes: [
        { id: 3, name: 'BetType3', isChecked: false, isDisable: false },
        { id: 4, name: 'BetType4', isChecked: false, isDisable: false }
      ],
      isChecked: false,
      isShow: true,
      isDisable: false,
      renderBetTypes: (_betTypes: BetType[], _isChecked: boolean, _isDisable: boolean) => {},
      isShowValidation: false,
      isShowError: false
    }
  ] as unknown as GroupBetType[];

  static createFakeTicketsModel(): TicketsModel {
    const model = new TicketsModel();
    model.totalSingle = 0;
    model.totalParlay = 0;
    model.selectedSingle = 0;
    model.selectedParlay = 0;
    model.isHasSettledTicket = false;
    model.fromTime = new Date();
    model.toTime = new Date();
    model.groups = [];
    model.groupOtherTickets = [];
    return model;
  }
}

describe('PoolHouseTicketComponent', () => {
  let component: PoolHouseTicketComponent;
  let fixture: ComponentFixture<PoolHouseTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        StaticService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PoolHouseTicketComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.model).toBeDefined();
    expect(component.poolHouseTicketsSections).toEqual([]);
    expect(component.isBlock).toBeFalsy();
    expect(component.blockBetList).toBeFalsy();
  });

  it('should update pool house ticket modal when model changes', () => {
    // Arrange
    component.model = Helper.fakePoolHouseTicketsModel;
    component.model.isOpen = true;
    component.model.groupBetTypes = Helper.fakeGroupBetTypes;
    component.model.checkedBetTypes = '';
    component.model.affectedTickets = Helper.createFakeTicketsModel();
    component.model.otherTickets = Helper.createFakeTicketsModel();

    // Act
    component.ngOnChanges({
      model: {
        currentValue: Helper.fakePoolHouseTicketsModel,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });

    // Assert
    expect(component.poolHouseTicketsSections.length).toBe(2);
    expect(component.blockBetList).toBeFalsy();
  });

  it('should get affected section correctly', () => {
    // Arrange
    component.model = Helper.fakePoolHouseTicketsModel;
    component.model.groupBetTypes = Helper.fakeGroupBetTypes;
    component.model.affectedTickets = Helper.createFakeTicketsModel();
    component.model.checkedBetTypes = '';

    // Act
    const affectedSection = component.getAffectedSection();

    // Assert
    expect(affectedSection.isAffected).toBeTruthy();
    expect(affectedSection.name).toBe('Affected Bet Types');
    expect(affectedSection.groupBetTypesModel).toBeDefined();
    expect(affectedSection.tickets).toBeDefined();
    expect(affectedSection.isCollapsed).toBeFalsy();
  });

  it('should get other section correctly', () => {
    // Arrange
    component.model = Helper.fakePoolHouseTicketsModel;
    component.model.groupBetTypes = Helper.fakeGroupBetTypes;
    component.model.otherTickets = Helper.createFakeTicketsModel();
    component.model.checkedBetTypes = '';

    // Act
    const otherSection = component.getOtherSection();

    // Assert
    expect(otherSection.isAffected).toBeFalsy();
    expect(otherSection.name).toBe('Other Bet Types');
    expect(otherSection.filterBetTypes).toBeDefined();
    expect(otherSection.groupBetTypesModel).toBeDefined();
    expect(otherSection.tickets).toBeDefined();
    expect(otherSection.isCollapsed).toBeFalsy();
  });

  it('should handle bet type changes correctly', () => {
    // Arrange
    component.model = Helper.fakePoolHouseTicketsModel;
    component.model.groupBetTypes = Helper.fakeGroupBetTypes;
    component.affectedSection = component.getAffectedSection();
    const betTypes = [1, 2];

    // Act
    component.changedBetTypes(betTypes);

    // Assert
    expect(component.affectedSection.tickets).toBeDefined();
  });

  it('should close modal correctly', () => {
    // Arrange
    component.model = Helper.fakePoolHouseTicketsModel;
    component.model.isOpen = true;

    // Act
    component.closeClick();

    // Assert
    expect(component.model.isOpen).toBeFalsy();
  });

  it('should save and emit model correctly', () => {
    // Arrange
    component.model = Helper.fakePoolHouseTicketsModel;
    component.model.isOpen = true;
    component.model.groupBetTypes = Helper.fakeGroupBetTypes;
    component.model.checkedBetTypes = '';
    component.model.affectedTickets = Helper.createFakeTicketsModel();
    component.model.otherTickets = Helper.createFakeTicketsModel();
    component.affectedSection = component.getAffectedSection();

    component.saveEventOutput.emit = jest.fn();

    // Act
    component.saveClick();

    // Assert
    expect(component.model.isOpen).toBeFalsy();
    expect(component.saveEventOutput.emit).toHaveBeenCalledWith(component.model);
  });

  it('should update selected bet types correctly', () => {
    // Arrange
    component.model = Helper.fakePoolHouseTicketsModel;
    component.otherSection = component.getOtherSection();
    const betTypes = ['1', '2'];

    // Act
    component.updateSelectedBetTypes(betTypes);

    // Assert
    expect(component.otherSection.tickets).toBeDefined();
  });

  it('should initialize filter bet types correctly', () => {
    // Arrange
    const groupBetTypes = Helper.fakeGroupBetTypes.filter(x => x.groupName === 'Others');

    // Act
    const filterBetTypes = component.initFilterBetTypes(groupBetTypes);

    // Assert
    expect(filterBetTypes).toBeDefined();
    expect(filterBetTypes.items.length).toBe(2);
  });

  it('should handle select all bet types correctly', () => {
    // Arrange
    component.model = Helper.fakePoolHouseTicketsModel;
    component.model.checkedBetTypes = PoolHouseTicketValue.SELECT_ALL_BETTYPE;
    component.model.groupBetTypes = Helper.fakeGroupBetTypes;
    component.affectedSection = component.getAffectedSection();
    component.affectedSection.groupBetTypesModel = new GroupBetTypesModel(Helper.fakeGroupBetTypes, true, false);
    component.affectedSection.tickets = new TicketsModel();

    // Act
    component['changeCheckBetTypeAndTicket']();

    // Assert
    expect(component.affectedSection.groupBetTypesModel).toBeDefined();
    expect(component.affectedSection.tickets).toBeDefined();
  });
});
