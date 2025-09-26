import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbExceptionListComponent } from './ab-exception-list.component';
import { GroupNumber, NumberItem } from '../../../../../../utility/components/bet-ids/bet-ids.model';

describe('AbExceptionListComponent', () => {
  let component: AbExceptionListComponent;
  let fixture: ComponentFixture<AbExceptionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({})
    .compileComponents();

    fixture = TestBed.createComponent(AbExceptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.betIds).toBe('');
      expect(component.isVoided).toBe(false);
      expect(component.groupNumber).toBeInstanceOf(GroupNumber);
      expect(component.groupNumber.items).toEqual([]);
    });
  });

  describe('Input Properties', () => {
    it('should accept betIds input', () => {
      component.betIds = '123,456,789';
      expect(component.betIds).toBe('123,456,789');
    });

    it('should accept isVoided input', () => {
      component.isVoided = true;
      expect(component.isVoided).toBe(true);
    });
  });

  describe('ngOnChanges', () => {
    it('should call updateGroupItems when betIds changes', () => {
      component['updateGroupItems'] = jest.fn();
      
      component.ngOnChanges({
        betIds: {
          currentValue: '123,456',
          previousValue: '',
          firstChange: true,
          isFirstChange: () => true
        }
      });

      expect(component['updateGroupItems']).toHaveBeenCalled();
    });

    it('should not call updateGroupItems when other properties change', () => {
      component['updateGroupItems'] = jest.fn();
      
      component.ngOnChanges({
        isVoided: {
          currentValue: true,
          previousValue: false,
          firstChange: false,
          isFirstChange: () => false
        }
      });

      expect(component['updateGroupItems']).not.toHaveBeenCalled();
    });

    it('should not call updateGroupItems when no changes', () => {
      component['updateGroupItems'] = jest.fn();
      
      component.ngOnChanges({});

      expect(component['updateGroupItems']).not.toHaveBeenCalled();
    });
  });

  describe('removeAllItems', () => {
    it('should clear all items and emit empty string', () => {
      component.changeAbExceptionList.emit = jest.fn();
      component.groupNumber.items = [new NumberItem('123'), new NumberItem('456')];
      component.betIds = '123,456';

      component.removeAllItems();

      expect(component.groupNumber.items).toEqual([]);
      expect(component.betIds).toBe('');
      expect(component.changeAbExceptionList.emit).toHaveBeenCalledWith('');
    });

    it('should work when no items exist', () => {
      component.changeAbExceptionList.emit = jest.fn();
      component.groupNumber.items = [];
      component.betIds = '';

      component.removeAllItems();

      expect(component.groupNumber.items).toEqual([]);
      expect(component.betIds).toBe('');
      expect(component.changeAbExceptionList.emit).toHaveBeenCalledWith('');
    });
  });

  describe('removeItem', () => {
    it('should remove specific item and update betIds', () => {
      component.changeAbExceptionList.emit = jest.fn();
      const item1 = new NumberItem('123');
      const item2 = new NumberItem('456');
      component.groupNumber.items = [item1, item2];
      component.betIds = '123,456';

      component.removeItem(item1);

      expect(component.groupNumber.items).toEqual([item2]);
      expect(component.betIds).toBe(',456');
      expect(component.changeAbExceptionList.emit).toHaveBeenCalledWith(',456');
    });

    it('should remove item and clean up empty commas', () => {
      component.changeAbExceptionList.emit = jest.fn();
      const item = new NumberItem('123');
      component.groupNumber.items = [item];
      component.betIds = '123';

      component.removeItem(item);

      expect(component.groupNumber.items).toEqual([]);
      expect(component.betIds).toBe('');
      expect(component.changeAbExceptionList.emit).toHaveBeenCalledWith('');
    });

    it('should handle removing non-existent item', () => {
      component.changeAbExceptionList.emit = jest.fn();
      const item = new NumberItem('123');
      component.groupNumber.items = [];
      component.betIds = '456';

      component.removeItem(item);

      expect(component.groupNumber.items).toEqual([]);
      expect(component.betIds).toBe('456');
      expect(component.changeAbExceptionList.emit).toHaveBeenCalledWith('456');
    });
  });

  describe('updateGroupItems', () => {
    it('should add new items when betIds has content', () => {
      component.betIds = '123,456,789';
      component.groupNumber.items = [];

      component['updateGroupItems']();

      expect(component.groupNumber.items.length).toBe(3);
      expect(component.groupNumber.items[0].value).toBe('123');
      expect(component.groupNumber.items[1].value).toBe('456');
      expect(component.groupNumber.items[2].value).toBe('789');
    });

    it('should not add duplicate items', () => {
      component.betIds = '123,456,123';
      component.groupNumber.items = [new NumberItem('123')];

      component['updateGroupItems']();

      expect(component.groupNumber.items.length).toBe(2);
      expect(component.groupNumber.items[0].value).toBe('123');
      expect(component.groupNumber.items[1].value).toBe('456');
    });

    it('should filter out empty items', () => {
      component.betIds = '123,,456,,789';
      component.groupNumber.items = [];

      component['updateGroupItems']();

      expect(component.groupNumber.items.length).toBe(3);
      expect(component.groupNumber.items[0].value).toBe('123');
      expect(component.groupNumber.items[1].value).toBe('456');
      expect(component.groupNumber.items[2].value).toBe('789');
    });

    it('should not add items when betIds is empty', () => {
      component.betIds = '';
      component.groupNumber.items = [];

      component['updateGroupItems']();

      expect(component.groupNumber.items.length).toBe(0);
    });
    
    it('should handle single item without comma', () => {
      component.betIds = '123';
      component.groupNumber.items = [];

      component['updateGroupItems']();

      expect(component.groupNumber.items.length).toBe(1);
      expect(component.groupNumber.items[0].value).toBe('123');
    });

    it('should handle items with spaces', () => {
      component.betIds = ' 123 , 456 , 789 ';
      component.groupNumber.items = [];

      component['updateGroupItems']();

      expect(component.groupNumber.items.length).toBe(3);
      expect(component.groupNumber.items[0].value).toBe(' 123 ');
      expect(component.groupNumber.items[1].value).toBe(' 456 ');
      expect(component.groupNumber.items[2].value).toBe(' 789 ');
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete workflow: add items, remove items, clear all', () => {
      component.changeAbExceptionList.emit = jest.fn();
      
      // Initial state
      expect(component.groupNumber.items.length).toBe(0);
      expect(component.betIds).toBe('');

      // Add items through ngOnChanges
      component.betIds = '123,456,789';
      component.ngOnChanges({
        betIds: {
          currentValue: '123,456,789',
          previousValue: '',
          firstChange: true,
          isFirstChange: () => true
        }
      });

      expect(component.groupNumber.items.length).toBe(3);
      expect(component.changeAbExceptionList.emit).not.toHaveBeenCalled();

      // Remove one item
      const itemToRemove = component.groupNumber.items[1]; // 456
      component.removeItem(itemToRemove);

      expect(component.groupNumber.items.length).toBe(2);
      expect(component.betIds).toBe('123,,789');
      expect(component.changeAbExceptionList.emit).toHaveBeenCalledWith('123,,789');

      // Remove all items
      component.removeAllItems();

      expect(component.groupNumber.items.length).toBe(0);
      expect(component.betIds).toBe('');
      expect(component.changeAbExceptionList.emit).toHaveBeenCalledWith('');
    });

    it('should handle multiple consecutive changes', () => {
      component.changeAbExceptionList.emit = jest.fn();
      
      // First change
      component.betIds = '123,456';
      component.ngOnChanges({
        betIds: {
          currentValue: '123,456',
          previousValue: '',
          firstChange: true,
          isFirstChange: () => true
        }
      });

      expect(component.groupNumber.items.length).toBe(2);

      // Second change
      component.betIds = '123,456,789,999';
      component.ngOnChanges({
        betIds: {
          currentValue: '123,456,789,999',
          previousValue: '123,456',
          firstChange: false,
          isFirstChange: () => false
        }
      });

      expect(component.groupNumber.items.length).toBe(4);
      expect(component.changeAbExceptionList.emit).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long betIds string', () => {
      const longBetIds = '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20';
      component.betIds = longBetIds;
      
      component['updateGroupItems']();

      expect(component.groupNumber.items.length).toBe(20);
      expect(component.groupNumber.items[0].value).toBe('1');
      expect(component.groupNumber.items[19].value).toBe('20');
    });

    it('should handle betIds with only commas', () => {
      component.betIds = ',,,';
      component.groupNumber.items = [];

      component['updateGroupItems']();

      expect(component.groupNumber.items.length).toBe(0);
    });

    it('should handle betIds with special characters', () => {
      component.betIds = '123@456#789$';
      component.groupNumber.items = [];

      component['updateGroupItems']();

      expect(component.groupNumber.items.length).toBe(1);
      expect(component.groupNumber.items[0].value).toBe('123@456#789$');
    });

    it('should handle removing item that was already removed', () => {
      component.changeAbExceptionList.emit = jest.fn();
      const item = new NumberItem('123');
      component.groupNumber.items = [];
      component.betIds = '456';

      component.removeItem(item);

      expect(component.groupNumber.items).toEqual([]);
      expect(component.betIds).toBe('456');
      expect(component.changeAbExceptionList.emit).toHaveBeenCalledWith('456');
    });
  });
});
