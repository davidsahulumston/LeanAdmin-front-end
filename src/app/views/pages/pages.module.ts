// Angular
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
// Partials
import { PartialsModule } from "../partials/partials.module";
// Pages
import { CoreModule } from "../../core/core.module";
import { MailModule } from "./apps/mail/mail.module";
import { HomeComponent } from "./home/home.component";
import { CompanyComponent } from "./company/company.component";
import { ClientsComponent } from "./clients/clients.component";
import { ProjectsComponent } from "./projects/projects.component";
import { UsersComponent } from "./users/users.component";
import {
	MatTableModule,
	MatSelectModule,
	MatCardModule,
	MatInputModule,
	MatSlideToggleModule,
	MatAutocompleteModule,
	MatIconModule,
	MatDialogModule,
	MatDatepickerModule,
	MatFormFieldModule,
	MatDividerModule,
	MatProgressSpinnerModule,
	
} from "@angular/material";
import { MatPaginatorModule } from "@angular/material";
import { CreateCompanyComponent } from "./create-company/create-company.component";
import { MatTabsModule } from "@angular/material";
import { CreateClientComponent } from "./create-client/create-client.component";
import { ClientProfileComponent } from "./client-profile/client-profile.component";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CreateProjectComponent } from "./create-project/create-project.component";
import { BrowserModule } from "@angular/platform-browser";
import { CreateUserComponent } from "./create-user/create-user.component";
import { MatPasswordStrengthModule } from "@angular-material-extensions/password-strength";
import {
	DialogOverviewExampleDialog,
	DialogOverviewRol,
	DialogOverviewVacations
} from "./users/users.component";
import { MaterialFileInputModule } from "ngx-material-file-input";
import { NgxPaginationModule } from "ngx-pagination";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { GrdFilterPipe } from "../pages/pipes/grd-filter.pipe";
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../../../environments/environment';
import { ProjectProfileComponent } from './project-profile/project-profile.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';


@NgModule({
	declarations: [
		HomeComponent,
		CompanyComponent,
		ClientsComponent,
		ProjectsComponent,
		UsersComponent,
		CreateCompanyComponent,
		CreateClientComponent,
		ClientProfileComponent,
		CreateProjectComponent,
		CreateUserComponent,
		DialogOverviewExampleDialog,
		DialogOverviewRol,
		DialogOverviewVacations,
		UserProfileComponent,
		GrdFilterPipe,
		ProjectProfileComponent,
		CompanyProfileComponent, 
	],
	entryComponents: [
		DialogOverviewExampleDialog,
		DialogOverviewRol,
		DialogOverviewVacations
	],
	exports: [
		DialogOverviewExampleDialog,
		DialogOverviewRol,
		DialogOverviewVacations
	],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		CoreModule,
		PartialsModule,
		MailModule,
		MatTableModule,
		MatPaginatorModule,
		MatTabsModule,
		MatSelectModule,
		MatCardModule,
		MatInputModule,
		MatProgressSpinnerModule,
		MatButtonToggleModule,
		BrowserAnimationsModule,
		MatSlideToggleModule,
		BrowserModule,
		ReactiveFormsModule,
		MatAutocompleteModule,
		MatIconModule,
		MatPasswordStrengthModule.forRoot(),
		MatDialogModule,
		MatDatepickerModule,
		MaterialFileInputModule,
		NgxPaginationModule,
		MatDividerModule,
		MatFormFieldModule,
		AngularFireModule.initializeApp(environment.firebase),
    	AngularFireStorageModule
	],
	providers: []
})
export class PagesModule {}
