import { inject, Injectable } from '@angular/core';
import { addDoc, collection, doc, DocumentData, Firestore, getDoc, getDocs, limit, orderBy, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Course, Lesson } from '../common/interfaces';
import { FirestoreCollection } from '../common/constants';
import { CourseConverter, LessonConverter } from '../common/firestore-converters';

@Injectable({
    providedIn: 'root'
})
export class CoursesService {

    db: Firestore = inject(Firestore);

    // https://firebase.google.com/docs/firestore/query-data/get-data#get_all_documents_in_a_collection
    async getAllCourses() {
        const collectionRef = collection(this.db, FirestoreCollection.COURSES).withConverter(new CourseConverter());
        const querySnapshot = await getDocs(collectionRef);
        console.log('cSvc gAC get all courses. querySnapshot: ', querySnapshot);
        console.log('cSvc gAC querySnapshot docs: ', querySnapshot.docs);
        let docs: Course[] = [];
        querySnapshot.forEach(doc => {
            docs.push(doc.data());
            // console.log('course: ', doc.data())
            // console.log('doc.metadata(): ', doc.metadata)
        });
        return docs;
    }

    async getAllLessons() {
        const collectionRef = collection(this.db, FirestoreCollection.LESSONS).withConverter(new LessonConverter())
        const querySnapshot = await getDocs(collectionRef);
        // console.log('cSvc gAC get all lessons. querySnapshot: ', querySnapshot);
        let docs: Lesson[] = [];
        querySnapshot.forEach(doc => {
            docs.push(doc.data());
            // console.log('lesson: ', doc.data())
            // console.log('doc.metadata(): ', doc.metadata)
        });
        return docs;
    }

    // from https://firebase.google.com/docs/firestore/query-data/get-data#get_a_document
    async getCourseById(id: string) {
        // console.log('fCSto gCBI course by id: ', id);
        if (!id) return
        const docRef = doc(this.db, FirestoreCollection.COURSES, id).withConverter(new CourseConverter());
        const docSnap = await getDoc(docRef);
        return docSnap.data();
    }

    async getLessonById(id: string) {
        if (!id) return
        const docRef = doc(this.db, FirestoreCollection.LESSONS, id);
        const docSnap = await getDoc(docRef);
        return docSnap.data();
    }

    // from https://firebase.google.com/docs/firestore/query-data/queries#simple_queries
    async getCourseByUrl(url: string)  {
        const collectionRef = collection(this.db, FirestoreCollection.COURSES).withConverter(new CourseConverter());
        const q = query(collectionRef, where('url', '==', url));
        const querySnapshot = await getDocs(q);
        let docs: Course[] = [];
        querySnapshot.forEach(snap => {
            docs.push(snap.data());
        });

        return docs[0]
    }

    // Course needs to have the sequence no. property set, so we need to get the
    // last document's seqNo and increment it, then populate the new course seqNo property
    async createCourseWithSeqNo(course: Course | Partial<Course>) {
        // console.log('cSvc cC create course: ', course);
        const collectionRef = collection(this.db, FirestoreCollection.COURSES).withConverter(new CourseConverter());
        const q = query(collectionRef, orderBy('seqNo', 'desc'));
        // console.log('cSvc cC query: ', q);

        const querySnapshot = await getDocs(q);
        // console.log('querySnapshot docs: ', querySnapshot.docs);

        let docs: Course[] = []
        for (const doc of querySnapshot.docs) {
            docs.push(doc.data())
        }

        // console.log('cSvc cCWSN query snapshot converted docs: ', docs);

        const doc = querySnapshot.docs[0].data();
        const newSeqNo = doc['seqNo'] + 1;
        // console.log('cSvc doc/new seqNo: ', doc, newSeqNo);
        
        course.seqNo = newSeqNo;
        // console.log('cSvc new course with seqNo: ', course);

        

        const docRef = (await addDoc(collectionRef, course)).withConverter(new CourseConverter());
        // console.log('cSvc cC docRef id: ', docRef.id);
        // console.log('cSvc cC docRef: ', docRef);
    }

    async createCourse(course: Course) {
        // console.log('cSvc cC create course: ', course);
        // const collectionRef = collection(this.db, FirestoreCollection.COURSES);
        const docRef = doc(collection(this.db, FirestoreCollection.COURSES))
        // console.log('cSvc cC docRef id/ref: ', docRef.id, docRef);
        course.id = docRef.id;
        // console.log('cSvc cC course with id: ', course);
        await setDoc(docRef, course);
    }

    async createLesson(lesson: Lesson) {
        // console.log('cSvc cC create lesson: ', lesson);
        const docRef = doc(collection(this.db, FirestoreCollection.LESSONS))
        // console.log('cSvc cC docRef id/ref: ', docRef.id, docRef);
        lesson.id = docRef.id;
        // console.log('cSvc cC lesson with id: ', lesson);
        await setDoc(docRef, lesson);
    }

    // updateCourse(courseId: string, changes: Partial<Course>) {

    //     return from(this.db.doc(`courses/${courseId}`).update(changes));

    // }

    async updateCourse(courseId: string, changes: Partial<Course>) {
        const docRef = doc(this.db, FirestoreCollection.COURSES, courseId);
        await updateDoc(docRef, {...changes});
    }

    // deleteCourse(courseId: string) {
    //     return from(this.db.doc(`courses/${courseId}`).delete());
    // }

    deleteCourse() {}

    // deleteCourseAndLessons(courseId: string) {
    //     return this.db.collection(`courses/${courseId}/lessons`)
    //         .get()
    //         .pipe(
    //             concatMap(results => {
    //                 const lessons = convertSnapshots<Lesson>(results);
                    
    //                 const batch = this.db.firestore.batch();
                    
    //                 const courseRef = this.db.doc(`courses/${courseId}`).ref;
                    
    //                 console.log('cS dCAL courseRef: ', courseRef);
                    
    //                 batch.delete(courseRef);

    //                 console.log('cS dCAL lessons: ', lessons);
    //                 for (const lesson of lessons) {
    //                     console.log('cS dCAL lesson: ', lesson);
    //                     const lessonRef = this.db.doc(`courses/${courseId}/lessons/${lesson.id}`).ref;

    //                     console.log('cS dCAL lessonRef: ', lessonRef);

    //                     batch.delete(lessonRef);
    //                 }

    //                 return from(batch.commit());

    //             })
    //         );
    // }

    deleteCourseAndLessons() {

    }

    // loadCoursesByCategory(category: string): Observable<Course[]> {
    //     const courses: Course[] = [];

    //     return this.db.collection(
    //         'courses',
    //         ref => ref.where('categories', 'array-contains', category)
    //             .orderBy('seqNo')
    //         )
    //         .get()
    //         .pipe(
    //             map(result => {
    //                 console.log('c.s result: ', result);
    //                 return convertSnapshots<Course>(result)}
    //                 )
    //         );
    // }

    loadCoursesByCategory() {

    }





}
