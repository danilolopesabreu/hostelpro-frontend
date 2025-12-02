import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmar-email',
  imports: [],
  templateUrl: './confirmar-email.component.html',
  styleUrl: './confirmar-email.component.scss',
})
export class ConfirmarEmailComponent {

  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }

}
