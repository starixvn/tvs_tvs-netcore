import { NgModule } from '@angular/core';
import { Shallow } from 'shallow-render';
import { MenuBarComponent } from '../../utility/components/menu-bar/menu-bar.component';
import { CommonService } from '../../utility/services/common.service';
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
            MenuBarComponent,
            UserLogComponent
        ],
        providers: [AppService, CommonService]
    })
    class AppModuleTest { }

    let shallow: Shallow<AppComponent>;

    beforeEach(() => {
        shallow = new Shallow(AppComponent, AppModuleTest)
            .mock(SignalRService, { initializeConnection: jest.fn() })
            .mock(CommonService, { logAccessFunction: jest.fn() });
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

    it('#isConfirmAutoUnmarkTab should return true when currentTab is 3', async () => {
        // Arrange
        const mockSignalRServiceInitializeConnection = jest.fn();
        const mockGetDataPermission = jest.fn();
        const { instance, } = await shallow
            .mock(SignalRService, { initializeConnection: mockSignalRServiceInitializeConnection })
            .mock(AppService, { getDataPermission: mockGetDataPermission })
            .render();

        instance.currentTab = '3';

        // Action
        const actual = instance.isConfirmAutoUnmarkTab();

        // Assert
        expect(actual).toBe(true);
    });

    it('#isConfirmAutoUnmarkTab should return false when currentTab is not 3', async () => {
        // Arrange
        const mockSignalRServiceInitializeConnection = jest.fn();
        const mockGetDataPermission = jest.fn();
        const { instance, } = await shallow
            .mock(SignalRService, { initializeConnection: mockSignalRServiceInitializeConnection })
            .mock(AppService, { getDataPermission: mockGetDataPermission })
            .render();

        instance.currentTab = '4';

        // Action
        const actual = instance.isConfirmAutoUnmarkTab();

        // Assert
        expect(actual).toBeFalsy();
    });

    it('#isLogTab should return true when currentTab is 2', async () => {
        // Arrange
        const mockSignalRServiceInitializeConnection = jest.fn();
        const mockGetDataPermission = jest.fn();
        const { instance, } = await shallow
            .mock(SignalRService, { initializeConnection: mockSignalRServiceInitializeConnection })
            .mock(AppService, { getDataPermission: mockGetDataPermission })
            .render();

        instance.currentTab = '2';

        // Action
        const actual = instance.isLogTab();

        // Assert
        expect(actual).toBe(true);
    });

    it('#isLogTab should return false when currentTab is not 2', async () => {
        // Arrange
        const mockSignalRServiceInitializeConnection = jest.fn();
        const mockGetDataPermission = jest.fn();
        const { instance, } = await shallow
            .mock(SignalRService, { initializeConnection: mockSignalRServiceInitializeConnection })
            .mock(AppService, { getDataPermission: mockGetDataPermission })
            .render();

        instance.currentTab = '4';

        // Action
        const actual = instance.isLogTab();

        // Assert
        expect(actual).toBeFalsy();
    });

    ['0', '1'].forEach((tab, index) => {
        it(`#isMarkOrUnmarkTab should return true when currentTab is ${index}`, async () => {
            // Arrange
            const mockSignalRServiceInitializeConnection = jest.fn();
            const mockGetDataPermission = jest.fn();
            const { instance, } = await shallow
                .mock(SignalRService, { initializeConnection: mockSignalRServiceInitializeConnection })
                .mock(AppService, { getDataPermission: mockGetDataPermission })
                .render();

            instance.currentTab = tab;

            // Action
            const actual = instance.isMarkOrUnmarkTab();

            // Assert
            expect(actual).toBe(true);
        });
    });

    it('#isMarkOrUnmarkTab should return false when currentTab is not 0 and 1', async () => {
        // Arrange
        const mockSignalRServiceInitializeConnection = jest.fn();
        const mockGetDataPermission = jest.fn();
        const { instance, } = await shallow
            .mock(SignalRService, { initializeConnection: mockSignalRServiceInitializeConnection })
            .mock(AppService, { getDataPermission: mockGetDataPermission })
            .render();

        instance.currentTab = '4';

        // Action
        const actual = instance.isMarkOrUnmarkTab();

        // Assert
        expect(actual).toBeFalsy();
    });

});