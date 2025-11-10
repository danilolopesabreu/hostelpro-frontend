import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItensAgrupadosComponent } from './itens-agrupados.component';

describe('ItensAgrupadosComponent', () => {
  let component: ItensAgrupadosComponent;
  let fixture: ComponentFixture<ItensAgrupadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItensAgrupadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItensAgrupadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
