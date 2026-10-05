import { ICategory, IStatus } from '../interface/master.Model';

export class EnquiryModel {
  _id?: string;
  enquiryCode?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  categoryId: string;
  statusId: string;
  category?: ICategory | string;
  status?: IStatus | string;
  enquiryType: string;
  isConverted: boolean;
  enquiryDate: string;
  followUpDate: string;
  feedback: string;
  enquiryId?: any;

  constructor() {
    this.customerName = '';
    this.customerEmail = '';
    this.customerPhone = '';
    this.message = '';
    this.categoryId = '';
    this.statusId = '';
    this.enquiryType = '';
    this.isConverted = false;
    this.enquiryDate = new Date().toISOString().split('T')[0];
    this.followUpDate = '';
    this.feedback = '';
  }
}
