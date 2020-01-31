import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from "@angular/router";
import { ConexionService } from "../../services/conexion.service";


@Component({
  selector: 'kt-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss']
})
export class CompanyProfileComponent implements OnInit {

  company: any = [];
  constructor(
    private _route: ActivatedRoute,
		private _conexion: ConexionService
  ) { }


    async getCompany() {
      await this._route.params.forEach(params => {
        console.log(params.id);
        this._conexion.globalGet("/api/companies/", params.id.toString()).subscribe((res: any) => {
          // console.log(res.data)
          this.company = res.data;
          console.log(this.company)
        })
      })
    }

  ngOnInit() {
    this.getCompany();
  }

}
