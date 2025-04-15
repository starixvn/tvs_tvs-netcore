import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpService } from './http.service';
import { of, throwError } from 'rxjs';

describe('HttpService', () => {
  let service: HttpService;
  let httpClientSpy: jest.Mocked<HttpClient>;

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
      post: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      providers: [
        HttpService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
    service = TestBed.inject(HttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getJson', () => {
    it('should return data on successful request', async () => {
      const mockData = { id: 1, name: 'Test' };
      httpClientSpy.get.mockReturnValue(of(mockData));

      const result = await service.getJson('test-url');
      expect(result).toEqual(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith('test-url');
    });

    it('should return null on error', async () => {
      httpClientSpy.get.mockReturnValue(throwError(() => new Error('Test error')));

      const result = await service.getJson('test-url');
      expect(result).toBeNull();
    });
  });

  describe('postJson', () => {
    it('should return data on successful request', async () => {
      const mockData = { result: 'success' };
      const postData = { id: 1 };
      httpClientSpy.post.mockReturnValue(of(mockData));

      const result = await service.postJson(postData, 'test-url');
      expect(result).toEqual(mockData);
      expect(httpClientSpy.post).toHaveBeenCalledWith(
        'test-url',
        JSON.stringify(postData),
        expect.objectContaining({
          headers: expect.any(HttpHeaders)
        })
      );
    });

    it('should return null on error', async () => {
      httpClientSpy.post.mockReturnValue(throwError(() => new Error('Test error')));

      const result = await service.postJson({}, 'test-url');
      expect(result).toBeNull();
    });
  });
}); 