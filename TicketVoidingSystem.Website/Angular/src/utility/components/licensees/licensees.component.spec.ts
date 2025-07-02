import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LicenseesComponent } from './licensees.component';
import { GroupLicensee, GroupLicenseeModel, Licensee } from './licensees.model';

class Helper {
  static readonly groupLicensees: GroupLicensee[] = [
    new GroupLicensee('China rules', [new Licensee(112, '123456betwin', true)], true),
    new GroupLicensee('Asia rules', [new Licensee(15, 'SENIBET', true), new Licensee(29, 'SUNGAME', true)], true)
  ];
  static readonly groupLicenseeModel: GroupLicenseeModel = new GroupLicenseeModel(Helper.groupLicensees, true);
}

describe('LicenseesComponent', () => {
  let component: LicenseesComponent;
  let fixture: ComponentFixture<LicenseesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();

    fixture = TestBed.createComponent(LicenseesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    // Assert
    expect(component.model).toBeDefined();
    expect(component.disabled).toBeUndefined();
    expect(component.checkAllLicensee).toBeTruthy();
  });

  it('should set model input correctly', () => {
    // Arrange
    const testModel = Helper.groupLicenseeModel;

    // Action
    component.model = testModel;
    fixture.detectChanges();

    // Assert
    expect(component.model).toBe(testModel);
  });

  it('should set disabled input correctly', () => {
    // Arrange
    const disabled = true;

    // Action
    component.disabled = disabled;
    fixture.detectChanges();

    // Assert
    expect(component.disabled).toBe(disabled);
  });

  it('should emit groupLicenseesChange when changeLicensees is called', () => {
    // Arrange
    component.model = Helper.groupLicenseeModel;
    jest.spyOn(component.groupLicenseesChange, 'emit').mockImplementation(() => {});

    // Action
    component.changeLicensees();

    // Assert
    expect(component.groupLicenseesChange.emit).toHaveBeenCalledTimes(1);
    expect(component.groupLicenseesChange.emit).toHaveBeenCalledWith(component.model.getCheckedLicensees());
  });

  it('should emit checked licensees when changeLicensees is called', () => {
    // Arrange
    component.model = Helper.groupLicenseeModel;
    jest.spyOn(component.groupLicenseesChange, 'emit').mockImplementation(() => {});
    const expectedCheckedLicensees = component.model.getCheckedLicensees();

    // Action
    component.changeLicensees();

    // Assert
    expect(component.groupLicenseesChange.emit).toHaveBeenCalledWith(expectedCheckedLicensees);
  });

  it('should handle empty model when changeLicensees is called', () => {
    // Arrange
    component.model = new GroupLicenseeModel([], false);
    jest.spyOn(component.groupLicenseesChange, 'emit').mockImplementation(() => {});

    // Action
    component.changeLicensees();

    // Assert
    expect(component.groupLicenseesChange.emit).toHaveBeenCalledWith([]);
  });

  it('should handle model with no checked licensees', () => {
    // Arrange
    const uncheckedModel = new GroupLicenseeModel([
      new GroupLicensee('Test Group', [new Licensee(1, 'Test Licensee', false)], false)
    ], false);
    component.model = uncheckedModel;
    jest.spyOn(component.groupLicenseesChange, 'emit').mockImplementation(() => {});

    // Action
    component.changeLicensees();

    // Assert
    expect(component.groupLicenseesChange.emit).toHaveBeenCalledWith([]);
  });

  it('should handle model with mixed checked and unchecked licensees', () => {
    // Arrange
    const mixedModel = new GroupLicenseeModel([
      new GroupLicensee('Test Group', [
        new Licensee(1, 'Checked Licensee', true),
        new Licensee(2, 'Unchecked Licensee', false)
      ], false)
    ], false);
    component.model = mixedModel;
    component.groupLicenseesChange.emit = jest.fn();

    // Action
    component.changeLicensees();

    // Assert
    expect(component.groupLicenseesChange.emit).toHaveBeenCalled();
  });

  it('should match snapshot when component is initialized', () => {
    // Action
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
  });

  it('should match snapshot with model data', () => {
    // Arrange
    component.model = Helper.groupLicenseeModel;

    // Action
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
  });

  it('should match snapshot when disabled is true', () => {
    // Arrange
    component.disabled = true;

    // Action
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
  });
});