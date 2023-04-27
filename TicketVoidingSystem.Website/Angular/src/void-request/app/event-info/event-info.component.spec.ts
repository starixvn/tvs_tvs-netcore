import { NgModule } from '@angular/core';
import { Shallow } from 'shallow-render';
import { EventInfoComponent } from './event-info.component';

describe('EventInfoComponent', () => {
  @NgModule({
    declarations: [
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<EventInfoComponent>;

  beforeEach(() => {
    shallow = new Shallow(EventInfoComponent, AppModuleTest);
  });

  it('EventInfoComponent should init match snapshot', async () => {
    // Arrange
    const { fixture } = await shallow.render();
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
  });
});
