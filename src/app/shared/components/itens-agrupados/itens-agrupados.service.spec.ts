import { TestBed } from '@angular/core/testing';

import { ItensAgrupadosService } from './itens-agrupados.service';

describe('ItensAgrupadosService', () => {
  let service: ItensAgrupadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItensAgrupadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
