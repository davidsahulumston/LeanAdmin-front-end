export class Company {
    id: string;
    name: string;
    businessName: string;
    phone: any;
    email: string;
    RFC: string;
    businessLine: any[] = [];
    services: any[] = [];
    logo: [];
    constructor(
        id: string,
        name: string,
        businessName: string,
        phone: any,
        email: string,
        RFC: string,
        businessLine: any[] = [],
        services: any[] = [],
        logo?: []
    ){}
}
