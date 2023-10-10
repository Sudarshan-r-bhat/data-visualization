import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadialTreeComponent } from './radial-tree.component';

describe('RadialTreeComponent', () => {
  let component: RadialTreeComponent;
  let fixture: ComponentFixture<RadialTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadialTreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadialTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
