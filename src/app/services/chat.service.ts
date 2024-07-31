import { inject, Injectable } from '@angular/core';
import {
    Auth,
    authState,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    user,
    getAuth,
    User,
} from '@angular/fire/auth';
import { map, switchMap, firstValueFrom, filter, Observable, Subscription } from 'rxjs';
import {
    doc,
    docData,
    DocumentReference,
    Firestore,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    addDoc,
    deleteDoc,
    collectionData,
    Timestamp,
    serverTimestamp,
    query,
    orderBy,
    limit,
    onSnapshot,
    DocumentData,
    FieldValue,
} from '@angular/fire/firestore';
import {
    Storage,
    getDownloadURL,
    ref,
    uploadBytesResumable,
} from '@angular/fire/storage';
import { getToken, Messaging, onMessage } from '@angular/fire/messaging';
import { Router } from '@angular/router';
import { ChatMessage } from '../common/interfaces';


@Injectable({
    providedIn: 'root',
})
export class ChatService {
    firestore: Firestore = inject(Firestore);
    auth: Auth = inject(Auth);
    storage: Storage = inject(Storage);
    messaging: Messaging = inject(Messaging);
    router: Router = inject(Router);
    private provider = new GoogleAuthProvider();
    LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';

    // observable that is updated when the auth state changes
    user$ = user(this.auth);
    currentUser: User | null = this.auth.currentUser;
    userSubscription: Subscription;

    constructor() {
        this.userSubscription = this.user$.subscribe((aUser: User | null) => {
            this.currentUser = aUser;
        });

        this.user$.pipe().subscribe(user => {
            console.log('cSvc ctor user sub: ', user);
        });
    }

    // Login Friendly Chat.
    login() {
        signInWithPopup(this.auth, this.provider).then((result) => {
            console.log('cSvc l login result: ', result);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            this.router.navigate(['/', 'chat']);
            return credential;
        })
    }

    // Logout of Friendly Chat.
    logout() {
        signOut(this.auth).then(() => {
            this.router.navigate(['/', 'login'])
            console.log('signed out');
        }).catch((error) => {
            console.log('sign out error: ' + error);
        })
    }

    // Adds a text or image message to Cloud Firestore.
    addMessage = async (
        textMessage: string,
        imageUrl?: string,
    ): Promise<void | DocumentReference<DocumentData>> => {
        // ignore empty messages
        console.log("cSvc aM addMessage.  message/url: ", textMessage, imageUrl);
        if (!textMessage && !imageUrl) {
            console.log("addMessage was called without a message", textMessage, imageUrl);
            return;
        }

        // if (this.currentUser === null) {
        //   console.log("addMessage requires a signed-in user");
        //   return;
        // }

        const message: ChatMessage = {
            name: this.auth.currentUser?.displayName ?? '',
            profilePicUrl: this.auth.currentUser?.photoURL ?? '',
            timestamp: Timestamp.fromDate(new Date()),
            uid: this.auth.currentUser?.uid ?? '',
            text: textMessage,
            imageUrl,
        };

        textMessage && (message.text = textMessage);
        imageUrl && (message.imageUrl = imageUrl);

        console.log("cSvc aM before try block. message", message);
        try {
            console.log("cSvc aM in try block");
            const newMessageRef = await addDoc(
                collection(this.firestore, "messages"),
                message,
            );
            console.log("cSvc aM add message.  messageRef", newMessageRef);
            return newMessageRef;
        } catch (error) {
            console.log("cSvc aM in error block");
            console.error("Error writing new message to Firebase Database", error);
            return;
        }
    };

    // Saves a new message to Cloud Firestore.
    saveTextMessage = async (messageText: string) => {
        console.log('c sTM send message: ', messageText);
        return this.addMessage(messageText, '');
    };

    // Loads chat messages history and listens for upcoming ones.
    loadMessages = () => {
        // Create the query to load the last 12 messages and listen for new ones.
        const recentMessagesQuery = query(collection(this.firestore, 'messages'), orderBy('timestamp', 'desc'), limit(12));
        // Start listening to the query.
        return collectionData(recentMessagesQuery);
    };

    // Saves a new message containing an image in Firebase.
    // This first saves the image in Firebase storage.
    saveImageMessage = async (file: any) => { };

    async updateData(path: string, data: any) { }

    async deleteData(path: string) { }

    getDocData(path: string) { }

    getCollectionData(path: string) { }

    async uploadToStorage(
        path: string,
        input: HTMLInputElement,
        contentType: any
    ) {
        return null;
    }
    // Requests permissions to show notifications.
    requestNotificationsPermissions = async () => { };

    saveMessagingDeviceToken = async () => { };
}
