import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { OthersModel } from '../../others/others.model';
import { OthersAbnormalComponent } from './others-abnormal-bet.component';

describe('OthersAbnormalMixParlayComponent', () => {
  @NgModule({
    declarations: [],
    imports: [
      FormsModule,
      NgbModule,
    ],
    providers: [
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<OthersAbnormalComponent>;

  beforeEach(() => {
    shallow = new Shallow(OthersAbnormalComponent, AppModuleTest).dontMock(NgbModule);
  });

  it('OthersAbnormalMixParlayComponent should init match snapshot', async () => {
    // Arrange
    const { instance, fixture } = await shallow.render();
    instance.model = new OthersModel();
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
  });
});
