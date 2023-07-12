import { NgModule } from '@angular/core';
import { Shallow } from 'shallow-render';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { AddRequestComponent } from './add-request/add-request.component';
import { AppComponent } from './app.component';
jest.mock('../../utility/services/signal-r.service.native');

class Helper {
  static readonly titleSelector = '.title';
}

describe('AppComponent', () => {
  @NgModule({
    declarations: [AddRequestComponent],
    imports: [
    ],
    providers: [
      SignalRService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<AppComponent>;

  beforeEach(() => {
    shallow = new Shallow(AppComponent, AppModuleTest)
    .mock(SignalRService, { initializeConnection: jest.fn()});
  });

  it('AppComponent should return expected data for <add-request />', async () => {
    // Arrange
    const mockSignalRServiceInitializeConnection = jest.fn();
    const { instance } = await shallow
      .mock(SignalRService, { initializeConnection: mockSignalRServiceInitializeConnection })
      .render();
    const initializedRequestJson = {
      issueTypeId: '11',
      subIssueTypeId: '28',
      actionId: '5',
      isTest: true,
      transIds: ['109016830961', '109016813319', '109016506118', '109016500848', '109016500915', '109016506161']
    };
    const element = document.createElement('input');
    element.setAttribute('id', 'addrequest-init-data');
    element.setAttribute('value', JSON.stringify(initializedRequestJson));
    document.body.appendChild(element);

    // Act
    instance.ngOnInit();

    // Assert
    expect(instance.isExternalUrl).toBe(true);
    expect(instance.model.filter.subIssueTypeId).toBe('28');
    expect(instance.model.filter.issueTypeId).toBe('11');
    expect(instance.model.filter.isTest).toBe(true);
    expect(instance.model.filter.action).toBe('5');
    expect(mockSignalRServiceInitializeConnection).toBeCalledTimes(2);
  });
});
