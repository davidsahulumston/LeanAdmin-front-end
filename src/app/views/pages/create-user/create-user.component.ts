import { Component, OnInit } from "@angular/core";
import { FormControl, FormBuilder } from "@angular/forms";
import moment from "moment";
import { Router, ActivatedRoute } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { MatSnackBar } from "@angular/material";
import { ConexionService } from "../../services/conexion.service";
import { amazons3StorageService } from "../../services/aws-s3.service";
import { LeanUser } from "../../models/user";
import Swal from "sweetalert2";

export interface Rol {
	value: string;
}

@Component({
	selector: "kt-create-user",
	templateUrl: "./create-user.component.html",
	styleUrls: ["./create-user.component.scss"]
})
export class CreateUserComponent implements OnInit {
	constructor(
		private _router: Router,
		private _DomSanitizationService: DomSanitizer,
		private _snackBar: MatSnackBar,
		private _conexion: ConexionService,
		private s3Storage: amazons3StorageService,
		private _route: ActivatedRoute
	) {}

	permissionsTable = [
		{ value: "Administrador", viewValue: "Administrador" },
		{ value: "Lider", viewValue: "Lider" },
		{ value: "Colaborador", viewValue: "Colaborador" }
	];
	selectedPermission;
	salaryArray: any = [];
	updateDate: any = [];
	salary: number;
	selectedIndex = 0;
	fileData: File = null;
	fileCURP: File = null;
	fileBirth: File = null;
	fileRFC: File = null;
	fileNSS: File = null;
	previewUrl: any = null;
	fileUploadProgress: string;
	imageLogo: any;
	confirmStrength: string;
	passStrength: string;
	confirmPass: any;
	passwordVisible: string;
	confPassword: string;
	//forms
	userEmail: string;
	incorporationDate: any;
	userName: string;
	// userLastName: string;
	userCURP: string;
	userRFC: string;
	userDateBirth: any;
	userNSS: string;
	userPhone: string;
	userAdress: string;
	selectedRol: any;
	lead: any;
	role: any;
	position: any;
	selectedRole: any;
	selectedCollaborators: any;
	publicURl: any;
	CURPUrl: any[];
	RFCUrl: any;
	birthUrl: any;
	NSSUrl: any;
	porcentaje: any;
	URLfileCURP: any[];
	URLfileRFC: any;
	URLfileBirth: any;
	URLfileNSS: any;
	userID: any;
	user: LeanUser;
	users: any;
	copyUsers: any;
	roles: any;
	copyRoles: any;
	positions: any;
	copyPostions: any;
	arrayImages: any = [];
	leads = new FormControl();
	collaborators = new FormControl();
	fileRFCTwo: any;
	userIdToEdit: any;
	isEdit: boolean = false;
	copyCompanies: any;
	companies: any;

	onStrengthChanged(strength: number) {
		console.log("password strength = ", strength);
		if (strength <= 40) {
			this.passStrength = "debil";
		} else if (strength > 50 && strength <= 60) {
			this.passStrength = "medio fuerte";
		} else if (strength > 60) {
			this.passStrength = "fuerte 🥚";
		}
		console.log(this.passwordVisible);
	}

	onStrengthConfirmationChanged(strengthConfirm: number) {
		console.log("password strength = ", strengthConfirm);
		if (strengthConfirm <= 40) {
			this.confirmStrength = "debil";
		} else if (strengthConfirm > 50 && strengthConfirm <= 60) {
			this.confirmStrength = "medio fuerte";
		} else if (strengthConfirm > 60) {
			this.confirmStrength = "fuerte 🥚";
		}
		console.log(this.confPassword);
		if (this.passwordVisible !== this.confPassword) {
			this._snackBar.open("Las contraseñas no coinciden", "😢");
		} else {
			this._snackBar.open("Las contraseñas coinciden", "🙂", {
				duration: 2000
			});
		}
	}

	selectTab(index: number): void {
		this.selectedIndex = index;
	}

