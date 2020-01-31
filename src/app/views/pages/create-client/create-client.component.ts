import { Component, OnInit, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { MatSnackBar } from "@angular/material";
import { FirebaseStorageService } from "../../services/firebase-storage.service";
import { ConexionService } from "../../services/conexion.service";
import { amazons3StorageService } from "../../services/aws-s3.service";
import { Clients } from "../../models/clients";
import Swal from "sweetalert2";
@Component({
	selector: "kt-create-client",
	templateUrl: "./create-client.component.html",
	styleUrls: ["./create-client.component.scss"]
})
export class CreateClientComponent implements OnInit {
	constructor(
		private _router: Router,
		private _DomSanitizationService: DomSanitizer,
		private _snackBar: MatSnackBar,
		private _conexion: ConexionService,
		private firebaseStorage: FirebaseStorageService,
		private s3Storage: amazons3StorageService,
		private _route: ActivatedRoute
	) {}

	fileData: File = null;
	previewUrl: any = null;
	fileUploadProgress: string;
	selectedIndex = 0;
	clientName: string;
	businessName: string;
	RFC: string;
	phone: number;
	email: string;
	clientId: any;
	isEdit: boolean = false;
	clients: any = [];
	editClientId: any;
	client: Clients;
	clientIdToEdit: any;

	async fileProgress(fileInput: any) {
		this.fileData = <File>fileInput.target.files[0];
		if (this.fileData.type.includes("pdf" || "mp4" || "gif" || "html")) {
			//	console.log("🎞");
			this.fileData = null;
		}
		this.previewUrl = await this.getImage(this.fileData);
	}

	selectTab(index: number): void {
		this.selectedIndex = index;
	}

	async file(fileInput: any) {
		this.fileData = <File>fileInput.target.files[0];
		if (this.fileData.type.includes("pdf" || "mp4" || "gif" || "html")) {
			// console.log("🎞");
			this.fileData = null;
		}
		this.previewUrl = await this.getImage(this.fileData);
		//	console.log(this.previewUrl);
		//	console.log(this.fileData);
	}

	deleteFile() {
		this.fileData = null;
	}

	goBack() {
		this._router.navigate(["clients"]);
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
		console.log(fileImage);
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

	public uploadLogo() {
		let clientLogo = this.fileData;
		let logoReference = this.firebaseStorage.referenciaCloudStorage(
			clientLogo.name.toString()
		);
		let taskLogo = this.firebaseStorage.tareaCloudStorage(
			clientLogo.name.toString(),
			clientLogo
		);

		taskLogo.percentageChanges().subscribe(percentage => {
			if (Math.round(percentage) === 100) {
				let promise = new Promise((resolve, reject) => {
					setTimeout(() => {
						resolve(
							logoReference.getDownloadURL().subscribe(url => {
								console.log(url);
								let update = {
									update: {
										URLfileClientLogo: url
									}
								};
								this._conexion
									.globalAppend(
										`/api/clients/${this.clientId.data.insertedId}/append/logo`,
										update
									)
									.subscribe(res => {
										console.log(res);
									});
							})
						);
					}, 2000);
				});
				promise.then(upload => {
					upload;
				});
			}
		});
	}

	public uploadAmazon() {
		//console.log(typeof(this.fileData))
		if (this.fileData !== null) {
			console.log("😒");
			let clientLogo = this.fileData;
			const contentType = clientLogo.type;
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
									URLfileClientLogo: data.Location
								}
							};
							this._conexion
								.globalAppend(
									`/api/clients/${this.clientId.data.insertedId}/append/logo`,
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
		} else {
			console.log("👵");
		}
	}

	putImageAmazon() {
		let clientLogo = this.fileData;
		const contentType = clientLogo.type;
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
									URLfileClientLogo: data.Location
								}
							]
						};
						this._conexion
							.globalPut(
								`/api/clients/${this.clientIdToEdit}`,
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

	addClient(clientData) {
		if (
			this.fileData === null ||
			!this.client.name ||
			!this.client.RFC ||
			!this.client.phone ||
			!this.client.email
		) {
			this.errorMessage();
		} else {
			this._conexion
				.globalPost(clientData, "/api/clients/createClient")
				.subscribe(res => {
					this.clientId = res;
					console.log(res);
				});
		}
	}

	editValClient(clientData) {
		this._conexion
			.globalPut(`/api/clients/${this.clientIdToEdit}`, clientData)
			.subscribe((response: any) => {
				console.log(response);
			});
	}

	createClient() {
		// this._router.navigate(['/createClient'])

		let dataClient = {
			name: this.clients.name,
			businessName: this.clients.businessName,
			phone: this.clients.phone,
			RFC: this.clients.RFC,
			email: this.clients.email
		};

		// console.log("create client");
		// console.log(this.fileData);
		// console.log(this.clientName);
		// console.log(this.businessName);
		// console.log(this.RFC);
		// console.log(this.phone);
		// console.log(this.email);

		async function asyncCall(addClient, uploadAmazon) {
			await addClient;
			//await addLogo;
			await uploadAmazon;
		}

		asyncCall(
			this.addClient(dataClient),
			//this.uploadLogo(),
			this.uploadAmazon()
		);
	}

	changeClient() {
		let dataClient = {
			name: this.clients.name,
			businessName: this.clients.businessName,
			phone: this.clients.phone,
			RFC: this.clients.RFC,
			email: this.clients.email
		};

		async function asyncCall(changeClt, putImageAmazon) {
			await changeClt;
			//await addLogo;
			await putImageAmazon;
		}

		asyncCall(
			this.editValClient(dataClient),
			//this.uploadLogo(),
			this.putImageAmazon()
		);
	}

	async editClient() {
		this.clients = new Clients("", "", "", "", "", "", []);
		await this._route.params.forEach(params => {
			//	this.editClientId = params.id
			if (params.id) {
				this.isEdit = true;
				console.log("parametros id", params.id);
				//console.log(this._route.snapshot.queryParams)
				this.clientIdToEdit = params.id.toString();
				this._conexion
					.globalGet("/api/clients/", params.id.toString())
					.subscribe((res: any) => {
						//console.log(res)
						this.clients = res.data;
						console.log(this.clients);
						if (res.status === 200) {
							this.clients = res.data[0];
						} else {
							console.log("error");
						}
					});
			}
		});
	}

	successMessage() {
		Swal.fire("Bien hecho!", "Se creo la empresa!", "success");
		this._router.navigate(["client"]);
	}

	errorMessage() {
		Swal.fire("Error!", "No pueden existir campos vacios!", "error");
	}

	ngOnInit() {
		this.editClient();
	}
}
