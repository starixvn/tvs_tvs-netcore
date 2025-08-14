import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { LinkedLogComponent } from './linked-log.component';
import { LinkedLogsViewModel } from './linked-log.model';

describe('LinkedLogComponent', () => {
  let component: LinkedLogComponent;
  let fixture: ComponentFixture<LinkedLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LinkedLogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default LinkedLogsViewModel', () => {
    expect(component.linkedLogsViewModel).toBeInstanceOf(LinkedLogsViewModel);
  });

  it('should accept input LinkedLogsViewModel', () => {
    const mockViewModel = new LinkedLogsViewModel();
    component.linkedLogsViewModel = mockViewModel;
    expect(component.linkedLogsViewModel).toBe(mockViewModel);
  });
});
