import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [AsyncPipe],
})
export class HeaderComponent {
  authService = inject(AuthService);
  user$: Observable<User | null> = this.authService.user$;
}
