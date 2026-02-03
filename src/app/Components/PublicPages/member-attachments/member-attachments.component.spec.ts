import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberAttachmentsComponent } from './member-attachments.component';

describe('MemberAttachmentsComponent', () => {
  let component: MemberAttachmentsComponent;
  let fixture: ComponentFixture<MemberAttachmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberAttachmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MemberAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
