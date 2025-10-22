import { UserNameService } from './user-name.service';
import { GroupUsername, UsernameItem, CSSCLASS } from './user-names.model';

describe('UserNameService', () => {
  let service: UserNameService;
  let groupUsername: GroupUsername;
  let usernameItem: UsernameItem;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UserNameService();
    groupUsername = new GroupUsername();
    usernameItem = new UsernameItem('testUser');
  });

  describe('changeSelectedAll', () => {
    it('should set isSelected to true and update cssClass to SELECTED when isSelected is true', () => {
      // Arrange
      usernameItem.defaultClass = CSSCLASS.VALID;

      // Action
      service.changeSelectedAll(usernameItem, true);

      // Assert
      expect(usernameItem.isSelected).toBe(true);
      expect(usernameItem.cssClass).toBe(CSSCLASS.SELECTED);
    });

    it('should set isSelected to false and update cssClass to defaultClass when isSelected is false', () => {
      // Arrange
      usernameItem.defaultClass = CSSCLASS.VALID;

      // Action
      service.changeSelectedAll(usernameItem, false);

      // Assert
      expect(usernameItem.isSelected).toBe(false);
      expect(usernameItem.cssClass).toBe(CSSCLASS.VALID);
    });
  });

  describe('selectAllItems', () => {
    it('should toggle isSelectedAll and update all items when called', () => {
      // Arrange
      const item1 = new UsernameItem('user1');
      const item2 = new UsernameItem('user2');
      groupUsername.items = [item1, item2];
      groupUsername.isSelectedAll = false;

      // Action
      service.selectAllItems(groupUsername);

      // Assert
      expect(groupUsername.isSelectedAll).toBe(true);
      expect(item1.isSelected).toBe(true);
      expect(item2.isSelected).toBe(true);
    });

    it('should deselect all items when isSelectedAll is true', () => {
      // Arrange
      const item1 = new UsernameItem('user1');
      const item2 = new UsernameItem('user2');
      groupUsername.items = [item1, item2];
      groupUsername.isSelectedAll = true;

      // Action
      service.selectAllItems(groupUsername);

      // Assert
      expect(groupUsername.isSelectedAll).toBe(false);
      expect(item1.isSelected).toBe(false);
      expect(item2.isSelected).toBe(false);
    });
  });

  describe('getAllValue', () => {
    it('should return empty string when no items', () => {
      // Arrange
      groupUsername.items = [];

      // Action
      const result = service.getAllValue(groupUsername);

      // Assert
      expect(result).toBe('');
    });

    it('should return single value when one item', () => {
      // Arrange
      const item = new UsernameItem('user1');
      groupUsername.items = [item];

      // Action
      const result = service.getAllValue(groupUsername);

      // Assert
      expect(result).toBe('user1');
    });

    it('should return comma-separated values when multiple items', () => {
      // Arrange
      const item1 = new UsernameItem('user1');
      const item2 = new UsernameItem('user2');
      const item3 = new UsernameItem('user3');
      groupUsername.items = [item1, item2, item3];

      // Action
      const result = service.getAllValue(groupUsername);

      // Assert
      expect(result).toBe('user1,user2,user3');
    });
  });

  describe('removeExistedUsernames', () => {
    it('should remove items with EXISTED defaultClass', () => {
      // Arrange
      const item1 = new UsernameItem('user1');
      const item2 = new UsernameItem('user2');
      item2.defaultClass = CSSCLASS.EXISTED;
      groupUsername.items = [item1, item2];

      // Action
      service.removeExistedUsernames(groupUsername);

      // Assert
      expect(groupUsername.items.length).toBe(1);
      expect(groupUsername.items[0].value).toBe('user1');
    });

    it('should not remove items with other defaultClass', () => {
      // Arrange
      const item1 = new UsernameItem('user1');
      const item2 = new UsernameItem('user2');
      item2.defaultClass = CSSCLASS.INVALID;
      groupUsername.items = [item1, item2];

      // Action
      service.removeExistedUsernames(groupUsername);

      // Assert
      expect(groupUsername.items.length).toBe(2);
    });
  });

  describe('removeInvalidUsernames', () => {
    it('should remove items with isValid false', () => {
      // Arrange
      const item1 = new UsernameItem('user1');
      const item2 = new UsernameItem('user2');
      item2.isValid = false;
      groupUsername.items = [item1, item2];

      // Action
      service.removeInvalidUsernames(groupUsername);

      // Assert
      expect(groupUsername.items.length).toBe(1);
      expect(groupUsername.items[0].value).toBe('user1');
    });

    it('should keep items with isValid true', () => {
      // Arrange
      const item1 = new UsernameItem('user1');
      const item2 = new UsernameItem('user2');
      groupUsername.items = [item1, item2];

      // Action
      service.removeInvalidUsernames(groupUsername);

      // Assert
      expect(groupUsername.items.length).toBe(2);
    });
  });

  describe('checkValidItems', () => {
    it('should return 1 when items array is empty', () => {
      // Arrange
      groupUsername.items = [];

      // Action
      const result = service.checkValidItems(groupUsername);

      // Assert
      expect(result).toBe(1);
    });

    it('should return 2 when some items are invalid', () => {
      // Arrange
      const item1 = new UsernameItem('user1');
      const item2 = new UsernameItem('user2');
      item2.isValid = false;
      groupUsername.items = [item1, item2];

      // Action
      const result = service.checkValidItems(groupUsername);

      // Assert
      expect(result).toBe(2);
    });

    it('should return 3 when isExceededTotalUsernames is true', () => {
      // Arrange
      const item1 = new UsernameItem('user1');
      groupUsername.items = [item1];
      groupUsername.isExceededTotalUsernames = true;

      // Action
      const result = service.checkValidItems(groupUsername);

      // Assert
      expect(result).toBe(3);
    });

    it('should return 0 when all conditions are valid', () => {
      // Arrange
      const item1 = new UsernameItem('user1');
      groupUsername.items = [item1];
      groupUsername.isExceededTotalUsernames = false;

      // Action
      const result = service.checkValidItems(groupUsername);

      // Assert
      expect(result).toBe(0);
    });
  });

  describe('updateInvalid', () => {
    it('should update items to INVALID when text is provided', () => {
      // Arrange
      const item1 = new UsernameItem('user1');
      const item2 = new UsernameItem('user2');
      groupUsername.items = [item1, item2];

      // Action
      service.updateInvalid(groupUsername, 'user1,user3');

      // Assert
      expect(item1.cssClass).toBe(CSSCLASS.INVALID);
      expect(item1.defaultClass).toBe(CSSCLASS.INVALID);
      expect(item1.isValid).toBe(false);
      expect(item2.cssClass).toBe(CSSCLASS.VALID);
    });

    it('should not update items when text is null', () => {
      // Arrange
      const item1 = new UsernameItem('user1');
      groupUsername.items = [item1];

      // Action
      service.updateInvalid(groupUsername, null);

      // Assert
      expect(item1.cssClass).toBe(CSSCLASS.VALID);
      expect(item1.isValid).toBe(true);
    });
  });

  describe('updateExisted', () => {
    it('should update items to EXISTED when text is provided', () => {
      // Arrange
      const item1 = new UsernameItem('user1');
      const item2 = new UsernameItem('user2');
      groupUsername.items = [item1, item2];

      // Action
      service.updateExisted(groupUsername, 'user1,user3');

      // Assert
      expect(item1.cssClass).toBe(CSSCLASS.EXISTED);
      expect(item1.defaultClass).toBe(CSSCLASS.EXISTED);
      expect(item1.isValid).toBe(false);
      expect(item2.cssClass).toBe(CSSCLASS.VALID);
    });

    it('should not update items when text is null', () => {
      // Arrange
      const item1 = new UsernameItem('user1');
      groupUsername.items = [item1];

      // Action
      service.updateExisted(groupUsername, null);

      // Assert
      expect(item1.cssClass).toBe(CSSCLASS.VALID);
      expect(item1.isValid).toBe(true);
    });
  });

  describe('updateWarningSiteDBDown', () => {
    it('should update items with warning when text is provided', () => {
      // Arrange
      const item1 = new UsernameItem('user1');
      const item2 = new UsernameItem('user2');
      groupUsername.items = [item1, item2];

      // Action
      service.updateWarningSiteDBDown(groupUsername, 'user1,user3');

      // Assert
      expect(item1.cssClass).toBe(CSSCLASS.EXISTED);
      expect(item1.defaultClass).toBe(CSSCLASS.EXISTED);
      expect(item1.isShowTooltip).toBe(true);
      expect(item1.tooltipText).toBe('Username has tickets of siteDB down');
      expect(item2.cssClass).toBe(CSSCLASS.VALID);
    });

    it('should not update items when text is null', () => {
      // Arrange
      const item1 = new UsernameItem('user1');
      groupUsername.items = [item1];

      // Action
      service.updateWarningSiteDBDown(groupUsername, null);

      // Assert
      expect(item1.cssClass).toBe(CSSCLASS.VALID);
      expect(item1.isShowTooltip).toBe(false);
    });
  });

  describe('getDuplicatedItems', () => {
    it('should return empty array when text is null', () => {
      // Action
      const result = service.getDuplicatedItems(null);

      // Assert
      expect(result).toEqual([]);
    });

    it('should return duplicated items from text', () => {
      // Action
      const result = service.getDuplicatedItems('user1,user2,user1,user3,user2');

      // Assert
      expect(result).toEqual(['user1', 'user2']);
    });

    it('should return empty array when no duplicates', () => {
      // Action
      const result = service.getDuplicatedItems('user1,user2,user3');

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('updateDuplicatedItems', () => {
    it('should update duplicated items to MOVED when text is provided', () => {
      // Arrange
      const item1 = new UsernameItem('user1');
      const item2 = new UsernameItem('user2');
      groupUsername.items = [item1, item2];

      // Action
      service.updateDuplicatedItems(groupUsername, 'user1,user2,user1,user3');

      // Assert
      expect(item1.cssClass).toBe(CSSCLASS.MOVED);
      expect(item1.defaultClass).toBe(CSSCLASS.MOVED);
      expect(item1.isValid).toBe(false);
      expect(item2.cssClass).toBe(CSSCLASS.VALID);
    });

    it('should not update items when text is null', () => {
      // Arrange
      const item1 = new UsernameItem('user1');
      groupUsername.items = [item1];

      // Action
      service.updateDuplicatedItems(groupUsername, null);

      // Assert
      expect(item1.cssClass).toBe(CSSCLASS.VALID);
      expect(item1.isValid).toBe(true);
    });
  });

  describe('remove', () => {
    it('should remove item from items array when item exists', () => {
      // Arrange
      const item1 = new UsernameItem('user1');
      const item2 = new UsernameItem('user2');
      groupUsername.items = [item1, item2];

      // Action
      service.remove(groupUsername, item1);

      // Assert
      expect(groupUsername.items.length).toBe(1);
      expect(groupUsername.items[0]).toBe(item2);
    });

    it('should not remove item when item does not exist', () => {
      // Arrange
      const item1 = new UsernameItem('user1');
      const item2 = new UsernameItem('user2');
      const item3 = new UsernameItem('user3');
      groupUsername.items = [item1, item2];

      // Action
      service.remove(groupUsername, item3);

      // Assert
      expect(groupUsername.items.length).toBe(2);
    });
  });

  describe('removeLasted', () => {
    it('should remove last item from items array', () => {
      // Arrange
      const item1 = new UsernameItem('user1');
      const item2 = new UsernameItem('user2');
      groupUsername.items = [item1, item2];

      // Action
      service.removeLasted(groupUsername);

      // Assert
      expect(groupUsername.items.length).toBe(1);
      expect(groupUsername.items[0]).toBe(item1);
    });

    it('should handle empty array', () => {
      // Arrange
      groupUsername.items = [];

      // Action
      service.removeLasted(groupUsername);

      // Assert
      expect(groupUsername.items.length).toBe(0);
    });
  });

  describe('removeSelected', () => {
    it('should remove selected items from items array', () => {
      // Arrange
      const item1 = new UsernameItem('user1');
      const item2 = new UsernameItem('user2');
      const item3 = new UsernameItem('user3');
      item1.isSelected = true;
      item3.isSelected = true;
      groupUsername.items = [item1, item2, item3];

      // Action
      service.removeSelected(groupUsername);

      // Assert
      expect(groupUsername.items.length).toBe(1);
      expect(groupUsername.items[0]).toBe(item2);
    });

    it('should keep all items when none are selected', () => {
      // Arrange
      const item1 = new UsernameItem('user1');
      const item2 = new UsernameItem('user2');
      groupUsername.items = [item1, item2];

      // Action
      service.removeSelected(groupUsername);

      // Assert
      expect(groupUsername.items.length).toBe(2);
    });
  });

  describe('resetAllValue', () => {
    it('should reset all items to valid state', () => {
      // Arrange
      const item1 = new UsernameItem('user1');
      const item2 = new UsernameItem('user2');
      item1.isValid = false;
      item1.cssClass = CSSCLASS.INVALID;
      item1.defaultClass = CSSCLASS.INVALID;
      item1.isShowTooltip = true;
      item1.tooltipText = 'error';
      groupUsername.items = [item1, item2];

      // Action
      service.resetAllValue(groupUsername);

      // Assert
      expect(item1.isValid).toBe(true);
      expect(item1.cssClass).toBe(CSSCLASS.VALID);
      expect(item1.defaultClass).toBe(CSSCLASS.VALID);
      expect(item1.isShowTooltip).toBe(false);
      expect(item1.tooltipText).toBe('');
      expect(item2.isValid).toBe(true);
      expect(item2.cssClass).toBe(CSSCLASS.VALID);
    });
  });
});
