export class Clients  {
    id: string;
    name: string;
    businessName: string;
    phone: any;
    RFC: string;
    email: string;
    logo?:[]
    constructor(
        id: string,
        name: string,
        businessName: string,
        phone: any,
        RFC: string,
        email: string,
        logo?:[]
    ){}
}