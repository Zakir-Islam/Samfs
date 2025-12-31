import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactListsComponent } from './contact-lists.component';

describe('ContactListsComponent', () => {
  let component: ContactListsComponent;
  let fixture: ComponentFixture<ContactListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactListsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
