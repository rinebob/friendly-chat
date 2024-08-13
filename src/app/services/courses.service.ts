import { inject, Injectable, OnDestroy } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, DocumentData, Firestore, getDoc, getDocs, limit, onSnapshot, orderBy, query, setDoc, Unsubscribe, updateDoc, where, writeBatch } from '@angular/fire/firestore';
import { Course, Lesson } from '../common/interfaces';
import { FirestoreCollection } from '../common/constants';
import { CourseConverter, LessonConverter } from '../common/firestore-converters';
import { FriendlyChatStore } from '../store/friendly-chat-store';
import { compareFn } from '../utils/utils-fc';

@Injectable({
    providedIn: 'root'
})
export class CoursesService implements OnDestroy {

    db: Firestore = inject(Firestore);

    friendlyChatStore = inject(FriendlyChatStore);

    subscriptions: Unsubscribe[] = []

    ngOnDestroy(): void {
        for (const unsubscribe of this.subscriptions) {
            unsubscribe();
        }
    }

    createNewDocRef(collectionName: FirestoreCollection) {
        const collectionRef = collection(this.db, collectionName).withConverter(new CourseConverter());
        const docRef = doc(collectionRef);
        console.log('cSvc cNDR create doc ref for collection. colln/docRef: ', collectionName, docRef);
        return docRef;
    }

    // https://firebase.google.com/docs/firestore/query-data/get-data#get_all_documents_in_a_collection
    async getAllCourses() {
        const collectionRef = collection(this.db, FirestoreCollection.COURSES).withConverter(new CourseConverter());
        const querySnapshot = await getDocs(collectionRef);
        // console.log('cSvc gAC get all courses. querySnapshot: ', querySnapshot);
        // console.log('cSvc gAC querySnapshot docs: ', querySnapshot.docs);
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

    // https://firebase.google.com/docs/firestore/query-data/listen
    // https://firebase.google.com/docs/firestore/query-data/listen#listen_to_multiple_documents_in_a_collection

    getAllCoursesListener() {
        const collectionRef = collection(this.db, FirestoreCollection.COURSES).withConverter(new CourseConverter());
        const q = query(collectionRef);
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            // let docs: Course[] = [];
            let docs: Course[] = this.friendlyChatStore.courseEntities();
            // console.log('cSvc gACL courses listener.  querySnapshot: ', querySnapshot);

            querySnapshot.docChanges().forEach((change) => {
                // console.log('cSvc gACL snapshot change type: ', change.type)
                // console.log('cSvc gACL snapshot change: ', change);

                if (change.type === 'added') {
                    docs.push(change.doc.data())

                } else if (change.type === 'modified') {
                    docs = docs.filter(doc => doc.id !== change.doc.data().id);
                    docs.push(change.doc.data());
                    
                } else {
                    docs = docs.filter(doc => doc.id !== change.doc.data().id);
                }
                // const doc = change.doc.data()
                // console.log('doc: ', doc);
                // docs.push(doc)

                this.getLessonsForCourseListener(change.doc.data().id)
            })
            // console.log('cSvc gACL courses listener.  docs: ', docs.sort());
            this.friendlyChatStore.setAllCourses([...docs.sort(compareFn)]);
        });
        
