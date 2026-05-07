export class EnquiryModel {
    enquiryId: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    message: string;
    categoryId: string;
    statusId: string;
    enquiryType: string;
    isConverted: boolean;
    enquiryDate: string;
    followUpDate: string;
    feedback: string;

    constructor() {
        this.enquiryId = 0;
        this.customerName = "";
        this.customerEmail = "";
        this.customerPhone = "";
        this.message = "";
        this.categoryId = "";
        this.statusId = "";
        this.enquiryType = "";
        this.isConverted = false;
        this.enquiryDate = "";
        this.followUpDate = "";
        this.feedback = "";
    }

}
