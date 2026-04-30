import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MasterService } from '../../services/master-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-enquiry-list',
  imports: [DatePipe],
  templateUrl: './enquiry-list.html',
  styleUrl: './enquiry-list.css',
})
export class EnquiryList implements OnInit {

  masterService = inject(MasterService);
  enquiryList: any[] = [];

  cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.getAllEnquiry();
  } 

  getAllEnquiry(){
    this.masterService.getAllEnquiry().subscribe({
      next:(result: any)=>{
        this.enquiryList = result.data;
        this.cdr.detectChanges();
      }
    })
  }

}
