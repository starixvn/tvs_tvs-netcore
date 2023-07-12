import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { AbnormalAccountOtherComponent } from './abnormal-accounts-other.component';

describe('AbnormalAccountOtherComponent', () => { 
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

  let shallow: Shallow<AbnormalAccountOtherComponent>;

  beforeEach(() => {
    shallow = new Shallow(AbnormalAccountOtherComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('#AbnormalAccountOtherComponent init should match snapshot', async () => {
    const { fixture } = await shallow.render();

    expect(fixture).toMatchSnapshot();
  });
});