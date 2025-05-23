import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Shallow } from 'shallow-render';
import { BlockFullUiComponent } from '../../utility/components/block-full-ui/block-full-ui.component';
import { MenuBarComponent } from '../../utility/components/menu-bar/menu-bar.component';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { AppComponent } from './app.component';
import { AppStore } from './app.store';

jest.mock('../../utility/services/signal-r.service.native');
class Helper {
}

describe('AppComponent', () => { 
  @NgModule({
    declarations: [
      MenuBarComponent
    ],
    imports: [
      NgbModule,
      FormsModule,
      BlockFullUiComponent
    ],
    providers: [
      SignalRService,
      AppStore
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<AppComponent>;

  beforeEach(() => {
    shallow = new Shallow(AppComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('#AppComponent init should match snapshot', async () => {
    const { fixture } = await shallow
    .mock(AppStore, { changeBlockingUiStatus: jest.fn() })
    .render();

    expect(fixture).toMatchSnapshot();
  });

  it('#ngOnInit should call #initializeConnection', async () => {
    const homePageStore = new AppStore();
    const signalRService = new SignalRService(null);
    signalRService.initializeConnection = jest.fn();
    homePageStore.changeBlockingUiStatus = jest.fn();
    homePageStore.blockingUiStatus.subscribe = jest.fn();

    const component = new AppComponent(signalRService, homePageStore);

    component.ngOnInit();

    expect(homePageStore.changeBlockingUiStatus).toHaveBeenCalledTimes(1);
    expect(signalRService.initializeConnection).toHaveBeenCalledTimes(1);
  });

  it('#ngOnDestroy should call #blockingUiSubscription?.unsubscribe', async () => {
    const component = new AppComponent(null, null);
    component.blockingUiSubscription = new Subscription();
    component.blockingUiSubscription.unsubscribe = jest.fn();
    component.ngOnDestroy();

    expect(component.blockingUiSubscription.unsubscribe).toHaveBeenCalledTimes(1);
  });
});