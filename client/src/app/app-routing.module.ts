import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { RegistrationComponent } from './registration/registration.component';
import { ProgramComponent } from './program/program.component';
import { ContactComponent } from './contact/contact.component';
import { RootComponent } from './root/root.component';
import { UsersComponent } from './users/users.component';
import { authGuard } from './_guards/auth.guard';
import { GenerateProgramComponent } from './generate-program/generate-program.component';
import { MailComponent } from './mail/mail.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  { path: 'registration', component: RegistrationComponent },
  { path: 'program', component: ProgramComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'root', component: RootComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      { path: 'users', component: UsersComponent, canActivate: [authGuard] },
      { path: 'generate-program', component: GenerateProgramComponent, canActivate: [authGuard] },
      { path: 'mail', component: MailComponent, canActivate: [authGuard] },

    ]
  },
  {path: 'errors', component: TestErrorsComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: 'server-error', component: ServerErrorComponent},
  {path: '**', component: NotFoundComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
