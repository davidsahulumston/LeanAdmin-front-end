import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
	providedIn: "root"
})
export class ConexionService {
	public url = `${environment.URL_SERVICE}`;

	constructor(private http: HttpClient, private _router: Router) {}

	globalGet(page: string, id: string): Observable<any> {
		if (id !== "") {
			const consult = this.url + page + id;
			console.log(consult);
			return this.http.get(consult);
		} else {
			const consult = this.url + page;
			return this.http.get(consult);
		}
	}

	globalPost(data: any, page: string) {
		const consult = this.url + page;
		return this.http.post(consult, data).pipe(
			map((res: Response) => {
				if (res) {
					return res;
				}
			})
		);
	}

	globalPut(page:string, data: any, ) {
		const consult = this.url + page;
		console.log(consult)
		//sconsole.log(consult);
		return this.http.put(consult, data).pipe(
		  map((res: Response) => {
			if (res) {
			  return res;
			}
		  })
		);
	  }

	globalAppend(page: string, data: any,) {
		const consult = this.url + page;
		return this.http.put(consult, data);
	}

	globalDelete(page: string, id: string) {
		const consult = this.url + page + id;
		return this.http.delete(consult).pipe(
			map((res: Response) => {
				if (res) {
					return res;
				}
			})
		);
	}
}
