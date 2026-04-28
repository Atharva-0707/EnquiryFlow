import { Component, inject, OnInit } from '@angular/core';
import { MasterService } from '../../services/master-service';

@Component({
  selector: 'app-submit-enquiry',
  imports: [],
  templateUrl: './submit-enquiry.html',
  styleUrl: './submit-enquiry.css',
})

export class SubmitEnquiry implements OnInit {

  masterService = inject(MasterService); 

  statusList: any[] = []; 
  categoryList: any[] = [];

  ngOnInit(): void {
    this.getStatus(); 
    this.getCategory();
  }

  getStatus(){ 
    return this.masterService.getAllStatus().subscribe({
      next:(result: any)=>{
        this.statusList = result.data; 
      }
    })
  }

  getCategory(){
    return this.masterService.getAllCategory().subscribe({
      next:(result: any)=>{
        this.categoryList = result.data;
      }
    })
  }

}
