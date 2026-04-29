import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MasterService } from '../../services/master-service';


@Component({
  selector: 'app-submit-enquiry',
  standalone: true,
  imports: [],
  templateUrl: './submit-enquiry.html',
  styleUrl: './submit-enquiry.css',
})

export class SubmitEnquiry implements OnInit {

  masterService = inject(MasterService); 
  cdr = inject(ChangeDetectorRef);

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

}
