import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { LicenseesComponent } from './licensees.component';
import { GroupLicensee, Licensee } from './licensees.model';

class Helper {
  static readonly groupLicensees: GroupLicensee[] = [
    new GroupLicensee('China rules', [new Licensee(112, '123456betwin')]),
    new GroupLicensee('Asia rules', [new Licensee(15, 'SENIBET'), new Licensee(29, 'SUNGAME')])
  ];
}

describe('LicenseesComponent', () => { 
  @NgModule({
    declarations: [
    ],
    imports: [
      NgbModule,
      FormsModule
    ],
    providers: [
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<LicenseesComponent>;

  beforeEach(() => {
    shallow = new Shallow(LicenseesComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });
  
  it('#LicenseesComponent init should match snapshot', async () => {
    const { fixture } = await shallow.render();

    expect(fixture).toMatchSnapshot();
  });

  it('Change check all licensee', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        groupLicensees: Helper.groupLicensees
      }
    });
    instance.groupLicensees[0].isChecked = false;
    instance.groupLicensees[0].licensees[0].isChecked = false;
    // Action and Assert
    instance.changeCheckAllLicensee();
    expect(instance.groupLicensees[0].isChecked).toBe(true);
    expect(instance.groupLicensees[0].licensees[0].isChecked).toBe(true);
  });

  it('Check All CheckBox', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        groupLicensees: Helper.groupLicensees
      }
    });
    const testCases = [
      { isChecked: false, expectedValue: false },
      { isChecked: true, expectedValue: true }
    ];
    // Action and Assert
    testCases.forEach(item => {
      instance.groupLicensees[0].isChecked = item.isChecked;
      instance.checkAllCheckBox();
      expect(instance.checkAllLicensee).toBe(item.expectedValue);
    });
  });

  it('Change Licensees', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        groupLicensees: Helper.groupLicensees
      }
    });
    jest.spyOn(instance.groupLicenseesChange, 'emit').mockImplementation(() => {});
    // Action and Assert
    instance.changeLicensees();
    expect(instance.groupLicenseesChange.emit).toHaveBeenCalledWith(Helper.groupLicensees);
  });
  
  it('GroupLicensee should call some its functions', async () => {
    const { instance } = await shallow.render({
      bind: {
        groupLicensees: Helper.groupLicensees
      }
    });
    const testCases = [
      { isChecked: false, expectedValue: false },
      { isChecked: true, expectedValue: true }
    ];
    // Action and Assert
    testCases.forEach(item => {
      instance.groupLicensees[0].isChecked = item.isChecked;
      instance.groupLicensees.forEach(x => {
        x.licensees.forEach(y => y.isChecked = item.isChecked);
        x.checkedLicensee();
        x.getLicenseesName();
      });
      instance.checkAllCheckBox();
      expect(instance.checkAllLicensee).toBe(item.isChecked);
    });
  });
});