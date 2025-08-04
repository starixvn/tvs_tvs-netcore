import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';
import { OthersAbnormalBetComponent } from './others-abnormal-bet.component';
import { OthersModel } from '../others/others.model';

describe('OthersAbnormalBetComponent', () => {
  let component: OthersAbnormalBetComponent;
  let fixture: ComponentFixture<OthersAbnormalBetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(OthersAbnormalBetComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    // Arrange
    component.isEdit = false;
    component.model = new OthersModel();

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.isEdit).toBeFalsy();
    expect(component.model).toBeTruthy();
    expect(component.isCollapse).toBeUndefined();
  });

  it('should initialize with provided model', () => {
    // Arrange
    const testModel = new OthersModel();
    testModel.mistakenBy = 'Test Mistaken By';
    testModel.decidedBy = 'Test Decided By';
    testModel.provider = 'Test Provider';
    testModel.source = 'Test Source';
    testModel.remark = 'Test Remark';

    // Act
    component.model = testModel;
    fixture.detectChanges();

    // Assert
    expect(component.model).toBe(testModel);
    expect(component.model.mistakenBy).toBe('Test Mistaken By');
    expect(component.model.decidedBy).toBe('Test Decided By');
    expect(component.model.provider).toBe('Test Provider');
    expect(component.model.source).toBe('Test Source');
    expect(component.model.remark).toBe('Test Remark');
  });

  it('should handle isEdit input', () => {
    // Arrange & Act
    component.isEdit = true;
    fixture.detectChanges();

    // Assert
    expect(component.isEdit).toBeTruthy();

    // Arrange & Act
    component.isEdit = false;
    fixture.detectChanges();

    // Assert
    expect(component.isEdit).toBeFalsy();
  });

  it('should handle isCollapse property', () => {
    // Arrange & Act
    component.isCollapse = true;
    fixture.detectChanges();

    // Assert
    expect(component.isCollapse).toBeTruthy();

    // Arrange & Act
    component.isCollapse = false;
    fixture.detectChanges();

    // Assert
    expect(component.isCollapse).toBeFalsy();
  });
});
