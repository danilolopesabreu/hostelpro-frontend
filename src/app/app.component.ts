import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  Renderer2, inject
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
    selector: 'app-root',
    imports: [RouterModule],
    providers: [],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit , OnInit{

  private auth = inject(AuthService);

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    /*this.auth.isAuthenticated$.subscribe({
      next: (isAutenticado) => {
        console.log(isAutenticado)
        if(!isAutenticado){
          this.auth.loginWithRedirect();
        } else {
          //redirecionar
        }
      },
      error: (err) => console.error('Erro', err)
    });*/
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const loader = this.renderer.selectRootElement('.loader');
      if (loader.style.display != 'none') {
        loader.style.display = 'none';
      }
    }
  }
}
