import { RouterModule, Routes } from '@angular/router';
import {
  AuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { HomeComponent } from './components/home/home.component';
import { CoursesPageComponent } from './pages/courses-page/courses-page.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['chat']);

export const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent,
    // canActivate: [AuthGuard],
    // data: { authGuardPipe: redirectLoggedInToHome },
  },
  {
    path: 'login',
    component: LoginPageComponent,
    // canActivate: [AuthGuard],
    // data: { authGuardPipe: redirectLoggedInToHome },
  },
  {
    path: 'chat',
    component: ChatPageComponent,
    // canActivate: [AuthGuard],
    // data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'home',
    component: HomeComponent,
    // canActivate: [AuthGuard],
    // data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'courses',
    component: CoursesPageComponent,
    // canActivate: [AuthGuard],
    // data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
];
