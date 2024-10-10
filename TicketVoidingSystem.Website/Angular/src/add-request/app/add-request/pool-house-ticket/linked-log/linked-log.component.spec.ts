import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { LinkedLogComponent } from './linked-log.component';
import { LinkedLogsViewModel } from './linked-log.model';

describe('LinkedLogComponent ', () => { 
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

  let shallow: Shallow<LinkedLogComponent>;

  beforeEach(() => {
    shallow = new Shallow(LinkedLogComponent, AppModuleTest)
      .mock(ElementRef, {})
      .dontMock(NgbModule);
  });

  it('LinkedLogComponent init should match snapshot', async () => {
    const { fixture } = await shallow
    .render({
      bind: {
        linkedLogsViewModel: new LinkedLogsViewModel()
      }
    });

    expect(fixture).toMatchSnapshot();
  });
  
});