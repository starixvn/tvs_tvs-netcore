import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmEkoComponent } from './confirm-eko.component';
import { ConfirmEarlyKickOffModel } from './confirm-eko.model';
import { TestingModule } from '../../../../../../utility/modules/testing.module';

describe('ConfirmEkoComponent', () => {
  let component: ConfirmEkoComponent;
  let fixture: ComponentFixture<ConfirmEkoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmEkoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default model', () => {
    expect(component.model).toBeInstanceOf(ConfirmEarlyKickOffModel);
  });

  it('should emit clickCancel event and close dialog when onClickCancel is called', () => {
    // Arrange
    const spy = jest.spyOn(component.clickCancel, 'emit');
    component.model.isOpenDialog = true;

    // Act
    component.onClickCancel();

    // Assert
    expect(component.model.isOpenDialog).toBeFalsy();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit clickOk event and close dialog when onClickOk is called', () => {
    // Arrange
    const spy = jest.spyOn(component.clickOk, 'emit');
    component.model.isOpenDialog = true;

    // Act
    component.onClickOk();

    // Assert
    expect(component.model.isOpenDialog).toBeFalsy();
    expect(spy).toHaveBeenCalled();
  });

  it('should update model when input model is provided', () => {
    // Arrange
    const testModel = new ConfirmEarlyKickOffModel();
    testModel.isOpenDialog = true;

    // Act
    component.model = testModel;

    // Assert
    expect(component.model).toBe(testModel);
    expect(component.model.isOpenDialog).toBeTruthy();
  });
});
