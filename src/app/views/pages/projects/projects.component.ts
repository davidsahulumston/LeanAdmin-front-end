import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { FormControl } from "@angular/forms";
import { ConexionService } from "../../services/conexion.service";
import Swal from "sweetalert2";

@Component({
	selector: "kt-projects",
	templateUrl: "./projects.component.html",
	styleUrls: ["./projects.component.scss"]
})
export class ProjectsComponent implements OnInit {
	constructor(private _router: Router, private _conexion: ConexionService) {}

	projectsArray = [];
	searchText: string;
	filteredOptions: Observable<string[]>;
	myControl = new FormControl();

	createProject() {
		console.log("crear proyecto");
		this._router.navigate(["/createProject"]);
	}

	getProjects() {
		this._conexion.globalGet("/api/projects", "").subscribe(res => {
			this.projectsArray = res.data;
			console.log("proyectos", this.projectsArray);
		});
	}

	editProject(i) {
		let id = this.projectsArray[i]._id;
		this._router.navigate([`/createProject/${id}`]);
	}

	deleteProject(i) {
		let id = this.projectsArray[i]._id;
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
					.globalDelete("/api/projects/", id)
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

	projectProfile(i) {
		let id = this.projectsArray[i]._id;
		console.log(id);
		this._router.navigate([`/projectProfile/${id}`]);
	}

	ngOnInit() {
		this.getProjects();
		//this.createDummyProjects();
	}
}
