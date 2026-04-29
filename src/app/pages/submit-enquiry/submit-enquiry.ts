import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterService } from '../../services/master-service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-submit-enquiry',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './submit-enquiry.html',
  styleUrl: './submit-enquiry.css',
})

export class SubmitEnquiry implements OnInit {

  masterService = inject(MasterService); 
  cdr = inject(ChangeDetectorRef);

  statusList: any[] = []; 
  categoryList: any[] = [];

  newEnquiryObj:any = {
  "enquiryId": 0,
  "customerName": "",
  "customerEmail": "",
  "customerPhone": "",
  "message": "",
  "categoryId": 0,
  "statusId": 0,
  "enquiryType": "",
  "isConverted": false,
  "enquiryDate": "",
  "followUpDate": "",
  "feedback": ""
}

  ngOnInit(): void {
    this.getStatus(); 
    this.getCategory();
  }

  getStatus(){ 
    return this.masterService.getAllStatus().subscribe({
      next:(result: any)=>{
        this.statusList = result.data; 
        this.cdr.detectChanges();
      }
    })
  }

  getCategory(){
    return this.masterService.getAllCategory().subscribe({
      next:(result: any)=>{
        this.categoryList = result.data;
        this.cdr.detectChanges();
      }
    })
  }

  onSaveEnquiry(){
    this.masterService.saveEnquiry(this.newEnquiryObj).subscribe({
      next:(result: any)=>{
        alert('Enquiry Submitted Successfully!');
      },
      error(error: any){
        alert('Error from API');
      }
    })
  }

}