        this.subscriptions.push(unsubscribe);
    }

    async getLessonsForCourseListener(courseId: string) {
        const collectionRef = collection(this.db, FirestoreCollection.COURSES, courseId, FirestoreCollection.LESSONS).withConverter(new LessonConverter());
        const q = query(collectionRef);
                
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let docs: Lesson[] = this.friendlyChatStore.lessonEntities();
            // console.log('cSvc gALL init store lesson entities: ', docs);
            querySnapshot.docChanges().forEach(change => {
                // console.log('cSvc gALL snapshot change type: ', change.type)
                // console.log('cSvc gALL snapshot change: ', change);
    
                if (change.type === 'added') {
                    docs.push(change.doc.data())
    
                } else if (change.type === 'modified') {
                    docs = docs.filter(doc => doc.id !== change.doc.data().id);
                    docs.push(change.doc.data());
                    
                } else {
                    docs = docs.filter(doc => doc.id !== change.doc.data().id);
    
                }
            });
            this.friendlyChatStore.setAllLessons([...docs.sort(compareFn)]);
            // console.log('cSvc gALL final store lesson entities: ', this.friendlyChatStore.lessonEntities());
        });

        this.subscriptions.push(unsubscribe);
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
        const docRef = doc(this.db, FirestoreCollection.LESSONS, id).withConverter(new LessonConverter());
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

        const newDoc = querySnapshot.docs[0].data();
        const newSeqNo = newDoc['seqNo'] + 1;
        console.log('cSvc doc/new seqNo: ', newDoc, newSeqNo);
        
        course.seqNo = newSeqNo;
        console.log('cSvc new course with seqNo: ', course);

        const docRef = doc(collectionRef);
        console.log('cSvc cC docRef id/ref: ', docRef.id, docRef);
        course.id = docRef.id;
        console.log('cSvc cC course with id: ', course);
        await setDoc(docRef, course);
    }

    async createCourse(course: Partial<Course>) {
        // console.log('cSvc cC create course - input: ', course);
        // const collectionRef = collection(this.db, FirestoreCollection.COURSES);
        const docRef = doc(collection(this.db, FirestoreCollection.COURSES)).withConverter(new CourseConverter());
        // console.log('cSvc cC docRef/ id/ref: ', docRef.id, docRef);
        course.id = docRef.id;
        // console.log('cSvc cC course with id: ', course);
        await setDoc(docRef, course);
        return docRef.id;
    }

    async createLesson(courseId: string, lesson: Lesson) {
        // console.log('cSvc cC create lesson - input: ', lesson);
        const docRef = doc(collection(this.db, FirestoreCollection.COURSES, courseId, FirestoreCollection.LESSONS)).withConverter(new LessonConverter());
        // console.log('cSvc cC docRef id/ref: ', docRef.id, docRef);
        lesson.id = docRef.id;
        // console.log('cSvc cC lesson with id: ', lesson);
        await setDoc(docRef, lesson);
    }

    async updateCourse(courseId: string, changes: Partial<Course>) {
        const docRef = doc(this.db, FirestoreCollection.COURSES, courseId);
        await updateDoc(docRef, {...changes});
    }

    // from https://firebase.google.com/docs/firestore/manage-data/delete-data#delete_documents
    async deleteCourse(id: string) {
        const docRef = doc(this.db, FirestoreCollection.COURSES, id)
        await deleteDoc(docRef);
        //Note: this will not delete the associated lessons
    }

    // get docs from a subcollection: https://firebase.google.com/docs/firestore/query-data/get-data#get_all_documents_in_a_subcollection
    // batch https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes
    async deleteCourseAndLessons(courseId: string) {
        // console.log('cSvc dCAL delete course and lessons for course id: ', courseId);
        const batch = writeBatch(this.db);
        const courseDocRef = doc(this.db, FirestoreCollection.COURSES, courseId);
        
        const lessonsCollectionRef = collection(this.db, FirestoreCollection.COURSES, courseId, FirestoreCollection.LESSONS);
        const querySnapshot = await getDocs(lessonsCollectionRef);
        // console.log('cSvc dCAL lessons querySnapshot: ', querySnapshot);
        
        querySnapshot.forEach(document => {
            // console.log('cSvc dCAL delete lesson snap doc: ', document);
            const docRef = doc(this.db, FirestoreCollection.COURSES, courseId, FirestoreCollection.LESSONS, document.id);
            // console.log('cSvc dCAL delete lesson docRef.id: ', docRef.id);
            batch.delete(docRef);
        });
        
        batch.delete(courseDocRef);
        
        // console.log('cSvc dCAL batch: ', batch);


        await batch.commit();
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

    // Note: this is unused.  Created computed properties for beg and adv in FriendlyChatStore
    async loadCoursesByCategory(category: string) {
        const courses: Course[] = [];

        const coursesCollectionRef = collection(this.db, FirestoreCollection.COURSES).withConverter(new CourseConverter());
        const q = query(coursesCollectionRef, where('categories', 'array-contains', category));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(snap => {
            courses.push(snap.data());
        });

        return courses;

    }





}
