import { MatchInfoComponent } from './match-info.component';
import { NgModule } from '@angular/core';
import { Shallow } from 'shallow-render';
import { MatchModel } from '../../../../utility/models/match.model';

describe('MatchInfoComponent', () => {
  @NgModule({
      declarations: [
      ],
      imports: [
      ],
      providers: [
      ]
    })
  class AppModuleTest { }

  let shallow: Shallow<MatchInfoComponent>;

  beforeEach(() => {
    shallow = new Shallow(MatchInfoComponent, AppModuleTest);
  });

  it('MatchInfoComponent should init match snapshot', async() => {
    // Arrange
    const { fixture, instance } = await shallow.render({
      bind: {
        match: new MatchModel(),
      }
    });
    fixture.detectChanges();
    instance.ngOnInit();
    
    // Assert
    expect(fixture).toMatchSnapshot();
  });
});
