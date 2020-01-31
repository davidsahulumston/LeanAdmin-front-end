import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { FormControl, FormGroup, FormBuilder } from "@angular/forms";
import { ConexionService } from "../../services/conexion.service";
import { FirebaseStorageService } from "../../services/firebase-storage.service";
import { amazons3StorageService } from "../../services/aws-s3.service";
import { Company } from "../../models/company";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
	selector: "kt-create-company",
	templateUrl: "./create-company.component.html",
	styleUrls: ["./create-company.component.scss"]
})
export class CreateCompanyComponent implements OnInit {
	constructor(
		private _DomSanitizationService: DomSanitizer,
		private _conexion: ConexionService,
		private s3Storage: amazons3StorageService,
		private _route: ActivatedRoute,
		private _router: Router
	) {}

	fileData: File = null;
	previewUrl: any = null;
	fileUploadProgress: string;
	selectedIndex = 0;
	imageLogo: any;
	// name: string;
	// businessName: string;
	// RFC: string;
	// phone: number;
	// email: string;
	// businessLine = [];
	businessLineName: string;
	selectedLeadBusinessLine: any;
	selectedBusinessLine: any;
	tableBusinessLine = [];
	//services = [];
	tableService = [];
	serviceName: string;
	users: any;
	copyUsers: any;
	companyID: any;
	company: Company;
	isEdit: boolean = false;
	companyIdToEdit: any;

	async fileProgress(fileInput: any) {
		this.fileData = <File>fileInput.target.files[0];
		this.previewUrl = await this.getImage(this.fileData);
	}

	selectTab(index: number): void {
		this.selectedIndex = index;
	}

	async file(fileInput: any) {
		this.fileData = <File>fileInput.target.files[0];
		this.previewUrl = await this.getImage(this.fileData);
		//console.log(this.previewUrl);
		//console.log(this.fileData);
	}

	getUsers() {
		this._conexion.globalGet("/api/leanusers", "").subscribe(res => {
			this.users = res.data;
			this.copyUsers = res.data;
		});
		// console.log(this.selectedLead);
	}

	getSafeUrl(image) {
		if (image) {
			return this._DomSanitizationService.bypassSecurityTrustResourceUrl(
				image
			);
		} else {
			null;
		}
	}

	getImage(fileImage) {
		//console.log(fileImage);
		return new Promise((res, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(fileImage);
			reader.onload = () => res(reader.result);
			reader.onerror = error => reject(error);
		});
	}

	public uploadAmazon() {
		let companyLogo = this.fileData;
		const contentType = companyLogo.type;
		const params = {
			Bucket: "leandev",
			Key: this.fileData.name,
			Body: this.fileData,
			ACL: "public-read",
			ContentType: contentType
		};
		if (contentType === "image/jpeg" || contentType === "image/png") {
			this.s3Storage.s3().upload(params, (error, data) => {
				if (error) {
					console.log(
						"There was an error uploading your file: ",
						error
					);
					return false;
				} else {
					if (data) {
						let update = {
							update: {
								URLCompanylogo: data.Location
							}
						};
						this._conexion
							.globalAppend(
								`/api/companies/${this.companyID.data.insertedId}/append/logo`,
								update
							)
							.subscribe(res => {
								console.log(res);
							});
					}
					console.log("Successfully uploaded file", data);
					return this.successMessage();
				}
			});

			this.s3Storage
				.s3()
				.upload(params)
				.on("httpUploadProgress", function(evt) {
					console.log(`${evt.loaded} of ${evt.total} bytes`);
				});
		} else {
			console.log("error solo imagenes");
		}
	}

	public putImageAmazon() {
		if (this.fileData !== null) {
			let companyLogo = this.fileData;
			const contentType = companyLogo.type;
			const params = {
				Bucket: "leandev",
				Key: this.fileData.name,
				Body: this.fileData,
				ACL: "public-read",
				ContentType: contentType
			};
			if (contentType === "image/jpeg" || contentType === "image/png") {
				this.s3Storage.s3().upload(params, (error, data) => {
					if (error) {
						console.log(
							"There was an error uploading your file: ",
							error
						);
						return false;
					} else {
						if (data) {
							let update = {
								logo: [
									{
										URLCompanylogo: data.Location
									}
								]
							};
							this._conexion
								.globalPut(
									`/api/companies/${this.companyIdToEdit}`,
									update
								)
								.subscribe(res => {
									console.log(res);
								});
						}
						console.log("Successfully uploaded file", data);
						return true;
					}
				});

				this.s3Storage
					.s3()
					.upload(params)
					.on("httpUploadProgress", function(evt) {
						console.log(`${evt.loaded} of ${evt.total} bytes`);
					});
			} else {
				console.log("error solo imagenes");
			}
		}
	}

