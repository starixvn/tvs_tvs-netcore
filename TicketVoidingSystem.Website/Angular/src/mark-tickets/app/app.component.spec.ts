import { NgModule } from '@angular/core';
import { Shallow } from 'shallow-render';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { ConfirmAutoUnmarkComponent } from './confirm-auto-unmark/confirm-auto-unmark.component';
import { MarkUnmarkTicketComponent } from './mark-unmark-ticket/mark-unmark-ticket.component';
import { TabMarkTicketComponent } from './tab-mark-ticket/tab-mark-ticket.component';
import { UserLogComponent } from './user-log/user-log.component';
jest.mock('../../utility/services/signal-r.service.native');
describe('AppComponent', () => {
    @NgModule({
        declarations: [AppComponent,
            ConfirmAutoUnmarkComponent,
            TabMarkTicketComponent,
            MarkUnmarkTicketComponent,
            UserLogComponent],
        providers: [AppService]
    })
    class AppModuleTest { }

    let shallow: Shallow<AppComponent>;

    beforeEach(() => {
        shallow = new Shallow(AppComponent, AppModuleTest)
        .mock(SignalRService, { initializeConnection: jest.fn()});;
    });

    ['0', '1'].forEach((tab, index) => {
        it(`AppComponent should render </mark-unmark-ticket> ${index}`, async () => {
            const { instance, fixture } = await shallow.render();
            instance.changeTab(tab);
            fixture.detectChanges();
            expect(fixture).toMatchSnapshot();
            expect(instance.currentTab).toBe(tab);
        });
    });

    it('AppComponent should render </user-log>', async () => {
        const { instance, fixture } = await shallow.render();
        instance.changeTab('2');
        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();
        expect(instance.currentTab).toBe('2');
    });

    it('AppComponent should render </confirm-auto-unmark>', async () => {
        const { instance, fixture } = await shallow.render();
        instance.changeTab('3');
        fixture.detectChanges();
        expect(fixture).toMatchSnapshot();
        expect(instance.currentTab).toBe('3');
    });
    
    it('ngOnInit should update isExternalUrl = true', async () => {        
        const mockSignalRServiceInitializeConnection = jest.fn();
        const mockGetDataPermission = jest.fn();
        const { instance, } = await shallow
        .mock(SignalRService, { initializeConnection: mockSignalRServiceInitializeConnection })
        .mock(AppService, { getDataPermission: mockGetDataPermission })
        .render();
        jest.spyOn(URLSearchParams.prototype, "get").mockReturnValue('1');
        await instance.ngOnInit();
        expect(instance.isExternalUrl).toBe(true);
    });
});