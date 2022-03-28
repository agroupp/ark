import { TestBed } from '@angular/core/testing';

import { ArkRegistryService } from './ark-registry.service';

describe('RegistryService', () => {
  let service: ArkRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArkRegistryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
