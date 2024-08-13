import { FieldValue, Timestamp } from "@angular/fire/firestore";


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