import { TestBed } from '@angular/core/testing';
import { BetTypeService } from './bet-type.service';
import { BetTypeAddRequest, GroupBetTypeAddRequest, GroupBetTypesAddRequestModel } from './group-bet-types.model';

describe('BetTypeService', () => {
  let service: BetTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BetTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initGroupBetTypeAddRequest', () => {
    it('should initialize group bet type with correct properties', () => {
      const groupName = 'Test Group';
      const betTypes = [
        new BetTypeAddRequest(1, 'Bet Type 1', false, false),
        new BetTypeAddRequest(2, 'Bet Type 2', false, false)
      ];
      const isChecked = true;
      const isDisable = false;

      const result = service.initGroupBetTypeAddRequest(groupName, betTypes, isChecked, isDisable);

      expect(result.groupName).toBe(groupName);
      expect(result.isChecked).toBe(isChecked);
      expect(result.isDisable).toBe(isDisable);
      expect(result.isShow).toBe(true);
      expect(result.betTypes).toHaveLength(2);
      expect(result.betTypes[0].isChecked).toBe(isChecked);
      expect(result.betTypes[0].isDisable).toBe(isDisable);
    });

    it('should handle empty bet types array', () => {
      const groupName = 'Empty Group';
      const betTypes: BetTypeAddRequest[] = [];
      const isChecked = false;
      const isDisable = true;

      const result = service.initGroupBetTypeAddRequest(groupName, betTypes, isChecked, isDisable);

      expect(result.betTypes).toHaveLength(0);
      expect(result.isDisable).toBe(true);
    });
  });

  describe('changeCheckedBetTypeToGroup', () => {
    it('should set group as checked when all bet types are checked', () => {
      const group = new GroupBetTypeAddRequest();
      group.betTypes = [
        new BetTypeAddRequest(1, 'Type 1', true, false),
        new BetTypeAddRequest(2, 'Type 2', true, false)
      ];

      service.changeCheckedBetTypeToGroup(group);

      expect(group.isChecked).toBe(true);
    });

    it('should set group as unchecked when any bet type is unchecked', () => {
      const group = new GroupBetTypeAddRequest();
      group.betTypes = [
        new BetTypeAddRequest(1, 'Type 1', true, false),
        new BetTypeAddRequest(2, 'Type 2', false, false)
      ];

      service.changeCheckedBetTypeToGroup(group);

      expect(group.isChecked).toBe(false);
    });

    it('should handle empty bet types array', () => {
      const group = new GroupBetTypeAddRequest();
      group.betTypes = [];

      service.changeCheckedBetTypeToGroup(group);

      expect(group.isChecked).toBe(true);
    });
  });

  describe('changeCheckedGroupToBetType', () => {
    it('should set all bet types as checked when group is checked and shown', () => {
      const group = new GroupBetTypeAddRequest();
      group.isChecked = true;
      group.isShow = true;
      group.betTypes = [
        new BetTypeAddRequest(1, 'Type 1', false, false),
        new BetTypeAddRequest(2, 'Type 2', false, false)
      ];

      service.changeCheckedGroupToBetType(group);

      expect(group.betTypes[0].isChecked).toBe(true);
      expect(group.betTypes[1].isChecked).toBe(true);
    });

    it('should set all bet types as unchecked when group is unchecked', () => {
      const group = new GroupBetTypeAddRequest();
      group.isChecked = false;
      group.isShow = true;
      group.betTypes = [
        new BetTypeAddRequest(1, 'Type 1', true, false),
        new BetTypeAddRequest(2, 'Type 2', true, false)
      ];

      service.changeCheckedGroupToBetType(group);

      expect(group.betTypes[0].isChecked).toBe(false);
      expect(group.betTypes[1].isChecked).toBe(false);
    });

    it('should set all bet types as unchecked when group is hidden', () => {
      const group = new GroupBetTypeAddRequest();
      group.isChecked = true;
      group.isShow = false;
      group.betTypes = [
        new BetTypeAddRequest(1, 'Type 1', true, false),
        new BetTypeAddRequest(2, 'Type 2', true, false)
      ];

      service.changeCheckedGroupToBetType(group);

      expect(group.betTypes[0].isChecked).toBe(false);
      expect(group.betTypes[1].isChecked).toBe(false);
    });
  });

  describe('initGroupBetTypesAddRequestModel', () => {
    it('should initialize group bet types model with correct properties', () => {
      const groups = [
        new GroupBetTypeAddRequest(),
        new GroupBetTypeAddRequest()
      ];
      groups[0].groupName = 'Group 1';
      groups[0].betTypes = [new BetTypeAddRequest(1, 'Type 1', false, false)];
      groups[1].groupName = 'Group 2';
      groups[1].betTypes = [new BetTypeAddRequest(2, 'Type 2', false, false)];

      const isChecked = true;
      const name = 'Test Model';
      const isDisable = false;

      const result = service.initGroupBetTypesAddRequestModel(groups, isChecked, name, isDisable);

      expect(result.name).toBe(name);
      expect(result.isChecked).toBe(isChecked);
      expect(result.isDisable).toBe(isDisable);
      expect(result.groupBetTypes).toHaveLength(2);
      expect(result.groupBetTypes[0].groupName).toBe('Group 1');
      expect(result.groupBetTypes[1].groupName).toBe('Group 2');
    });

    it('should handle empty groups array', () => {
      const groups: GroupBetTypeAddRequest[] = [];
      const isChecked = false;
      const name = 'Empty Model';
      const isDisable = true;

      const result = service.initGroupBetTypesAddRequestModel(groups, isChecked, name, isDisable);

      expect(result.groupBetTypes).toHaveLength(0);
      expect(result.isDisable).toBe(true);
    });
  });

  describe('changeCheckedModelToGroup', () => {
    it('should propagate checked state from model to groups and bet types', () => {
      const groupModel = new GroupBetTypesAddRequestModel();
      groupModel.isChecked = true;
      groupModel.groupBetTypes = [
        new GroupBetTypeAddRequest(),
        new GroupBetTypeAddRequest()
      ];
      groupModel.groupBetTypes[0].isShow = true;
      groupModel.groupBetTypes[0].betTypes = [new BetTypeAddRequest(1, 'Type 1', false, false)];
      groupModel.groupBetTypes[1].isShow = true;
      groupModel.groupBetTypes[1].betTypes = [new BetTypeAddRequest(2, 'Type 2', false, false)];

      service.changeCheckedModelToGroup(groupModel);

      expect(groupModel.groupBetTypes[0].isChecked).toBe(true);
      expect(groupModel.groupBetTypes[1].isChecked).toBe(true);
      expect(groupModel.groupBetTypes[0].betTypes[0].isChecked).toBe(true);
      expect(groupModel.groupBetTypes[1].betTypes[0].isChecked).toBe(true);
    });

    it('should not affect hidden groups', () => {
      const groupModel = new GroupBetTypesAddRequestModel();
      groupModel.isChecked = true;
      groupModel.groupBetTypes = [
        new GroupBetTypeAddRequest()
      ];
      groupModel.groupBetTypes[0].isShow = false;
      groupModel.groupBetTypes[0].betTypes = [new BetTypeAddRequest(1, 'Type 1', false, false)];

      service.changeCheckedModelToGroup(groupModel);

      expect(groupModel.groupBetTypes[0].isChecked).toBe(false);
      expect(groupModel.groupBetTypes[0].betTypes[0].isChecked).toBe(false);
    });
  });

  describe('changeCheckedGroupToModel', () => {
    it('should set model as checked when all visible groups are checked', () => {
      const groupModel = new GroupBetTypesAddRequestModel();
      groupModel.groupBetTypes = [
        new GroupBetTypeAddRequest(),
        new GroupBetTypeAddRequest()
      ];
      groupModel.groupBetTypes[0].isShow = true;
      groupModel.groupBetTypes[0].isChecked = true;
      groupModel.groupBetTypes[1].isShow = true;
      groupModel.groupBetTypes[1].isChecked = true;

      service.changeCheckedGroupToModel(groupModel);

      expect(groupModel.isChecked).toBe(true);
    });

    it('should set model as unchecked when any visible group is unchecked', () => {
      const groupModel = new GroupBetTypesAddRequestModel();
      groupModel.groupBetTypes = [
        new GroupBetTypeAddRequest(),
        new GroupBetTypeAddRequest()
      ];
      groupModel.groupBetTypes[0].isShow = true;
      groupModel.groupBetTypes[0].isChecked = true;
      groupModel.groupBetTypes[1].isShow = true;
      groupModel.groupBetTypes[1].isChecked = false;

      service.changeCheckedGroupToModel(groupModel);

      expect(groupModel.isChecked).toBe(false);
    });

    it('should set model as unchecked when all groups are hidden', () => {
      const groupModel = new GroupBetTypesAddRequestModel();
      groupModel.groupBetTypes = [
        new GroupBetTypeAddRequest(),
        new GroupBetTypeAddRequest()
      ];
      groupModel.groupBetTypes[0].isShow = false;
      groupModel.groupBetTypes[0].isChecked = true;
      groupModel.groupBetTypes[1].isShow = false;
      groupModel.groupBetTypes[1].isChecked = true;

      service.changeCheckedGroupToModel(groupModel);

      expect(groupModel.isChecked).toBe(false);
    });

    it('should handle empty groups array', () => {
      const groupModel = new GroupBetTypesAddRequestModel();
      groupModel.groupBetTypes = [];

      service.changeCheckedGroupToModel(groupModel);

      expect(groupModel.isChecked).toBe(false);
    });
  });

  describe('getCheckedBetTypes', () => {
    it('should return only checked bet types from all groups', () => {
      const groupBetTypes = [
        new GroupBetTypeAddRequest(),
        new GroupBetTypeAddRequest()
      ];
      groupBetTypes[0].betTypes = [
        new BetTypeAddRequest(1, 'Type 1', true, false),
        new BetTypeAddRequest(2, 'Type 2', false, false)
      ];
      groupBetTypes[1].betTypes = [
        new BetTypeAddRequest(3, 'Type 3', true, false),
        new BetTypeAddRequest(4, 'Type 4', true, false)
      ];

      const result = service.getCheckedBetTypes(groupBetTypes);

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(3);
      expect(result[2].id).toBe(4);
    });

    it('should return empty array when no bet types are checked', () => {
      const groupBetTypes = [
        new GroupBetTypeAddRequest()
      ];
      groupBetTypes[0].betTypes = [
        new BetTypeAddRequest(1, 'Type 1', false, false),
        new BetTypeAddRequest(2, 'Type 2', false, false)
      ];

      const result = service.getCheckedBetTypes(groupBetTypes);

      expect(result).toHaveLength(0);
    });

    it('should handle empty groups array', () => {
      const groupBetTypes: GroupBetTypeAddRequest[] = [];

      const result = service.getCheckedBetTypes(groupBetTypes);

      expect(result).toHaveLength(0);
    });
  });

  describe('getAllBetTypes', () => {
    it('should return all bet types from all groups', () => {
      const groupBetTypes = [
        new GroupBetTypeAddRequest(),
        new GroupBetTypeAddRequest()
      ];
      groupBetTypes[0].betTypes = [
        new BetTypeAddRequest(1, 'Type 1', true, false),
        new BetTypeAddRequest(2, 'Type 2', false, false)
      ];
      groupBetTypes[1].betTypes = [
        new BetTypeAddRequest(3, 'Type 3', true, false)
      ];

      const result = service.getAllBetTypes(groupBetTypes);

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
      expect(result[2].id).toBe(3);
    });

    it('should handle empty groups array', () => {
      const groupBetTypes: GroupBetTypeAddRequest[] = [];

      const result = service.getAllBetTypes(groupBetTypes);

      expect(result).toHaveLength(0);
    });

    it('should handle groups with empty bet types', () => {
      const groupBetTypes = [
        new GroupBetTypeAddRequest(),
        new GroupBetTypeAddRequest()
      ];
      groupBetTypes[0].betTypes = [];
      groupBetTypes[1].betTypes = [new BetTypeAddRequest(1, 'Type 1', true, false)];

      const result = service.getAllBetTypes(groupBetTypes);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });
  });
});
