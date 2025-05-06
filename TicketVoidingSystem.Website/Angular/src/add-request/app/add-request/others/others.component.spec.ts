import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { OthersComponent } from './others.component';
import { OthersService } from './others.service';
import { AddRequestStore } from '../add-request.store';
import { AddRequestApiService } from '../add-request-api.service';
import { SimpleChange } from '@angular/core';
import { GroupOperator, OperatorDefault, OthersModel } from './others.model';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';

class Helper {
  static readonly fakeMatchId = 123;
  static readonly fakeParentMatchId = 456;
  static readonly fakeIssueTypeId = '1';
  static readonly fakeOperators = [
    { operatorId: 1, operatorType: 'TRADER', groupName: 'Group1' },
    { operatorId: 2, operatorType: 'SUSPENDER', groupName: 'Group2' }
  ];
  static readonly fakeDecidedBys = ['User1', 'User2'];
}

describe('OthersComponent', () => {
  let component: OthersComponent;
  let fixture: ComponentFixture<OthersComponent>;
  let othersService: OthersService;
  let addRequestStore: AddRequestStore;
  let addRequestApiService: AddRequestApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        OthersService,
        AddRequestStore,
        AddRequestApiService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OthersComponent);
    othersService = fixture.debugElement.injector.get(OthersService);
    addRequestStore = fixture.debugElement.injector.get(AddRequestStore);
    addRequestApiService = fixture.debugElement.injector.get(AddRequestApiService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', async () => {
    // Arrange
    component.isEdit = false;
    component.matchId = Helper.fakeMatchId;
    component.issueTypeId = Helper.fakeIssueTypeId;
    othersService.getOperators = jest.fn().mockResolvedValue(Helper.fakeOperators);
    addRequestApiService.GetDecidedBy = jest.fn().mockResolvedValue(Helper.fakeDecidedBys);
    addRequestStore.changeBlockingUiStatus = jest.fn();

    // Act
    await component.ngOnInit();

    // Assert
    expect(component.operators).toEqual([OperatorDefault.TRADER, OperatorDefault.SUSPENDER]);
    expect(component.groupOperators.length).toBeGreaterThan(0);
  });

  it('should handle changes when matchId is provided', async () => {
    // Arrange
    component.isEdit = false;
    component.matchId = Helper.fakeMatchId;
    othersService.getOperators = jest.fn().mockResolvedValue(Helper.fakeOperators);
    addRequestStore.changeBlockingUiStatus = jest.fn();

    // Act
    await component.ngOnChanges({
      matchId: {
        currentValue: Helper.fakeMatchId,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });

    // Assert
    expect(othersService.getOperators).toHaveBeenCalledWith(Helper.fakeMatchId.toString());
    expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
    expect(component.operators).toEqual(Helper.fakeOperators);
  });

  it('should handle operator selection', () => {
    // Arrange
    component.groupOperators = [
      {
        groupName: 'Group1',
        items: [
          { operatorId: 0, operatorType: 'DEFAULT' },
          { operatorId: 1, operatorType: 'TRADER' }
        ],
        selected: []
      }
    ] as unknown as GroupOperator[];

    // Act
    component.onSelectOperator();

    // Assert
    expect(component.groupOperators[0].selected.length).toBe(1);
    expect(component.groupOperators[0].selected[0].operatorId).toBe(0);
  });

  it('should update model when operators change', () => {
    // Arrange
    component.model = new OthersModel();
    component.groupOperators = [
      {
        groupName: 'Group1',
        items: [
          { operatorId: 1, operatorType: 'TRADER' }
        ],
        selected: [{ operatorId: 1, operatorType: 'TRADER' }]
      }
    ] as unknown as GroupOperator[];
    component.modelChange.emit = jest.fn();

    // Act
    component.updateModel();

    // Assert
    expect(component.model.operatorsList.length).toBe(1);
    expect(component.model.operatorsList[0].operatorId).toBe(1);
    expect(component.modelChange.emit).toHaveBeenCalledWith(component.model);
  });

  it('should initialize provider when issue type supports suggestion', async () => {
    // Arrange
    component.isEdit = false;
    component.matchId = Helper.fakeMatchId;
    component.parentMatchId = Helper.fakeParentMatchId;
    component.issueTypeId = IssueTypeConstant.DANGER_ACCEPTED;
    othersService.getProvider = jest.fn().mockResolvedValue({ providerName: 'TestProvider' });

    // Act
    await component.ngOnChanges({
      matchId: {
        currentValue: Helper.fakeMatchId,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });

    // Assert
    expect(othersService.getProvider).toHaveBeenCalledWith(Helper.fakeParentMatchId);
    expect(component.model.provider).toBe('TestProvider');
  });

  it('should add decided by', () => {
    // Arrange
    const newDecidedBy = 'NewUser';

    // Act
    component.addDecidedBy(newDecidedBy);

    // Assert
    expect(component.decidedBys).toContain(newDecidedBy);
  });

  it('should check if issue type supports suggestion', () => {
    // Arrange
    component.issueTypeId = IssueTypeConstant.DANGER_ACCEPTED;

    // Act & Assert
    expect(component.isIssueTypeSupportSuggestion()).toBeTruthy();

    component.issueTypeId = IssueTypeConstant.RED_CARD;
    expect(component.isIssueTypeSupportSuggestion()).toBeTruthy();

    component.issueTypeId = IssueTypeConstant.WRONG_SCORE;
    expect(component.isIssueTypeSupportSuggestion()).toBeTruthy();

    component.issueTypeId = 'OTHER_TYPE';
    expect(component.isIssueTypeSupportSuggestion()).toBeFalsy();
  });
});
