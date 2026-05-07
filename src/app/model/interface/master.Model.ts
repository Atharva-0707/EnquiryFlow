export interface IStatus {
    statusId: string;
    statusName: string;
    isActive: boolean;
}

export interface ICategory {
    categoryId: string;
    categoryName: string;
    isActive: boolean;
}

export interface IApiResponseModel {
    error: any[];
    result: boolean;
    data: any[];
    message: string;
}

export interface IEnquiry {
    enquiryId: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    message: string;
    categoryId: number;
    statusId: number;
    enquiryType: string;
    isConverted: boolean;
    enquiryDate: string;
    followUpDate: string;
    feedback: string;
}