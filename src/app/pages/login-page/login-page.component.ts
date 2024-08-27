import { AsyncPipe, PercentPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { LoginCredentials, LoginForm, SignInMessage, UserStatus } from 'src/app/common/interfaces';
import { FriendlyChatBaseComponent } from 'src/app/components/friendly-chat-base/friendly-chat-base.component';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    imports: [
        ReactiveFormsModule,
        AsyncPipe,
        PercentPipe,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
    ],
    styleUrls: ['./login-page.component.scss'],
    standalone: true,
})
export class LoginPageComponent extends FriendlyChatBaseComponent {

    email = new FormControl('', Validators.compose([Validators.required, Validators.email]));
    password = new FormControl('', Validators.required);

    userStatus = signal<UserStatus>('existing');
    readonly SignInMessage = SignInMessage;
    
    form = new FormGroup<LoginForm>({
        email: this.email,
        password: this.password,
    });

    updateUserStatus() {
        // console.log('lP uUS update user status. pre: ', this.userStatus())
        const newStatus = this.userStatus() === 'new' ? 'existing' : 'new'
        this.userStatus.set(newStatus);
        // console.log('lP uUS update user status. post: ', this.userStatus())
    }

    handleUserLogin() {
        const credentials: LoginCredentials = {
            email: this.form.controls['email'].value,
            password: this.form.controls['password'].value,
        };

        this.authService.handleUserLogin(credentials, this.userStatus())
    }
}
