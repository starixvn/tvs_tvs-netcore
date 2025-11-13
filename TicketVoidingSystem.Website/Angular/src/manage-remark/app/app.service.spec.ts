import { Result } from '../../utility/models/result';
import { HttpService } from '../../utility/services/http.service';
import { AppService } from './app.service';
import { TestBed } from '@angular/core/testing';

jest.mock('../../utility/services/http.service');

describe('AppService', () => {
  let mockHttpService: jest.Mocked<HttpService>;
  let appService: AppService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppService, { provide: HttpService }
      ],
    });

    appService = TestBed.inject(AppService);
    mockHttpService = TestBed.inject(HttpService) as jest.Mocked<HttpService>;
  });
});
