import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { ConexionService } from "../../services/conexion.service";

@Component({
	selector: "kt-client-profile",
	templateUrl: "./client-profile.component.html",
	styleUrls: ["./client-profile.component.scss"]
})
export class ClientProfileComponent implements OnInit {
	clients: any = [];
	id: any = []

	constructor(
		private _router: Router,
		private _route: ActivatedRoute,
		private _conexion: ConexionService
	) {}
	editClient() {
		console.log("editUser has clicked");
		this._router.navigate([`/createClient/${this.id}`])
	}
	ngOnInit() {
		this._route.params.forEach(params => {
	  console.log(params.id)
			this.id = params.id.toString();
			this._conexion
				.globalGet("/api/clients/", params.id.toString())
				.subscribe((res: any) => {
          //console.log(res)
          this.clients = res.data;
          console.log(this.clients)
					if (res.status === 200) {
						this.clients = res.data[0];
					} else {
						console.log("error");
					}
				});
		});
	}
}
