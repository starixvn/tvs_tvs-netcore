import { TestBed } from '@angular/core/testing';
import { AppStore } from './app.store';

describe('AppStore', () => {
  let appStore: AppStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppStore]
    });
    appStore = TestBed.inject(AppStore);
  });

  it('should be created', () => {
    expect(appStore).toBeTruthy();
  });

  it('should have initial blockingUiStatus as false', (done) => {
    appStore.blockingUiStatus.subscribe(status => {
      expect(status).toBe(false);
      done();
    });
  });

  it('should change blockingUiStatus', (done) => {
    appStore.changeBlockingUiStatus(true);
    appStore.blockingUiStatus.subscribe(status => {
      expect(status).toBe(true);
      done();
    });
  });
});