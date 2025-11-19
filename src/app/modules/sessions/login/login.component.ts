import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, User as UserAuth0 } from '@auth0/auth0-angular';

import { AuthServiceLocal, TokenService } from '@core';
import { NgxRolesService } from 'ngx-permissions';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { LocalStorageService } from '@shared';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SettingsService } from '@core/services/settings.service';
import { CommonModule } from '@angular/common';
import { UsuarioService } from 'app/modules/admin/usuario/usuario.service';
import { User } from '@core/models/interface';
import { Usuario } from 'app/modules/admin/usuario/usuario.model';
import { BehaviorSubject, Observable, iif, merge, of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    TranslateModule,
    CommonModule
  ],
})
export class LoginComponent implements OnInit {
  isSubmitting = false;
  error = '';
  hide = true;
  options = this.settings.getOptions();
  themeStyle = '';
  activeLoginType: 'admin' | 'employee' = 'admin';

  loginForm = this.fb.nonNullable.group({
    username: ['admin', [Validators.required]],
    password: ['admin', [Validators.required]],
    rememberMe: [false],
  });

  private auth = inject(AuthService);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private localAuthService: AuthServiceLocal,
    private tokenService: TokenService,
    private rolesService: NgxRolesService,
    private store: LocalStorageService,
    private settings: SettingsService,
    private usuarioService: UsuarioService
  ) {
    this.themeStyle = this.options.theme;
  }

  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe({
      next: (isAutenticado) => {
        console.log(isAutenticado)
        if(!isAutenticado){
          this.auth.loginWithRedirect();
        } else {
          //redirecionar
          this.auth.user$.subscribe({
            next: (usuarioLogado) => {
                if(usuarioLogado){
                  this.usuarioService.consultarPorEmail(usuarioLogado?.email!).subscribe({
                    next: (usuarioCadastrado) => {
                      
                      this.store.set("usuarioLogado",usuarioLogado);
                     
                      if (usuarioCadastrado) {

                        this.store.set('currentUser', this.getUserFromUserAuthAndUserCadastrado(usuarioLogado, usuarioCadastrado));
                        this.store.set('roleNames', JSON.stringify([usuarioCadastrado.papel?.nome]));
                        console.log('Usuário encontrado:', usuarioCadastrado);
                        
                        this.store.set("usuarioCadastrado",usuarioCadastrado);

                        this.localAuthService.assignUser(new BehaviorSubject<User>(this.store.get('currentUser')));
                        this.localAuthService.menu();
                        this.router.navigate(['/vendas']);
                      } else {
                        console.log('Usuário não cadastrado');
                        //this.store.clear();
                        this.router.navigate(['/estabelecimento/cadastro']);
                      }
                    },
                    error: (err) => {
                      console.error('Erro na requisição', err);
                    }
                  });
              } else {
                this.router.navigate(['/auth/login']);     
              }
              
            }
          });

          
        }
      },
      error: (err) => console.error('Erro', err)
    });
  }

  private getUserFromUserAuthAndUserCadastrado(user:UserAuth0, usuario:Usuario): User {
    return {
      id: usuario.id,
      //username: "admin",
      //password: "admin",
      name: user.given_name,
      email: user.email,
      role: [
        { 
          name: usuario.papel?.nome,
          priority: 1
        }
      ],
      permissions: usuario.papel?.permissoes.map(p => p.nome),
      avatar: user.picture
    };
  }

  get username() {
    return this.loginForm.get('username')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe')!;
  }

  adminSet() {
    this.activeLoginType = 'admin';
    this.loginForm.get('username')?.setValue('admin');
    this.loginForm.get('password')?.setValue('admin');
  }
  employeeSet() {
    this.activeLoginType = 'employee';
    this.loginForm.get('username')?.setValue('employee');
    this.loginForm.get('password')?.setValue('employee');
  }
  login() {
    this.isSubmitting = true;
    /*this.auth.login(
      this.username.value,
      this.password.value,
      this.rememberMe.value
    );*/
  }
}
