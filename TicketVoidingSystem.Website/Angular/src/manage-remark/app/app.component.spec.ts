import { ModalService } from '../../utility/components/modal/modal.service';
import { CommonService } from '../../utility/services/common.service';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignalRService } from '../../utility/services/signal-r.service.native';

jest.mock('../../utility/services/signal-r.service.native');
class Helper {
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let modalService: ModalService;
  let commonService: CommonService;
  let appService: AppService;
  let signalRService: SignalRService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    appService = fixture.debugElement.injector.get(AppService);
    component = fixture.componentInstance;
  });
});
