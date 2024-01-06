import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordsCarouselComponent } from './records-carousel.component';

describe('RecordsCarouselComponent', () => {
  let component: RecordsCarouselComponent;
  let fixture: ComponentFixture<RecordsCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordsCarouselComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecordsCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
