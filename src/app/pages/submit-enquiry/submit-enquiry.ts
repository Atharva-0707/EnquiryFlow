import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MasterService } from '../../services/master-service';
import { FormsModule } from '@angular/forms';
import { EnquiryModel } from '../../model/class/Enquiry.Model';
import { ICategory, IStatus } from '../../model/interface/master.Model';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-submit-enquiry',
  standalone: true,
  imports: [FormsModule, CommonModule, AsyncPipe],
  templateUrl: './submit-enquiry.html',
  styleUrl: './submit-enquiry.css',
})

export class SubmitEnquiry implements OnInit {

  masterService = inject(MasterService); 
  cdr = inject(ChangeDetectorRef);

  // statusList: IStatus[] = []; 
  // categoryList: ICategory[] = [];

  $statusList: Observable<IStatus[]> = new Observable<IStatus[]>;
  $categoryList: Observable<ICategory[]> = new Observable<ICategory[]>;

  newEnquiryObj:EnquiryModel = new EnquiryModel();

  constructor(){
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

  onSaveEnquiry(){
    this.newEnquiryObj.statusId = '1';
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
