import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlockUiDirective } from '../../../../utility/components/block-ui/block-ui.directive';
import { ModalService } from '../../../../utility/components/modal/modal.service';
import { PagingComponent } from '../../../../utility/components/paging/paging.component';
import { PagingModel } from '../../../../utility/components/paging/paging.model';
import { LogsListComponent } from './logs-list.component';
import { LogModel } from './logs-list.model';
import { By } from '@angular/platform-browser';
import { TestingModule } from '../../../../utility/modules/testing.module';

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

describe('LogsListComponent', () => {
    let component: LogsListComponent;
    let fixture: ComponentFixture<LogsListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestingModule],
            providers: [
                ModalService
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LogsListComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
        // Act
        fixture.detectChanges();

        // Assert
        expect(component.isBlock).toBeUndefined();
        expect(component.isShowLogs).toBeUndefined();
        expect(component.model.length).toBe(0);
        expect(component.paging).toStrictEqual(new PagingModel());
    });

    it('should initialize with log data correctly', () => {
        // Arrange
        component.isShowLogs = true;
        component.isBlock = false;
        component.model = Helper.getFakeListLogModel();

        // Act
        fixture.detectChanges();
        const blockUI = fixture.debugElement.query(By.directive(BlockUiDirective));

        // Assert
        expect(blockUI).toBeTruthy();
        expect(blockUI.componentInstance.isBlock).toBe(false);
    });

    it('should update paging when paging component changes', () => {
        // Arrange
        component.isShowLogs = true;
        fixture.detectChanges();
        const pagingComponent = fixture.debugElement.query(By.directive(PagingComponent)).componentInstance;

        // Act
        pagingComponent.model.pageSize = 1000;
        pagingComponent.model.page = 2;

        // Assert
        expect(component.paging.page).toBe(2);
        expect(component.paging.pageSize).toBe(1000);
    });

    it('should emit paging event when paging changes', () => {
        // Arrange
        const spyPagingEvent = jest.spyOn(component, 'pagingEvent');
        const mockPagingChange = jest.fn();
        component.pagingChange.emit = mockPagingChange;
        component.isShowLogs = true;
        fixture.detectChanges();

        // Act
        component.pagingEvent();

        // Assert
        expect(spyPagingEvent).toHaveBeenCalledTimes(1);
        expect(mockPagingChange).toHaveBeenCalledTimes(1);
        expect(mockPagingChange).toHaveBeenCalledWith(component.paging);
    });

    it('should return empty array when getModalContent is called with empty arrays', () => {
        // Act
        const result = component['getModalContent']([], []);

        // Assert
        expect(result.length).toBe(0);
    });

    it('should handle empty model data', () => {
        // Arrange
        component.model = [];
        component.isShowLogs = true;

        // Act
        fixture.detectChanges();

        // Assert
        expect(component.model.length).toBe(0);
        expect(fixture.debugElement.query(By.directive(BlockUiDirective))).toBeTruthy();
    });
});