import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TidyTreeComponent } from './tidy-tree.component';

describe('TidyTreeComponent', () => {
  let component: TidyTreeComponent;
  let fixture: ComponentFixture<TidyTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TidyTreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TidyTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
