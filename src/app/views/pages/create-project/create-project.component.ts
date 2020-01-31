import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ConexionService } from "../../services/conexion.service";
import { Project } from "../../models/project";
import Swal from "sweetalert2";


@Component({
	selector: "kt-create-project",
	templateUrl: "./create-project.component.html",
	styleUrls: ["./create-project.component.scss"]
})
export class CreateProjectComponent implements OnInit {
	constructor(
		private _router: Router,
		private _conexion: ConexionService,
		private _route: ActivatedRoute
	) {}
	displayedColumns: string[] = ["position", "name", "weight", "symbol"];
	companies: any = [];
	clients: any = [];
	users: any = [];
	roles: any = [];
	copyCompanies: any = [];
	copyClients: any = [];
	copyUsers: any = [];
	copyRoles: any = [];
	logos: any = [];
	selectedIndex = 0;
	// company: any;
	businessLine: any;
	copyCompany: any;
	businessName: any;
	serviceName: any;
	clientLogos: any = [];
	arrayImages: any = [];
	tableProject: any = [];
	typeHrs: any;
	collaborator: any;
	role: any;
	hrs: any;
	projectName: string;
	description: string;
	client: any;
	isEdit: boolean = false;
	project: Project;
	projectIdtoEdit: any;
	dataBusiness: any;

	addCollaborator() {
		// console.log("add collaborator");
		this.project.resources.push({
			name: this.collaborator,
			role: this.role,
			type: this.typeHrs,
			hrs: this.hrs
		});
	}

	selectTab(index: number): void {
		this.selectedIndex = index;
	}

	backTab() {
		this._router.navigate(["projects"]);
	}

	getCompanies() {
		this._conexion.globalGet("/api/companies", "").subscribe(res => {
			// console.log(res);
			this.companies = res.data;
			// console.log(this.companies);
			this.copyCompanies = res.data;
			this.logos = this.companies.map(({ logo }) =>
				logo.map(({ URLCompanylogo }) => URLCompanylogo)
			);
		});
	}

	getClients() {
		this._conexion.globalGet("/api/clients", "").subscribe(res => {
			// console.log(res);
			this.clients = res.data;
			// console.log(this.clients);
			this.copyClients = res.data;
			this.clientLogos = this.clients.map(({ logo }) =>
				logo.map(({ URLfileClientLogo }) => URLfileClientLogo)
			);

			// console.log(this.clientLogos);
		});
	}

	getRoles() {
		this._conexion.globalGet("/api/leanroles", "").subscribe(res => {
			this.roles = res.data;
			this.copyRoles = res.data;
		});
	}

	getCompany() {
		this._conexion.globalGet("/api/companies", this.project.company).subscribe(res => {
			this.dataBusiness = res.data
			console.log('dataB',this.dataBusiness)
		})
	}

	getUsers() {
		this._conexion.globalGet("/api/leanusers", "").subscribe(res => {
			this.users = res.data;
			this.copyUsers = res.data;

			var userDocs: any = [];
			this.users.map(({ personalData }) => {
				//console.log("personal", personalData);
				userDocs.push({ personalData });
				//console.log("personal", userDocs);
			});
			// console.log(userDocs);
			userDocs.map(docs => {
				//console.log("docuemntso", docs.personalData.documents);
				docs.personalData.documents.forEach(element => {
					// console.log(element);
					if (element !== null) {
						//console.log(element);
						if (element.URLfileProfileImage) {
							this.arrayImages.push(element.URLfileProfileImage);
							// 			this.arrayImages.push(element.URLfileProfileImage);
						}
					}
				});
			});
		});
	}

	searchRole(query: string) {
		let result = this.selectRole(query.toLowerCase());
		this.roles = result;
	}

	selectRole(query: string) {
		var result: any;
		var validate: any;
		if (query) {
			validate = this.roles.map(({ name }) =>
				name.toLowerCase().includes(query.toString())
			);
		}
		if (query === undefined || !query) {
			return this.copyRoles;
		}
		if (validate.map(val => val)) {
			return (result = this.roles.filter(({ name }) =>
				name.toLowerCase().includes(query.toString())
			));
		} else {
			return (result = []);
		}
	}

	searchClient(query: string) {
		let result = this.selectClient(query.toLowerCase());
		this.clients = result;
	}

