import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as _ from 'lodash';
import { Shallow } from 'shallow-render';
import { AppService } from '../app.service';
import { DataPermission } from '../models/result.model';
import { TabMarkTicketComponent } from './tab-mark-ticket.component';

class Helper {
  static readonly fakeDataPermission: DataPermission = {
    isReadMarkTickets: true,
    isHostMarkTickets: true
  };
}
@NgModule({
  declarations: [TabMarkTicketComponent],
  imports: [
    FormsModule
  ],
})
class ModuleTest { }

describe('TabMarkTicketComponent', () => {
  let shallow: Shallow<TabMarkTicketComponent>;

  beforeEach(() => {
    shallow = new Shallow(TabMarkTicketComponent, ModuleTest)
      .mock(AppService, {});
  });

  it('TabMarkTicketComponent init with NO permission should match snapshot', async () => {
    const { fixture, instance } = await shallow.render();

    expect(fixture).toMatchSnapshot();
    expect(instance.currentTab).toBe('0');
  });

  it('TabMarkTicketComponent init with permission ReadMarkTickets should match snapshot', async () => {
    const fakePermission = _.cloneDeep(Helper.fakeDataPermission);
    fakePermission.isReadMarkTickets = true;
    fakePermission.isHostMarkTickets = false;
    const { fixture, instance } = await shallow
    .render({
      bind: {
        dataPermission: fakePermission
      }
    });

    expect(fixture).toMatchSnapshot();
    expect(instance.currentTab).toBe('0');
  });

  it('TabMarkTicketComponent init with permission HostAutoMarkService should match snapshot', async () => {
    const fakePermission = _.cloneDeep(Helper.fakeDataPermission);
    fakePermission.isReadMarkTickets = false;
    fakePermission.isHostMarkTickets = false;
    const { fixture, instance } = await shallow
    .render({
      bind: {
        dataPermission: fakePermission
      }
    });

    expect(fixture).toMatchSnapshot();
    expect(instance.currentTab).toBe('4');
  });

  it('TabMarkTicketComponent init with permission ReadMarkTickets & HostAutoMarkService should match snapshot', async () => {
    const fakePermission = _.cloneDeep(Helper.fakeDataPermission);
    fakePermission.isReadMarkTickets = true;
    fakePermission.isHostMarkTickets = false;
    const { fixture, instance } = await shallow
    .render({
      bind: {
        dataPermission: fakePermission
      }
    });
    expect(fixture).toMatchSnapshot();
    expect(instance.currentTab).toBe('0');
  });

  [0, 1, 2, 3, 4].forEach(tabId => {
    it('TabMarkTicketComponent should call #setTabPage when change tab nav', async () => {
      const { find, instance } = await shallow
      .render({
        bind: {
          dataPermission: Helper.fakeDataPermission
        }
      });
      const spySetTabPage = jest.spyOn(instance, 'setTabPage');
      const mockChangeTab = jest.fn();
      instance.changeTab.emit = mockChangeTab;

      const tabMarkTicket = find('button.nav-link')[tabId];
      tabMarkTicket.triggerEventHandler('click', {});

      expect(spySetTabPage).toBeCalledTimes(1);
      expect(spySetTabPage).toBeCalledWith(tabId.toString());
      expect(mockChangeTab).toBeCalledTimes(1);
      expect(mockChangeTab).toBeCalledWith(tabId.toString());
      expect(instance.currentTab).toBe(tabId.toString());
    });
  });
  
  it('ngOnChanges should not call #initializeCurrentTab', async () => {
    const { instance } = await shallow.render();
    instance['initializeCurrentTab'] = jest.fn();
    instance.ngOnChanges({});

    expect(instance['initializeCurrentTab']).toHaveBeenCalledTimes(0);
  });
  
  it('initializeCurrentTab should not call #setTabPage when isExternalUrl true', async () => {
    const { instance } = await shallow.render();
    instance.isExternalUrl = true;
    instance.setTabPage = jest.fn();
    instance['initializeCurrentTab'](new DataPermission());

    expect(instance.setTabPage).toHaveBeenCalledTimes(1);
    expect(instance.setTabPage).toHaveBeenCalledWith('1');
  });
  
  it('initializeCurrentTab should not call #setTabPage when isExternalUrl false', async () => {
    const { instance } = await shallow.render();
    const permission = new DataPermission();
    permission.isReadMarkTickets = false;
    instance.isExternalUrl = false;
    instance.setTabPage = jest.fn();
    instance['initializeCurrentTab'](permission);

    expect(instance.setTabPage).toHaveBeenCalledTimes(1);
    expect(instance.setTabPage).toHaveBeenCalledWith(null);
  });
});
