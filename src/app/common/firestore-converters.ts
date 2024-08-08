import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, WithFieldValue } from "@angular/fire/firestore";
import { Course, Lesson } from "./interfaces";

// from https://firebase.google.com/docs/reference/js/firestore_.firestoredataconverter
export class CourseConverter implements FirestoreDataConverter<Course, DocumentData> {
    toFirestore(course: WithFieldValue<Course>): WithFieldValue<DocumentData> {
        return course;
    }

    fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>, options?: SnapshotOptions): Course {
        const data = snapshot.data(options);
        const course: Course = {
            id: data['id'],
            internalId: data['internalId'],
            description: data['description'],
            longDescription: data['longDescription'],
            iconUrl: data['iconUrl'],
            lessonsCount: data['lessonsCount'],
            categories: data['categories'],
            seqNo: data['seqNo'],
            url: data['url'],
            price: data['price'],
            courseListIcon: data['courseListIcon'],
            promo: data['promo'],
        }

        return course;
    }
}

export class LessonConverter implements FirestoreDataConverter<Lesson, DocumentData> {
    toFirestore(course: WithFieldValue<Lesson>): WithFieldValue<DocumentData> {
        return course;
    }

    fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>, options?: SnapshotOptions): Lesson {
        const data = snapshot.data(options);
        const lesson: Lesson = {
            id: data['id'],
            internalId: data['internalId'],
            description: data['description'],
            duration: data['duration'],
            seqNo: data['seqNo'],
            courseId: data['courseId'],
            videoId: data['videoId'],
        }

        return lesson;
    }
}