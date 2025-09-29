import { TestBed } from '@angular/core/testing';
import { GroupBetTypesService } from './group-bettypes.service';
import { BetType, GroupBetType, GroupBetTypesModel } from './group-bettypes.model';

describe('GroupBetTypesService', () => {
  let service: GroupBetTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupBetTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initGroupBetType', () => {
    it('should initialize a group bet type with correct properties', () => {
      const groupName = 'Test Group';
      const betTypes: BetType[] = [
        new BetType(1, 'Test Bet 1', false, 1, false),
        new BetType(2, 'Test Bet 2', true, 2, false)
      ];
      const isChecked = true;

      const result = service.initGroupBetType(groupName, betTypes, isChecked);

      expect(result.groupName).toBe(groupName);
      expect(result.isShow).toBe(true);
      expect(result.isChecked).toBe(isChecked);
      expect(result.betTypes).toHaveLength(2);
      expect(result.betTypes[0].isChecked).toBe(isChecked);
      expect(result.betTypes[1].isChecked).toBe(isChecked);
    });

    it('should initialize with unchecked bet types when isChecked is false', () => {
      const groupName = 'Test Group';
      const betTypes: BetType[] = [ { id: 1, name: 'Test Bet 1', liveIndicator: false, type: 1, value: '1'}
      ] as BetType[];

      const result = service.initGroupBetType(groupName, betTypes, false);

      expect(result.isChecked).toBe(false);
      expect(result.betTypes[0].isChecked).toBe(false);
    });
  });

  describe('changeCheckedGroupToBetType', () => {
    it('should set all bet types to checked when group is checked and shown', () => {
      const group = new GroupBetType();
      group.isChecked = true;
      group.isShow = true;
      group.betTypes = [
        new BetType(1, 'Test 1', false, 1, false),
        new BetType(2, 'Test 2', false, 1, false)
      ];

      service.changeCheckedGroupToBetType(group);

      expect(group.betTypes[0].isChecked).toBe(true);
      expect(group.betTypes[1].isChecked).toBe(true);
    });

    it('should set all bet types to unchecked when group is unchecked', () => {
      const group = new GroupBetType();
      group.isChecked = false;
      group.isShow = true;
      group.betTypes = [
        new BetType(1, 'Test 1', false, 1, true),
        new BetType(2, 'Test 2', false, 1, true)
      ];

      service.changeCheckedGroupToBetType(group);

      expect(group.betTypes[0].isChecked).toBe(false);
      expect(group.betTypes[1].isChecked).toBe(false);
    });

    it('should set all bet types to unchecked when group is hidden', () => {
      const group = new GroupBetType();
      group.isChecked = true;
      group.isShow = false;
      group.betTypes = [
        new BetType(1, 'Test 1', false, 1, true),
        new BetType(2, 'Test 2', false, 1, true)
      ];

      service.changeCheckedGroupToBetType(group);

      expect(group.betTypes[0].isChecked).toBe(false);
      expect(group.betTypes[1].isChecked).toBe(false);
    });
  });

  describe('changeCheckedBetTypeToGroup', () => {
    it('should set group to checked when all bet types are checked', () => {
      const group = new GroupBetType();
      group.betTypes = [
        new BetType(1, 'Test 1', false, 1, true),
        new BetType(2, 'Test 2', false, 1, true)
      ];

      service.changeCheckedBetTypeToGroup(group);

      expect(group.isChecked).toBe(true);
    });

    it('should set group to unchecked when any bet type is unchecked', () => {
      const group = new GroupBetType();
      group.betTypes = [
        new BetType(1, 'Test 1', false, 1, true),
        new BetType(2, 'Test 2', false, 1, false)
      ];

      service.changeCheckedBetTypeToGroup(group);

      expect(group.isChecked).toBe(false);
    });

    it('should set group to checked when no bet types exist', () => {
      const group = new GroupBetType();
      group.betTypes = [];

      service.changeCheckedBetTypeToGroup(group);

      expect(group.isChecked).toBe(true);
    });
  });

  describe('initGroupBetTypesModel', () => {
    it('should initialize group bet types model with correct properties', () => {
      const groups: GroupBetType[] = [
        {
          groupName: 'Group 1',
          betTypes: [new BetType(1, 'Test 1', false, 1, false)],
          isChecked: false,
          isShow: true
        },
        {
          groupName: 'Group 2',
          betTypes: [new BetType(2, 'Test 2', false, 1, false)],
          isChecked: false,
          isShow: true
        }
      ];
      const isChecked = true;

      const result = service.initGroupBetTypesModel(groups, isChecked);

      expect(result.isChecked).toBe(isChecked);
      expect(result.groupBetTypes).toHaveLength(2);
      expect(result.groupBetTypes[0].groupName).toBe('Group 1');
      expect(result.groupBetTypes[1].groupName).toBe('Group 2');
    });
  });

  describe('changeCheckGroupByBetTypes', () => {
    it('should set group to checked when all bet types are checked', () => {
      const groupBetTypes: GroupBetType[] = [
        {
          groupName: 'Group 1',
          betTypes: [
            new BetType(1, 'Test 1', false, 1, true),
            new BetType(2, 'Test 2', false, 1, true)
          ],
          isChecked: false,
          isShow: true
        }
      ];

      service.changeCheckGroupByBetTypes(groupBetTypes);

      expect(groupBetTypes[0].isChecked).toBe(true);
    });

    it('should set group to unchecked when any bet type is unchecked', () => {
      const groupBetTypes: GroupBetType[] = [
        {
          groupName: 'Group 1',
          betTypes: [
            new BetType(1, 'Test 1', false, 1, true),
            new BetType(2, 'Test 2', false, 1, false)
          ],
          isChecked: true,
          isShow: true
        }
      ];

      service.changeCheckGroupByBetTypes(groupBetTypes);

      expect(groupBetTypes[0].isChecked).toBe(false);
    });
  });

  describe('changeCheckedModelToGroup', () => {
    it('should propagate model checked state to groups and bet types', () => {
      const groupModel = new GroupBetTypesModel();
      groupModel.isChecked = true;
      groupModel.groupBetTypes = [
        {
          groupName: 'Group 1',
          betTypes: [new BetType(1, 'Test 1', false, 1, false)],
          isChecked: false,
          isShow: true
        }
      ];

      service.changeCheckedModelToGroup(groupModel);

      expect(groupModel.groupBetTypes[0].isChecked).toBe(true);
      expect(groupModel.groupBetTypes[0].betTypes[0].isChecked).toBe(true);
    });

    it('should not affect hidden groups', () => {
      const groupModel = new GroupBetTypesModel();
      groupModel.isChecked = true;
      groupModel.groupBetTypes = [
        {
          groupName: 'Group 1',
          betTypes: [new BetType(1, 'Test 1', false, 1, false)],
          isChecked: false,
          isShow: false
        }
      ];

      service.changeCheckedModelToGroup(groupModel);

      expect(groupModel.groupBetTypes[0].isChecked).toBe(false);
      expect(groupModel.groupBetTypes[0].betTypes[0].isChecked).toBe(false);
    });
  });

  describe('changeCheckedGroupToModel', () => {
    it('should set model to checked when all visible groups are checked', () => {
      const groupModel = new GroupBetTypesModel();
      groupModel.groupBetTypes = [
        {
          groupName: 'Group 1',
          betTypes: [new BetType(1, 'Test 1', false, 1, true)],
          isChecked: true,
          isShow: true
        },
        {
          groupName: 'Group 2',
          betTypes: [new BetType(2, 'Test 2', false, 1, true)],
          isChecked: true,
          isShow: true
        }
      ];

      service.changeCheckedGroupToModel(groupModel);

      expect(groupModel.isChecked).toBe(true);
    });

    it('should set model to unchecked when any visible group is unchecked', () => {
      const groupModel = new GroupBetTypesModel();
      groupModel.groupBetTypes = [
        {
          groupName: 'Group 1',
          betTypes: [new BetType(1, 'Test 1', false, 1, true)],
          isChecked: true,
          isShow: true
        },
        {
          groupName: 'Group 2',
          betTypes: [new BetType(2, 'Test 2', false, 1, false)],
          isChecked: false,
          isShow: true
        }
      ];

      service.changeCheckedGroupToModel(groupModel);

      expect(groupModel.isChecked).toBe(false);
    });

    it('should set model to checked when all groups are hidden', () => {
      const groupModel = new GroupBetTypesModel();
      groupModel.groupBetTypes = [
        {
          groupName: 'Group 1',
          betTypes: [new BetType(1, 'Test 1', false, 1, false)],
          isChecked: false,
          isShow: false
        }
      ];

      service.changeCheckedGroupToModel(groupModel);

      expect(groupModel.isChecked).toBe(false);
    });
  });

  describe('getCheckedBetTypes', () => {
    it('should return array of checked bet type IDs', () => {
      const groupBetTypes: GroupBetType[] = [
        {
          groupName: 'Group 1',
          betTypes: [
            new BetType(1, 'Test 1', false, 1, true),
            new BetType(2, 'Test 2', false, 1, false)
          ],
          isChecked: false,
          isShow: true
        },
        {
          groupName: 'Group 2',
          betTypes: [
            new BetType(3, 'Test 3', false, 1, true)
          ],
          isChecked: false,
          isShow: true
        }
      ];

      const result = service.getCheckedBetTypes(groupBetTypes);

      expect(result).toEqual([1, 3]);
    });

    it('should return empty array when no bet types are checked', () => {
      const groupBetTypes: GroupBetType[] = [
        {
          groupName: 'Group 1',
          betTypes: [
            new BetType(1, 'Test 1', false, 1, false),
            new BetType(2, 'Test 2', false, 1, false)
          ],
          isChecked: false,
          isShow: true
        }
      ];

      const result = service.getCheckedBetTypes(groupBetTypes);

      expect(result).toEqual([]);
    });
  });

  describe('getValueCheckedBetTypes', () => {
    it('should return comma-separated string of checked bet type values', () => {
      const groupBetTypes: GroupBetType[] = [
        {
          groupName: 'Group 1',
          betTypes: [
            new BetType(1, 'Test 1', false, 1, true),
            new BetType(2, 'Test 2', false, 1, false)
          ],
          isChecked: false,
          isShow: true
        }
      ];

      const result = service.getValueCheckedBetTypes(groupBetTypes);

      expect(result).toBe('1,1303');
    });

    it('should return empty string when no bet types are checked', () => {
      const groupBetTypes: GroupBetType[] = [
        {
          groupName: 'Group 1',
          betTypes: [
            new BetType(1, 'Test 1', false, 1, false)
          ],
          isChecked: false,
          isShow: true
        }
      ];

      const result = service.getValueCheckedBetTypes(groupBetTypes);

      expect(result).toBe('');
    });
  });

  describe('getAllBetType', () => {
    it('should return all bet types from all groups', () => {
      const groupBetTypes: GroupBetType[] = [
        {
          groupName: 'Group 1',
          betTypes: [
            new BetType(1, 'Test 1', false, 1, true),
            new BetType(2, 'Test 2', false, 1, false)
          ],
          isChecked: false,
          isShow: true
        },
        {
          groupName: 'Group 2',
          betTypes: [
            new BetType(3, 'Test 3', false, 1, true)
          ],
          isChecked: false,
          isShow: true
        }
      ];

      const result = service.getAllBetType(groupBetTypes);

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
      expect(result[2].id).toBe(3);
    });
  });

  describe('hasBetType', () => {
    it('should return true when bet type exists in any group', () => {
      const groupBetTypes: GroupBetType[] = [
        {
          groupName: 'Group 1',
          betTypes: [
            new BetType(1, 'Test 1', false, 1, true),
            new BetType(2, 'Test 2', false, 1, false)
          ],
          isChecked: false,
          isShow: true
        }
      ];

      const result = service.hasBetType(groupBetTypes, 1);

      expect(result).toBe(true);
    });

    it('should return false when bet type does not exist in any group', () => {
      const groupBetTypes: GroupBetType[] = [
        {
          groupName: 'Group 1',
          betTypes: [
            new BetType(1, 'Test 1', false, 1, true)
          ],
          isChecked: false,
          isShow: true
        }
      ];

      const result = service.hasBetType(groupBetTypes, 999);

      expect(result).toBe(false);
    });
  });
});