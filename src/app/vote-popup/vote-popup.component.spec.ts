import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotePopupComponent } from './vote-popup.component';

describe('VotePopupComponent', () => {
  let component: VotePopupComponent;
  let fixture: ComponentFixture<VotePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VotePopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VotePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
