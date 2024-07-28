import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LieferandoRestaurantDetailsComponent } from './lieferando-restaurant-details.component';

describe('LieferandoRestaurantDetailsComponent', () => {
  let component: LieferandoRestaurantDetailsComponent;
  let fixture: ComponentFixture<LieferandoRestaurantDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LieferandoRestaurantDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LieferandoRestaurantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
