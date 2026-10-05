import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { SubmitEnquiry } from './submit-enquiry';
import { MasterService } from '../../services/master-service';

describe('SubmitEnquiry', () => {
  let component: SubmitEnquiry;
  let fixture: ComponentFixture<SubmitEnquiry>;

  const mockMasterService = {
    getAllCategory: () => of([]),
    getAllStatus: () => of([]),
    getAllEnquiry: () => of([]),
    saveEnquiry: () => of({ success: true }),
    getDashboardStats: () => of({
      totalEnquiries: 0,
      newEnquiries: 0,
      inProgress: 0,
      converted: 0,
      closed: 0,
      conversionRate: 0,
    }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitEnquiry],
      providers: [
        provideRouter([]),
        { provide: MasterService, useValue: mockMasterService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitEnquiry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

