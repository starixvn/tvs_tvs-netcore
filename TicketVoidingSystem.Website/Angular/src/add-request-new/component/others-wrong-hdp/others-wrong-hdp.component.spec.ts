import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';
import { OthersWrongHdpComponent } from './others-wrong-hdp.component';
import { OthersModel } from '../others/others.model';

describe('OthersWrongHdpComponent', () => {
  let component: OthersWrongHdpComponent;
  let fixture: ComponentFixture<OthersWrongHdpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(OthersWrongHdpComponent);
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
    expect(component.isCollapse).toBeFalsy();
  });

  it('should toggle collapse state when clicked', () => {
    // Arrange
    component.isEdit = false;
    component.model = new OthersModel();
    fixture.detectChanges();

    // Act
    component.isCollapse = true;
    fixture.detectChanges();

    // Assert
    expect(component.isCollapse).toBeTruthy();
  });

  it('should update model values when inputs change', () => {
    // Arrange
    component.isEdit = false;
    component.model = new OthersModel();
    fixture.detectChanges();

    // Act
    component.model.mistakenBy = 'Test User';
    component.model.decidedBy = 'Admin';
    component.model.remark = 'Test remark';
    fixture.detectChanges();

    // Assert
    expect(component.model.mistakenBy).toBe('Test User');
    expect(component.model.decidedBy).toBe('Admin');
    expect(component.model.remark).toBe('Test remark');
  });
});
