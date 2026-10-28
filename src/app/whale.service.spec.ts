import { TestBed } from '@angular/core/testing';

import { WhaleService } from './whale.service';

describe('WhaleService', () => {
  let service: WhaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WhaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
