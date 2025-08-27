import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { AppService } from '../app.service';
import { DataPermission } from '../models/result.model';
import { TabMarkTicketComponent } from './tab-mark-ticket.component';

class Helper {
  static readonly fakeDataPermission: DataPermission = {
    isReadMarkTickets: true,
    isHostMarkTickets: true
  };
}

describe('TabMarkTicketComponent', () => {
  let component: TabMarkTicketComponent;
  let fixture: ComponentFixture<TabMarkTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      providers: [AppService]
    }).compileComponents();

    fixture = TestBed.createComponent(TabMarkTicketComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  [0, 1, 2, 3].forEach(tabId => {
    it(`should handle tab change for tab ${tabId}`, () => {
      // Arrange
      component.dataPermission = Helper.fakeDataPermission;
      fixture.detectChanges();
      const spySetTabPage = jest.spyOn(component, 'setTabPage');
      const mockChangeTab = jest.fn();
      component.changeTab.emit = mockChangeTab;

      // Act
      const tabMarkTicket = fixture.debugElement.queryAll(By.css('button.nav-link'))[tabId];
      tabMarkTicket.triggerEventHandler('click', {});

      // Assert
      expect(spySetTabPage).toHaveBeenCalledTimes(1);
      expect(spySetTabPage).toHaveBeenCalledWith(tabId.toString());
      expect(mockChangeTab).toHaveBeenCalledTimes(1);
      expect(mockChangeTab).toHaveBeenCalledWith(tabId.toString());
      expect(component.currentTab).toBe(tabId.toString());
    });
  });

  it('should not call initializeCurrentTab when ngOnChanges is called with empty changes', () => {
    // Arrange
    component['initializeCurrentTab'] = jest.fn();

    // Act
    component.ngOnChanges({});

    // Assert
    expect(component['initializeCurrentTab']).toHaveBeenCalledTimes(0);
  });

  it('should set tab to 1 when isExternalUrl is true', () => {
    // Arrange
    component.isExternalUrl = true;
    component.setTabPage = jest.fn();

    // Act
    component['initializeCurrentTab'](new DataPermission());

    // Assert
    expect(component.setTabPage).toHaveBeenCalledTimes(1);
    expect(component.setTabPage).toHaveBeenCalledWith('1');
  });

  it('should set tab to null when isExternalUrl is false and no read permission', () => {
    // Arrange
    const permission = new DataPermission();
    permission.isReadMarkTickets = false;
    component.isExternalUrl = false;
    component.setTabPage = jest.fn();

    // Act
    component['initializeCurrentTab'](permission);

    // Assert
    expect(component.setTabPage).toHaveBeenCalledTimes(1);
    expect(component.setTabPage).toHaveBeenCalledWith(null);
  });

  it('should handle ngOnChanges with dataPermission change', () => {
    // Arrange
    const permission = new DataPermission();
    component['initializeCurrentTab'] = jest.fn();

    // Act
    component.ngOnChanges({
      dataPermission: {
        currentValue: permission,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });

    // Assert
    expect(component['initializeCurrentTab']).toHaveBeenCalledWith(permission);
  });
});
