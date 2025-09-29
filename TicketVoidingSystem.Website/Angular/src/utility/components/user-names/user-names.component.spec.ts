import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';
import { UsernamesComponent } from './user-names.component';
import { CSSCLASS, UsernameItem } from './user-names.model';
import { Tooltip } from '../tooltip/tooltip.model';

class Helper {
  static readonly fakeModel = 'user1,user2,user3';
}

describe('UsernamesComponent', () => {
  let component: UsernamesComponent;
  let fixture: ComponentFixture<UsernamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UsernamesComponent);
    component = fixture.componentInstance;
    
    // Mock DOM element for tooltip
    const mockElement = {
      getElementsByClassName: () => [{
        scrollIntoView: () => {},
        getBoundingClientRect: () => ({ top: 0, left: 0 })
      }]
    };
    component.element = mockElement as any;
    
    // Set initial values
    component.model = Helper.fakeModel;
    component.maxUsername = 50;
    component.disabled = false;
    component.isAbException = false;
    
    // Trigger ngOnChanges manually
    component.ngOnChanges({
      model: {
        currentValue: Helper.fakeModel,
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    });
    component.tooltip = new Tooltip();
    component.tooltip.display = jest.fn();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.groupUsername).toBeTruthy();
    expect(component.groupUsername.items.length).toBe(3);
    expect(component.username).toBe('');
  });

  it('should handle model changes', () => {
    component.ngOnChanges({
      model: {
        currentValue: Helper.fakeModel,
        previousValue: Helper.fakeModel,
        firstChange: false,
        isFirstChange: () => false
      }
    });
    expect(component.groupUsername.items.length).toBe(3);
  });

  it('should add item correctly', () => {
    const newUsername = 'newuser';
    component.addItem(newUsername, false);
    expect(component.groupUsername.items.length).toBe(4);
    expect(component.groupUsername.items[3].value).toBe(newUsername);
  });

  it('should not add item when max username limit reached', () => {
    component.maxUsername = 3;
    const newUsername = 'newuser';
    component.addItem(newUsername, false);
    expect(component.groupUsername.items.length).toBe(3);
  });

  it('should handle paste event correctly', () => {
    const pasteText = 'user4 user5;user6\r\nuser7\tuser8\nuser9';
    const pasteEvent = {
      clipboardData: {
        getData: () => pasteText
      }
      } as unknown as ClipboardEvent;
    
    component.pasteItem(pasteEvent);
    expect(component.groupUsername.items.length).toBe(9);
    expect(component.groupUsername.items[3].value).toBe('user4');
    expect(component.groupUsername.items[4].value).toBe('user5');
    expect(component.groupUsername.items[5].value).toBe('user6');
    expect(component.groupUsername.items[6].value).toBe('user7');
    expect(component.groupUsername.items[7].value).toBe('user8');
    expect(component.groupUsername.items[8].value).toBe('user9');
  });

  it('should handle delete item', () => {
    const itemToDelete = component.groupUsername.items[0];
    component.userNameService.remove = jest.fn();
    component.userNameService.getAllValue = jest.fn().mockReturnValue(Helper.fakeModel);
    
    // Mock EventEmitters
    const changeSpy = jest.spyOn(component.change, 'emit');
    const modelChangeSpy = jest.spyOn(component.modelChange, 'emit');

    // Action
    component.deleteItem(itemToDelete);

    // Assert
    expect(component.model).toBe(Helper.fakeModel);
    expect(component.userNameService.remove).toHaveBeenCalled();
    expect(component.userNameService.getAllValue).toHaveBeenCalled();
    expect(changeSpy).toHaveBeenCalled();
    expect(modelChangeSpy).toHaveBeenCalled();
  });

  it('should handle focus out event', () => {
    component.input.nativeElement.blur = jest.fn();
    component.focusOutUsernames.emit = jest.fn();

    component.triggerFocusOutUsernames();
    expect(component.input.nativeElement.blur).toHaveBeenCalled();
    expect(component.focusOutUsernames.emit).toHaveBeenCalled();
  });

  it('should handle clear usernames', () => {
    component.clearUsernames();
    expect(component.groupUsername.items.length).toBe(0);
  });

  it('should handle remove invalid usernames', () => {
    component.isAbException = true;
    component.groupUsername.items = [
      new UsernameItem('valid1'),
      new UsernameItem('invalid@'),
      new UsernameItem('valid2')
    ];

    component.removeInvalidUserNames();
    
    expect(component.groupUsername.items.length).toBe(3);
    expect(component.groupUsername.items.every(item => item.isValid)).toBeTruthy();
  });

  describe('#isShowButtonRemoveInvalid', () => {
    it('should return true when isAbException is true and validIndex is 2', () => {
      component.isAbException = true;
      component.userNameService.checkValidItems = jest.fn().mockReturnValue(2);

      // Action & Assert
      expect(component.isShowButtonRemoveInvalid()).toBeTruthy();
    });

    it('should return false when isAbException is false and validIndex is 2', () => {
      component.isAbException = false;
      component.userNameService.checkValidItems = jest.fn().mockReturnValue(2);

      // Action & Assert
      expect(component.isShowButtonRemoveInvalid()).toBeFalsy();
    });

    it('should return false when isAbException is false and validIndex is 1', () => {
      component.isAbException = false;
      component.userNameService.checkValidItems = jest.fn().mockReturnValue(1);

      // Action & Assert
      expect(component.isShowButtonRemoveInvalid()).toBeFalsy();
    });

    it('should return false when isAbException is true and validIndex is 1', () => {
      component.isAbException = true;
      component.userNameService.checkValidItems = jest.fn().mockReturnValue(1);

      // Action & Assert
      expect(component.isShowButtonRemoveInvalid()).toBeFalsy();
    });
  });

  describe('#isAllUsernamesOffSiteDbDown', () => {
    it('should return true when all usernames are off site DB down', () => {
      component.groupUsername.items = [
        new UsernameItem('user1'),
        new UsernameItem('user2'),
        new UsernameItem('user3')
      ];
      component.groupUsername.items.forEach(item => item.cssClass = CSSCLASS.SITE_DB_DOWN);

      // Action & Assert
      expect(component.isAllUsernamesOffSiteDbDown()).toBeTruthy();
    });

    it('should return false when all usernames are not off site DB down', () => {
      component.groupUsername.items = [
        new UsernameItem('user1'),
        new UsernameItem('user2'),
        new UsernameItem('user3')
      ];
      component.groupUsername.items[0].cssClass = CSSCLASS.SITE_DB_DOWN;
      component.groupUsername.items[1].cssClass = CSSCLASS.VALID;
      component.groupUsername.items[2].cssClass = CSSCLASS.INVALID;

      // Action & Assert
      expect(component.isAllUsernamesOffSiteDbDown()).toBeFalsy();
    });

    it('should return true when group username items is empty', () => {
      component.groupUsername.items = [];

      // Action & Assert
      expect(component.isAllUsernamesOffSiteDbDown()).toBeTruthy();
    });
  });

  describe('#checkValidItems', () => {
    it('should return true when all usernames are valid', () => {
      component.groupUsername.items = [
        new UsernameItem('user1'),
        new UsernameItem('user2'),
        new UsernameItem('user3')
      ];
      component.userNameService.checkValidItems = jest.fn().mockReturnValue(0);
      component.tooltip.display = jest.fn();

      // Action & Assert
      expect(component.checkValidItems()).toBeTruthy();
    });

    it('should return false when invalid usernames', () => {
      component.groupUsername.items = [
        new UsernameItem('user1'),
        new UsernameItem('user2'),
        new UsernameItem('user3')
      ];
      component.userNameService.checkValidItems = jest.fn().mockReturnValue(2);

      // Action & Assert
      expect(component.checkValidItems()).toBeFalsy();
      expect(component.tooltip.display).toHaveBeenCalled();
    });

    it('should return false when no usernames', () => {
      component.groupUsername.items = [];
      component.userNameService.checkValidItems = jest.fn().mockReturnValue(1);

      // Action & Assert
      expect(component.checkValidItems()).toBeFalsy();
    });

    it('should return false when isExceededTotalUsernames is true', () => {
      component.groupUsername.items = [
        new UsernameItem('user1'),
        new UsernameItem('user2'),
        new UsernameItem('user3')
      ];
      component.userNameService.checkValidItems = jest.fn().mockReturnValue(3);

      // Action & Assert
      expect(component.checkValidItems()).toBeFalsy();
    });
  });

  describe('#onKey', () => {
    beforeEach(() => {
      // Mock userNameService methods
      component.userNameService.selectAllItems = jest.fn();
      component.userNameService.removeLasted = jest.fn();
      component.userNameService.removeSelected = jest.fn();
      component.userNameService.getAllValue = jest.fn().mockReturnValue(Helper.fakeModel);
      
      // Mock EventEmitters
      jest.spyOn(component.change, 'emit');
      jest.spyOn(component.modelChange, 'emit');
    });

    it('should select all items when Ctrl + Numpad1 is pressed', () => {
      // Arrange
      const event = {
        ctrlKey: true,
        key: String.fromCharCode(97) // Numpad1 key code 97
      } as KeyboardEvent;

      // Act
      const result = component.onKey(event);

      // Assert
      expect(component.userNameService.selectAllItems).toHaveBeenCalledWith(component.groupUsername);
      expect(result).toBeUndefined();
    });

    it('should remove last item when Backspace is pressed and username is empty', () => {
      // Arrange
      component.username = '';
      const event = {
        ctrlKey: false,
        key: String.fromCharCode(66) // Backspace key code 66
      } as KeyboardEvent;

      // Act
      const result = component.onKey(event);

      // Assert
      expect(component.userNameService.removeLasted).toHaveBeenCalledWith(component.groupUsername);
      expect(result).toBeUndefined();
    });

    it('should not remove last item when Backspace is pressed and username is not empty', () => {
      // Arrange
      component.username = 'testuser';
      const event = {
        ctrlKey: false,
        key: String.fromCharCode(66) // Backspace key code 66
      } as KeyboardEvent;

      // Act
      const result = component.onKey(event);

      // Assert
      expect(component.userNameService.removeLasted).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should remove selected items when Delete key is pressed', () => {
      // Arrange
      const event = {
        ctrlKey: false,
        key: String.fromCharCode(68) // Delete key code 68
      } as KeyboardEvent;

      // Act
      const result = component.onKey(event);

      // Assert
      expect(component.userNameService.removeSelected).toHaveBeenCalledWith(component.groupUsername);
      expect(result).toBeUndefined();
    });

    it('should add item when Space key is pressed and username is not empty', () => {
      // Arrange
      component.username = 'newuser';
      const event = {
        ctrlKey: false,
        key: ' ',
        preventDefault: jest.fn()
      } as any;

      // Act
      const result = component.onKey(event);

      // Assert
      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.groupUsername.items.length).toBe(4);
      expect(component.groupUsername.items[3].value).toBe('newuser');
      expect(result).toBeUndefined();
    });

    it('should prevent default and return when Space key is pressed and username is empty', () => {
      // Arrange
      component.username = '';
      const event = {
        ctrlKey: false,
        key: ' ',
        preventDefault: jest.fn()
      } as any;

      // Act
      const result = component.onKey(event);

      // Assert
      expect(event.preventDefault).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should add item when Comma key is pressed and username is not empty', () => {
      // Arrange
      component.username = 'newuser';
      const event = {
        ctrlKey: false,
        key: ',',
        preventDefault: jest.fn()
      } as any;

      // Act
      const result = component.onKey(event);

      // Assert
      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.groupUsername.items.length).toBe(4);
      expect(component.groupUsername.items[3].value).toBe('newuser');
      expect(result).toBeUndefined();
    });

    it('should add item when Semicolon key is pressed and username is not empty', () => {
      // Arrange
      component.username = 'newuser';
      const event = {
        ctrlKey: false,
        key: ';',
        preventDefault: jest.fn()
      } as any;

      // Act
      const result = component.onKey(event);

      // Assert
      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.groupUsername.items.length).toBe(4);
      expect(component.groupUsername.items[3].value).toBe('newuser');
      expect(result).toBeUndefined();
    });

    it('should return false when max username limit is reached', () => {
      // Arrange
      component.maxUsername = 3; // Current items length is 3
      const event = {
        ctrlKey: false,
        key: 'a' // Normal key
      } as KeyboardEvent;

      // Act
      const result = component.onKey(event);

      // Assert
      expect(result).toBe(false);
    });

    it('should return true for normal keys when max username limit is not reached', () => {
      // Arrange
      component.maxUsername = 10; // Higher than current items length
      const event = {
        ctrlKey: false,
        key: 'a' // Normal key
      } as KeyboardEvent;

      // Act
      const result = component.onKey(event);

      // Assert
      expect(result).toBe(true);
    });

    it('should handle Ctrl + Numpad1 with correct key code', () => {
      // Arrange
      const event = {
        ctrlKey: true,
        key: String.fromCharCode(97) // Numpad1 key code 97
      } as KeyboardEvent;

      // Act
      const result = component.onKey(event);

      // Assert
      expect(component.userNameService.selectAllItems).toHaveBeenCalledWith(component.groupUsername);
      expect(result).toBeUndefined();
    });
  });
});
