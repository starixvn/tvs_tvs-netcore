import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { ConfirmDangerAcceptedComponent } from './confirm-danger-accepted.component';
import { ConfirmDangerAcceptedModel } from './confirm-danger-accepted.model';

describe('ConfirmDangerAcceptedComponent', () => {
  let component: ConfirmDangerAcceptedComponent;
  let fixture: ComponentFixture<ConfirmDangerAcceptedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDangerAcceptedComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default model', () => {
    expect(component.model).toBeInstanceOf(ConfirmDangerAcceptedModel);
  });

  it('should emit clickCancel event and set isOpenDialog to false when onClickCancel is called', () => {
    // Arrange
    component.model.isOpenDialog = true;
    component.clickCancel.emit = jest.fn();

    // Action
    component.onClickCancel();

    // Assert
    expect(component.model.isOpenDialog).toBeFalsy();
    expect(component.clickCancel.emit).toHaveBeenCalled();
  });

  it('should emit clickOk event and set isOpenDialog to false when onClickOk is called', () => {
    // Arrange
    component.model.isOpenDialog = true;
    component.clickOk.emit = jest.fn();

    // Action
    component.onClickOk();

    // Assert
    expect(component.model.isOpenDialog).toBeFalsy();
    expect(component.clickOk.emit).toHaveBeenCalled();
  });
});
