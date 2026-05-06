import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { IApiResponseModel } from '../model/interface/master.Model';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  
  constructor(private http: HttpClient){}

  // getAllCategory(){
  //   return this.http.get('https://api.freeprojectapi.com/api/Enquiry/get-categories');
  // }

  getAllCategory(){
    return this.http.get<IApiResponseModel>('https://api.freeprojectapi.com/api/Enquiry/get-categories').pipe(
      map((response: IApiResponseModel) => response.data)
    )
  }

  // getAllStatus(){
  //   return this.http.get('https://api.freeprojectapi.com/api/Enquiry/get-statuses');
  // }

  getAllStatus(){
    return this.http.get<IApiResponseModel>('https://api.freeprojectapi.com/api/Enquiry/get-statuses').pipe(
      map((response: IApiResponseModel) => response.data)
    )
  }

  saveEnquiry(obj: any){
    return this.http.post('https://api.freeprojectapi.com/api/Enquiry/create-enquiry', obj);
  }

  getAllEnquiry(){
    return this.http.get('https://api.freeprojectapi.com/api/Enquiry/get-enquiries');
  }

}
