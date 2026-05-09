import { Component, inject, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MasterService } from '../../services/master-service';
import { EnquiryModel } from '../../model/class/Enquiry.Model';
import { ICategory, IStatus } from '../../model/interface/master.Model';
import { Observable, Subscription } from 'rxjs';
import { CommonImports } from '../../Global.constant';


@Component({
  selector: 'app-submit-enquiry',
  standalone: true,
  imports: [CommonImports],
  templateUrl: './submit-enquiry.html',
  styleUrl: './submit-enquiry.css',
})

export class SubmitEnquiry implements OnInit, OnDestroy {

  masterService = inject(MasterService);
  cdr = inject(ChangeDetectorRef);

  // statusList: IStatus[] = []; 
  // categoryList: ICategory[] = [];

  $statusList: Observable<IStatus[]> = new Observable<IStatus[]>;
  $categoryList: Observable<ICategory[]> = new Observable<ICategory[]>;

  newEnquiryObj: EnquiryModel = new EnquiryModel();

  subscription!: Subscription;

  constructor() {
    this.$categoryList = this.masterService.getAllCategory();
    this.$statusList = this.masterService.getAllStatus();
  }

  ngOnInit(): void {
    //this.getStatus(); 
    //this.getCategory();
  }

  // getStatus(){ 
  //   return this.masterService.getAllStatus().subscribe({
  //     next:(result: any)=>{
  //       this.statusList = result.data; 
  //       this.cdr.detectChanges();
  //     }
  //   })
  // }

  // getCategory(){
  //   return this.masterService.getAllCategory().subscribe({
  //     next:(result: any)=>{
  //       this.categoryList = result.data;
  //       this.cdr.detectChanges();
  //     }
  //   })
  // }

  onSaveEnquiry() {
  // Setting default status id before saving
  this.newEnquiryObj.statusId = 1;

  // Creating a separate payload object
  // so that the original form values are not modified
  const payload = {

    // Copy all existing form values
    ...this.newEnquiryObj,

    // Convert enquiryDate from yyyy-MM-dd to ISO format required by backend API
    enquiryDate: new Date(
      this.newEnquiryObj.enquiryDate
    ).toISOString(),

    // If followUpDate exists, convert it to ISO format Otherwise send current date-time
    followUpDate: this.newEnquiryObj.followUpDate
      ? new Date(this.newEnquiryObj.followUpDate).toISOString()
      : new Date().toISOString()
  };

  // Check final payload in browser console
  console.log(payload);

  this.subscription = this.masterService.saveEnquiry(payload).subscribe({
      next: (result: any) => {
        alert('Enquiry Submitted Successfully!');
      },
      error: (error: any) => {
        console.log(error);
        alert('Error from API');
      }
    });
}

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