	updateSalary() {
		console.log(this.user.salary);
		this.salary
			? this.user.salary.push({
					salary: this.salary,
					date: moment().format("YYYY-MM-DD")
			  })
			: console.log("error");
	}

	async fileProgress(fileInput: any) {
		this.fileData = <File>fileInput.target.files[0];
		if (this.fileData.type.includes("pdf" || "mp4" || "gif" || "html")) {
			console.log("🎞");
			this.fileData = null;
		}
		this.previewUrl = await this.getImage(this.fileData);
	}

	async file(fileInput: any) {
		this.fileData = <File>fileInput.target.files[0];
		if (this.fileData.type.includes("pdf" || "mp4" || "gif" || "html")) {
			this.fileData = null;
		}
		this.previewUrl = await this.getImage(this.fileData);
		//console.log("previewURL", this.previewUrl);
		//console.log("fileData", this.fileData);
	}

	fileforCurp(fileInput: any) {
		console.log(fileInput);
		this.fileCURP = <File>fileInput.target.files[0];
		console.log(this.fileCURP);
		if (!this.fileCURP.type.includes("pdf")) {
			console.log("CURP", this.fileCURP);
			this._snackBar.open("error solo pdfs 🌋", "Aceptar");
			this.fileCURP = null;
		}
	}

	fileforDateBirth(fileInput: any) {
		this.fileBirth = <File>fileInput.target.files[0];
		if (!this.fileBirth.type.includes("pdf")) {
			console.log("CURP", this.fileBirth);
			this._snackBar.open("error solo pdfs 🌋", "Aceptar");
			this.fileBirth = null;
		}
	}
	fileforRFC(fileInput: any) {
		//console.log(fileInput)
		this.fileRFC = <File>fileInput.target.files[0];
		// console.log(this.fileRFC);
		if (!this.fileRFC.type.includes("pdf")) {
			console.log("RFC", this.fileRFC);
			this._snackBar.open("error solo pdfs 🌋", "Aceptar");
			this.fileRFC = null;
		}
	}
	fileforNSS(fileInput: any) {
		this.fileNSS = <File>fileInput.target.files[0];
		if (!this.fileNSS.type.includes("pdf")) {
			console.log("NSS", this.fileNSS);
			this._snackBar.open("error solo pdfs 🌋", "Aceptar");
			this.fileNSS = null;
		}
	}

	deleteFile(data) {
		// console.log(data);
		if (data.toString() === "RFC") {
			this.fileRFC = null;
		} else if (data.toString() === "CURP") {
			this.fileCURP = null;
		} else if (data.toString() === "BIRTH") {
			this.fileBirth = null;
		} else if (data.toString() === "NSS") {
			this.fileNSS = null;
		}
		this.fileData = null;
	}

	goBack() {
		this._router.navigate(["users"]);
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
		// console.log(fileImage);
		if (this.fileData) {
			return new Promise((res, reject) => {
				const reader = new FileReader();
				reader.readAsDataURL(fileImage);
				reader.onload = () => res(reader.result);
				reader.onerror = error => reject(error);
			});
		} else {
			this._snackBar.open("error solo imagenes", "Aceptar");
		}
	}

	searchLead(query: string) {
		// console.log('query', query)
		this.users;
		let result = this.selectLead(query.toLowerCase());
		this.users = result;
	}

	selectLead(query: string) {
		var result: any;
		var validate: any;

		if (query) {
			validate = this.users.map(({ personalData: { name } }) =>
				name.toLowerCase().includes(query.toString())
			);
		}
		if (query === undefined || !query) {
			// console.log('🥞')
			// this.getUsers()
			return this.copyUsers;
		}

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
		// console.log(validate);
		if (validate.map(val => val)) {
			console.log(
				this.roles.filter(({ name }) =>
					name.toLowerCase().includes(query.toString())
				)
			);
			return (result = this.roles.filter(({ name }) =>
				name.toLowerCase().includes(query.toString())
			));
		} else {
			return (result = []);
		}
	}

