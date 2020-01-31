import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { ConexionService } from "../../services/conexion.service";

@Component({
	selector: "kt-project-profile",
	templateUrl: "./project-profile.component.html",
	styleUrls: ["./project-profile.component.scss"]
})
export class ProjectProfileComponent implements OnInit {
	project: any = [];
	constructor(
		private _route: ActivatedRoute,
		private _conexion: ConexionService
	) {}

	async getProject() {
		await this._route.params.forEach(params => {
			console.log(params.id);
			  this._conexion
				.globalGet("/api/projects/", params.id.toString())
				.subscribe((res: any) => {
					this.project = res.data;
					console.log(this.project);
				});
		});
    //this.project.resources.map()
  }





	ngOnInit() {
    this.getProject()
  }
}
