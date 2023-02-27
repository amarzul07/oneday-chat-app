import {TestBed} from '@angular/core/testing';

import {CHANNELS, DataService, USERS} from './data.service';
import {of} from "rxjs";

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get users', (done: any) => {
    service.getUsers().subscribe(v => {
      expect(v).toEqual(USERS);
      done();
    });
  });

  it('should get channels', (done: any) => {
    service.getChannels().subscribe(v => {
      expect(v).toEqual(CHANNELS);
      done();
    });
  });
});
