import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  IApiResponse,
  ICategory,
  IStatus,
  IEnquiry,
  IDashboardStats,
} from '../model/interface/master.Model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  /**
   * Fetch all active categories from MongoDB backend
   */
  getAllCategory(): Observable<ICategory[]> {
    return this.http
      .get<IApiResponse<ICategory[]>>(`${this.baseUrl}/categories`)
      .pipe(
        map((response) => {
          const list = response?.data || [];
          return list.map((cat) => ({
            ...cat,
            categoryId: cat._id,
            categoryName: cat.name,
          }));
        })
      );
  }

  /**
   * Fetch all active statuses from MongoDB backend
   */
  getAllStatus(): Observable<IStatus[]> {
    return this.http
      .get<IApiResponse<IStatus[]>>(`${this.baseUrl}/statuses`)
      .pipe(
        map((response) => {
          const list = response?.data || [];
          return list.map((stat) => ({
            ...stat,
            statusId: stat._id,
            statusName: stat.name,
          }));
        })
      );
  }

  /**
   * Fetch enquiries with optional server-side search and filters
   */
  getAllEnquiry(
    search?: string,
    status?: string,
    category?: string
  ): Observable<IApiResponse<IEnquiry[]>> {
    let params = new HttpParams();
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }
    if (status && status !== 'all') {
      params = params.set('status', status);
    }
    if (category && category !== 'all') {
      params = params.set('category', category);
    }

    return this.http.get<IApiResponse<IEnquiry[]>>(`${this.baseUrl}/enquiries`, {
      params,
    });
  }

  /**
   * Fetch single enquiry by ID
   */
  getEnquiryById(id: string): Observable<IApiResponse<IEnquiry>> {
    return this.http.get<IApiResponse<IEnquiry>>(`${this.baseUrl}/enquiries/${id}`);
  }

  /**
   * Save / Create a new customer enquiry in MongoDB
   */
  saveEnquiry(obj: any): Observable<IApiResponse<IEnquiry>> {
    return this.http.post<IApiResponse<IEnquiry>>(`${this.baseUrl}/enquiries`, obj);
  }

  /**
   * Update an existing enquiry in MongoDB
   */
  updateEnquiry(id: string | number, obj: any): Observable<IApiResponse<IEnquiry>> {
    return this.http.put<IApiResponse<IEnquiry>>(`${this.baseUrl}/enquiries/${id}`, obj);
  }

  /**
   * Delete an enquiry by MongoDB _id
   */
  deleteEnquiry(id: string | number): Observable<IApiResponse<any>> {
    return this.http.delete<IApiResponse<any>>(`${this.baseUrl}/enquiries/${id}`);
  }

  /**
   * Get live CRM dashboard statistics calculated directly from MongoDB
   */
  getDashboardStats(): Observable<IDashboardStats> {
    return this.http
      .get<IApiResponse<IDashboardStats>>(`${this.baseUrl}/dashboard/stats`)
      .pipe(map((response) => response.data));
  }
}
