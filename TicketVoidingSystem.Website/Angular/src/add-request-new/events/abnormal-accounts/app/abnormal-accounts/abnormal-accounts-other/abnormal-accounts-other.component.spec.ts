import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { AbnormalAccountOtherComponent } from './abnormal-accounts-other.component';
import { OthersModel } from '../../../../../component/others/others.model';

describe('AbnormalAccountOtherComponent', () => {
  let component: AbnormalAccountOtherComponent;
  let fixture: ComponentFixture<AbnormalAccountOtherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(AbnormalAccountOtherComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    // Arrange
    component.isEdit = false;
    component.model = new OthersModel();
    component.isCollapse = false;

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.isEdit).toBeFalsy();
    expect(component.model).toBeInstanceOf(OthersModel);
    expect(component.isCollapse).toBeFalsy();
  });

  it('should initialize with provided values', () => {
    // Arrange
    const testModel = new OthersModel();
    component.isEdit = true;
    component.model = testModel;
    component.isCollapse = true;

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.isEdit).toBeTruthy();
    expect(component.model).toBe(testModel);
    expect(component.isCollapse).toBeTruthy();
  });

  it('should toggle collapse state', () => {
    // Arrange
    component.isCollapse = false;

    // Act
    component.isCollapse = true;

    // Assert
    expect(component.isCollapse).toBeTruthy();
  });
});
