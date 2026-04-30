import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  
  constructor(private http: HttpClient){}

  getAllCategory(){
    return this.http.get('https://api.freeprojectapi.com/api/Enquiry/get-categories');
  }

  getAllStatus(){
    return this.http.get('https://api.freeprojectapi.com/api/Enquiry/get-statuses');
  }

  saveEnquiry(obj: any){
    return this.http.post('https://api.freeprojectapi.com/api/Enquiry/create-enquiry', obj);
  }

  getAllEnquiry(){
    return this.http.get('https://api.freeprojectapi.com/api/Enquiry/get-enquiries');
  }

}
