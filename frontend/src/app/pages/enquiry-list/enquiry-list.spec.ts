import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { EnquiryList } from './enquiry-list';
import { MasterService } from '../../services/master-service';

describe('EnquiryList', () => {
  let component: EnquiryList;
  let fixture: ComponentFixture<EnquiryList>;

  const mockMasterService = {
    getAllCategory: () => of([]),
    getAllStatus: () => of([]),
    getAllEnquiry: () => of([]),
    getEnquiryById: () => of({}),
    saveEnquiry: () => of({}),
    updateEnquiry: () => of({}),
    deleteEnquiry: () => of({})
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnquiryList],
      providers: [
        provideRouter([]),
        { provide: MasterService, useValue: mockMasterService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnquiryList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
