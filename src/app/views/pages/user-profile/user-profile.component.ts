import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { ConexionService } from "../../services/conexion.service";
@Component({
	selector: "kt-user-profile",
	templateUrl: "./user-profile.component.html",
	styleUrls: ["./user-profile.component.scss"]
})
export class UserProfileComponent implements OnInit {
	user: any = [];
	profileImage: any;

	constructor(
		private _route: ActivatedRoute,
		private _conexion: ConexionService
	) {}

	getProfileImage() {
		this.profileImage = this.user.personalData.documents.filter(
			({ URLfileProfileImage }) => URLfileProfileImage !== undefined
		);
	}

	async getUser() {
		await this._route.params.forEach(params => {
			console.log(params.id);
			this._conexion
				.globalGet("/api/leanusers/", params.id.toString())
				.subscribe((res: any) => {
					this.user = res.data;
					console.log(this.user);
					this.getProfileImage();
				});
		});
	}

	ngOnInit() {
		this.getUser();
	}
}
