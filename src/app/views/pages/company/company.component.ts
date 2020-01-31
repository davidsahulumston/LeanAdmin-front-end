import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { FormControl } from "@angular/forms";
import { ConexionService } from "../../services/conexion.service";
import Swal from 'sweetalert2';

@Component({
	selector: "kt-company",
	templateUrl: "./company.component.html",
	styleUrls: ["./company.component.scss"]
})
export class CompanyComponent implements OnInit {
	constructor(private _router: Router, private _conexion: ConexionService) {}

	p: number = 1;
	companiesArray = [];
	searchText: string;
	filteredOptions: Observable<string[]>;
	myControl = new FormControl();

	getCompanies() {
		this._conexion.globalGet("/api/companies/", "").subscribe(res => {
			console.log(res.data);
			this.companiesArray = res.data;
		});
	}

	createCompany() {
		console.log("ir a crear empresa");
		this._router.navigate(["/createCompany"]);
	}

	editCompany(i) {
		let id = this.companiesArray[i]._id;
		this._router.navigate([`/createCompany/${id}`])
	}

	deleteCompany(i) {
		let id = this.companiesArray[i]._id;
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
					.globalDelete("/api/companies/", id)
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

	companyProfile(i) {
		let id = this.companiesArray[i]._id;
		console.log(id);
		this._router.navigate([`/companyProfile/${id}`]);
	}

	ngOnInit() {
		this.getCompanies();
	}
}
