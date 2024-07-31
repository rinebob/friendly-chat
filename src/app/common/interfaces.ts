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