import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopPizzasComponent } from './top-pizzas.component';

describe('TopPizzasComponent', () => {
  let component: TopPizzasComponent;
  let fixture: ComponentFixture<TopPizzasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopPizzasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopPizzasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