	addCompany(companyData) {
		if (
			this.fileData === null ||
			!this.company.name ||
			!this.company.RFC ||
			!this.company.phone
		) {
			this.errorMessage();
		} else {
			this._conexion
				.globalPost(companyData, "/api/companies/createCompany")
				.subscribe(res => {
					this.companyID = res;
					console.log(res);
				});
		}
	}

	editValuesCompany(companyData) {
		this._conexion
			.globalPut(`/api/companies/${this.companyIdToEdit}`, companyData)
			.subscribe((res: any) => {
				console.log(res);
			});
	}

	addBusinessLine() {
		console.log(this.businessLineName);
		console.log(this.selectedLeadBusinessLine);
		console.log("line was add 🐱‍🚀");
		this.company.businessLine.push({
			name: this.businessLineName,
			lead: this.selectedLeadBusinessLine
		});
	}

	addService() {
		console.log(this.selectedBusinessLine);
		this.company.services.push({
			name: this.serviceName,
			line: this.selectedBusinessLine
		});
	}

	deleteBusinessLine(i) {
		this.company.businessLine.splice(i, 1);
	}

	deleteService(i) {
		this.company.services.splice(i, 1);
	}

	createCompanyBtn() {
		this.dataCreateCompany();
	}

	dataCreateCompany() {
		let dataCompany = {
			name: this.company.name,
			businessName: this.company.businessName,
			phone: this.company.phone,
			email: this.company.email,
			RFC: this.company.RFC,
			businessLine: this.company.businessLine,
			services: this.company.services
		};
		// let image = this.fileData;
		// console.log(this.fileData);
		// console.log(this.nameCompany);
		// console.log(this.);
		// console.log(this.phoneCompany);
		// console.log(this.emailCompany);
		// console.log(this.tableBusinessLine);
		// console.log(this.tableService);

		async function asyncCall(addCompany, addLogo) {
			await addCompany;
			await addLogo;
		}

		asyncCall(this.addCompany(dataCompany), this.uploadAmazon());

		//await this.uploadLogo()
	}

	editCompanyBtn() {
		this.dataEditCompany();
	}

	dataEditCompany() {
		let dataCompany = {
			name: this.company.name,
			businessName: this.company.businessName,
			phone: this.company.phone,
			email: this.company.email,
			RFC: this.company.RFC,
			businessLine: this.company.businessLine,
			services: this.company.services
		};
		// let image = this.fileData;
		// console.log(this.fileData);
		// console.log(this.nameCompany);
		// console.log(this.);
		// console.log(this.phoneCompany);
		// console.log(this.emailCompany);
		// console.log(this.tableBusinessLine);
		// console.log(this.tableService);

		async function asyncCall(editCompany, editLogo, message) {
			await editCompany;
			await editLogo;
			await message;
		}

		asyncCall(this.editValuesCompany(dataCompany), this.putImageAmazon(), this.successMessage());

		//await this.uploadLogo()
	}

	searchLead(query: string) {
		this.users;
		let result = this.select(query.toLowerCase());
		console.log(result);
		this.users = result;
	}

	select(query: string) {
		var result: any;
		var validate: any;
		console.log(query);

		if (query) {
			// console.log('🍙')
			validate = this.users.map(({ personalData: { name } }) =>
				name.toLowerCase().includes(query.toString())
			);
		}
		if (query === undefined || !query) {
			// console.log('🥞')
			// this.getUsers()
			return this.copyUsers;
		}
		// console.log(validate[0]);
		if (validate.map(val => val)) {
			console.log(
				this.users.filter(({ personalData: { name } }) =>
					name.toLowerCase().includes(query.toString())
				)
			);
			return (result = this.users.filter(({ personalData: { name } }) =>
				name.toLowerCase().includes(query.toString())
			));
		} else {
			return (result = []);
			//this.users;
		}
	}

	async editCompany() {
		this.company = new Company("", "", "", "", "", "", [], [], []);
		await this._route.params.forEach(params => {
			//	this.editClientId = params.id
			if (params.id) {
				this.isEdit = true;
				console.log("parametros id", params.id);
				//console.log(this._route.snapshot.queryParams)
				this.companyIdToEdit = params.id.toString();
				this._conexion
					.globalGet("/api/companies/", params.id.toString())
					.subscribe((res: any) => {
						//console.log(res)
						this.company = res.data;
						console.log(this.company);
						if (res.status === 200) {
							this.company = res.data[0];
						} else {
							console.log("error");
						}
					});
			}
		});
	}

	successMessage() {
		if(this.isEdit) {
			Swal.fire("Bien hecho!", "Se edito la empresa!", "success");
		this._router.navigate(["company"]);
		} else {
			Swal.fire("Bien hecho!", "Se creo la empresa!", "success");
			this._router.navigate(["company"]);
		}
	}

	errorMessage() {
		Swal.fire("Error!", "No pueden existir campos vacios!", "error");
	}

	ngOnInit() {
		this.editCompany();
		this.getUsers();
		// this.createDummyTableBusinessLine();
		// this.createDummyTableService();
	}
}
