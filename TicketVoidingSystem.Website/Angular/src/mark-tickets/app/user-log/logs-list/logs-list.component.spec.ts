import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { BlockUiDirective } from '../../../../utility/modules/block-ui/block-ui.directive';
import { BlockUiModule } from '../../../../utility/modules/block-ui/block-ui.module';
import { ModalType } from '../../../../utility/modules/modal/modal';
import { ModalService } from '../../../../utility/modules/modal/modal.service';
import { PagingModule } from '../../../../utility/modules/paging/paging.module';
import { PagingComponent } from '../../../../utility/modules/paging/paging/paging.component';
import { PagingModel } from '../../../../utility/modules/paging/paging/paging.model';
import { LogsListComponent } from './logs-list.component';
import { LogModel } from './logs-list.model';

class Helper {
    static getFakeListLogModel(): LogModel[] {
        return [{
            no: 1,
            actionId: 12,
            logDate: new Date('2020-02-12'),
            action: 'aa',
            matchId: 12,
            event: 'event',
            kickOffTime: new Date('2020-01-19'),
            htScore: 'htScore',
            ftScore: 'ftScore',
            singleTickets: ['11', '12', '13'],
            parlayTickets: ['22', '23', '24'],
            doneBy: 'sa'
        }];
    }
}

@NgModule({
    declarations: [LogsListComponent],
    imports: [
        BlockUiModule,
        NgbModule,
        FormsModule,
        PagingModule
    ],
})
class ModuleTest { }

describe('LogsListComponent', () => {
    let shallow: Shallow<LogsListComponent>;

    beforeEach(() => {
        shallow = new Shallow(LogsListComponent, ModuleTest)
            .dontMock(NgbModule)
            .mock(ModalService, {});
    });

    it('LogsListComponent init should match snapshot', async () => {
        const { fixture, instance } = await shallow.render();

        expect(fixture).toMatchSnapshot();
        expect(instance.isBlock).toBeUndefined();
        expect(instance.isShowLogs).toBeUndefined();
        expect(instance.model.length).toBe(0);
        expect(instance.paging).toStrictEqual(new PagingModel());
    });

    it('LogsListComponent init with log data should match snapshot', async () => {
        const { fixture, instance, findDirective } = await shallow.render();
        instance.isShowLogs = true;
        instance.isBlock = false;
        instance.model = Helper.getFakeListLogModel();
        fixture.detectChanges();
        const blockUI = findDirective(BlockUiDirective);

        expect(fixture).toMatchSnapshot();
        expect(blockUI).toHaveFoundOne();
        expect(blockUI.isBlock).toBe(false);
    });

    it('Props paging should change when </paging> change model', async () => {
        const { fixture, instance, findComponent } = await shallow
            .dontMock(PagingComponent)
            .render();
        instance.isShowLogs = true;
        fixture.detectChanges();
        const paging = findComponent(PagingComponent);
        paging.model.pageSize = 1000;
        paging.model.page = 2;

        expect(paging).toHaveFoundOne();
        expect(instance.paging.page).toBe(2);
        expect(instance.paging.pageSize).toBe(1000);
    });

    it('PagingComponent should call #pagingEvent when emit (modelChange) event', async () => {
        const { fixture, instance, findComponent } = await shallow
            .dontMock(PagingComponent)
            .render();
        const spyPagingEvent = jest.spyOn(instance, 'pagingEvent');
        const mockPagingChange = jest.fn();
        instance.pagingChange.emit = mockPagingChange;
        instance.isShowLogs = true;
        fixture.detectChanges();
        const paging = findComponent(PagingComponent);
        paging.modelChange.emit();

        expect(spyPagingEvent).toHaveBeenCalledTimes(1);
        expect(spyPagingEvent).toHaveBeenCalledWith();
        expect(mockPagingChange).toHaveBeenCalledTimes(1);
        expect(mockPagingChange).toHaveBeenCalledWith(instance.paging);
    });

    it('Should show modal when click column description', async () => {
        const mockOpenModalService = jest.fn();
        const { fixture, instance, find } = await shallow
            .mock(ModalService, { open: mockOpenModalService })
            .render();
        const spyDisplayTransIdList = jest.spyOn(instance, 'displayTransIdList');

        instance.isShowLogs = true;
        instance.isBlock = false;
        instance.model = Helper.getFakeListLogModel();
        fixture.detectChanges();

        const descriptionOfFirstRow = find('em.fa-align-justify')[0];
        descriptionOfFirstRow.triggerEventHandler('click', {});

        expect(spyDisplayTransIdList).toBeCalledTimes(1);
        expect(spyDisplayTransIdList).toBeCalledWith(Helper.getFakeListLogModel()[0].singleTickets,
            Helper.getFakeListLogModel()[0].parlayTickets);
        expect(mockOpenModalService).toBeCalledTimes(1);
        expect(mockOpenModalService).toBeCalledWith({
            title: 'List of BetID (Click on the list to copy)',
            type: ModalType.Alert,
            copyContent: true,
            content: [{ title: 'Single ticket(s):', message: Helper.getFakeListLogModel()[0].singleTickets.join(', ') },
            { title: 'Parlay ticket(s):', message: Helper.getFakeListLogModel()[0].parlayTickets.join(', ') }]
        });
    });
    
    it('getModalContent should not push data to to result', async () => {
        const { instance } = await shallow.render();
        const actual = instance['getModalContent']([], []);

        expect(actual.length).toBe(0);
    });
});