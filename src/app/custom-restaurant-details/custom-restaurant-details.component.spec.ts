import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomRestaurantDetailsComponent } from './custom-restaurant-details.component';

describe('CustomRestaurantDetailsComponent', () => {
  let component: CustomRestaurantDetailsComponent;
  let fixture: ComponentFixture<CustomRestaurantDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomRestaurantDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomRestaurantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
