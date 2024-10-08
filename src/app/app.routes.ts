import { Routes } from '@angular/router';
import {
  AuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ChatPageComponent } from './pages/chat-page/chat-page.component';
import { HomeComponent } from './components/home/home.component';
import { CoursesPageComponent } from './pages/courses-page/courses-page.component';
import { CourseComponent } from './components/courses-list/course/course.component';
import { CreateCourseComponent } from './components/courses-list/create-course/create-course.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToCourses = () => redirectLoggedInTo(['courses']);

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectLoggedInToCourses },
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
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'view-course/:url',
    component: CourseComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'create-course',
    component: CreateCourseComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
