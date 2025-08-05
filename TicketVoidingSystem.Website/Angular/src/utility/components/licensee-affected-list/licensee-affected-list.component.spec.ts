import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClipboardService } from 'ngx-clipboard';
import { TestingModule } from '../../../utility/modules/testing.module';
import { LicenseeAffectedListComponent } from './licensee-affected-list.component';
import { AffectedLicensee } from './licensee-affected-list.model';

describe('LicenseeAffectedListComponent', () => {
  let component: LicenseeAffectedListComponent;
  let fixture: ComponentFixture<LicenseeAffectedListComponent>;
  let clipboardService: ClipboardService;

  const mockAffectedLicenseeNormal: AffectedLicensee = {
    group: "normal",
    licenseesName: "123",
    message: '',
    show: false,
    color: ''
  };

  const mockAffectedLicenseeJollyView: AffectedLicensee = {
    group: "jollyView",
    licenseesName: "456",
    message: '',
    show: false,
    color: ''
  };

  const mockLicenseeAffectedList: AffectedLicensee[] = [
    mockAffectedLicenseeNormal,
    mockAffectedLicenseeJollyView
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ClipboardService]
    }).compileComponents();

    fixture = TestBed.createComponent(LicenseeAffectedListComponent);
    clipboardService = fixture.debugElement.injector.get(ClipboardService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.licenseeAffectedList).toEqual([]);
    expect(component.isDisplay).toBeTruthy();
    expect(component.affectedLicenseeNormal).toBe('');
  });

  it('should update display when licenseeAffectedList changes', () => {
    // Arrange
    component.licenseeAffectedList = mockLicenseeAffectedList;
    component.isDisplay = true;

    // Act
    component.ngOnChanges({
      'licenseeAffectedList': {
        currentValue: mockLicenseeAffectedList,
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true
      }
    });

    // Assert
    expect(component.licenseeAffectedList[1].show).toBeTruthy();
    expect(component.affectedLicenseeNormal).toBe('123');
  });

  it('should show affected licensee area when there are licensees and isDisplay is true', () => {
    // Arrange
    component.licenseeAffectedList = mockLicenseeAffectedList;
    component.isDisplay = true;

    // Act
    const result = component.isShowAffectedLicenseeArea();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should not show affected licensee area when isDisplay is false', () => {
    // Arrange
    component.licenseeAffectedList = mockLicenseeAffectedList;
    component.isDisplay = false;

    // Act
    const result = component.isShowAffectedLicenseeArea();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should not show affected licensee area when there are no licensees', () => {
    // Arrange
    component.licenseeAffectedList = [];
    component.isDisplay = true;

    // Act
    const result = component.isShowAffectedLicenseeArea();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should copy text to clipboard and show alert', () => {
    // Arrange
    const mockCopyFromContent = jest.spyOn(clipboardService, 'copyFromContent');
    window.alert = jest.fn();
    const testText = 'test text';

    // Act
    component.copyClipboard(testText);

    // Assert
    expect(mockCopyFromContent).toHaveBeenCalledWith(testText);
    expect(window.alert).toHaveBeenCalledWith('The Licensee list has been copied to clipboard.');
  });
});
