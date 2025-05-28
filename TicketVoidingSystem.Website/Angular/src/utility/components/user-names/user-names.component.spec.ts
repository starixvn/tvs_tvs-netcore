import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';
import { UsernamesComponent } from './user-names.component';
import { UsernameItem } from './user-names.model';

class Helper {
  static readonly fakeModel = 'user1,user2,user3';
  static readonly fakeMaxUsername = 50;
  static readonly fakeMaxLengthOneUsername = 30;
  static readonly fakeDisabled = false;
  static readonly fakeIsAbException = false;
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
    component.maxUsername = Helper.fakeMaxUsername;
    component.maxLengthOneUsername = Helper.fakeMaxLengthOneUsername;
    component.disabled = Helper.fakeDisabled;
    component.isAbException = Helper.fakeIsAbException;
    
    // Trigger ngOnChanges manually
    component.ngOnChanges({
      model: {
        currentValue: Helper.fakeModel,
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    });
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.groupUsername).toBeTruthy();
    expect(component.groupUsername.items.length).toBe(3);
    expect(component.username).toBe('');
    expect(component.isFocusingUsernames).toBeFalsy();
    expect(component.isSelectedAll).toBeFalsy();
  });

  it('should handle model changes', () => {
    const newModel = 'user4,user5';
    component.model = newModel;
    component.ngOnChanges({
      model: {
        currentValue: newModel,
        previousValue: Helper.fakeModel,
        firstChange: false,
        isFirstChange: () => false
      }
    });
    expect(component.groupUsername.items.length).toBe(2);
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
    const pasteText = 'user4 user5;user6\nuser7\tuser8';
    const pasteEvent = {
      clipboardData: {
        getData: () => pasteText
      },
      preventDefault: () => {},
      bubbles: true,
      cancelBubble: false,
      cancelable: true,
      composed: false,
      currentTarget: null,
      defaultPrevented: false,
      eventPhase: 0,
      isTrusted: true,
      returnValue: true,
      srcElement: null,
      target: null,
      timeStamp: 0,
      type: 'paste',
      composedPath: () => [],
      initEvent: () => {},
      stopImmediatePropagation: () => {},
      stopPropagation: () => {},
      AT_TARGET: 2,
      BUBBLING_PHASE: 3,
      CAPTURING_PHASE: 1
    } as unknown as ClipboardEvent;
    
    component.pasteItem(pasteEvent);
    expect(component.groupUsername.items.length).toBe(8);
    expect(component.groupUsername.items[3].value).toBe('user4');
    expect(component.groupUsername.items[4].value).toBe('user5');
    expect(component.groupUsername.items[5].value).toBe('user6');
    expect(component.groupUsername.items[6].value).toBe('user7');
    expect(component.groupUsername.items[7].value).toBe('user8');
  });

  it('should handle select all items', () => {
    component.selectAllItems();
    expect(component.isSelectedAll).toBeTruthy();
    expect(component.groupUsername.items.every(item => item.isSelected)).toBeTruthy();
  });

  it('should handle delete item', () => {
    const itemToDelete = component.groupUsername.items[0];
    component.deleteItem(itemToDelete);
    expect(component.groupUsername.items.length).toBe(2);
    expect(component.groupUsername.items.includes(itemToDelete)).toBeFalsy();
  });

  it('should handle focus out event', () => {
    const focusOutSpy = jest.spyOn(component.focusOutUsernames, 'emit');
    component.triggerFocusOutUsernames();
    expect(focusOutSpy).toHaveBeenCalled();
  });

  it('should handle keyboard events correctly', () => {
    const keyEvent = new KeyboardEvent('keydown', { key: ',' });
    component.username = 'testuser';
    const result = component.onKey(keyEvent);
    expect(result).toBeUndefined();
    expect(component.groupUsername.items.length).toBe(4);
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
});
