export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  createdAt?: string;
}

export interface ILoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: IUser;
}

export interface ICategory {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Compatibility properties
  categoryId?: string;
  categoryName?: string;
}

export interface IStatus {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Compatibility properties
  statusId?: string;
  statusName?: string;
}

export interface IEnquiry {
  _id?: string;
  enquiryCode?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  category: ICategory | string;
  status: IStatus | string;
  enquiryType: string;
  isConverted: boolean;
  enquiryDate: string | Date;
  followUpDate: string | Date | null;
  feedback: string;
  createdBy?: IUser | string | null;
  createdAt?: string;
  updatedAt?: string;
  // Compatibility properties
  enquiryId?: any;
  categoryId?: any;
  statusId?: any;
}

export interface IDashboardStats {
  totalEnquiries: number;
  newEnquiries: number;
  inProgress: number;
  followUp: number;
  converted: number;
  closed: number;
  totalCategories: number;
  recentEnquiries?: IEnquiry[];
}

export interface IApiResponse<T = any> {
  success: boolean;
  message?: string;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
  data: T;
  error?: any[];
  result?: boolean;
}

export type IApiResponseModel = IApiResponse<any>;