	selectClient(query: string) {
		var result: any;
		var validate: any;
		if (query) {
			validate = this.clients.map(({ name }) =>
				name.toLowerCase().includes(query.toString())
			);
		}
		if (query === undefined || !query) {
			return this.copyClients;
		}
		if (validate.map(val => val)) {
			return (result = this.clients.filter(({ name }) =>
				name.toLowerCase().includes(query.toString())
			));
		} else {
			return (result = []);
		}
	}

	searchCollaborator(query: string) {
		let result = this.selectCollaborator(query.toLowerCase());
		this.users = result;
	}

	selectCollaborator(query: string) {
		var result: any;
		var validate: any;
		if (query) {
			validate = this.users.map(({ personalData: { name } }) =>
				name.toLowerCase().includes(query.toString())
			);
		}
		if (query === undefined || !query) {
			return this.copyUsers;
		}
		if (validate.map(val => val)) {
			return (result = this.users.filter(({ personalData: { name } }) =>
				name.toLowerCase().includes(query.toString())
			));
		} else {
			return (result = []);
		}
	}

	searchCompany(query: string) {
		let result = this.selectCompany(query.toLowerCase());
		this.companies = result;
	}

	selectCompany(query: string) {
		var result: any;
		var validate: any;
		if (query) {
			validate = this.companies.map(({ name }) =>
				name.toLowerCase().includes(query.toString())
			);
		}
		if (query === undefined || !query) {
			return this.copyCompanies;
		}
		if (validate.map(val => val)) {
			return (result = this.companies.filter(({ name }) =>
				name.toLowerCase().includes(query.toString())
			));
		} else {
			return (result = []);
		}
	}

	// searchBusiness(query: string) {
	// 	let result = this.selectBusiness(query.toLowerCase());
	// 	this.company = result;
	// }

	// selectBusiness(query: string) {
	// 	var result: any;
	// 	var validate: any;
	// 	if (query) {
	// 		validate = this.company.map(({ name }) =>
	// 			name.toLowerCase().includes(query.toString())
	// 		);
	// 	}
	// 	if (query === undefined || !query) {
	// 		return this.copyCompany;
	// 	}
	// 	if (validate.map(val => val)) {
	// 		return (result = this.company.filter(({ name }) =>
	// 			name.toLowerCase().includes(query.toString())
	// 		));
	// 	} else {
	// 		return (result = []);
	// 	}
	// }

	editProjectBtn() {
		let dataProject = {
			name: this.project.name,
			description: this.project.description,
			company: this.project.company,
			businessName: this.project.businessName,
			serviceName: this.project.serviceName,
			client: this.project.client,
			status: this.project.status,
			resources: this.project.resources
		};

		this._conexion
			.globalPut(`/api/projects/${this.projectIdtoEdit}`, dataProject)
			.subscribe((res: any) => {
				console.log(res);
			});
	}

	createProject() {
		//console.log(this.tableProject);
		//console.log(this.company.bussinesLine);
		let dataProject = {
			name: this.project.name,
			description: this.project.description,
			company: this.project.company,
			businessName: this.project.businessName,
			serviceName: this.project.serviceName,
			client: this.project.client,
			status: this.project.status,
			resources: this.project.resources
		};

		// console.log(dataProject);
		//console.log("company", this.project.company);
		// console.log("businessLine", this.businessName);
		// console.log("service", this.serviceName);

		this._conexion
			.globalPost(dataProject, "/api/projects/createProject")
			.subscribe(res => {
				console.log(res);
				this.successMessage();
			});
	}


	successMessage() {
		Swal.fire("Bien hecho!", "Se creo el proyecto!", "success");
		this._router.navigate(["projects"]);
	}

	async editProject() {
		this.project = new Project("", "", "", {}, "", "", {}, []);
		await this._route.params.forEach(params => {
			if (params.id) {
				this.isEdit = true;
				console.log("parametros id", params.id);

				this.projectIdtoEdit = params.id.toString();
				this._conexion
					.globalGet("/api/projects/", this.projectIdtoEdit)
					.subscribe((res: any) => {
						this.project = res.data;
						console.log(this.project);
					});
			}
		});
	}

	ngOnInit() {
		this.editProject();
		this.getCompanies();
		this.getClients();
		this.getUsers();
		this.getRoles();
	}
}