	searchPosition(query: string) {
		let result = this.selectPosition(query.toLowerCase());
		this.positions = result;
	}

	selectPosition(query: string) {
		var result: any;
		var validate: any;
		if (query) {
			validate = this.positions.map(({ name }) =>
				name.toLowerCase().includes(query.toString())
			);
		}
		if (query === undefined || !query) {
			return this.copyPostions;
		}
		if (validate.map(val => val)) {
			result = this.positions.filter(({ name }) =>
				name.toLowerCase().includes(query.toString())
			);
			return result;
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
			result = this.companies.filter(({ name }) =>
				name.toLowerCase().includes(query.toString())
			);
			return result;
		} else {
			return (result = []);
		}
	}

	createUser() {
		let userData = {
			photo: this.publicURl,
			userName: this.user.userName,
			password: this.user.password,
			incorporationDate: this.user.incorporationDate,
			permissions: this.user.permissions,
			role: this.user.role,
			personalData: {
				name: this.user.personalData.name,
				lastName: this.user.personalData.lastName,
				phone: this.user.personalData.phone,
				email: this.user.personalData.email,
				address: this.user.personalData.address,
				documents: []
			},
			positionData: {
				position: this.user.positionData.position,
				company: this.user.positionData.company,
				role: this.user.positionData.role,
				lead: this.user.positionData.lead,
				collaborators: this.user.positionData.collaborators
			},
			salary: this.user.salary
		};

		function postUser(add, upload) {
			new Promise((resolve, reject) => {
				resolve(add);
			}).then(() => {
				upload;
			});
			// .then(() => {
			// 	let wait = new Promise((resolve, reject) => {
			// 		setTimeout(function() {
			// 			resolve(ruta);
			// 		}, 2000);
			// 	});

			// 	wait.then(successMessage => {
			// 		console.log(successMessage);
			// 	});
			// });
		}

		postUser(
			this.addUser(userData),
			this.uploadAmazon()
			//this.successMessage()
		);

		// this.addUser(userData);

		// console.log(this.fileData);
		// console.log(this.userEmail);
		// console.log(this.incorporationDate);
		// console.log(this.passwordVisible);
		// console.log(this.userLastName);

		// User personal data
		// console.log(this.userName);
		// console.log(this.userLastName);
		// console.log(this.userEmail);
		// console.log(this.userCURP);
		// console.log(this.fileCURP);
		// console.log(this.userDateBirth);
		// console.log(this.salary);

		// User Rol
		// console.log(this.selectedRol);
		// console.log("rol", this.role);
		// console.log("lead", this.lead);
		// console.log(this.selectedCollaborators);
	}

	editUserBtn() {
		this.dataEditUser();
	}

	dataEditUser() {
		let userData = {
			photo: this.publicURl,
			userName: this.user.userName,
			password: this.user.password,
			incorporationDate: this.user.incorporationDate,
			permissions: this.user.permissions,
			role: this.user.role,
			personalData: {
				name: this.user.personalData.name,
				lastName: this.user.personalData.lastName,
				phone: this.user.personalData.phone,
				email: this.user.personalData.email,
				address: this.user.personalData.address,
				documents: []
			},
			positionData: {
				position: this.user.positionData.position,
				company: this.user.positionData.company,
				role: this.user.positionData.role,
				lead: this.user.positionData.lead,
				collaborators: this.user.positionData.collaborators
			},
			salary: this.user.salary
		};

		function putUser(add, upload) {
			new Promise((resolve, reject) => {
				resolve(add);
			}).then(() => {
				upload;
			});
			// .then(() => {
			// 	let wait = new Promise((resolve, reject) => {
			// 		setTimeout(function() {
			// 			resolve(ruta);
			// 		}, 2000);
			// 	});

			// 	wait.then(successMessage => {
			// 		console.log(successMessage);
			// 	});
			// });
		}

		putUser(
			this.editUser(userData),
			this.putImageAmazon()
			// this.successMessage()
		);

		// this.addUser(userData);

		// console.log(this.fileData);
		// console.log(this.userEmail);
		// console.log(this.incorporationDate);
		// console.log(this.passwordVisible);
		// console.log(this.userLastName);

		// User personal data
		// console.log(this.userName);
		// console.log(this.userLastName);
		// console.log(this.userEmail);
		// console.log(this.userCURP);
		// console.log(this.fileCURP);
		// console.log(this.userDateBirth);
		// console.log(this.salary);

		// User Rol
		// console.log(this.selectedRol);
		// console.log("rol", this.role);
		// console.log("lead", this.lead);
		// console.log(this.selectedCollaborators);
	}

