import { Component, OnInit, Inject, Input } from "@angular/core";
import { Router } from "@angular/router";
import {
	MatDialog,
	MatDialogRef,
	MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { Observable } from "rxjs";
import { FormControl } from "@angular/forms";
import { ConexionService } from "../../services/conexion.service";
import Swal from 'sweetalert2';
import moment from "moment";


@Component({
	selector: "kt-users",
	templateUrl: "./users.component.html",
	styleUrls: ["./users.component.scss"]
})
export class UsersComponent implements OnInit {
	position: string;
	rol: string;
	cost: number;
	startDate: any;
	endDate: any;
	usersArray = [];
	jobsArray = [];
	rolsArray = [];
	p: number = 1;
	filteredOptions: Observable<string[]>;
	myControl = new FormControl();
	searchText: string;
	arrayImages: any = [];
	actualSalary: any = [];
	dateInc: any;

	constructor(
		private _router: Router,
		public dialog: MatDialog,
		public _conexion: ConexionService
	) {}

	openDialog(): void {
		const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
			width: "550px",
			data: { name: this.position }
		});
		dialogRef.afterClosed().subscribe(result => {
			console.log("The dialog was closed");
			this.position = result;
		});
	}

	openDialogRol(): void {
		const dialogRef = this.dialog.open(DialogOverviewRol, {
			width: "550px",
			data: { rol: this.rol, cost: this.cost }
		});
		dialogRef.afterClosed().subscribe(result => {
			console.log("dialog was closed");
			this.rol && this.cost ? ([this.rol, this.cost] = result) : result;
		});
	}

	openDialogVacations(): void {
		const dialogRef = this.dialog.open(DialogOverviewVacations, {
			width: "550px",
			data: { startDate: this.startDate, endDate: this.endDate }
		});
		dialogRef.afterClosed().subscribe(result => {
			console.log("dialog was closed");
			this.startDate && this.endDate
				? ([this.startDate, this.endDate] = result)
				: result;
		});
	}

	getUsers() {
		this._conexion.globalGet("/api/leanusers", "").subscribe(res => {
			this.usersArray = res.data;
			console.log(this.usersArray);
			var userDocs: any = [];
			this.usersArray.map(({ personalData, incorporationDate }) => {
				//console.log("personal", personalData);
				userDocs.push({ personalData });
				// console.log("personal", userDocs);
				// this.actualSalary.push(
				// 	positionData.salary[positionData.salary.length - 1]
				// );
				this.dateInc = moment(incorporationDate).format("L")

				// console.log("position", this.actualSalary);
			});
			this.usersArray.map(({salary}) => {
				this.actualSalary.push(
					salary[salary.length - 1]
				);

				console.log("position", this.actualSalary);
			})
			userDocs.map(docs => {
				//console.log("docuemntso", docs.personalData.documents);
				docs.personalData.documents.forEach(element => {
					// console.log(element);
					if (element !== null) {
						if (element.URLfileProfileImage) {
							this.arrayImages.push(element.URLfileProfileImage);
						}
					}
				});
			});

			//console.log("url", this.arrayImages);
		});
	}

	getPositions() {
		this._conexion.globalGet("/api/positions", "").subscribe(res => {
			//console.log(res);
			this.jobsArray = res.data;
			//console.log(this.jobsArray);
			// this._router.navigate(["/users"]);
		});
	}

	getRoles() {
		this._conexion.globalGet("/api/leanroles", "").subscribe(res => {
			//console.log(res);
			this.rolsArray = res.data;
			//console.log(this.rolsArray);
		});
	}

	createUser() {
		this._router.navigate(["/createUser"]);
	}

	deleteElement(i) {
		this.rolsArray.splice(i);
	}

	deleteUser(i) {
		let id = this.usersArray[i]._id;
		Swal.fire({
			title: "¿Estas seguro de eliminar el elemento?",
			text: "No se pueden revertir los cambios",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, eliminar!"
		}).then(result => {
			if (result.value) {
				this._conexion
					.globalDelete("/api/leanusers/", id)
					.subscribe(res => {
						console.log(res);

						Swal.fire(
							"Borrado!",
							"Se elimino el elemento.",
							"success"
						);
					});
			}
		});
	}

	deletePosition(i) {
		console.log(i);
		let id = this.jobsArray[i]._id;
		console.log(id);
		Swal.fire({
			title: "¿Estas seguro de eliminar el elemento?",
			text: "No se pueden revertir los cambios",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, eliminar!"
		}).then(result => {
			if (result.value) {
				this._conexion
					.globalDelete("/api/positions/", id)
					.subscribe(res => {
						console.log(res);
						Swal.fire(
							"Borrado!",
							"Se elimino el elemento.",
							"success"
						);
					});
			}
		});

		// this.jobsArray.splice(i)
	}

	deleteRole(i) {
		let id = this.rolsArray[i]._id;
		console.log(id);
		Swal.fire({
			title: "¿Estas seguro de eliminar el elemento?",
			text: "No se pueden revertir los cambios",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, eliminar!"
		}).then(result => {
			if (result.value) {
				this._conexion
					.globalDelete("/api/leanroles/", id)
					.subscribe(res => {
						console.log(res);

						Swal.fire(
							"Borrado!",
							"Se elimino el elemento.",
							"success"
						);
					});
			}
		});
	}

	successMessage() {
		Swal.fire('Bien hecho ! 👩‍🦼', 'Se eliminó el elemento!', 'success');
            this._router.navigate(['users']);
	}


	userProfile(i) {
		let id = this.usersArray[i]._id;
		this._router.navigate([`/userProfile/${id}`]);
	}

	editUser(i) {
		let id = this.usersArray[i]._id;
		this._router.navigate([`/createUser/${id}`]);
	}

	ngOnInit() {
		//this.createDummyUsers();
		// this.createDummyJobs();
		//	this.createDummyRols();
		this.getUsers();
		this.getPositions();
		this.getRoles();
	}
}

