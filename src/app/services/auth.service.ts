import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LoginCredentials, RbFirebaseAuthError, RbFirebaseAuthErrorResponse, UserStatus } from '../common/interfaces';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    router: Router = inject(Router);

    auth: Auth = inject(Auth);
    user$ = user(this.auth);
    private provider = new GoogleAuthProvider();

    constructor() {
        // this.user$.pipe().subscribe(user => {
        //     console.log('aSvc ctor user sub: ', user);
        // });
    }

    login() {
        signInWithPopup(this.auth, this.provider).then((result) => {
            // console.log('aSvc l login result: ', result);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            // console.log('aSvc l credential: ', credential);
            this.router.navigate(['/courses']);
            return credential;
        })
    }

    logout() {
        signOut(this.auth).then(() => {
            this.router.navigate(['/', 'login'])
            // console.log('signed out');
        }).catch((error) => {
            console.log('sign out error: ' + error);
        })
    }

    async handleUserLogin(credentials: LoginCredentials, userStatus: UserStatus) {
        console.log('aSvc sIWEAP em/pw creds: ', credentials);
        if (userStatus === 'new') {
            try {
                const userCredential = await createUserWithEmailAndPassword(this.auth, credentials.email, credentials.password);
                console.log('aSvc sIWEAP user/credential: ', userCredential.user, userCredential);
    
                this.router.navigate(['/courses']);
            }
            catch(error: any) {
                // const err: RbFirebaseAuthError = {...error};
                console.log('aSvc sIWEAP create user error: ', error);
                // console.log('aSvc sIWEAP err: ', err);
                // console.log('aSvc sIWEAP code: ', err.code);
                // console.log('aSvc sIWEAP message: ', err.message);
                // console.log('aSvc sIWEAP errors: ', err.errors);
            }
        } else {
            try {
                const userCredential = await signInWithEmailAndPassword(this.auth, credentials.email, credentials.password);
                // console.log('aSvc sIWEAP user/credential: ', userCredential.user, userCredential);
                this.router.navigate(['/courses']);
            }
            catch (error: any) {
                // const err: RbFirebaseAuthError = {...error};
                console.log('aSvc sIWEAP create user error: ', error);
                // console.log('aSvc sIWEAP create user error: ', err);
                // console.log('aSvc sIWEAP code: ', err.code);
                // console.log('aSvc sIWEAP message: ', err.message);
                // console.log('aSvc sIWEAP errors: ', err.errors);
            }
        }
    }
}
