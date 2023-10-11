import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdgeBundlingComponent } from './edge-bundling.component';

describe('EdgeBundlingComponent', () => {
  let component: EdgeBundlingComponent;
  let fixture: ComponentFixture<EdgeBundlingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdgeBundlingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdgeBundlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
