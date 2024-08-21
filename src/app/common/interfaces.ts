import { FieldValue, Timestamp } from "@angular/fire/firestore";
import { AbstractControl } from "@angular/forms";

export interface LoginForm {
    email: AbstractControl<any, any>;
    password: AbstractControl<any, any>;
}
export interface LoginCredentials {
    email: string;
    password: string;
}

// TODO: see if AngularFire has this already available
export interface RbFirebaseAuthErrorResponse {
    error: RbFirebaseAuthError;         // Rb = rinebob - to distinguish from actual Firebase types
  }

  export interface RbFirebaseAuthError {
    code: number;
    message: string;
    errors: {[key: string]: string}[]
  }

  export interface UserRoles {
    admin:boolean;
  }

  export type UserStatus = 'new' | 'existing';

  export enum SignInMessage {
    NEW = 'Enter email and password to create a new account',
    EXISTING = 'Sign in with email and password',
    ACCOUNT_EXISTS = 'Already signed up? Click here to sign in',
    NO_ACCOUNT = 'Don\'t have an account? Click here',
    SIGN_IN = 'Sign in',
    CREATE_ACCOUNT = 'Create account',
  }


export interface ChatMessage {
    name: string;
    profilePicUrl: string;
    timestamp: Timestamp;
    uid: string;
    text?: string;
    imageUrl?: string;
    response?: string;
};



export interface Course {
    id: string;
    internalId:number;
    description:string;
    longDescription: string;
    iconUrl: string;
    priorityImage?: boolean;
    lessonsCount?: number;
    categories:string[];
    seqNo: number;
    url: string;
    price: number;

    courseListIcon?: string;
    promo?: boolean;
    createdAt?: Timestamp;
    promoStartAt?: Timestamp;
    
    
}



export interface Lesson {
    id: string;
    internalId: number;
    description: string;
    duration?: string;
    seqNo: number;
    courseId: number;
    videoId?: string;
    
}

export type CourseOrLesson = Course | Lesson;