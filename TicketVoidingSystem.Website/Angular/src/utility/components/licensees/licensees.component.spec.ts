import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
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

  it('Change Licensees', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        model: Helper.groupLicenseeModel
      }
    });
    jest.spyOn(instance.groupLicenseesChange, 'emit').mockImplementation(() => {});

    // Action and Assert
    instance.changeLicensees();
    expect(instance.groupLicenseesChange.emit).toHaveBeenCalledTimes(1);
  });
  
});