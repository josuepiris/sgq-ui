import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FieldsetModule } from 'primeng/fieldset';

import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';

import { LoginFormComponent } from './login-form/login-form.component';

import { AuthGuard } from './auth.guard';
import { LogoutService } from './logout.service';
import { SegurancaRoutingModule } from './seguranca-routing.module';
import { InterceptadorHttp } from './interceptador-http';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    FieldsetModule,
    InputTextModule,
    ButtonModule,

    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: [ 'localhost:8080', 'sgq.example.com:8080' ],
        blacklistedRoutes: [
          'http://localhost:8080/oauth/token',
          'http://sgq.example.com:8080/oauth/token',
        ]
      }
    }),

    SegurancaRoutingModule
  ],
  declarations: [LoginFormComponent],
  providers: [
    JwtHelperService,
    AuthGuard,
    LogoutService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptadorHttp,
      multi: true
    }
  ]
})
export class SegurancaModule { }
