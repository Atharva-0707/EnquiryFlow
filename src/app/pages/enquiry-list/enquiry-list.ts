import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MasterService } from '../../services/master-service';
import { IEnquiry, ICategory, IStatus } from '../../model/interface/master.Model';
import { EnquiryModel } from '../../model/class/Enquiry.Model';
import { Observable, Subscription } from 'rxjs';
import { CommonImports } from '../../Global.constant';

@Component({
  selector: 'app-enquiry-list',
  imports: [CommonImports],
  templateUrl: './enquiry-list.html',
  styleUrl: './enquiry-list.css',
})
export class EnquiryList implements OnInit {

  masterService = inject(MasterService);
  enquiryList: IEnquiry[] = [];

  cdr = inject(ChangeDetectorRef);

  subscribe !: Subscription;

  $statusList: Observable<IStatus[]> = new Observable<IStatus[]>;
  $categoryList: Observable<ICategory[]> = new Observable<ICategory[]>;

  selectedEnquiry: IEnquiry | null = null;
  showModal: boolean = false;

  constructor() {
    this.$categoryList = this.masterService.getAllCategory();
    this.$statusList = this.masterService.getAllStatus();
  }

  ngOnInit(): void {
    this.getAllEnquiry();
  }

  getAllEnquiry() {
    this.subscribe = this.masterService.getAllEnquiry().subscribe({
      next: (result: any) => {
        this.enquiryList = result.data;
        this.cdr.detectChanges();
      }
    })
  }

  onUpdate(enquiry: IEnquiry) {
    this.selectedEnquiry = { ...enquiry };
    this.showModal = true;
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this enquiry?')) {
      this.masterService.deleteEnquiry(id).subscribe({
        next: () => {
          alert('Enquiry deleted successfully!');
          this.getAllEnquiry();
        },
        error: () => {
          alert('Error deleting enquiry');
        }
      });
    }
  }

  onSaveUpdate() {
    if (!this.selectedEnquiry) return;
    const payload = {
      enquiryId: this.selectedEnquiry.enquiryId,
      customerName: this.selectedEnquiry.customerName,
      customerEmail: this.selectedEnquiry.customerEmail,
      customerPhone: this.selectedEnquiry.customerPhone,
      message: this.selectedEnquiry.message,
      categoryId: Number(this.selectedEnquiry.categoryId),
      statusId: this.selectedEnquiry.statusId,
      enquiryType: this.selectedEnquiry.enquiryType,
      isConverted: this.selectedEnquiry.isConverted,
      enquiryDate: this.formatDate(this.selectedEnquiry.enquiryDate),
      followUpDate: this.formatDate(this.selectedEnquiry.followUpDate),
      feedback: this.selectedEnquiry.feedback
    };
    this.masterService.updateEnquiry(this.selectedEnquiry.enquiryId, payload).subscribe({
      next: () => {
        alert('Enquiry updated successfully!');
        this.showModal = false;
        this.getAllEnquiry();
      },
      error: () => {
        alert('Error updating enquiry');
      }
    });
  }

  private formatDate(date: Date | string): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString();
  }

  ngOnDestroy(): void {
    this.subscribe?.unsubscribe();
  }

}