@Component({
	selector: "dialog-overview",
	templateUrl: "dialog-overview.html"
})
export class DialogOverviewExampleDialog {
	constructor(
		public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
		@Inject(MAT_DIALOG_DATA) public data,
		private _conexion: ConexionService,
		private _router: Router
	) {}

	onNoClick(): void {
		this.dialogRef.close();
	}

	addPosition() {
		console.log(this.data);
		this._conexion
			.globalPost(this.data, "/api/positions/createPosition")
			.subscribe((response: any) => {
				// this._router.navigate(["/users"]);
				if (response.status === 200) {
					console.log("puesto creado");
				}
			});
		console.log("they push me 🎂");
		this.dialogRef.close();
	}
}

@Component({
	selector: "dialog-rol",
	templateUrl: "dialog-rol.html"
})
export class DialogOverviewRol {
	constructor(
		public dialogRef: MatDialogRef<DialogOverviewRol>,
		private _conexion: ConexionService,
		private _router: Router,
		@Inject(MAT_DIALOG_DATA) public data
	) {}

	onNoClick(): void {
		this.dialogRef.close();
	}

	addRol() {
		console.log(this.data);
		this._conexion
			.globalPost(this.data, "/api/leanroles/createRole")
			.subscribe(res => {
				console.log(res);
				// this._router.navigate(["/users"]);
			});
		console.log("they push me ✨");
		// this.rolsArray.push(this.data);
		this.dialogRef.close();
	}
}

@Component({
	selector: "dialog-vacations",
	templateUrl: "dialog-vacations.html"
})
export class DialogOverviewVacations {
	constructor(
		public dialogRef: MatDialogRef<DialogOverviewVacations>,
		@Inject(MAT_DIALOG_DATA) public data
	) {}

	onNoClick(): void {
		this.dialogRef.close();
	}

	addVacations() {
		console.log(this.data);
		console.log("they push me ✨");
		this.dialogRef.close();
	}
}
