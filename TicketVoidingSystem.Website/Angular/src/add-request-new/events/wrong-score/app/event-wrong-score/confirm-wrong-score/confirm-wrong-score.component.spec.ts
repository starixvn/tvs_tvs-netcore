import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { ConfirmWrongScoreComponent } from './confirm-wrong-score.component';
import { ConfirmWrongScoreModel } from './confirm-wrong-score.model';

describe('ConfirmWrongScoreComponent', () => {
  let component: ConfirmWrongScoreComponent;
  let fixture: ComponentFixture<ConfirmWrongScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmWrongScoreComponent);
    component = fixture.componentInstance;

    // Set default input values
    component.model = new ConfirmWrongScoreModel();
    component.model.isOpenDialog = true;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close event when closeClick is called', () => {
    // Arrange
    jest.spyOn(component.close, 'emit');

    // Act
    component.closeClick();

    // Assert
    expect(component.model.isOpenDialog).toBeFalsy();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should emit save event when saveClick is called', () => {
    // Arrange
    jest.spyOn(component.save, 'emit');

    // Act
    component.saveClick();

    // Assert
    expect(component.model.isOpenDialog).toBeFalsy();
    expect(component.save.emit).toHaveBeenCalled();
  });
});
