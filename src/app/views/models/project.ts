export class Project {
    id:string;
    name: string;
    description: string;
    company: any;
    businessName: string;
    serviceName: string;
    client: any;
    status: boolean;
    resources: any[] = [];
    constructor(
        id:string,
        name: string,
        description: string,
        company: any,
        businessName: string,
        serviceName: string,
        client: any,
        resources: any[] = []
    ) {}
}