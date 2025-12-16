import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEmailTemplateComponent } from './update-email-template.component';

describe('UpdateEmailTemplateComponent', () => {
  let component: UpdateEmailTemplateComponent;
  let fixture: ComponentFixture<UpdateEmailTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateEmailTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateEmailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
