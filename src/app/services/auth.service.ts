import { inject, Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, User, user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LoginCredentials, RbFirebaseAuthError, UserRoles, UserStatus } from '../common/interfaces';
import { map, Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    router: Router = inject(Router);

    auth: Auth = inject(Auth);
    currentUser: User | null;
    user$ = user(this.auth);

    isLoggedIn$: Observable<boolean>;
    isLoggedOut$: Observable<boolean>;
    pictureUrl$: Observable<string>;
    roles = signal<UserRoles | undefined>(undefined);

    private provider = new GoogleAuthProvider();

    constructor() {

        this.isLoggedIn$ = this.user$.pipe(map(user => !!user));
        this.isLoggedOut$ = this.user$.pipe(map(user => !user));
        this.pictureUrl$ = this.user$.pipe(map(user => user?.photoURL ?? ''));
        this.roles.set({admin: false});
        this.currentUser = this.auth.currentUser;

        onAuthStateChanged(this.auth, (user) => {
            if (user) {
                console.log('aSvc ctor user is present. user: ', user);
                console.log('currentUser: ', this.auth.currentUser);
                console.log('emailVerified: ', user.emailVerified);
                console.log('isAnonymous: ', user.isAnonymous);
                console.log('metadata: ', user.metadata);
                console.log('providerData: ', user.providerData);
                console.log('refreshToken: ', user.refreshToken);
                console.log('tenantId: ', user.tenantId);

                this.auth.currentUser?.getIdTokenResult().then((idTokenResult) => {
                    if(idTokenResult.claims['admin']) {
                        console.log('aSvc ctor current user idTokenResult. user is admin. idTokenResult: ', idTokenResult);
                        this.roles.set({admin: true})
                    } else {
                        console.log('aSvc ctor current user idTokenResult. user is not admin. idTokenResult: ', idTokenResult);
        
                    }
                })


            } else {
                console.log('aSvc ctor no user is present');

            }
        })
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
        // console.log('aSvc sIWEAP em/pw creds: ', credentials);
        if (userStatus === 'new') {
            try {
                const userCredential = await createUserWithEmailAndPassword(this.auth, credentials.email, credentials.password);
                // console.log('aSvc sIWEAP user/credential: ', userCredential.user, userCredential);
    
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
