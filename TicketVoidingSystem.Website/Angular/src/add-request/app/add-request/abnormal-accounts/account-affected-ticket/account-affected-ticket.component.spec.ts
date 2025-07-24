import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountAffectedTicketComponent } from './account-affected-ticket.component';
import { AddRequestApiService } from '../../add-request-api.service';
import { AccountAffectedTicketModel, AdjustedAccountModel } from './account-affected-ticket.model';
import { TicketTableViewModel } from '../../components/ticket-table/ticket-table.model';
import bigDecimal from 'js-big-decimal';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { ValidationService } from '../services/validation.service';

class Helper {
  static readonly fakeCustId = 123;
  static readonly fakeAccountWinlostModel = {
    custId: 123,
    username: 'testUser',
    givenCredit: 1000,
    adjustVoidLimit: 500,
    adjustVoidLimitString: '500',
    isHighlight: false,
    estimateVoidAmount: 100,
    estimateVoidAmountUnEditableTickets: 50,
    currentLosing: -200,
    currentWinning: 300,
    winLostAfterVoid: 150,
    isEditedTicket: false,
    isSelected: false,
    isDisabled: false,
    isExpanded: false,
    isShowInput: true,
    isCanEditTicket: true,
    isShowOnTable: true,
    transInfoAccountJson: '{}',
    oldAdjustVoidLimit: 500
  };

  static readonly fakeTicketTableViewModel = {
    groups: [{
      id: 1,
      name: 'Test Group',
      displayTotalTickets: 1,
      isChecked: true,
      isExpanded: true,
      tickets: [{
        no: 1,
        betId: '123',
        value: '100',
        transDate: '2024-03-20',
        member: 'test',
        betType: 'testBetType',
        betTypeId: 1,
        subBetTypeId: 1,
        odds: '1.5',
        stake: '100',
        winLoss: '50',
        currency: 'USD',
        status: 'Active',
        score: '1-0',
        handicap: '0.5',
        choice: 'Home',
        mainTransId: '123',
        isParlay: false,
        siteDbGroupId: 1,
        groupName: 'Test Group',
        isChecked: true
      }],
      changeGroupToTickets() {
        this.tickets.forEach(ticket => {
          ticket.isChecked = this.isChecked;
        });
      },
      changeTicketToGroup() {
        this.isChecked = this.tickets.every(ticket => ticket.isChecked);
      },
      getCheckedTickets() {
        return this.tickets.filter(ticket => ticket.isChecked);
      }
    }]
  } as unknown as TicketTableViewModel;

  static readonly fakeAdjustedAccountModel = {
    custId: 123,
    ticketTableViewModel: Helper.fakeTicketTableViewModel
  } as AdjustedAccountModel;
}

describe('AccountAffectedTicketComponent', () => {
  let component: AccountAffectedTicketComponent;
  let fixture: ComponentFixture<AccountAffectedTicketComponent>;
  let addRequestApiService: AddRequestApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule,
        AccountAffectedTicketComponent
      ],
      providers: [
        AddRequestApiService,
        ValidationService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountAffectedTicketComponent);
    addRequestApiService = fixture.debugElement.injector.get(AddRequestApiService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', async () => {
    // Arrange
    component.model = new AccountAffectedTicketModel();
    component.model.accountWinlostModels = [Helper.fakeAccountWinlostModel];
    component.model.selectedCustId = Helper.fakeCustId;
    addRequestApiService.GetTicketsAbnormalAccount = jest.fn().mockResolvedValue(Helper.fakeTicketTableViewModel);

    // Act
    await component.ngOnInit();

    // Assert
    expect(component.isEdittedTicket).toBeFalsy();
    expect(component.tempAdjustedAccounts.accountWinlostTables[0].custId).toBe(Helper.fakeCustId);
  });

  it('should update table with existing adjusted account', async () => {
    // Arrange
    component.model = new AccountAffectedTicketModel();
    component.model.accountWinlostModels = [Helper.fakeAccountWinlostModel];
    component.model.selectedCustId = Helper.fakeCustId;
    component.model.adjustedAccounts = [Helper.fakeAdjustedAccountModel];

    // Act
    await component.updateTable();

    // Assert
    expect(component.tempAdjustedAccounts.ticketTableViewModel.groups[0].tickets[0].betId)
      .toBe(Helper.fakeTicketTableViewModel.groups[0].tickets[0].betId);
  });

  it('should close dialog', () => {
    // Arrange
    component.model.isOpen = true;

    // Act
    component.closeClick();

    // Assert
    expect(component.model.isOpen).toBeFalsy();
  });

  it('should recalculate account with new winlost value', () => {
    // Arrange
    const accountWinlostModel = {
      ...Helper.fakeAccountWinlostModel,
      estimateVoidAmountUnEditableTickets: 50,
      currentLosing: -200,
      currentWinning: 300,
      estimateVoidAmount: 0,
      winLostAfterVoid: 0,
      oldAdjustVoidLimit: 500
    };
    component.tempAdjustedAccounts.accountWinlostTables = [accountWinlostModel];
    const newWinlost = new bigDecimal(50);

    // Act
    component.reCalculateAccount(newWinlost);

    // Assert
    expect(component.isEdittedTicket).toBeTruthy();
    expect(component.tempAdjustedAccounts.accountWinlostTables[0].estimateVoidAmount).toBe(100);
    // winLostAfterVoid = currentLosing + currentWinning - estimateVoidAmount
    // = -200 + 300 - 100 = 0
    expect(component.tempAdjustedAccounts.accountWinlostTables[0].winLostAfterVoid).toBe(0);
  });

  it('should get adjusted tickets', () => {
    // Arrange
    component.model = new AccountAffectedTicketModel();
    component.model.adjustedAccounts = [{
      ...Helper.fakeAdjustedAccountModel,
      ticketTableViewModel: Helper.fakeTicketTableViewModel
    }];

    // Act
    const result = component.getAdjustedTickets();

    // Assert
    expect(result.length).toBe(1);
    expect(result[0].custId).toBe(Helper.fakeCustId);
    expect(result[0].transId).toBe('123');
    expect(result[0].isChecked).toBeTruthy();
  });

  it('should update adjusted accounts when edited', () => {
    // Arrange
    component.model = new AccountAffectedTicketModel();
    component.model.adjustedAccounts = [];
    component.tempAdjustedAccounts.accountWinlostTables = [Helper.fakeAccountWinlostModel];
    component.tempAdjustedAccounts.ticketTableViewModel = Helper.fakeTicketTableViewModel;
    component.isEdittedTicket = true;

    // Act
    component['updateAdjustedAccounts'](Helper.fakeCustId);

    // Assert
    expect(component.model.adjustedAccounts.length).toBe(1);
    expect(component.model.adjustedAccounts[0].custId).toBe(Helper.fakeCustId);
    expect(component.isEdittedTicket).toBeFalsy();
  });

  it('should not update adjusted accounts when not edited', () => {
    // Arrange
    component.model = new AccountAffectedTicketModel();
    component.model.adjustedAccounts = [];
    component.isEdittedTicket = false;

    // Act
    component['updateAdjustedAccounts'](Helper.fakeCustId);

    // Assert
    expect(component.model.adjustedAccounts.length).toBe(0);
  });
}); 