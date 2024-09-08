import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressLandingpageComponent } from './address-landingpage.component';

describe('AddressLandingpageComponent', () => {
  let component: AddressLandingpageComponent;
  let fixture: ComponentFixture<AddressLandingpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressLandingpageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddressLandingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
