import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  standalone: true,
})
export class LoginPageComponent {
  authService = inject(AuthService);
  user$ = this.authService.user$;
}
