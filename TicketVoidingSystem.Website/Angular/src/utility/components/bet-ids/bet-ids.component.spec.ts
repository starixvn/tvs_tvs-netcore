import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { BetIdsComponent } from './bet-ids.component';

describe('BetIdsComponent', () => {
  @NgModule({
    declarations: [
    ],
    imports: [
      NgbModule,
      FormsModule
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<BetIdsComponent>;

  beforeEach(() => {
    shallow = new Shallow(BetIdsComponent, AppModuleTest)
    .dontMock(NgbModule)
    .mock(ElementRef, {});
  });  
  
  it('BetIdsComponent should init match snapshot', async () => {
    // Arrange
    const { fixture } = await shallow.render();
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
  });
});
