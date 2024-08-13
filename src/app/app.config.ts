import { ApplicationConfig } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth';
import { provideFirestore, getFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { provideFunctions, getFunctions, connectFunctionsEmulator} from '@angular/fire/functions';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { provideStorage, getStorage, connectStorageEmulator } from '@angular/fire/storage';
import { routes } from './app.routes';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNativeDateAdapter } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => {
        const firestore = getFirestore();
        if (location.hostname === 'localhost') {
            connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
        }
        return firestore;
    }),
    provideAuth(() => {
        const auth = getAuth();
        if (location.hostname === 'localhost') {
            connectAuthEmulator(auth, "http://127.0.0.1:9099");
        }
        return auth;
    }),
    provideFunctions(() => {
        const functions = getFunctions();
        if (location.hostname === 'localhost') {
            connectFunctionsEmulator(functions, '127.0.0.1', 5001);
        }
        return functions;

    }),
    provideStorage(() => {
        const storage = getStorage();
        if (location.hostname === 'localhost') {
            connectStorageEmulator(storage, '127.0.0.1', 9199);
        }
        return storage;
        
    }),
    // provideMessaging(() => getMessaging()),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideNativeDateAdapter()
  ],
};
