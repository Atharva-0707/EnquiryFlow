import { Component, inject, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MasterService } from '../../services/master-service';
import { EnquiryModel } from '../../model/class/Enquiry.Model';
import { ICategory, IStatus } from '../../model/interface/master.Model';
import { Observable, Subscription } from 'rxjs';
import { CommonImports } from '../../Global.constant';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-submit-enquiry',
  standalone: true,
  imports: [CommonImports],
  templateUrl: './submit-enquiry.html',
  styleUrl: './submit-enquiry.css',
})
export class SubmitEnquiry implements OnInit, OnDestroy {
  masterService = inject(MasterService);
  toastService = inject(ToastService);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  $statusList: Observable<IStatus[]> = new Observable<IStatus[]>();
  $categoryList: Observable<ICategory[]> = new Observable<ICategory[]>();

  newEnquiryObj: EnquiryModel = new EnquiryModel();
  isSubmitting: boolean = false;
  subscription!: Subscription;

  constructor() {
    this.$categoryList = this.masterService.getAllCategory();
    this.$statusList = this.masterService.getAllStatus();
  }

  ngOnInit(): void {}

  onResetForm(): void {
    this.newEnquiryObj = new EnquiryModel();
    this.cdr.markForCheck();
  }

  onSaveEnquiry(): void {
    if (!this.newEnquiryObj.customerName || !this.newEnquiryObj.customerEmail || !this.newEnquiryObj.customerPhone) {
      this.toastService.warning('Please complete all required customer fields.', 'Missing Information');
      return;
    }

    if (!this.newEnquiryObj.message) {
      this.toastService.warning('Please enter an enquiry message description.', 'Message Required');
      return;
    }

    this.isSubmitting = true;

    const payload: any = {
      customerName: this.newEnquiryObj.customerName,
      customerEmail: this.newEnquiryObj.customerEmail,
      customerPhone: this.newEnquiryObj.customerPhone,
      message: this.newEnquiryObj.message,
      enquiryType: this.newEnquiryObj.enquiryType || 'General',
      isConverted: Boolean(this.newEnquiryObj.isConverted),
      feedback: this.newEnquiryObj.feedback || '',
    };

    if (this.newEnquiryObj.categoryId) {
      payload.category = this.newEnquiryObj.categoryId;
    }

    if (this.newEnquiryObj.statusId) {
      payload.status = this.newEnquiryObj.statusId;
    }

    if (this.newEnquiryObj.enquiryDate) {
      payload.enquiryDate = new Date(this.newEnquiryObj.enquiryDate).toISOString();
    } else {
      payload.enquiryDate = new Date().toISOString();
    }

    if (this.newEnquiryObj.followUpDate) {
      payload.followUpDate = new Date(this.newEnquiryObj.followUpDate).toISOString();
    } else {
      payload.followUpDate = null;
    }

    this.subscription = this.masterService.saveEnquiry(payload).subscribe({
      next: (result) => {
        this.isSubmitting = false;
        this.toastService.success(
          `Enquiry ${result.data?.enquiryCode || ''} submitted successfully into CRM database!`,
          'Enquiry Submitted'
        );
        this.onResetForm();
        this.router.navigateByUrl('/enquiry-list');
      },
      error: (error) => {
        this.isSubmitting = false;
        const msg = error.error?.message || error.error?.errors?.[0] || 'Error submitting enquiry to backend API.';
        this.toastService.error(msg, 'Submission Failed');
        this.cdr.markForCheck();
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
