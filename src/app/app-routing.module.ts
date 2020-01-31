// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './views/theme/base/base.component';
import { ErrorPageComponent } from './views/theme/content/error-page/error-page.component';
// Auth
import { AuthGuard } from './core/auth';
import { HomeComponent } from './views/pages/home/home.component';
import { CompanyComponent } from './views/pages/company/company.component';
import { ProjectsComponent } from './views/pages/projects/projects.component';
import { ClientsComponent } from './views/pages/clients/clients.component';
import { UsersComponent } from './views/pages/users/users.component';
import { CreateCompanyComponent } from './views/pages/create-company/create-company.component';
import { CreateClientComponent } from './views/pages/create-client/create-client.component';
import { ClientProfileComponent } from './views/pages/client-profile/client-profile.component';
import { CreateProjectComponent } from './views/pages/create-project/create-project.component';
import { CreateUserComponent } from './views/pages/create-user/create-user.component';
import { UserProfileComponent } from './views/pages/user-profile/user-profile.component';
import { ProjectProfileComponent } from './views/pages/project-profile/project-profile.component';
import { CompanyProfileComponent } from './views/pages/company-profile/company-profile.component';

const routes: Routes = [
	{path: 'auth', loadChildren: () => import('app/views/pages/auth/auth.module').then(m => m.AuthModule)},

	{
		path: '',
		component: BaseComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'home',
				component: HomeComponent
			},
			{
				path: 'company',
				component: CompanyComponent
			},
			{
				path: 'projects',
				component: ProjectsComponent
			},
			{
				path: 'projectProfile/:id',
				component: ProjectProfileComponent
			},
			{
				path: 'clients',
				component: ClientsComponent
			},
			{
				path: 'createCompany',
				component: CreateCompanyComponent
			},
			{
				path: 'createCompany/:id',
				component: CreateCompanyComponent
			},
			{
				path: 'companyProfile/:id',
				component: CompanyProfileComponent
			},
			{
				path: 'createClient',
				component: CreateClientComponent
			},
			{
				path: 'createClient/:id',
				component: CreateClientComponent
			},
			{
				path: 'clientProfile/:id',
				component: ClientProfileComponent
			},
			{
				path: 'createProject',
				component: CreateProjectComponent
			},
			{
				path: 'createProject/:id',
				component: CreateProjectComponent
			},
			{
				path: 'userProfile/:id',
				component: UserProfileComponent
			},
			{
				path: 'createUser',
				component: CreateUserComponent
			},
			{
				path: 'createUser/:id',
				component: CreateUserComponent
			},
			{
				path: 'users',
				component: UsersComponent
			},
			{
				path: 'dashboard',
				loadChildren: () => import('app/views/pages/dashboard/dashboard.module').then(m => m.DashboardModule)
			},
			{
				path: 'mail',
				loadChildren: () => import('app/views/pages/apps/mail/mail.module').then(m => m.MailModule)
			},
			{
				path: 'ecommerce',
				loadChildren: () => import('app/views/pages/apps/e-commerce/e-commerce.module').then(m => m.ECommerceModule),
			},
			{
				path: 'user-management',
				loadChildren: () => import('app/views/pages/user-management/user-management.module').then(m => m.UserManagementModule)
			},
			{
				path: 'wizard',
				loadChildren: () => import('app/views/pages/wizard/wizard.module').then(m => m.WizardModule)
			},
			{
				path: 'builder',
				loadChildren: () => import('app/views/theme/content/builder/builder.module').then(m => m.BuilderModule)
			},
			{
				path: 'error/403',
				component: ErrorPageComponent,
				data: {
					'type': 'error-v6',
					'code': 403,
					'title': '403... Access forbidden',
					'desc': 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator'
				}
			},
			{path: 'error/:type', component: ErrorPageComponent},
			{path: '', redirectTo: 'home', pathMatch: 'full'},
			{path: '**', redirectTo: 'home', pathMatch: 'full'}
		]
	},

	{path: '**', redirectTo: 'error/403', pathMatch: 'full'},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes)
	],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
