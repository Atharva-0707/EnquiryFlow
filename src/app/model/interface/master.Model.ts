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