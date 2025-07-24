import { ElementRef } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Shallow } from 'shallow-render';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { AppComponent } from './app.component';
import { AppStore } from './app.store';

jest.mock('../../utility/services/signal-r.service.native');

describe('AppComponent', () => { 
  let shallow: Shallow<AppComponent>;

  beforeEach(() => {
    shallow = new Shallow(AppComponent)
      .dontMock(NgbModule)
      .mock(ElementRef, {})
      .provideMock({ provide: SignalRService, useValue: { initializeConnection: jest.fn() } })
      .provideMock({ provide: AppStore, useValue: { 
        changeBlockingUiStatus: jest.fn(),
        blockingUiStatus: { subscribe: jest.fn() }
      }});
  });

  it('#AppComponent init should match snapshot', async () => {
    const { fixture } = await shallow.render();

    expect(fixture).toMatchSnapshot();
  });

  it('#ngOnInit should call #initializeConnection', async () => {
    const { instance } = await shallow.render();
    
    // Mock the injected services
    const mockSignalRService = { initializeConnection: jest.fn() };
    const mockHomePageStore = { 
      changeBlockingUiStatus: jest.fn(),
      blockingUiStatus: { subscribe: jest.fn().mockReturnValue(new Subscription()) }
    };
    
    (instance as any).signalRService = mockSignalRService;
    (instance as any).homePageStore = mockHomePageStore;

    await instance.ngOnInit();

    expect(mockHomePageStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
    expect(mockSignalRService.initializeConnection).toHaveBeenCalled();
  });

  it('#ngOnDestroy should call #blockingUiSubscription?.unsubscribe', async () => {
    const { instance } = await shallow.render();
    const mockSubscription = new Subscription();
    mockSubscription.unsubscribe = jest.fn();
    instance.blockingUiSubscription = mockSubscription;
    
    instance.ngOnDestroy();

    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
  });
});