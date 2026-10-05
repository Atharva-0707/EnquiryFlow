import { Component, inject, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MasterService } from '../../services/master-service';
import { IEnquiry, ICategory, IStatus } from '../../model/interface/master.Model';
import { Observable, Subscription } from 'rxjs';
import { CommonImports } from '../../Global.constant';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-enquiry-list',
  standalone: true,
  imports: [CommonImports, RouterLink],
  templateUrl: './enquiry-list.html',
  styleUrl: './enquiry-list.css',
})
export class EnquiryList implements OnInit, OnDestroy {
  masterService = inject(MasterService);
  toastService = inject(ToastService);
  authService = inject(AuthService);
  cdr = inject(ChangeDetectorRef);

  enquiryList: IEnquiry[] = [];
  subscribe!: Subscription;
  categorySub?: Subscription;
  statusSub?: Subscription;

  $statusList: Observable<IStatus[]> = new Observable<IStatus[]>();
  $categoryList: Observable<ICategory[]> = new Observable<ICategory[]>();

  categoryList: ICategory[] = [];
  statusList: IStatus[] = [];
  categoryMap: Record<string, string> = {};
  statusMap: Record<string, string> = {};

  selectedEnquiry: any = null;
  showModal: boolean = false;
  isLoading: boolean = true;
  searchTerm: string = '';
  errorMessage: string = '';

  constructor() {
    this.$categoryList = this.masterService.getAllCategory();
    this.$statusList = this.masterService.getAllStatus();

    this.categorySub = this.$categoryList.subscribe({
      next: (categories) => {
        if (Array.isArray(categories)) {
          this.categoryList = categories;
          categories.forEach((cat) => {
            this.categoryMap[cat._id] = cat.name;
          });
          this.cdr.markForCheck();
        }
      },
    });

    this.statusSub = this.$statusList.subscribe({
      next: (statuses) => {
        if (Array.isArray(statuses)) {
          this.statusList = statuses;
          statuses.forEach((status) => {
            this.statusMap[status._id] = status.name;
          });
          this.cdr.markForCheck();
        }
      },
    });
  }

  ngOnInit(): void {
    this.getAllEnquiry();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  getAllEnquiry() {
    this.isLoading = true;
    this.errorMessage = '';

    this.subscribe = this.masterService.getAllEnquiry(this.searchTerm).subscribe({
      next: (result: any) => {
        this.enquiryList = Array.isArray(result?.data) ? result.data : [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.isLoading = false;
        const msg =
          err.error?.message ||
          (err.status === 0
            ? 'Cannot connect to backend API on port 5001. Please verify MongoDB and Express server are running.'
            : 'Unable to load enquiries. Please check backend connection.');
        this.errorMessage = msg;
        this.toastService.error(msg, 'Enquiry Load Notice');
        this.cdr.markForCheck();
      },
    });
  }

  get filteredEnquiries(): IEnquiry[] {
    if (!this.searchTerm.trim()) {
      return this.enquiryList;
    }
    const term = this.searchTerm.toLowerCase();
    return this.enquiryList.filter((item) => {
      const catName = this.getCategoryLabel(item).toLowerCase();
      const statName = this.getStatusLabel(item).toLowerCase();
      return (
        item.customerName?.toLowerCase().includes(term) ||
        item.customerEmail?.toLowerCase().includes(term) ||
        item.customerPhone?.toLowerCase().includes(term) ||
        item.enquiryType?.toLowerCase().includes(term) ||
        item.enquiryCode?.toLowerCase().includes(term) ||
        item.message?.toLowerCase().includes(term) ||
        catName.includes(term) ||
        statName.includes(term)
      );
    });
  }

  getCategoryLabel(item: IEnquiry): string {
    if (item.category && typeof item.category === 'object' && 'name' in item.category) {
      return item.category.name;
    }
    const id = String(item.category || item.categoryId || '');
    return this.categoryMap[id] || id || 'General';
  }

  getStatusLabel(item: IEnquiry): string {
    if (item.status && typeof item.status === 'object' && 'name' in item.status) {
      return item.status.name;
    }
    const id = String(item.status || item.statusId || '');
    return this.statusMap[id] || id || 'New';
  }

  getEnquiryCode(item: IEnquiry): string {
    if (item.enquiryCode) return item.enquiryCode;
    if (item._id) return `ENQ-${item._id.slice(-4).toUpperCase()}`;
    return `#ENQ-${item.enquiryId || '1001'}`;
  }

  getInitials(name: string): string {
    if (!name) return 'EN';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  onUpdate(enquiry: IEnquiry) {
    // Clone and prepare selectedEnquiry with proper category/status IDs
    const categoryId =
      enquiry.category && typeof enquiry.category === 'object'
        ? (enquiry.category as ICategory)._id
        : enquiry.category || enquiry.categoryId;

    const statusId =
      enquiry.status && typeof enquiry.status === 'object'
        ? (enquiry.status as IStatus)._id
        : enquiry.status || enquiry.statusId;

    this.selectedEnquiry = {
      ...enquiry,
      categoryId,
      statusId,
      enquiryDate: enquiry.enquiryDate
        ? new Date(enquiry.enquiryDate).toISOString().split('T')[0]
        : '',
      followUpDate: enquiry.followUpDate
        ? new Date(enquiry.followUpDate).toISOString().split('T')[0]
        : '',
    };

    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onDelete(id: string | number | undefined) {
    if (!id) return;
    if (confirm('Are you sure you want to delete this enquiry from MongoDB?')) {
      this.masterService.deleteEnquiry(id).subscribe({
        next: () => {
          this.toastService.success('Enquiry record deleted from MongoDB.', 'Record Deleted');
          this.getAllEnquiry();
        },
        error: (err: any) => {
          const msg = err.error?.message || 'Error deleting enquiry';
          this.toastService.error(msg, 'Delete Failed');
        },
      });
    }
  }

  onSaveUpdate() {
    if (!this.selectedEnquiry) return;

    const id = this.selectedEnquiry._id || this.selectedEnquiry.enquiryId;
    if (!id) {
      this.toastService.error('Missing enquiry identifier', 'Update Failed');
      return;
    }

    const payload: any = {
      customerName: this.selectedEnquiry.customerName,
      customerEmail: this.selectedEnquiry.customerEmail,
      customerPhone: this.selectedEnquiry.customerPhone,
      message: this.selectedEnquiry.message,
      category: this.selectedEnquiry.categoryId,
      status: this.selectedEnquiry.statusId,
      enquiryType: this.selectedEnquiry.enquiryType,
      isConverted: Boolean(this.selectedEnquiry.isConverted),
      enquiryDate: this.selectedEnquiry.enquiryDate
        ? new Date(this.selectedEnquiry.enquiryDate).toISOString()
        : new Date().toISOString(),
      followUpDate: this.selectedEnquiry.followUpDate
        ? new Date(this.selectedEnquiry.followUpDate).toISOString()
        : null,
      feedback: this.selectedEnquiry.feedback || '',
    };

    this.masterService.updateEnquiry(id, payload).subscribe({
      next: () => {
        this.toastService.success('Enquiry updated successfully in MongoDB.', 'Record Updated');
        this.showModal = false;
        this.getAllEnquiry();
      },
      error: (err: any) => {
        const msg = err.error?.message || 'Error updating enquiry record';
        this.toastService.error(msg, 'Update Failed');
      },
    });
  }

  ngOnDestroy(): void {
    this.subscribe?.unsubscribe();
    this.categorySub?.unsubscribe();
    this.statusSub?.unsubscribe();
  }
}
