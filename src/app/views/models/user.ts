interface Salary {
	salary: any;
	date: any;
}

export class LeanUser {
	constructor(
		public id: string,
		public userName: string,
		public password: string,
		public incorporationDate: any,
		public permissions: any,
		public status: boolean,
		public role?: {
			id: string;
			name: string;
			costHour: any;
		},
		public personalData?: {
			name: string;
			lastName: string;
			phone: number;
			email: string;
			address: string;
			documents?: [
				{
					URLfileRFC: string;
					rfc: string;
					URLfileBirth: string;
					birthDate: string;
					URLfileCURP: string;
					curp: string;
					URLfileNSS: string;
					nss: string;
					URLfileProfileImage: string;
					name: string;
				},
			];
		},
		public positionData?: {
			position?: {};
			company?: {};
			role?: {};
			lead?: {};
			collaborators?: {};
		},
		public salary: any[] = []
	) {}
}
