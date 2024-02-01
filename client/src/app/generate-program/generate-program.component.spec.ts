import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateProgramComponent } from './generate-program.component';

describe('GenerateProgramComponent', () => {
  let component: GenerateProgramComponent;
  let fixture: ComponentFixture<GenerateProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateProgramComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenerateProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
