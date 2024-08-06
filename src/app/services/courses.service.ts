import { inject, Injectable } from '@angular/core';
import { addDoc, collection, doc, DocumentData, Firestore, getDocs, limit, orderBy, query, setDoc } from '@angular/fire/firestore';
import { Course, Lesson } from '../common/interfaces';
import { FirestoreCollection } from '../common/constants';
import { CourseConverter } from '../common/firestore-converters';

@Injectable({
    providedIn: 'root'
})
export class CoursesService {

    db: Firestore = inject(Firestore);

    getCourseById() {

    }

    // https://firebase.google.com/docs/firestore/query-data/get-data#get_all_documents_in_a_collection
    async getAllCourses() {
        const querySnapshot = await getDocs(collection(this.db, FirestoreCollection.COURSES));
        console.log('cSvc gAC get all courses. querySnapshot: ', querySnapshot);
        let docs: DocumentData[] = [];
        querySnapshot.forEach(doc => {
            docs.push(doc.data());
            console.log('doc.data(): ', doc.data())
            console.log('doc.metadata(): ', doc.metadata)
        });
        return docs;

    }

    // findCourseByUrl(url: string): Observable<Course | null> {
    //     return this.db.collection(`courses`, 
    //         ref => ref.where('url', '==', url))
    //         .get()
    //         .pipe(
    //             map(results => {
    //                 const courses = convertSnapshots<Course>(results);
    //                 return courses.length === 1 ? courses[0] : null;
    //             })
    //         );
    // }

    getCourseByUrl()  {

    }

    // createCourse(newCourse: Partial<Course>, courseId?: string) {
    //     return this.db.collection('courses',
    //             ref => ref.orderBy('seqNo', 'desc').limit(1))
    //         .get()
    //         .pipe(
    //             concatMap(result => {
    //                 const courses = convertSnapshots<Course>(result);
    //                 const lastCourseSeqNo = courses[0]?.seqNo ?? 0;
    //                 const course = {
    //                     ...newCourse,
    //                     seqNo: lastCourseSeqNo + 1,
    //                 }

    //                 let save$: Observable<any>;

    //                 if (courseId) {
    //                     save$ = from(this.db.doc(`courses/${courseId}`).set(course));

    //                 } else {
    //                     save$ = from (this.db.collection('courses').add(course));

    //                 }

    //                 return save$.pipe(
    //                     map(res => {
    //                         return {
    //                             id: courseId ?? res.id,
    //                             ...course
    //                         }
    //                     })
    //                 );

    //             })
    //         )

    // }

    // Course needs to have the sequence no. property set, so we need to get the
    // last document's seqNo and increment it, then populate the new course seqNo property
    async createCourseWithSeqNo(course: Course | Partial<Course>) {
        console.log('cSvc cC create course: ', course);
        const collectionRef = collection(this.db, FirestoreCollection.COURSES).withConverter(new CourseConverter());
        const q = query(collectionRef, orderBy('seqNo', 'desc'));
        console.log('cSvc cC query: ', q);

        const querySnapshot = await getDocs(q);
        console.log('querySnapshot docs: ', querySnapshot.docs);

        let docs: Course[] = []
        for (const doc of querySnapshot.docs) {
            docs.push(doc.data())
        }

        console.log('cSvc cCWSN query snapshot converted docs: ', docs);

        const doc = querySnapshot.docs[0].data();
        const newSeqNo = doc['seqNo'] + 1;
        console.log('cSvc doc/new seqNo: ', doc, newSeqNo);
        
        course.seqNo = newSeqNo;
        console.log('cSvc new course with seqNo: ', course);

        

        const docRef = (await addDoc(collectionRef, course)).withConverter(new CourseConverter());
        console.log('cSvc cC docRef id: ', docRef.id);
        console.log('cSvc cC docRef: ', docRef);
    }

    async createCourse(course: Course) {
        // console.log('cSvc cC create course: ', course);
        const collectionRef = collection(this.db, FirestoreCollection.COURSES);
        const docRef = await addDoc(collectionRef, course);
        // console.log('cSvc cC docRef id: ', docRef.id);
        // console.log('cSvc cC docRef: ', docRef);
    }

    async createLesson(lesson: Lesson) {
        console.log('cSvc cC create lesson: ', lesson);
        const collectionRef = collection(this.db, FirestoreCollection.LESSONS);
        const docRef = await addDoc(collectionRef, lesson);
        console.log('cSvc cC docRef id: ', docRef.id);
        console.log('cSvc cC docRef: ', docRef);
    }

    // updateCourse(courseId: string, changes: Partial<Course>) {

    //     return from(this.db.doc(`courses/${courseId}`).update(changes));

    // }

    updateCourse() {

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
