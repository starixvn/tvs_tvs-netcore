import { LicenseeAffectedListComponent } from './licensee-affected-list.component';
import { NgModule, SimpleChange } from '@angular/core';
import { Shallow } from 'shallow-render';
import { AffectedLicensee } from './licensee-affected-list.model';
import _ from 'lodash';
import { ClipboardService } from 'ngx-clipboard';

class Helper {
  static readonly fakeAffectedLicenseeNormal: AffectedLicensee = {
    group: "normal",
    licenseesName: "123",
    message: '',
    show: false,
    color: ''
  };
  static readonly fakeAffectedLicenseeJollyView: AffectedLicensee = {
    group: "jollyView",
    licenseesName: "456",
    message: '',
    show: false,
    color: ''
  };
  static readonly licenseeAffectedList: AffectedLicensee[] = [Helper.fakeAffectedLicenseeNormal, Helper.fakeAffectedLicenseeJollyView];
}

describe('LicenseeAffectedListComponent', () => {
    @NgModule({
      imports: [],
      providers: [
        ClipboardService
      ]
    })
    class AppModuleTest { }
  
    let shallow: Shallow<LicenseeAffectedListComponent>;
  
    beforeEach(() => {
      shallow = new Shallow(LicenseeAffectedListComponent, AppModuleTest);
    });

  it('ngOnChanges should updateDisplayAffectedLicensee when has change licenseeAffectedList', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        licenseeAffectedList: Helper.licenseeAffectedList
      }
    });
    const changes = {
      'licenseeAffectedList': new SimpleChange([], Helper.licenseeAffectedList, true)
    };

    // Action
    instance.ngOnChanges(changes);

    // Assert
    expect(instance.licenseeAffectedList[1].show).toBeTruthy();
    expect(instance.affectedLicenseeNormal).toBe('123');
  });

  it('isShowAffectedLicenseeArea should return true', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        licenseeAffectedList: Helper.licenseeAffectedList
      }
    });

    // Action
    const actual = instance.isShowAffectedLicenseeArea();

    // Assert
    expect(actual).toBeTruthy();
  });

  it('copyClipboard should return true', async () => {
    // Arrange
    const mockcopyFromContent = jest.fn();
    const { instance } = await shallow
    .mock(ClipboardService, { copyFromContent: mockcopyFromContent })
    .render({
      bind: {
        licenseeAffectedList: Helper.licenseeAffectedList
      }
    });

    // Action
    instance.copyClipboard('124');

    // Assert
    expect(mockcopyFromContent).toHaveBeenCalled();
  });
});
