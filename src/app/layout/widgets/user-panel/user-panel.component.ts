import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { User } from '@core/models/interface';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { FeatherModule } from 'angular-feather';

@Component({
    selector: 'app-user-panel',
    templateUrl: './user-panel.component.html',
    styleUrls: ['./user-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [
        MatButtonModule,
        RouterLink,
        MatTooltipModule,
        MatIconModule,
        TranslateModule,
        FeatherModule,
    ]
})
export class UserPanelComponent implements OnInit {
  user!: any;
  url: any;

  private auth = inject(AuthService);

  constructor(private router: Router) {}

  ngOnInit(): void {
    //this.auth.user().subscribe((user) => (this.user = user));
    console.log('ngOnInit')
    this.auth.user$.subscribe({
      next: (user) => {
        this.user = user;
        console.log(user);
      },
      error: (err) => console.error('Erro', err)
    });

  }

  logout() {
    this.auth.logout({ 
      logoutParams: { 
        returnTo: window.location.origin 
      } 
    });
  }
  public onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.url = event.target?.result;
      };
    }
  }
}
