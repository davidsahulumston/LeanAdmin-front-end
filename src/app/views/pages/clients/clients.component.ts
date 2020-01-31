import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { FormControl } from "@angular/forms";
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { ConexionService } from "../../services/conexion.service";

@Component({
	selector: "kt-clients",
	templateUrl: "./clients.component.html",
	styleUrls: ["./clients.component.scss"]
})
export class ClientsComponent implements OnInit {
	constructor(private _router: Router, private _conexion: ConexionService) {}
	clientsArray: any = [];
	searchText: string;
	filteredOptions: Observable<string[]>;
	myControl = new FormControl();
	logos: any = [];
	getClients() {
		this._conexion.globalGet("/api/clients", "").subscribe(res => {
			console.log(res);
			this.clientsArray = res.data;
			this.logos = this.clientsArray.map(({ logo }) =>
				logo.map(({ URLfileClientLogo }) => URLfileClientLogo)
			);

			//console.log('logos', this.logos)
		});
	}

	createClient() {
		console.log("ir a crear cliente");
		this._router.navigate(["/createClient"]);
	}

	deleteClient(i) {
		let id = this.clientsArray[i]._id;
		this._conexion.globalDelete("/api/clients/", id).subscribe(res => {
			console.log(res);
		});
	}

	editClient(i) {
		let id = this.clientsArray[i]._id;
		console.log(id);
		this._router.navigate([`/createClient/${id}`])
	}

	clientProfile(i) {
		let id = this.clientsArray[i]._id;
		console.log(id)
		this._router.navigate([`/clientProfile/${id}`]);
	}

	ngOnInit() {
		this.getClients();
	}
}