	editUser(userData) {
		this._conexion
			.globalPut(
				`/api/leanusers/${this.userIdToEdit}/append/personalData.documents`,
				userData
			)
			.subscribe((res: any) => {
				console.log(res);
			});
	}

	public putImageAmazon() {
		let profilePicture = this.fileData;
		const paramsProfile = {
			Bucket: "leandev",
			Key: this.userName + this.fileData.name,
			Body: this.fileData,
			ACL: "public-read",
			ContentType: profilePicture.type
		};

		let CURP = this.fileCURP;

		const paramsCURP = {
			Bucket: "leandev",
			Key: this.userName + CURP.name,
			Body: CURP,
			ACL: "public-read",
			ContentType: CURP.type
		};

		let RFC = this.fileRFC;
		const paramsRFC = {
			Bucket: "leandev",
			Key: this.userName + RFC.name,
			Body: RFC,
			ACL: "public-read",
			ContentType: RFC.type
		};

		let birth = this.fileBirth;

		const paramsBirth = {
			Bucket: "leandev",
			Key: this.userName + birth.name,
			Body: birth,
			ACL: "public-read",
			ContentType: birth.type
		};

		let NSS = this.fileNSS;

		const paramsNSS = {
			Bucket: "leandev",
			Key: this.userName + NSS.name,
			Body: NSS,
			ACL: "public-read",
			ContentType: NSS.type
		};

		this.s3Storage.s3().upload(paramsProfile, (error, data) => {
			if (error) {
				console.log("There was an error uploading your file: ", error);
				return false;
			} else {
				if (data) {
					console.log("profileImage", data);
					let update = {
						personalData: {
							documents: [
								{
									URLfileProfileImage: data.Location,
									name: data.key
								}
							]
						}
					};

					console.log("URL prof Editable 💕");
					let promise = new Promise((resolve, reject) => {
						setTimeout(() => {
							resolve(
								this._conexion
									.globalPut(
										`/api/leanusers/${this.userIdToEdit}/append/personalData.documents`,
										update
									)
									.subscribe(res => {
										console.log(res);
									})
							);
						}, 2000);
					});

					promise.then(upload => {
						return upload;
					});
				}
				console.log("Successfully uploaded image", data);
				return true;
			}
		});

		this.s3Storage.s3().upload(paramsCURP, (error, data) => {
			if (error) {
				console.log("There was an error uploading your file: ", error);
				return false;
			} else {
				if (data) {
					console.log("curp", data);
					let update = {
						update: {
							URLfileCURP: data.Location,
							curp: this.user.personalData.documents[0].curp
						}
					};
					this._conexion
						.globalPut(
							`/api/leanusers/${this.userIdToEdit}/append/personalData.documents`,
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

		this.s3Storage.s3().upload(paramsRFC, (error, data) => {
			if (error) {
				console.log("There was an error uploading your file: ", error);
				return false;
			} else {
				if (data) {
					console.log("url", data);
					let update = {
						personalData: {
							documents: {
								URLfileRFC: data.Location,
								rfc: this.user.personalData.documents[0].rfc
							}
						}
					};
					this._conexion
						.globalPut(
							`/api/leanusers/${this.userIdToEdit}/append/personalData.documents`,
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

		this.s3Storage.s3().upload(paramsBirth, (error, data) => {
			if (error) {
				console.log("There was an error uploading your file: ", error);
				return false;
			} else {
				if (data) {
					console.log("nacimietno", data);

					let update = {
						personalData: {
							documents: {
								URLfileBirth: data.Location,
								birthDate: this.user.personalData.documents[0]
									.birthDate
							}
						}
					};
					this._conexion
						.globalPut(
							`/api/leanusers/${this.userIdToEdit}/append/personalData.documents`,
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

		this.s3Storage.s3().upload(paramsNSS, (error, data) => {
			if (error) {
				console.log("There was an error uploading your file: ", error);
				return false;
			} else {
				if (data) {
					console.log("nss", data);
					let update = {
						personalData: {
							documents: {
								URLfileNSS: data.Location,
								nss: this.user.personalData.documents[0].nss
							}
						}
					};
					this._conexion
						.globalPut(
							`/api/leanusers/${this.userIdToEdit}/append/personalData.documents`,
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
	}

	public uploadAmazon() {
		let profilePicture = this.fileData;
		let CURP = this.fileCURP;
		let RFC = this.fileRFC;
		let birth = this.fileBirth;
		let NSS = this.fileNSS;

		if (
			profilePicture === null ||
			CURP === null ||
			RFC === null ||
			birth === null ||
			NSS === null
		) {
			//this.errorMessage();

		} else {
			const paramsProfile = {
				Bucket: "leandev",
				Key: this.fileData.name,
				Body: this.fileData,
				ACL: "public-read",
				ContentType: profilePicture.type
			};

			const paramsCURP = {
				Bucket: "leandev",
				Key: CURP.name,
				Body: CURP,
				ACL: "public-read",
				ContentType: CURP.type
			};

			const paramsRFC = {
				Bucket: "leandev",
				Key: RFC.name,
				Body: RFC,
				ACL: "public-read",
				ContentType: RFC.type
			};
			const paramsBirth = {
				Bucket: "leandev",
				Key: birth.name,
				Body: birth,
				ACL: "public-read",
				ContentType: birth.type
			};
			const paramsNSS = {
				Bucket: "leandev",
				Key: NSS.name,
				Body: NSS,
				ACL: "public-read",
				ContentType: NSS.type
			};

			this.s3Storage.s3().upload(paramsProfile, (error, data) => {
				if (error) {
					console.log(
						"There was an error uploading your file: ",
						error
					);
					return false;
				} else {
					if (data) {
						console.log("profileImage", data);
						let update = {
							update: {
								URLfileProfileImage: data.Location,
								name: data.key
							}
						};

						console.log(
							"URL prof 💕",
							update.update.URLfileProfileImage
						);
						let promise = new Promise((resolve, reject) => {
							console.log("🤔", this.userID.data.insertedId);
							setTimeout(() => {
								resolve(
									this._conexion
										.globalAppend(
											`/api/leanusers/${this.userID.data.insertedId}/append/personalData.documents`,
											update
										)
										.subscribe(res => {
											console.log(res);
										})
								);
							}, 2000);
						});

						promise.then(upload => {
							return upload;
						});
					}

					return true;
				}
			});

			this.s3Storage.s3().upload(paramsCURP, (error, data) => {
				if (error) {
					console.log(
						"There was an error uploading your file: ",
						error
					);
					return false;
				} else {
					if (data) {
						console.log("curp", data);
						let update = {
							update: {
								URLfileCURP: data.Location,
								curp: this.user.personalData.documents[0].curp
							}
						};
						this._conexion
							.globalAppend(
								`/api/leanusers/${this.userID.data.insertedId}/append/personalData.documents`,
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

			this.s3Storage.s3().upload(paramsRFC, (error, data) => {
				if (error) {
					console.log(
						"There was an error uploading your file: ",
						error
					);
					return false;
				} else {
					if (data) {
						console.log("url", data);
						let update = {
							update: {
								URLfileRFC: data.Location,
								rfc: this.user.personalData.documents[0].rfc
							}
						};
						this._conexion
							.globalAppend(
								`/api/leanusers/${this.userID.data.insertedId}/append/personalData.documents`,
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

			this.s3Storage.s3().upload(paramsBirth, (error, data) => {
				if (error) {
					console.log(
						"There was an error uploading your file: ",
						error
					);
					return false;
				} else {
					if (data) {
						console.log("nacimietno", data);

						let update = {
							update: {
								URLfileBirth: data.Location,
								birthDate: this.user.personalData.documents[0]
									.birthDate
							}
						};
						this._conexion
							.globalAppend(
								`/api/leanusers/${this.userID.data.insertedId}/append/personalData.documents`,
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

			this.s3Storage.s3().upload(paramsNSS, (error, data) => {
				if (error) {
					console.log(
						"There was an error uploading your file: ",
						error
					);
					return false;
				} else {
					if (data) {
						console.log("nss", data);
						let update = {
							update: {
								URLfileNSS: data.Location,
								nss: this.user.personalData.documents[0].nss
							}
						};
						this._conexion
							.globalAppend(
								`/api/leanusers/${this.userID.data.insertedId}/append/personalData.documents`,
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
		}
	}

	addUser(userData) {
		if (
			this.fileData === null ||
			this.fileCURP === null ||
			this.fileRFC === null ||
			this.fileBirth === null ||
			this.fileNSS === null
		) {
			this.errorMessage()
		} else {
			this._conexion
				.globalPost(userData, "/api/leanusers/createUser")
				.subscribe(res => {
					this.userID = res;
					console.log(res);
					// this._router.navigate(["/users"]);
				});

		}
	}

	successMessage() {
		Swal.fire("Bien hecho!", "El usuario se ha actualizado!", "success");
		this._router.navigate(["users"]);
	}

	errorMessage() {
		Swal.fire("Error!", "No pueden existir campos vacios!", "error");
		this._conexion
		.globalDelete("/api/leanusers/", this.userID.data.insertedId)
		.subscribe((res: any) => {
			console.log(res);
		});
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
		// console.log(this.selectedLead);
	}

	getRoles() {
		this._conexion.globalGet("/api/leanroles", "").subscribe(res => {
			this.roles = res.data;
			this.copyRoles = res.data;
		});
	}

	getPositions() {
		this._conexion.globalGet("/api/positions/", "").subscribe(res => {
			this.positions = res.data;
			this.copyPostions = res.data;
		});
	}

	getCompanies() {
		this._conexion.globalGet("/api/companies", "").subscribe(res => {
			this.companies = res.data;
			this.copyCompanies = res.data;
		});
	}

	async getEditUser() {
		this.user = new LeanUser(
			"",
			"",
			"",
			"",
			"",
			false,
			{ id: "", name: "", costHour: "" },
			{
				name: "",
				lastName: "",
				phone: Number(),
				email: "",
				address: "",
				documents: [
					{
						URLfileRFC: "",
						rfc: "",

						URLfileBirth: "",
						birthDate: "",

						URLfileCURP: "",
						curp: "",

						URLfileNSS: "",
						nss: "",

						URLfileProfileImage: "",
						name: ""
					}
				]
			},
			{
				position: { id: "", name: "" },
				role: { id: "", name: "", costHour: "" },
				lead: {},
				collaborators: {}
			},
			[]
		
		);

		await this._route.params.forEach(params => {
			//	this.editClientId = params.id
			if (params.id) {
				this.isEdit = true;
				console.log("parametros id", params.id);
				//console.log(this._route.snapshot.queryParams)
				this.userIdToEdit = params.id.toString();
				this._conexion
					.globalGet("/api/leanusers/", params.id.toString())
					.subscribe((res: any) => {
						//console.log(res)
						this.user = res.data;
						console.log(this.user);
						if (res.status === 200) {
							this.user = res.data[0];
						} else {
							console.log("error");
						}
					});
			}
		});
	}

	ngOnInit() {
		this.getEditUser();
		this.getUsers();
		this.getRoles();
		this.getCompanies();
		this.getPositions();
	}
}
